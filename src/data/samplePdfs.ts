import { AnalysisResult, SampleDoc, BatchAnalysisResult } from '../types';

export const SAMPLE_ANALYSIS_FINANCIAL: AnalysisResult = {
  id: 'sample-fin-q3-2026',
  documentName: 'Acme_Corp_Q3_2026_Financial_Performance.pdf',
  fileSize: '2.4 MB',
  processedAt: new Date().toISOString(),
  personaLens: 'executive',
  summaryDepth: 'paragraph',
  metadata: {
    title: 'Acme Corp Q3 2026 Global Performance & Strategic Outlook',
    authors: ['Chief Financial Officer - Finance Intelligence Team'],
    publicationDate: 'October 24, 2026',
    primaryTopics: ['Revenue Growth', 'Cloud Infrastructure Margins', 'AI Integration ROI', 'Risk Mitigation'],
    estimatedReadingTime: '12 mins',
    totalPages: 18,
    language: 'English (US)',
    isScannedImage: false
  },
  tableOfContents: [
    { id: 'toc-1', title: '1. Executive Summary & Revenue Overview', level: 1, pageNumber: 1 },
    { id: 'toc-2', title: '2. Segment Breakdown & ARR Growth', level: 1, pageNumber: 4 },
    { id: 'toc-3', title: '3. Operating Expenses & R&D Capitalization', level: 1, pageNumber: 8 },
    { id: 'toc-4', title: '4. Balance Sheet & Cash Reserves', level: 1, pageNumber: 12 },
    { id: 'toc-5', title: '5. Risk Factors & FY2027 Projections', level: 1, pageNumber: 16 }
  ],
  executiveSummary: `Acme Corp demonstrated resilient financial execution in Q3 2026, delivering consolidated quarterly revenue of $142.8M, representing an 18.4% year-over-year expansion. Enterprise Cloud Solutions and AI Workloads were the chief catalysts, expanding recurring ARR by 27.2% to $98.4M. Overall gross margins expanded 210 basis points to 72.8%, driven by server efficiency optimization and decreased vendor unit costs.\n\nOperating income surged 24% to $34.2M despite a 14% increase in R&D expenditure directed toward agentic infrastructure and automated data pipelines. Operating cash flows reached $41.5M, maintaining liquidity reserves at $210M. Key liabilities include increased cloud data center long-term lease commitments and talent retention bonuses.\n\nThe strategic posture for Q4 remains focused on scaling high-margin enterprise AI tier offerings while maintaining strict debt-to-equity ratios below 0.35. Regulatory compliance with the EU AI Act and US FTC Guidelines is fully budgeted at $3.2M.`,
  keyInsights: [
    {
      id: 'ki-1',
      statement: 'Consolidated revenue reached $142.8M (+18.4% YoY), surpassing street consensus by $4.2M.',
      impact: 'high',
      citation: 'Doc 1, Page 2, Para 1',
      pageNumber: 2,
      section: 'Executive Summary'
    },
    {
      id: 'ki-2',
      statement: 'Enterprise Cloud ARR expanded to $98.4M with customer net retention rate at 118%.',
      impact: 'high',
      citation: 'Doc 1, Page 5, Para 3',
      pageNumber: 5,
      section: 'Segment Breakdown'
    },
    {
      id: 'ki-3',
      statement: 'R&D investments grew 14% YoY to $28.6M, specifically prioritizing multimodal document AI microservices.',
      impact: 'medium',
      citation: 'Doc 1, Page 9, Para 2',
      pageNumber: 9,
      section: 'Operating Expenses'
    },
    {
      id: 'ki-4',
      statement: 'Gross margin reached 72.8% due to compute vendor price renegotiation and GPU cluster optimization.',
      impact: 'high',
      citation: 'Doc 1, Page 3, Para 4',
      pageNumber: 3,
      section: 'Executive Summary'
    },
    {
      id: 'ki-5',
      statement: 'Legal and regulatory compliance budget increased by $3.2M to comply with EU AI Act disclosures.',
      impact: 'medium',
      citation: 'Doc 1, Page 16, Para 1',
      pageNumber: 16,
      section: 'Risk Factors'
    }
  ],
  tables: [
    {
      id: 'tbl-1',
      title: 'Quarterly Revenue Breakdown by Division ($ Millions)',
      headers: ['Division', 'Q3 2025', 'Q2 2026', 'Q3 2026', 'YoY Growth (%)'],
      rows: [
        ['Enterprise Cloud Services', '52.4', '68.1', '74.2', '+41.6%'],
        ['AI Platform Subscriptions', '18.1', '28.5', '32.6', '+80.1%'],
        ['Professional Services', '24.8', '21.0', '19.8', '-20.1%'],
        ['Legacy On-Prem Licenses', '25.3', '18.2', '16.2', '-35.9%'],
        ['Total Revenue', '120.6', '135.8', '142.8', '+18.4%']
      ],
      recommendedChartType: 'bar',
      confidence: 'high',
      citation: 'Doc 1, Page 4, Table 2.1',
      pageNumber: 4
    },
    {
      id: 'tbl-2',
      title: 'Operating Expense & R&D Trend ($ Millions)',
      headers: ['Expense Category', 'Q1 2026', 'Q2 2026', 'Q3 2026'],
      rows: [
        ['Research & Development', '24.1', '26.4', '28.6'],
        ['Sales & Marketing', '31.2', '33.0', '34.5'],
        ['General & Administrative', '12.5', '12.8', '13.1'],
        ['Cost of Goods Sold (COGS)', '36.8', '37.2', '38.8']
      ],
      recommendedChartType: 'line',
      confidence: 'high',
      citation: 'Doc 1, Page 8, Table 3.2',
      pageNumber: 8
    }
  ],
  visualAssets: [
    {
      id: 'va-1',
      title: 'Global Revenue Distribution & Regional Share Map',
      caption: 'Illustrates regional market penetration across North America (58%), EMEA (26%), and APAC (16%). APAC shows highest quarter-over-quarter expansion.',
      pageNumber: 6,
      category: 'chart',
      description: 'Regional pie chart showing growth trends in international markets.'
    },
    {
      id: 'va-2',
      title: 'Agentic AI Architecture Pipeline Diagram',
      caption: 'Diagram depicting the real-time inference workflow, vector caching tier, and client response synthesis engine.',
      pageNumber: 10,
      category: 'architecture',
      description: 'System flow diagram detailing serverless pipeline components.'
    }
  ],
  actionItems: [
    {
      id: 'act-1',
      task: 'Finalize EU AI Act compliance filing documentation before December 1, 2026.',
      priority: 'High',
      ownerRole: 'Chief Legal Officer',
      deadline: '2026-12-01',
      pageCitation: 'Doc 1, Page 16, Para 3',
      pageNumber: 16,
      completed: false
    },
    {
      id: 'act-2',
      task: 'Renegotiate Tier-1 GPU cloud provider contract to lock in 15% volume discount.',
      priority: 'High',
      ownerRole: 'VP of Infrastructure',
      deadline: '2026-11-15',
      pageCitation: 'Doc 1, Page 11, Para 2',
      pageNumber: 11,
      completed: false
    },
    {
      id: 'act-3',
      task: 'Transition remaining legacy on-premise accounts to Enterprise Cloud tier.',
      priority: 'Medium',
      ownerRole: 'VP of Customer Success',
      deadline: '2027-01-31',
      pageCitation: 'Doc 1, Page 7, Para 1',
      pageNumber: 7,
      completed: true
    }
  ],
  topicTags: ['Financial Performance', 'Enterprise AI', 'Cloud ARR', 'R&D Allocation', 'EU AI Act', 'Margin Optimization'],
  rawMarkdownReport: `# Acme Corp Q3 2026 Financial Report Summary\n\n## Executive Summary\nAcme Corp delivered $142.8M in Q3 revenue (+18.4% YoY) with Enterprise Cloud ARR growing 27.2% to $98.4M. Operating cash flow reached $41.5M.\n\n## Key Metrics\n- Revenue: $142.8M\n- Gross Margin: 72.8%\n- Operating Income: $34.2M\n\n## Key Action Items\n1. [High] EU AI Act compliance filing by Dec 1, 2026\n2. [High] GPU Cloud renegotiation by Nov 15, 2026\n`
};

