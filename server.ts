import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for PDF base64 uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lazy GoogleGenAI initialization
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing in server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// System Instruction builder for Analysis Engine
function buildAnalysisSystemInstruction(personaLens: string, summaryDepth: string) {
  const personaDescriptions: Record<string, string> = {
    executive: 'Executive Briefing: High-level strategy, key metrics, financial outcomes, ROI, actionable conclusions, and risk vectors.',
    academic: 'Academic & Technical Audit: Methodology evaluation, statistical significance, sample sizes, constraints, data integrity, formal citations.',
    eli5: 'Plain English (ELI5): Jargon-free, highly intuitive explanations, simple real-world analogies, concise digestible concepts.',
    legal: 'Legal & Compliance Risk: Contractual obligations, liabilities, compliance mandates, risk factors, policy implications.'
  };

  const depthDescriptions: Record<string, string> = {
    oneline: 'Summary depth: Single crisp executive sentence condensing the core thesis.',
    paragraph: 'Summary depth: Balanced 2-3 paragraph synthesis covering major highlights and implications.',
    detailed: 'Summary depth: Exhaustive section-by-section breakdown detailing granular findings, nuances, and metrics.'
  };

  return `You are an advanced Document Intelligence & Multimodal Analytics Engine for PDF Insight Analyzer.

You MUST analyze the attached PDF document(s) and return a strict, valid JSON object matching the requested schema.

ACTIVE PERSONA LENS: ${personaDescriptions[personaLens] || personaDescriptions.academic}
ACTIVE SUMMARY DEPTH: ${depthDescriptions[summaryDepth] || depthDescriptions.paragraph}

REQUIRED MODULES & OUTPUT SPECIFICATIONS:
1. DOCUMENT METADATA:
   - title, authors (array), publicationDate, primaryTopics (array), estimatedReadingTime (e.g. "12 mins"), totalPages (number), language, isScannedImage (boolean).

2. EXECUTIVE SUMMARY & KEY INSIGHTS:
   - executiveSummary: Structured text tailored to the active Persona Lens and Summary Depth.
   - keyInsights: Array of 5-8 major findings with:
     - statement: Clear finding
     - impact: "high" | "medium" | "low"
     - citation: Exact page citation formatted as "[Doc 1, Page X, Para Y]"
     - pageNumber: integer page number
     - section: section title

3. STRUCTURED TABLES & CHART RECOMMENDATIONS:
   - Extract all embedded data tables into clean 2D arrays (headers, rows).
   - Recommend optimal chart type per table: "bar" | "line" | "pie" | "scatter" | "stacked_bar".
   - Confidence: "high" | "medium" | "low" | "ocr_estimated".
   - Include exact page citation for each table.

4. MEDIA & VISUAL ASSET EXTRACTION:
   - Identify visual assets (diagrams, charts, photos, architecture flows, formulas).
   - Provide title, category ("diagram" | "chart" | "photo" | "architecture" | "formula"), pageNumber, caption (contextual relevance), and description.

5. ACTION ITEMS CHECKLIST:
   - Extract explicit or implied tasks, future work, policy mandates, and deadlines.
   - Assign priority ("High" | "Medium" | "Low"), ownerRole (if mentioned or implied), deadline, pageCitation, pageNumber, completed: false.

6. TABLE OF CONTENTS & TOPIC TAGS:
   - tableOfContents: headings, level (1|2|3), pageNumber.
   - topicTags: 6-10 keywords/topic tags.

7. CITATIONS MANDATE:
   - Every major insight, quote, table, and action item MUST include explicit page citations in the format "[Doc 1, Page X, Para Y]".

Return ONLY valid JSON with no markdown block wrappers if possible, or standard clean JSON.`;
}

// JSON Schema definition for Gemini responseSchema
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        authors: { type: Type.ARRAY, items: { type: Type.STRING } },
        publicationDate: { type: Type.STRING },
        primaryTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
        estimatedReadingTime: { type: Type.STRING },
        totalPages: { type: Type.INTEGER },
        language: { type: Type.STRING },
        isScannedImage: { type: Type.BOOLEAN }
      },
      required: ['title', 'authors', 'publicationDate', 'primaryTopics', 'estimatedReadingTime', 'totalPages', 'language', 'isScannedImage']
    },
    tableOfContents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          level: { type: Type.INTEGER },
          pageNumber: { type: Type.INTEGER }
        },
        required: ['id', 'title', 'level', 'pageNumber']
      }
    },
    executiveSummary: { type: Type.STRING },
    keyInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          statement: { type: Type.STRING },
          impact: { type: Type.STRING },
          citation: { type: Type.STRING },
          pageNumber: { type: Type.INTEGER },
          section: { type: Type.STRING }
        },
        required: ['id', 'statement', 'impact', 'citation', 'pageNumber', 'section']
      }
    },
    tables: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          headers: { type: Type.ARRAY, items: { type: Type.STRING } },
          rows: {
            type: Type.ARRAY,
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          recommendedChartType: { type: Type.STRING },
          confidence: { type: Type.STRING },
          citation: { type: Type.STRING },
          pageNumber: { type: Type.INTEGER }
        },
        required: ['id', 'title', 'headers', 'rows', 'recommendedChartType', 'confidence', 'citation', 'pageNumber']
      }
    },
    visualAssets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          caption: { type: Type.STRING },
          pageNumber: { type: Type.INTEGER },
          category: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ['id', 'title', 'caption', 'pageNumber', 'category', 'description']
      }
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          task: { type: Type.STRING },
          priority: { type: Type.STRING },
          ownerRole: { type: Type.STRING },
          deadline: { type: Type.STRING },
          pageCitation: { type: Type.STRING },
          pageNumber: { type: Type.INTEGER },
          completed: { type: Type.BOOLEAN }
        },
        required: ['id', 'task', 'priority', 'pageCitation', 'pageNumber', 'completed']
      }
    },
    topicTags: { type: Type.ARRAY, items: { type: Type.STRING } },
    rawMarkdownReport: { type: Type.STRING }
  },
  required: ['metadata', 'tableOfContents', 'executiveSummary', 'keyInsights', 'tables', 'visualAssets', 'actionItems', 'topicTags']
};

