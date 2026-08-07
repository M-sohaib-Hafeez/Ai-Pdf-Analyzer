import React, { useState } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Search,
  BookOpen,
  CheckCircle,
  Highlighter
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { DiagramViewer } from './DiagramViewer';

interface PdfViewerPaneProps {
  analysis: AnalysisResult;
  currentPage: number;
  onPageChange: (page: number) => void;
  highlightedSection?: string;
}

export const PdfViewerPane: React.FC<PdfViewerPaneProps> = ({
  analysis,
  currentPage,
  onPageChange,
  highlightedSection
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const totalPages = analysis.metadata.totalPages || 10;

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 20, 60));

  // Find elements on this page
  const pageTables = analysis.tables.filter(t => t.pageNumber === currentPage);
  const pageInsights = analysis.keyInsights.filter(k => k.pageNumber === currentPage);
  const pageActions = analysis.actionItems.filter(a => a.pageNumber === currentPage);
  const pageVisualAssets = analysis.visualAssets.filter(v => v.pageNumber === currentPage);

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
      
      {/* PDF Viewer Toolbar */}
      <div className="bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between gap-2 text-xs shrink-0 border-b-2 border-slate-900">
        
        {/* Document Name */}
        <div className="flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
          <FileText className="w-4 h-4 text-indigo-400 shrink-0 stroke-[2.5]" />
          <span className="font-black uppercase tracking-wide text-slate-100 truncate" title={analysis.documentName}>
            {analysis.documentName}
          </span>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px] font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-slate-400">P.</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= totalPages) onPageChange(val);
              }}
              className="w-8 text-center bg-transparent text-amber-400 font-black outline-none"
            />
            <span className="text-slate-400">/ {totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Zoom & Window Tools */}
        <div className="flex items-center gap-1.5">
          {analysis.fileDataUrl && (
            <a
              href={analysis.fileDataUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={analysis.documentName}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase bg-indigo-600 hover:bg-indigo-700 text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 shrink-0"
              title="Open or Download Binary PDF"
            >
              <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              <span className="hidden sm:inline">Download</span> PDF
            </a>
          )}

          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <span className="font-mono text-[10px] font-black text-slate-300 w-9 text-center">
            {zoomLevel}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ml-1 border border-slate-900"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer'}
          >
            <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* Main Preview Workspace (High-Fidelity Document Canvas View) */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-[#f0f2f5] dark:bg-slate-950/90 min-h-[450px]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-900 dark:border-slate-700 p-6 sm:p-8 min-h-[600px] transition-transform space-y-6 relative mb-12"
        >
          {/* PDF Header Mark */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-700 pb-4">
            <div>
              <p className="bento-eyebrow text-slate-400">
                AI-RECONSTRUCTED PAGE SUMMARY • PAGE {currentPage} OF {totalPages}
              </p>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mt-1">
                {analysis.metadata.title}
              </h3>
            </div>
            <span className="text-[10px] font-mono font-black text-white bg-indigo-600 px-2.5 py-1 rounded-md border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              [PAGE {currentPage}]
            </span>
          </div>

          {/* Document Content View for Page */}
          <div className="space-y-5 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            <p className="first-letter:text-xl first-letter:font-black first-letter:text-indigo-600">
              Page {currentPage} contains extracted multimodal document content, verified citations, and tabular data parsed by the Lumina Intelligence Engine.
            </p>

            {/* Page-Specific Key Insights Highlight */}
            {pageInsights.length > 0 && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border-2 border-slate-900 dark:border-slate-700 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-2 my-3">
                <div className="flex items-center gap-1.5 bento-eyebrow text-indigo-700 dark:text-indigo-300">
                  <Highlighter className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                  <span>Page Citation Landmark</span>
                </div>
                {pageInsights.map((insight) => (
                  <p key={insight.id} className="text-xs text-slate-900 dark:text-indigo-200 font-bold">
                    "{insight.statement}" — <span className="font-mono text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-900">{insight.citation}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Page-Specific Diagrams & Figures */}
            {pageVisualAssets.length > 0 && (
              <div className="my-4">
                <DiagramViewer asset={pageVisualAssets[0]} onJumpToPage={onPageChange} />
              </div>
            )}

            {/* Page-Specific Table View */}
            {pageTables.length > 0 && (
              <div className="my-4 border-2 border-slate-900 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-slate-900 dark:text-slate-100">
                    Table: {pageTables[0].title}
                  </span>
                  <span className="text-[10px] font-black uppercase text-white bg-emerald-600 px-2 py-0.5 rounded border border-slate-900">
                    Verified Table
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-black uppercase">
                        {pageTables[0].headers.map((h, i) => (
                          <th key={i} className="p-1.5 border border-slate-900">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageTables[0].rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-slate-300 dark:border-slate-700 font-semibold">
                          {row.map((cell, ci) => (
                            <td key={ci} className="p-1.5 text-slate-900 dark:text-slate-200">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Page-Specific Action Item */}
            {pageActions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-300 dark:bg-amber-500 border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] my-3">
                <span className="bento-eyebrow text-slate-900 block mb-1">
                  Action Required on Page {currentPage}
                </span>
                <p className="text-xs font-black">{pageActions[0].task}</p>
              </div>
            )}

            <p className="text-slate-500 dark:text-slate-400 italic text-[11px] pt-4 border-t-2 border-slate-100 dark:border-slate-800">
              [Paragraph {currentPage * 2 - 1}] Grounded citations link directly to this document section. Click any citation badge in the insights pane to jump to its corresponding page.
            </p>
          </div>

          {/* Document Page Footer */}
          <div className="pt-6 flex items-center justify-between text-[10px] font-bold text-slate-400 border-t-2 border-slate-100 dark:border-slate-800">
            <span>{analysis.metadata.authors.join(', ')}</span>
            <span>PAGE {currentPage} / {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Page Quick Jump Strip */}
      <div className="bg-[#0f172a] text-slate-200 px-4 py-2.5 text-xs flex items-center justify-between overflow-x-auto shrink-0 gap-2 border-t-2 border-slate-900">
        <span className="bento-eyebrow text-slate-400 shrink-0">Quick Pages:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {Array.from({ length: Math.min(totalPages, 12) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-black transition-all border ${
                currentPage === p
                  ? 'bg-indigo-600 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              P{p}
            </button>
          ))}
          {totalPages > 12 && <span className="text-slate-500 text-[10px] font-mono">... {totalPages}</span>}
        </div>
      </div>

    </div>
  );
};
