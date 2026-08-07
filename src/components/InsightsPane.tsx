import React, { useState } from 'react';
import {
  FileText,
  Key,
  Table as TableIcon,
  Image as ImageIcon,
  CheckSquare,
  Layers,
  Download,
  MessageSquare,
  Sparkles,
  List,
  Tag,
  Clock,
  User,
  Calendar,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Briefcase,
  Lightbulb,
  Scale
} from 'lucide-react';
import {
  AnalysisResult,
  BatchAnalysisResult,
  PersonaLens,
  SummaryDepth,
  TableData
} from '../types';
import { EditableTable } from './EditableTable';
import { ActionItemsTab } from './ActionItemsTab';
import { ComparativeMatrixView } from './ComparativeMatrixView';
import { ExportCenterTab } from './ExportCenterTab';
import { ChatPanel } from './ChatPanel';
import { DiagramViewer } from './DiagramViewer';

interface InsightsPaneProps {
  activeResult: AnalysisResult | BatchAnalysisResult;
  onJumpToPage: (page: number) => void;
  onResynthesize?: (personaLens: PersonaLens, summaryDepth: SummaryDepth) => void;
  isResynthesizing?: boolean;
}

export const InsightsPane: React.FC<InsightsPaneProps> = ({
  activeResult,
  onJumpToPage,
  onResynthesize,
  isResynthesizing
}) => {
  const isBatch = 'documents' in activeResult;

  // Selected single document in batch mode
  const [selectedBatchDocIndex, setSelectedBatchDocIndex] = useState<number>(0);

  const docResult: AnalysisResult = isBatch
    ? activeResult.documents[selectedBatchDocIndex] || activeResult.documents[0]
    : activeResult;

  const [activeTab, setActiveTab] = useState<
    'summary' | 'insights' | 'tables' | 'media' | 'actions' | 'batch' | 'export' | 'chat'
  >(isBatch ? 'batch' : 'summary');

  const [personaLens, setPersonaLens] = useState<PersonaLens>(docResult.personaLens || 'academic');
  const [summaryDepth, setSummaryDepth] = useState<SummaryDepth>(docResult.summaryDepth || 'paragraph');
  const [actionItems, setActionItems] = useState(docResult.actionItems || []);

  const handleToggleActionComplete = (id: string) => {
    setActionItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleTableUpdate = (updatedTable: TableData) => {
    // Local table update
    docResult.tables = docResult.tables.map(t => (t.id === updatedTable.id ? updatedTable : t));
  };

  const handleResynthesizeClick = (lens: PersonaLens, depth: SummaryDepth) => {
    setPersonaLens(lens);
    setSummaryDepth(depth);
    if (onResynthesize) onResynthesize(lens, depth);
  };

  const personaIcons: Record<PersonaLens, React.ReactNode> = {
    academic: <BookOpen className="w-3.5 h-3.5 text-indigo-500" />,
    executive: <Briefcase className="w-3.5 h-3.5 text-emerald-500" />,
    eli5: <Lightbulb className="w-3.5 h-3.5 text-amber-500" />,
    legal: <Scale className="w-3.5 h-3.5 text-rose-500" />
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full overflow-hidden">
      
      {/* Batch Document Selector if in Batch Mode */}
      {isBatch && (
        <div className="bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between gap-3 border-b-2 border-slate-900 text-xs shrink-0">
          <div className="flex items-center gap-2 font-black uppercase text-amber-400">
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>Batch Mode ({activeResult.documentCount} PDFs)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bento-eyebrow text-slate-400">Active Document:</span>
            <select
              value={selectedBatchDocIndex}
              onChange={(e) => setSelectedBatchDocIndex(parseInt(e.target.value, 10))}
              className="bg-slate-800 text-white text-xs font-black uppercase px-3 py-1 rounded-lg border-2 border-slate-700 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {activeResult.documents.map((d, i) => (
                <option key={d.id} value={i}>
                  {i + 1}. {d.documentName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Tab Navigation Bar */}
      <div className="bg-[#f0f2f5] dark:bg-slate-950 border-b-2 border-slate-900 dark:border-slate-800 px-4 pt-3 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        
        {isBatch && (
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
              activeTab === 'batch'
                ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
            <span>Comparative Matrix</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'summary'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Summary & TOC</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'insights'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <Key className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Key Insights ({docResult.keyInsights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'tables'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tables & Charts ({docResult.tables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'media'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Visual Assets ({docResult.visualAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'actions'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Actions ({actionItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'export'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export Center</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-b-0 border-slate-900 transition-all shrink-0 ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-[2px_-2px_0px_0px_rgba(15,23,42,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Q&A Chat</span>
        </button>

      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* TAB: BATCH COMPARATIVE MATRIX */}
        {isBatch && activeTab === 'batch' && (
          <ComparativeMatrixView matrix={activeResult.comparativeMatrix} />
        )}

        {/* TAB: SUMMARY & TOC */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Metadata Bar */}
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="bento-eyebrow text-slate-400 block mb-0.5">Document Title</span>
                <span className="font-black text-slate-900 dark:text-white uppercase line-clamp-1">
                  {docResult.metadata.title}
                </span>
              </div>
              <div>
                <span className="bento-eyebrow text-slate-400 block mb-0.5">Authors</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {docResult.metadata.authors.join(', ')}
                </span>
              </div>
              <div>
                <span className="bento-eyebrow text-slate-400 block mb-0.5">Publication Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {docResult.metadata.publicationDate}
                </span>
              </div>
              <div>
                <span className="bento-eyebrow text-slate-400 block mb-0.5">Est. Reading Time</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {docResult.metadata.estimatedReadingTime} ({docResult.metadata.totalPages} pages)
                </span>
              </div>
            </div>

            {/* Persona Lens & Depth Controls Toolbar */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-slate-100">
                  Persona Lens:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  {personaIcons[personaLens]}
                  {personaLens.replace('eli5', 'ELI5 (Plain English)')}
                </span>
                <span className="text-xs font-black uppercase text-slate-500 ml-2">Depth:</span>
                <span className="px-2.5 py-1 rounded text-[11px] font-black uppercase bg-indigo-600 text-white border border-slate-900">
                  {summaryDepth}
                </span>
              </div>

              {/* Quick Lens Switcher */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['executive', 'academic', 'eli5', 'legal'] as PersonaLens[]).map((lens) => (
                  <button
                    key={lens}
                    onClick={() => handleResynthesizeClick(lens, summaryDepth)}
                    disabled={isResynthesizing}
                    className={`bento-btn px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      personaLens === lens
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {lens.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Executive Summary Output Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                Structured Executive Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans font-medium">
                {docResult.executiveSummary}
              </p>
            </div>

            {/* Topic Tags Cloud */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                Keyword & Topic Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {docResult.topicTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Auto-Generated Table of Contents */}
            {docResult.tableOfContents && docResult.tableOfContents.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <List className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  Auto-Generated Table of Contents
                </h4>
                <div className="space-y-2 pt-1">
                  {docResult.tableOfContents.map((toc) => (
                    <div
                      key={toc.id}
                      onClick={() => onJumpToPage(toc.pageNumber)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer group border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] bg-white dark:bg-slate-800"
                    >
                      <span className={`text-xs font-black uppercase text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${toc.level === 2 ? 'ml-4 text-slate-700' : ''}`}>
                        {toc.title}
                      </span>
                      <span className="text-[10px] font-mono font-black text-white bg-indigo-600 px-2.5 py-1 rounded-md border border-slate-900 shrink-0">
                        PAGE {toc.pageNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: KEY INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                Core Findings & Grounded Citations
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Major empirical findings mapped directly to source document pages.
              </p>
            </div>

            <div className="space-y-3">
              {docResult.keyInsights.map((ki) => (
                <div
                  key={ki.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border-2 border-slate-900 ${
                      ki.impact === 'high'
                        ? 'bg-rose-500 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {ki.impact} Impact
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      Section: {ki.section}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {ki.statement}
                  </p>

                  <div className="pt-2 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500">Verified Citation:</span>
                    <button
                      onClick={() => onJumpToPage(ki.pageNumber)}
                      className="bento-btn inline-flex items-center gap-1.5 text-xs font-mono font-black text-slate-900 dark:text-slate-100 bg-amber-300 dark:bg-amber-500 px-3 py-1 rounded-lg border-2 border-slate-900"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      {ki.citation}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TABLES & CHARTS */}
        {activeTab === 'tables' && (
          <div className="space-y-6 animate-fadeIn">
            {docResult.tables.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold uppercase text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900">
                No embedded data tables detected in this document.
              </div>
            ) : (
              docResult.tables.map((t) => (
                <EditableTable
                  key={t.id}
                  table={t}
                  onTableUpdate={handleTableUpdate}
                  onJumpToPage={onJumpToPage}
                />
              ))
            )}
          </div>
        )}

        {/* TAB: MEDIA & FIGURES */}
        {activeTab === 'media' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                Extracted Media & Visual Assets
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Diagrams, figures, and visual flows extracted with contextual captions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {docResult.visualAssets.map((va) => (
                <DiagramViewer key={va.id} asset={va} onJumpToPage={onJumpToPage} />
              ))}
            </div>
          </div>
        )}

        {/* TAB: ACTION ITEMS */}
        {activeTab === 'actions' && (
          <ActionItemsTab
            actionItems={actionItems}
            onToggleComplete={handleToggleActionComplete}
            onJumpToPage={onJumpToPage}
          />
        )}

        {/* TAB: EXPORT CENTER */}
        {activeTab === 'export' && (
          <ExportCenterTab analysis={docResult} />
        )}

        {/* TAB: GROUNDED Q&A CHAT */}
        {activeTab === 'chat' && (
          <ChatPanel analysis={docResult} onJumpToPage={onJumpToPage} />
        )}

      </div>

    </div>
  );
};