// Batch comparative schema
const comparativeMatrixSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    documentComparisons: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          docId: { type: Type.STRING },
          docName: { type: Type.STRING },
          coreTheme: { type: Type.STRING },
          keyMetrics: { type: Type.STRING },
          stanceOrConclusion: { type: Type.STRING }
        },
        required: ['docId', 'docName', 'coreTheme', 'keyMetrics', 'stanceOrConclusion']
      }
    },
    commonThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
    contrastingConclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
    overlappingDataPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['summary', 'documentComparisons', 'commonThemes', 'contrastingConclusions', 'overlappingDataPoints']
};

// --- API ENDPOINTS ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Analyze single or batch PDFs
app.post('/api/analyze-pdf', async (req, res) => {
  try {
    const { files, personaLens = 'academic', summaryDepth = 'paragraph' } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'At least one PDF file (base64) is required.' });
    }

    const ai = getGenAI();
    const systemInstruction = buildAnalysisSystemInstruction(personaLens, summaryDepth);

    const analyzedDocuments = [];

    // Analyze each file with multimodal Gemini
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const base64Data = file.base64.includes('base64,') ? file.base64.split('base64,')[1] : file.base64;

      const pdfPart = {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      };

      const promptText = `Analyze this PDF document "${file.name}" thoroughly. Extract metadata, structured tables, visual assets, action items, executive summary, and key insights with page citations. Adjust tone to persona '${personaLens}' and depth '${summaryDepth}'.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [pdfPart, promptText],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: analysisResponseSchema,
          temperature: 0.2
        }
      });

      const parsedData = JSON.parse(response.text || '{}');

      const docResult = {
        id: `doc-${Date.now()}-${index}`,
        documentName: file.name,
        fileDataUrl: file.base64,
        fileSize: file.size || '1.5 MB',
        processedAt: new Date().toISOString(),
        personaLens,
        summaryDepth,
        metadata: parsedData.metadata,
        tableOfContents: parsedData.tableOfContents || [],
        executiveSummary: parsedData.executiveSummary || '',
        keyInsights: parsedData.keyInsights || [],
        tables: (parsedData.tables || []).map((t: any, tid: number) => ({
          ...t,
          id: t.id || `tbl-${index}-${tid}`,
          recommendedChartType: t.recommendedChartType || 'bar',
          confidence: t.confidence || 'high'
        })),
        visualAssets: parsedData.visualAssets || [],
        actionItems: (parsedData.actionItems || []).map((a: any, aid: number) => ({
          ...a,
          id: a.id || `act-${index}-${aid}`,
          completed: false
        })),
        topicTags: parsedData.topicTags || [],
        rawMarkdownReport: parsedData.rawMarkdownReport || `# Report for ${file.name}\n\n${parsedData.executiveSummary}`
      };

      analyzedDocuments.push(docResult);
    }

    // If batch mode (>1 PDF), generate Cross-Document Comparative Matrix
    let comparativeMatrix = null;
    if (files.length > 1) {
      const batchParts = files.map((f: any) => ({
        inlineData: {
          mimeType: 'application/pdf',
          data: f.base64.includes('base64,') ? f.base64.split('base64,')[1] : f.base64
        }
      }));

      const batchPrompt = `Compare these ${files.length} uploaded PDF documents (${files.map((f: any) => f.name).join(', ')}). Generate a Cross-Document Comparative Matrix highlighting common themes, contrasting conclusions, key metric comparisons, and overlapping data points.`;

      const batchResponse = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [...batchParts, batchPrompt],
        config: {
          systemInstruction: 'You are a Cross-Document Comparative Intelligence Engine. Compare multiple uploaded PDFs and return a structured JSON matrix.',
          responseMimeType: 'application/json',
          responseSchema: comparativeMatrixSchema,
          temperature: 0.2
        }
      });

      comparativeMatrix = JSON.parse(batchResponse.text || '{}');
    }

    if (files.length === 1) {
      return res.json({ success: true, mode: 'single', document: analyzedDocuments[0] });
    } else {
      const batchResult = {
        id: `batch-${Date.now()}`,
        createdAt: new Date().toISOString(),
        batchName: `Batch Analysis (${files.length} PDFs)`,
        documentCount: files.length,
        documents: analyzedDocuments,
        comparativeMatrix: comparativeMatrix || {
          summary: 'Cross-document comparison completed.',
          documentComparisons: analyzedDocuments.map(d => ({
            docId: d.id,
            docName: d.documentName,
            coreTheme: d.metadata.primaryTopics.join(', '),
            keyMetrics: d.metadata.title,
            stanceOrConclusion: d.executiveSummary.slice(0, 150) + '...'
          })),
          commonThemes: ['Document Intelligence', 'Data Synthesis'],
          contrastingConclusions: ['Varying scope and methodologies'],
          overlappingDataPoints: ['Citations verified']
        }
      };
      return res.json({ success: true, mode: 'batch', batch: batchResult });
    }
  } catch (err: any) {
    console.error('Error analyzing PDF:', err);
    res.status(500).json({
      error: err.message || 'Failed to process PDF file. Please verify the document format.'
    });
  }
});

