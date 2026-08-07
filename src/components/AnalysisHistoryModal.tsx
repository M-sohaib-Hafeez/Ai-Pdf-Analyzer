import React, { useState } from 'react';
import {
  History,
  X,
  Search,
  FileText,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { AnalysisResult, BatchAnalysisResult } from '../types';

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: Array<AnalysisResult | BatchAnalysisResult>;
  onSelectResult: (item: AnalysisResult | BatchAnalysisResult) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
}

export const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
  onSelectResult,
  onDeleteHistoryItem,
  onClearAllHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredList = historyList.filter((item) => {
    if ('documents' in item) {
      return item.batchName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return (
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Analysis History & Saved Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Access past document analysis sessions without re-processing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Clear Button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history by title, document name, or topic..."
              className="w-full bg-white dark:bg-slate-800 pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {historyList.length > 0 && (
            <button
              onClick={onClearAllHistory}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2"
            >
              Clear All
            </button>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
              No saved document analyses found.
            </div>
          ) : (
            filteredList.map((item) => {
              const isBatch = 'documents' in item;
              const title = isBatch ? item.batchName : item.metadata.title || item.documentName;
              const dateStr = isBatch ? item.createdAt : item.processedAt;
              const docCount = isBatch ? item.documentCount : 1;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      {isBatch ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> Batch ({docCount})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Single PDF
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(dateStr).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectResult(item);
                        onClose();
                      }}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors"
                      title="Open Saved Analysis"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
