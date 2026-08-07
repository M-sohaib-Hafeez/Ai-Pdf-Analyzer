import React, { useState } from 'react';
import { VisualAsset } from '../types';
import {
  Maximize2,
  Minimize2,
  Download,
  Layers,
  Activity,
  ArrowRight,
  Database,
  Cpu,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  GitCommit,
  ShieldAlert,
  BarChart3,
  PieChart
} from 'lucide-react';

interface DiagramViewerProps {
  asset: VisualAsset;
  onJumpToPage?: (page: number) => void;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ asset, onJumpToPage }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'caption'>('visual');

  const titleLower = asset.title.toLowerCase();
  const captionLower = asset.caption.toLowerCase();

  // Determine diagram archetype
  const isConcurrencyDiagram =
    titleLower.includes('concurrency') ||
    titleLower.includes('lost update') ||
    captionLower.includes('dirty read') ||
    captionLower.includes('lost update');

  const isArchitectureDiagram =
    asset.category === 'architecture' ||
    titleLower.includes('architecture') ||
    titleLower.includes('pipeline') ||
    captionLower.includes('inference workflow');

  const isDistributionChart =
    asset.category === 'chart' ||
    titleLower.includes('distribution') ||
    titleLower.includes('chart') ||
    titleLower.includes('share') ||
    titleLower.includes('error classification');

  return (
    <div
      className={`bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl bg-white dark:bg-slate-900' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#0f172a] text-white p-3.5 flex items-center justify-between border-b-2 border-slate-900 shrink-0">
        <div className="flex items-center gap-2 truncate max-w-[70%]">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            {asset.category}
          </span>
          <h4 className="text-xs font-black uppercase tracking-wide truncate text-slate-100" title={asset.title}>
            {asset.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onJumpToPage && (
            <button
              onClick={() => onJumpToPage(asset.pageNumber)}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase bg-amber-400 text-slate-900 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300"
            >
              Page {asset.pageNumber}
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Diagram'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 stroke-[2.5]" /> : <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 flex-1 overflow-auto flex flex-col justify-center items-center min-h-[320px]">
        {isConcurrencyDiagram ? (
          <ConcurrencyAnomalyDiagram />
        ) : isArchitectureDiagram ? (
          <ArchitecturePipelineDiagram />
        ) : isDistributionChart ? (
          <ChartDistributionDiagram asset={asset} />
        ) : (
          <GenericNodeDiagram asset={asset} />
        )}
      </div>

      {/* Footer Caption & Context */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border-t-2 border-slate-900 dark:border-slate-800 text-xs shrink-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="bento-eyebrow text-slate-500">Caption Annotation:</span>
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-900 dark:border-slate-700">
          "{asset.caption}"
        </p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Specialized Diagram 1: Lost Update & Dirty Read Concurrency Anomalies      */
/* -------------------------------------------------------------------------- */
const ConcurrencyAnomalyDiagram: React.FC = () => {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Diagram Badge Banner */}
      <div className="flex items-center justify-between text-xs font-black uppercase text-slate-900 dark:text-slate-100 bg-amber-300 dark:bg-amber-500 p-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 stroke-[2.5] text-slate-900" />
          Interactive Banking System Concurrency Anomaly Trace
        </span>
        <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded">
          ISOLATION: READ COMMITTED
        </span>
      </div>

      {/* Split Grid: Left = Lost Update, Right = Dirty Read */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Card: Lost Update Problem */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> Lost Update Anomaly
            </span>
            <span className="text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-900">
              Overwrite
            </span>
          </div>

          {/* Step Timeline */}
          <div className="space-y-2 text-[11px] font-mono font-bold">
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-900 flex justify-between items-center">
              <span>T1: READ(Account_A)</span>
              <span className="text-emerald-600 font-black">$100</span>
            </div>
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-900 flex justify-between items-center">
              <span>T2: READ(Account_A)</span>
              <span className="text-emerald-600 font-black">$100</span>
            </div>
            <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950 border border-slate-900 flex justify-between items-center text-indigo-700 dark:text-indigo-300">
              <span>T1: WRITE(A = $100 + $50)</span>
              <span className="font-black">$150</span>
            </div>
            <div className="p-2 rounded bg-rose-50 dark:bg-rose-950 border-2 border-rose-600 text-rose-700 dark:text-rose-300 flex justify-between items-center animate-pulse">
              <span>T2: WRITE(A = $100 + $20)</span>
              <span className="font-black text-rose-600">$120 [LOST]</span>
            </div>
          </div>

          <div className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 p-2 rounded border border-rose-900">
            ⚠️ T1's $50 deposit is overwritten & lost forever! Final DB state is $120 instead of $170.
          </div>
        </div>

        {/* Right Card: Dirty Read Problem */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" /> Dirty Read Anomaly
            </span>
            <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-900">
              Uncommitted
            </span>
          </div>

          {/* Step Timeline */}
          <div className="space-y-2 text-[11px] font-mono font-bold">
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-900 flex justify-between items-center">
              <span>T1: WRITE(Account_B)</span>
              <span className="text-amber-600 font-black">$500</span>
            </div>
            <div className="p-2 rounded bg-amber-100 dark:bg-amber-950 border-2 border-amber-600 text-amber-900 dark:text-amber-200 flex justify-between items-center">
              <span>T2: READ(Account_B)</span>
              <span className="font-black text-amber-600">$500 [DIRTY]</span>
            </div>
            <div className="p-2 rounded bg-rose-100 dark:bg-rose-950 border border-rose-900 text-rose-800 dark:text-rose-300 flex justify-between items-center">
              <span>T1: ABORT / ROLLBACK</span>
              <span className="font-black">$200</span>
            </div>
            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-900 flex justify-between items-center">
              <span>T2: USES UNCOMMITTED $500</span>
              <span className="text-rose-600 font-black">INVALID</span>
            </div>
          </div>

          <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-2 rounded border border-amber-900">
            ⚠️ T2 read uncommitted $500 from T1. When T1 rolled back, T2's calculation became invalid!
          </div>
        </div>

      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Specialized Diagram 2: Agentic AI Pipeline Architecture                    */
/* -------------------------------------------------------------------------- */
const ArchitecturePipelineDiagram: React.FC = () => {
  const steps = [
    { title: 'Ingestion Engine', desc: 'PDF / Scanned Ingestion', icon: <Database className="w-4 h-4 text-indigo-600" /> },
    { title: 'Vision OCR Pipeline', desc: 'Layout & Cell Alignment', icon: <Cpu className="w-4 h-4 text-emerald-600" /> },
    { title: 'Vector Caching Tier', desc: 'DocBench Embeddings', icon: <GitCommit className="w-4 h-4 text-amber-600" /> },
    { title: 'Grounded Synthesizer', desc: 'Multimodal RAG Agent', icon: <Activity className="w-4 h-4 text-indigo-600" /> }
  ];

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-xs font-black uppercase text-slate-900 dark:text-slate-100 bg-indigo-100 dark:bg-indigo-950 p-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <span className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 stroke-[2.5] text-indigo-600" />
          Real-Time Multimodal Inference & Extraction Flow
        </span>
        <span className="font-mono text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded">
          LATENCY: &lt;1.4s
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center space-y-2 relative"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-900 flex items-center justify-center">
              {step.icon}
            </div>
            <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
              {step.title}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              {step.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Specialized Diagram 3: SVG Chart & Distribution Diagram                    */
/* -------------------------------------------------------------------------- */
const ChartDistributionDiagram: React.FC<{ asset: VisualAsset }> = ({ asset }) => {
  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4 text-center">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 stroke-[2.5]" /> Visual Distribution Breakdown
        </span>
        <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-900">
          PROPORTIONAL
        </span>
      </div>

      {/* High-Contrast Graphic Donuts / Bars */}
      <div className="flex items-center justify-center gap-6 py-2">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
          {/* Segment 1: North America 58% */}
          <path
            className="text-indigo-600 stroke-current"
            strokeWidth="6"
            strokeDasharray="58 100"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Segment 2: EMEA 26% */}
          <path
            className="text-amber-400 stroke-current"
            strokeWidth="6"
            strokeDasharray="26 100"
            strokeDashoffset="-58"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Segment 3: APAC 16% */}
          <path
            className="text-emerald-500 stroke-current"
            strokeWidth="6"
            strokeDasharray="16 100"
            strokeDashoffset="-84"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        <div className="text-left space-y-2 text-xs font-black uppercase">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-600 border border-slate-900" />
            <span>North America (58%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-400 border border-slate-900" />
            <span>EMEA Region (26%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-slate-900" />
            <span>APAC Growth (16%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Fallback: Generic Flow Node Diagram                                        */
/* -------------------------------------------------------------------------- */
const GenericNodeDiagram: React.FC<{ asset: VisualAsset }> = ({ asset }) => {
  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 border-2 border-slate-900 flex items-center justify-center mx-auto text-indigo-600">
        <Activity className="w-6 h-6 stroke-[2.5]" />
      </div>
      <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
        {asset.title}
      </h4>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
        {asset.description}
      </p>
    </div>
  );
};
