import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FileSpreadsheet,
  Copy,
  Check,
  Printer,
  FileText,
  Boxes,
  Share2
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { escapeHtml, tableToCsv } from '../utils/csv';

interface ExportCenterTabProps {
  analysis: AnalysisResult;
}

export const ExportCenterTab: React.FC<ExportCenterTabProps> = ({ analysis }) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Generate Clean Markdown
  const generateMarkdownReport = (): string => {
    let md = `# ${analysis.metadata.title}\n`;
    md += `**Authors:** ${analysis.metadata.authors.join(', ')}  \n`;
    md += `**Date:** ${analysis.metadata.publicationDate} | **Pages:** ${analysis.metadata.totalPages}\n\n`;
    md += `## Executive Summary (${analysis.personaLens.toUpperCase()} Lens)\n\n${analysis.executiveSummary}\n\n`;

    md += `## Key Findings & Citations\n\n`;
    analysis.keyInsights.forEach(ki => {
      md += `- **[${ki.impact.toUpperCase()}]** ${ki.statement} _(${ki.citation})_\n`;
    });

    md += `\n## Extracted Tables\n\n`;
    analysis.tables.forEach(t => {
      md += `### ${t.title} _(${t.citation})_\n\n`;
      md += `| ${t.headers.join(' | ')} |\n`;
      md += `| ${t.headers.map(() => '---').join(' | ')} |\n`;
      t.rows.forEach(r => {
        md += `| ${r.join(' | ')} |\n`;
      });
      md += `\n`;
    });

    md += `## Action Items Checklist\n\n`;
    analysis.actionItems.forEach(ai => {
      md += `- [${ai.completed ? 'x' : ' '}] **[${ai.priority}]** ${ai.task} _(Owner: ${ai.ownerRole || 'N/A'}, ${ai.pageCitation})_\n`;
    });

    return md;
  };

  // Generate Google Docs API Payload Schema
  const generateGoogleDocsJson = (): string => {
    const payload = {
      title: analysis.metadata.title,
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: `${analysis.metadata.title}\n\nExecutive Summary:\n${analysis.executiveSummary}\n\nKey Insights:\n` +
              analysis.keyInsights.map(k => `• ${k.statement} (${k.citation})`).join('\n')
          }
        }
      ]
    };
    return JSON.stringify(payload, null, 2);
  };

  // Generate Notion API Blocks Schema
  const generateNotionBlocksJson = (): string => {
    const blocks = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: analysis.metadata.title } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: analysis.executiveSummary } }]
        }
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Key Findings & Citations' } }]
        }
      },
      ...analysis.keyInsights.map(ki => ({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            { type: 'text', text: { content: `${ki.statement} ` } },
            { type: 'text', text: { content: ki.citation }, annotations: { italic: true, color: 'blue' } }
          ]
        }
      }))
    ];
    return JSON.stringify({ children: blocks }, null, 2);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(analysis.metadata.title)} - Analysis Report</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { color: #0f172a; font-size: 24px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
            h2 { color: #334155; font-size: 18px; margin-top: 24px; }
            .badge { background: #e0e7ff; color: #4338ca; padding: 2px 8px; borderRadius: 4px; font-size: 12px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(analysis.metadata.title)}</h1>
          <p><strong>Authors:</strong> ${escapeHtml(analysis.metadata.authors.join(', '))} | <strong>Date:</strong> ${escapeHtml(analysis.metadata.publicationDate)}</p>
          <h2>Executive Summary (${escapeHtml(analysis.personaLens.toUpperCase())} Lens)</h2>
          <p>${escapeHtml(analysis.executiveSummary)}</p>
          <h2>Key Insights</h2>
          <ul>
            ${analysis.keyInsights.map(k => `<li><strong>[${escapeHtml(k.impact.toUpperCase())}]</strong> ${escapeHtml(k.statement)} <em>(${escapeHtml(k.citation)})</em></li>`).join('')}
          </ul>
          <h2>Action Items</h2>
          <ul>
            ${analysis.actionItems.map(a => `<li>[${escapeHtml(a.priority)}] ${escapeHtml(a.task)} <em>(${escapeHtml(a.pageCitation)})</em></li>`).join('')}
          </ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const markdownText = generateMarkdownReport();
  const docsJsonText = generateGoogleDocsJson();
  const notionJsonText = generateNotionBlocksJson();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              Multi-Format Export & Integration Center
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Export complete document intelligence reports or structured API payloads directly into your workflow.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="bento-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider shrink-0"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Standalone Clean Markdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs">
                <FileCode className="w-5 h-5 stroke-[2.5]" /> Clean Markdown (.md)
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                Universal Report
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Complete report with headings, bullet points, citations, and Markdown formatted tables.
            </p>

            <div className="mt-3 bg-[#0f172a] text-slate-200 p-3.5 rounded-xl font-mono text-[11px] h-32 overflow-y-auto border-2 border-slate-900">
              <pre>{markdownText}</pre>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => downloadFile(markdownText, `${analysis.documentName}_Report.md`, 'text/markdown')}
              className="bento-btn flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" /> Download .md
            </button>
            <button
              onClick={() => handleCopy(markdownText, 'markdown')}
              className="bento-btn py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              {copiedFormat === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* 2. Google Docs API Payload */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs">
                <FileText className="w-5 h-5 stroke-[2.5]" /> Google Docs API Payload
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                Copy for Integration
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Structured JSON request objects (Copy payload to send via your Google Docs API batchUpdate integration).
            </p>

            <div className="mt-3 bg-[#0f172a] text-indigo-300 p-3.5 rounded-xl font-mono text-[11px] h-32 overflow-y-auto border-2 border-slate-900">
              <pre>{docsJsonText}</pre>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => downloadFile(docsJsonText, `${analysis.documentName}_GoogleDocsPayload.json`, 'application/json')}
              className="bento-btn flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" /> Download JSON
            </button>
            <button
              onClick={() => handleCopy(docsJsonText, 'googleDocs')}
              className="bento-btn py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              {copiedFormat === 'googleDocs' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* 3. Notion API Block Schema */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs">
                <Boxes className="w-5 h-5 stroke-[2.5]" /> Notion API Payload
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                Copy for Integration
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Clean JSON block hierarchy (Copy payload to insert via your Notion API endpoints).
            </p>

            <div className="mt-3 bg-[#0f172a] text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] h-32 overflow-y-auto border-2 border-slate-900">
              <pre>{notionJsonText}</pre>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => downloadFile(notionJsonText, `${analysis.documentName}_NotionBlocks.json`, 'application/json')}
              className="bento-btn flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" /> Download Blocks
            </button>
            <button
              onClick={() => handleCopy(notionJsonText, 'notion')}
              className="bento-btn py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              {copiedFormat === 'notion' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* 4. CSV Tables Export */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs">
                <FileSpreadsheet className="w-5 h-5 stroke-[2.5]" /> Extracted Tables (.CSV)
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                Excel / Sheets
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Export all {analysis.tables.length} extracted data tables as standalone CSV files for financial modeling or Excel analysis.
            </p>

            <div className="mt-3 space-y-2">
              {analysis.tables.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <span className="font-black text-slate-900 dark:text-slate-100 truncate">{t.title}</span>
                  <span className="font-mono font-black text-[10px] text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-900">{t.rows.length} rows</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              analysis.tables.forEach(t => {
                const csv = tableToCsv(t.headers, t.rows);
                downloadFile(csv, `${t.title.replace(/\s+/g, '_')}.csv`, 'text/csv');
              });
            }}
            className="bento-btn w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" /> Download All CSV Tables
          </button>
        </div>

      </div>

    </div>
  );
};