export const SAMPLE_ANALYSIS_ACADEMIC: AnalysisResult = {
  id: 'sample-academic-ethics-2026',
  documentName: 'Multimodal_LLM_Audit_Benchmarking.pdf',
  fileSize: '3.8 MB',
  processedAt: new Date().toISOString(),
  personaLens: 'academic',
  summaryDepth: 'detailed',
  metadata: {
    title: 'Benchmarking Hallucinations and Tabular Precision in Multimodal Document LLMs',
    authors: ['Dr. Elena Rostova', 'Prof. Marcus Vance', 'AI Safety Research Lab'],
    publicationDate: 'August 2026',
    primaryTopics: ['Multimodal LLM Evaluation', 'Tabular OCR Accuracy', 'Hallucination Rate', 'Document Extraction'],
    estimatedReadingTime: '22 mins',
    totalPages: 34,
    language: 'English (UK)',
    isScannedImage: true
  },
  tableOfContents: [
    { id: 'atoc-1', title: '1. Abstract & Introduction', level: 1, pageNumber: 1 },
    { id: 'atoc-2', title: '2. Dataset Composition (DocBench-5K)', level: 1, pageNumber: 5 },
    { id: 'atoc-3', title: '3. Methodology & OCR Fallback Pipeline', level: 1, pageNumber: 11 },
    { id: 'atoc-4', title: '4. Experimental Results & Error Analysis', level: 1, pageNumber: 19 },
    { id: 'atoc-5', title: '5. Limitations & Future Directions', level: 1, pageNumber: 30 }
  ],
  executiveSummary: `This study evaluates 12 state-of-the-art vision-language models on DocBench-5K, a benchmark comprising 5,000 multi-page scanned, native, and complex layout PDFs. The investigation focuses specifically on table cell extraction precision, numerical reasoning fidelity, and page-level citation accuracy.\n\nNative vision processing outpaced traditional OCR-text pipeline models by 34.2% in table reconstruction precision (94.8% vs 60.6% F1-score on skewed layout pages). However, when document pages exhibited low resolution (<150 DPI) or dense mathematical formulae, OCR fallback hybrid mechanisms reduced cell misalignments by 42%.\n\nCitation fidelity benchmarking revealed that models without explicit vector passage retrieval suffered a 21.5% hallucination rate on specific paragraph numbers, whereas grounded RAG index architectures capped mis-citations below 1.2%. The findings advocate for native multimodal ingestion paired with hybrid OCR fallback.`,
  keyInsights: [
    {
      id: 'aki-1',
      statement: 'Native multimodal models achieved 94.8% F1 score in table cell alignment on complex financial layouts.',
      impact: 'high',
      citation: 'Doc 1, Page 20, Para 2',
      pageNumber: 20,
      section: 'Experimental Results'
    },
    {
      id: 'aki-2',
      statement: 'Hybrid OCR fallback improved numerical accuracy on scanned pages under 150 DPI by 42%.',
      impact: 'high',
      citation: 'Doc 1, Page 14, Para 4',
      pageNumber: 14,
      section: 'Methodology'
    },
    {
      id: 'aki-3',
      statement: 'Ungrounded models hallucinated citations in 21.5% of tested claims across 5,000 evaluation prompts.',
      impact: 'high',
      citation: 'Doc 1, Page 24, Para 1',
      pageNumber: 24,
      section: 'Error Analysis'
    }
  ],
  tables: [
    {
      id: 'atbl-1',
      title: 'Model Benchmarking Score Comparison (F1 Score %)',
      headers: ['Model Family', 'Native Table F1', 'OCR Fallback F1', 'Citation Accuracy', 'Latency (s)'],
      rows: [
        ['Gemini Multimodal Ingestion', '96.2%', '98.1%', '98.9%', '1.4s'],
        ['Standard Vision-Language B', '88.4%', '91.2%', '89.5%', '2.8s'],
        ['Text OCR + LLM Pipeline C', '60.6%', '78.4%', '78.2%', '4.1s'],
        ['Baseline Open-Source VLM D', '71.2%', '82.0%', '74.1%', '3.2s']
      ],
      recommendedChartType: 'bar',
      confidence: 'high',
      citation: 'Doc 1, Page 21, Table 4.2',
      pageNumber: 21
    }
  ],
  visualAssets: [
    {
      id: 'ava-1',
      title: 'DocBench-5K Error Classification Chart',
      caption: 'Categorizes extraction failures into Cell Misalignment (38%), Font Encoding Artifacts (29%), Omitted Sub-tables (21%), and Unclear Bounding Boxes (12%).',
      pageNumber: 22,
      category: 'chart',
      description: 'Distribution of errors across document parsing strategies.'
    }
  ],
  actionItems: [
    {
      id: 'aact-1',
      task: 'Integrate hybrid OCR fallback trigger for PDFs with DPI below 150.',
      priority: 'High',
      ownerRole: 'Lead Machine Learning Engineer',
      deadline: '2026-10-15',
      pageCitation: 'Doc 1, Page 31, Para 2',
      pageNumber: 31,
      completed: false
    }
  ],
  topicTags: ['Document AI', 'Benchmarking', 'Table Extraction', 'OCR Fallback', 'Hallucination Mitigation', 'Vision Language Models'],
  rawMarkdownReport: `# Multimodal LLM Audit Report\n\n## Abstract\nEvaluation of 12 VLMs across 5,000 complex PDFs.`
};

