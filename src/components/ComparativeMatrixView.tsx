import React from 'react';
import {
  Layers,
  CheckCircle2,
  GitCompare,
  TrendingUp,
  AlertCircle,
  FileText
} from 'lucide-react';
import { ComparativeMatrix } from '../types';

interface ComparativeMatrixViewProps {
  matrix: ComparativeMatrix;
}

export const ComparativeMatrixView: React.FC<ComparativeMatrixViewProps> = ({ matrix }) => {
  return (
    <div className="space-y-6">
      
      {/* Matrix Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-indigo-800">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4 text-indigo-400" /> Cross-Document Intelligence Synthesis
        </div>
        <h3 className="text-xl font-extrabold">Batch Comparative Matrix</h3>
        <p className="text-xs text-indigo-200/90 mt-2 leading-relaxed">
          {matrix.summary}
        </p>
      </div>

      {/* Comparative Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-indigo-500" />
          Document Stance & Metrics Breakdown
        </h4>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 font-bold border-r border-slate-200 dark:border-slate-700">Document</th>
                <th className="p-3 font-bold border-r border-slate-200 dark:border-slate-700">Core Strategic Theme</th>
                <th className="p-3 font-bold border-r border-slate-200 dark:border-slate-700">Key Metrics & Data</th>
                <th className="p-3 font-bold">Stance / Core Conclusion</th>
              </tr>
            </thead>
            <tbody>
              {matrix.documentComparisons.map((doc, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400 border-r border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 shrink-0 text-indigo-500" />
                      <span>{doc.docName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800 font-medium">
                    {doc.coreTheme}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                    {doc.keyMetrics}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {doc.stanceOrConclusion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synthesis Columns: Common Themes vs Contrasting Conclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Common Themes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Common Themes & Alignments
          </h4>
          <ul className="space-y-2">
            {matrix.commonThemes.map((theme, i) => (
              <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contrasting Conclusions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Contrasting Conclusions & Divergences
          </h4>
          <ul className="space-y-2">
            {matrix.contrastingConclusions.map((contrast, i) => (
              <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-amber-50/50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{contrast}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Overlapping Data Points */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Overlapping Data Points & Metrics
        </h4>
        <div className="flex flex-wrap gap-2">
          {matrix.overlappingDataPoints.map((dp, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {dp}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