// Grounded Follow-Up Q&A Endpoint
app.post('/api/chat-pdf', async (req, res) => {
  try {
    const { message, history = [], documentSummary, fileBase64, docName } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Question text is required.' });
    }

    const ai = getGenAI();

    const systemInstruction = `You are the Interactive Q&A Assistant for PDF Insight Analyzer.
Your task is to answer user follow-up questions strictly grounded in the provided document context.

RULES:
1. Provide precise, direct, zero-hallucination answers backed by direct page citations formatted as "[Doc 1, Page X, Para Y]".
2. If the user's question cannot be answered from the document, explicitly state that the information is not present in the document.
3. Keep response well-formatted with markdown, bold bullet points, and citation badges.`;

    const parts: any[] = [];

    if (fileBase64) {
      const base64Data = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      });
    }

    let promptText = `DOCUMENT NAME: ${docName || 'Uploaded Document'}\n`;
    if (documentSummary) {
      promptText += `SUMMARY CONTEXT:\n${documentSummary}\n\n`;
    }

    if (history.length > 0) {
      promptText += `PREVIOUS CHAT CONVERSATION:\n`;
      history.forEach((h: any) => {
        promptText += `${h.sender.toUpperCase()}: ${h.text}\n`;
      });
      promptText += `\n`;
    }

    promptText += `USER QUESTION: ${message}\nAnswer with precise page citations.`;

    parts.push(promptText);

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: parts,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    const replyText = response.text || 'No response generated.';

    // Extract page citations regex
    const citationMatches = [...replyText.matchAll(/\[(?:Doc \d+,\s*)?Page\s*(\d+)(?:,\s*Para\s*(\d+))?\]/gi)];
    const citations = citationMatches.map(m => ({
      pageNumber: parseInt(m[1], 10),
      excerpt: m[0]
    }));

    res.json({
      success: true,
      answer: replyText,
      citations
    });
  } catch (err: any) {
    console.error('Error in Q&A chat:', err);
    res.status(500).json({ error: err.message || 'Failed to process question.' });
  }
});

// Re-synthesize summary for persona / depth change
app.post('/api/re-synthesize', async (req, res) => {
  try {
    const { personaLens, summaryDepth, currentResult, fileBase64 } = req.body;
    const ai = getGenAI();

    const systemInstruction = `You are the Persona Lens & Depth Resynthesizer for PDF Insight Analyzer.
Re-write the executive summary and key insights of the document to strictly align with Persona Lens '${personaLens}' and Summary Depth '${summaryDepth}'. Include page citations.`;

    const parts: any[] = [];
    if (fileBase64) {
      const base64Data = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      });
    }

    parts.push(`Current Document Title: ${currentResult?.metadata?.title || 'PDF Document'}\nExisting Summary: ${currentResult?.executiveSummary}\n\nResynthesize into new JSON with updated 'executiveSummary' and 'keyInsights' matching persona '${personaLens}' and depth '${summaryDepth}'.`);

    const schema = {
      type: Type.OBJECT,
      properties: {
        executiveSummary: { type: Type.STRING },
        keyInsights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              statement: { type: Type.STRING },
              impact: { type: Type.STRING },
              citation: { type: Type.STRING },
              pageNumber: { type: Type.INTEGER },
              section: { type: Type.STRING }
            },
            required: ['id', 'statement', 'impact', 'citation', 'pageNumber', 'section']
          }
        }
      },
      required: ['executiveSummary', 'keyInsights']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: parts,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Error re-synthesizing:', err);
    res.status(500).json({ error: err.message || 'Failed to resynthesize.' });
  }
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PDF Insight Analyzer Server running on http://localhost:${PORT}`);
  });
}

startServer();