export const SAMPLE_BATCH_ANALYSIS: BatchAnalysisResult = {
  id: 'batch-sample-2026',
  createdAt: new Date().toISOString(),
  batchName: 'Enterprise Cloud Strategy & Market Audit (Batch of 2)',
  documentCount: 2,
  documents: [SAMPLE_ANALYSIS_FINANCIAL, SAMPLE_ANALYSIS_ACADEMIC],
  comparativeMatrix: {
    summary: 'Cross-document analysis indicates a strong alignment between commercial enterprise cloud investments (Acme Q3 Report) and empirical academic findings on multimodal document processing (DocBench Audit). While Acme prioritizes high-margin ARR scaling and regulatory AI compliance, academic benchmarks demonstrate that Native Multimodal PDF ingestion yields 34% higher table accuracy and sub-second processing.',
    documentComparisons: [
      {
        docId: SAMPLE_ANALYSIS_FINANCIAL.id,
        docName: SAMPLE_ANALYSIS_FINANCIAL.documentName,
        coreTheme: 'Financial Expansion & Enterprise Cloud ARR Growth',
        keyMetrics: 'Revenue: $142.8M (+18.4%), Gross Margin: 72.8%, Cloud ARR: $98.4M',
        stanceOrConclusion: 'Aggressive expansion in Enterprise AI tier while committing $3.2M to compliance.'
      },
      {
        docId: SAMPLE_ANALYSIS_ACADEMIC.id,
        docName: SAMPLE_ANALYSIS_ACADEMIC.documentName,
        coreTheme: 'Multimodal Document Processing & Hallucination Mitigation',
        keyMetrics: 'Table F1: 96.2%, Citation Precision: 98.9%, OCR Fallback Gain: 42%',
        stanceOrConclusion: 'Recommends native multimodal pipeline over text-OCR for document intelligence.'
      }
    ],
    commonThemes: [
      'Focus on Multimodal AI Infrastructure for enterprise workflows',
      'Emphasis on data accuracy, regulatory compliance, and verification',
      'Transition from legacy text systems to high-performance vision-language pipelines'
    ],
    contrastingConclusions: [
      'Commercial perspective emphasizes revenue growth and cost-per-inference margins.',
      'Academic perspective highlights edge-case vulnerabilities in low-DPI scanned PDFs and mathematical notation.'
    ],
    overlappingDataPoints: [
      'Both documents highlight 20-30% performance/growth jumps when utilizing modern multimodal AI models.',
      'Both cite regulatory compliance & hallucination control as critical blockers for enterprise adoption.'
    ]
  }
};

export const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: 'demo-financial',
    name: 'Acme Corp Q3 Financial Performance.pdf',
    description: 'Corporate financial briefing with revenue tables, ARR growth, margins, and action items.',
    category: 'Financial / Corporate',
    mockResult: SAMPLE_ANALYSIS_FINANCIAL
  },
  {
    id: 'demo-academic',
    name: 'Multimodal LLM Audit Benchmarking.pdf',
    description: 'Academic paper evaluating vision-language models on table extraction and OCR fallback.',
    category: 'Academic Research',
    mockResult: SAMPLE_ANALYSIS_ACADEMIC
  }
];
