import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  X,
  Sparkles,
  BookOpen,
  Briefcase,
  Lightbulb,
  Scale,
  AlignLeft,
  FileSearch,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { PersonaLens, SummaryDepth, SampleDoc } from '../types';

interface UploadPanelProps {
  onStartAnalysis: (files: Array<{ name: string; size: string; base64: string; mimeType: string }>, personaLens: PersonaLens, summaryDepth: SummaryDepth) => void;
  onSelectSample: (sample: SampleDoc) => void;
  sampleDocs: SampleDoc[];
  isAnalyzing: boolean;
  analysisStep: string;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onStartAnalysis,
  onSelectSample,
  sampleDocs,
  isAnalyzing,
  analysisStep
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; size: string; base64: string; mimeType: string }>>([]);
  const [personaLens, setPersonaLens] = useState<PersonaLens>('academic');
  const [summaryDepth, setSummaryDepth] = useState<SummaryDepth>('paragraph');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileListArray = Array.from(files);
    const pdfFiles = fileListArray.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      alert('Please upload valid PDF document(s).');
      return;
    }

    const MAX_SIZE_BYTES = 30 * 1024 * 1024; // 30MB cap
    const validFiles: File[] = [];

    for (const file of pdfFiles) {
      if (file.size > MAX_SIZE_BYTES) {
        alert(`File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed size limit of 30MB.`);
      } else {
        validFiles.push(file);
      }
    }

    if (selectedFiles.length + validFiles.length > 5) {
      alert('Batch limit exceeded: You can analyze a maximum of 5 PDF files per request.');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedFiles(prev => [
          ...prev,
          {
            name: file.name,
            size: formatFileSize(file.size),
            base64,
            mimeType: 'application/pdf'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    onStartAnalysis(selectedFiles, personaLens, summaryDepth);
  };

  const personas: Array<{ id: PersonaLens; label: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'academic',
      label: 'Academic & Audit',
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
      desc: 'Methodology, evidence citations, precision, & statistical integrity.'
    },
    {
      id: 'executive',
      label: 'Executive Briefing',
      icon: <Briefcase className="w-4 h-4 text-emerald-500" />,
      desc: 'High-level strategy, revenue ROI, core metrics, & summary.'
    },
    {
      id: 'eli5',
      label: 'Plain English (ELI5)',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      desc: 'Jargon-free concepts, clear analogies, & intuitive summaries.'
    },
    {
      id: 'legal',
      label: 'Legal & Risk',
      icon: <Scale className="w-4 h-4 text-rose-500" />,
      desc: 'Compliance mandates, liabilities, risk factors, & obligations.'
    }
  ];

  const depths: Array<{ id: SummaryDepth; label: string; desc: string }> = [
    { id: 'oneline', label: 'One-Line', desc: 'Single crisp executive sentence' },
    { id: 'paragraph', label: 'Paragraph', desc: '2-3 paragraph synthesis' },
    { id: 'detailed', label: 'Detailed', desc: 'Exhaustive section-by-section' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-slate-900 dark:border-slate-700 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
          <span>Multimodal Document Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Transform PDFs into <span className="text-indigo-600 dark:text-indigo-400">Actionable Insights</span>
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upload single or batch PDFs to extract structured summaries, editable data tables, interactive charts, action items, and grounded citations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Upload Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-900 dark:border-slate-700 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileChange(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragOver
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'border-slate-900 dark:border-slate-700 hover:border-indigo-600 bg-slate-50/70 dark:bg-slate-800/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files)}
              />

              <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-600 text-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 stroke-[2.5]" />
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Drop your PDF document(s) here, or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-2">browse</span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Supports single or batch PDFs (scanned image PDFs supported via OCR fallback)
              </p>
            </div>

            {/* Selected File List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bento-eyebrow text-slate-500 dark:text-slate-400">
                    Uploaded Files ({selectedFiles.length})
                  </span>
                  {selectedFiles.length > 1 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded border-2 border-slate-900">
                      <Layers className="w-3 h-3" /> Batch Mode Triggered (Cross-Doc Matrix)
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2.5]" />
                        <div className="truncate">
                          <p className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 truncate">
                            {f.name}
                          </p>
                          <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                            {f.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Persona Lens Selector */}
            <div className="space-y-3">
              <label className="block bento-eyebrow text-slate-800 dark:text-slate-200">
                1. Select Persona Lens (Focus & Tone)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personas.map((p) => {
                  const isSelected = personaLens === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPersonaLens(p.id)}
                      className={`p-3.5 rounded-xl text-left border-2 border-slate-900 dark:border-slate-700 transition-all ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {p.icon}
                          <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                            {p.label}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Depth Toggle */}
            <div className="space-y-3">
              <label className="block bento-eyebrow text-slate-800 dark:text-slate-200">
                2. Select Summary Depth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {depths.map((d) => {
                  const isSelected = summaryDepth === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSummaryDepth(d.id)}
                      className={`p-3 rounded-xl text-center border-2 border-slate-900 dark:border-slate-700 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100 font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      }`}
                    >
                      <div className="text-xs font-black uppercase">{d.label}</div>
                      <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {d.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={selectedFiles.length === 0 || isAnalyzing}
              className={`w-full py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                selectedFiles.length === 0 || isAnalyzing
                  ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-60'
                  : 'bg-indigo-600 hover:translate-x-[1px] hover:translate-y-[1px]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{analysisStep || 'Processing Document Multimodal Pipeline...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {selectedFiles.length > 1
                      ? `Analyze Batch (${selectedFiles.length} PDFs)`
                      : 'Run Document Intelligence Analysis'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Right Sidebar - Instant Demo Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#1e293b] text-white rounded-2xl p-6 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 bento-eyebrow">
              <Sparkles className="w-4 h-4 stroke-[2.5]" /> Instant Demo PDFs
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">No PDF ready? Test instant demos</h3>
            <p className="text-xs font-medium text-slate-300">
              Explore pre-processed multi-page PDF documents with editable tables, chart widgets, grounded Q&A, and citation maps.
            </p>

            <div className="space-y-3 pt-1">
              {sampleDocs.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-white/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-white group-hover:text-indigo-300 truncate">
                      {sample.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                  </div>
                  <p className="text-[11px] font-medium text-slate-300 mt-1 line-clamp-2">
                    {sample.description}
                  </p>
                  <span className="inline-block mt-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {sample.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Capabilities Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-slate-900 dark:border-slate-700 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
            <h4 className="bento-eyebrow text-slate-800 dark:text-slate-200">
              Engine Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2.5]" />
                <span>Multimodal PDF layout & table extraction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2.5]" />
                <span>Page-level citation mapping [Page X]</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2.5]" />
                <span>Editable data tables & Recharts widgets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2.5]" />
                <span>Grounded follow-up chat & Markdown export</span>
              </li>
            </ul>

            <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Files processed securely via Gemini APIs.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
