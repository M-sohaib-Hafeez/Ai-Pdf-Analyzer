import React from 'react';
import { FileText, History, Shield, PlusCircle, Sparkles, Sun, Moon, BookOpen } from 'lucide-react';
import { SampleDoc } from '../types';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenPrivacy: () => void;
  onNewAnalysis: () => void;
  onSelectSample: (sample: SampleDoc) => void;
  sampleDocs: SampleDoc[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenPrivacy,
  onNewAnalysis,
  onSelectSample,
  sampleDocs,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f0f2f5] dark:bg-slate-950 border-b-2 border-slate-900 dark:border-slate-800 transition-colors py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNewAnalysis}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all">
            <FileText className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Lumina PDF <span className="text-indigo-600 dark:text-indigo-400">Analyzer</span>
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                Gemini 1.5 Pro
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hidden md:block">
              Multimodal Document Intelligence Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Demo Selector */}
          <div className="relative group hidden lg:block">
            <button
              id="demo-docs-dropdown-btn"
              className="bento-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Try Demo PDF</span>
            </button>
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-2 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hidden group-hover:block z-50 animate-fadeIn">
              <div className="px-2 py-1 bento-eyebrow text-slate-400 mb-1">
                Instant Interactive Demos
              </div>
              {sampleDocs.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors group/item border border-transparent hover:border-slate-900 dark:hover:border-slate-700"
                >
                  <div className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 truncate">
                    {sample.name}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {sample.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* New Analysis Button */}
          <button
            id="new-analysis-header-btn"
            onClick={onNewAnalysis}
            className="bento-btn inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg bg-indigo-600 text-white"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Upload New</span>
          </button>

          {/* History Library */}
          <button
            id="history-library-btn"
            onClick={onOpenHistory}
            className="bento-btn relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
            title="Analysis History Library"
          >
            <History className="w-4 h-4 text-slate-700 dark:text-slate-300 stroke-[2.5]" />
            <span className="hidden md:inline">Library</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black text-white bg-indigo-600 rounded-full border border-slate-900">
                {historyCount}
              </span>
            )}
          </button>

          {/* Privacy Note */}
          <button
            id="privacy-note-btn"
            onClick={onOpenPrivacy}
            className="bento-btn p-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-lg"
            title="Privacy & Data Safety"
          >
            <Shield className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="dark-mode-toggle-btn"
            onClick={onToggleDarkMode}
            className="bento-btn p-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-lg"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" /> : <Moon className="w-4 h-4 text-slate-900 stroke-[2.5]" />}
          </button>

        </div>
      </div>
    </header>
  );
};
