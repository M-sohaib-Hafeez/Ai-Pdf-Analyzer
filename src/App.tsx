import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadPanel } from './components/UploadPanel';
import { PdfViewerPane } from './components/PdfViewerPane';
import { InsightsPane } from './components/InsightsPane';
import { AnalysisHistoryModal } from './components/AnalysisHistoryModal';
import { PrivacyModal } from './components/PrivacyModal';
import {
  AnalysisResult,
  BatchAnalysisResult,
  PersonaLens,
  SummaryDepth,
  SampleDoc
} from './types';
import { SAMPLE_DOCS, SAMPLE_BATCH_ANALYSIS } from './data/samplePdfs';
import {
  loadHistoryFromIDB,
  saveAnalysisToIDB,
  deleteAnalysisFromIDB,
  clearAllHistoryFromIDB
} from './lib/db';
import { apiFetch } from './utils/api';

export default function App() {
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | BatchAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isResynthesizing, setIsResynthesizing] = useState<boolean>(false);

  // History & Storage via IndexedDB
  const [historyList, setHistoryList] = useState<Array<AnalysisResult | BatchAnalysisResult>>([SAMPLE_BATCH_ANALYSIS]);

  useEffect(() => {
    // Load history asynchronously from IndexedDB on startup
    loadHistoryFromIDB()
      .then(stored => {
        if (stored && stored.length > 0) {
          setHistoryList(stored);
        } else {
          // Initialize default sample in IndexedDB
          saveAnalysisToIDB(SAMPLE_BATCH_ANALYSIS).catch(() => {});
          setHistoryList([SAMPLE_BATCH_ANALYSIS]);
        }
      })
      .catch(err => {
        console.warn('Could not read history from IndexedDB:', err);
      });
  }, []);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('pdf_analyzer_dark');
      if (stored !== null) {
        return stored === 'true';
      }
      return false; // Default to Light Mode
    } catch {
      return false;
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Dark mode class toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('pdf_analyzer_dark', String(darkMode));
  }, [darkMode]);

  // Handle uploading real PDFs and calling server API
  const handleStartAnalysis = async (
    files: Array<{ name: string; size: string; base64: string; mimeType: string }>,
    personaLens: PersonaLens,
    summaryDepth: SummaryDepth
  ) => {
    setIsAnalyzing(true);
    setAnalysisStep('Reading Multimodal Document Layouts...');

    try {
      setTimeout(() => setAnalysisStep('Extracting Multimodal Tables & Figures...'), 1500);
      setTimeout(() => setAnalysisStep('Synthesizing Citations & Executive Summary...'), 3000);

      const response = await apiFetch('/api/analyze-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, personaLens, summaryDepth })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to process document(s).');
      }

      const result = data.mode === 'batch' ? data.batch : data.document;

      setActiveAnalysis(result);
      setCurrentPage(1);

      // Add to IndexedDB storage
      try {
        await saveAnalysisToIDB(result);
      } catch (dbErr: any) {
        console.error('Failed to save to IndexedDB:', dbErr);
        alert(`Storage Warning: Analysis completed, but failed to persist to IndexedDB library: ${dbErr.message || dbErr}`);
      }

      setHistoryList(prev => [result, ...prev.filter(h => h.id !== result.id)]);
    } catch (err: any) {
      console.error('Error during analysis:', err);
      alert(`Document Processing Error: ${err.message || 'Verification failed. Please ensure the file is a valid PDF.'}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Handle selecting a pre-baked sample demo PDF
  const handleSelectSample = (sample: SampleDoc) => {
    setActiveAnalysis(sample.mockResult);
    setCurrentPage(1);
  };

  // Re-synthesize summary on persona lens / depth change
  const handleResynthesize = async (personaLens: PersonaLens, summaryDepth: SummaryDepth) => {
    if (!activeAnalysis || 'documents' in activeAnalysis) return;

    setIsResynthesizing(true);
    try {
      const response = await apiFetch('/api/re-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaLens,
          summaryDepth,
          currentResult: activeAnalysis,
          fileBase64: activeAnalysis.fileDataUrl
        })
      });

      const data = await response.json();
      if (data.success) {
        const updatedDoc: AnalysisResult = {
          ...activeAnalysis,
          personaLens,
          summaryDepth,
          executiveSummary: data.executiveSummary || activeAnalysis.executiveSummary,
          keyInsights: data.keyInsights || activeAnalysis.keyInsights
        };
        setActiveAnalysis(updatedDoc);
        saveAnalysisToIDB(updatedDoc).catch(() => {});
      }
    } catch (err) {
      console.warn('Re-synthesize fallback:', err);
    } finally {
      setIsResynthesizing(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await deleteAnalysisFromIDB(id);
    } catch (dbErr) {
      console.warn('Failed to delete item from IndexedDB:', dbErr);
    }
    setHistoryList(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAllHistory = async () => {
    if (confirm('Clear all saved analysis entries from local library?')) {
      try {
        await clearAllHistoryFromIDB();
      } catch (dbErr) {
        console.warn('Failed to clear IndexedDB:', dbErr);
      }
      setHistoryList([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header App Bar */}
      <Header
        historyCount={historyList.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onNewAnalysis={() => setActiveAnalysis(null)}
        onSelectSample={handleSelectSample}
        sampleDocs={SAMPLE_DOCS}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {!activeAnalysis ? (
          /* State 1: Upload & Pre-Analysis Controls View */
          <UploadPanel
            onStartAnalysis={handleStartAnalysis}
            onSelectSample={handleSelectSample}
            sampleDocs={SAMPLE_DOCS}
            isAnalyzing={isAnalyzing}
            analysisStep={analysisStep}
          />
        ) : (
          /* State 2: Two-Pane Split Layout (PDF Viewer + Insights Workspace) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch min-h-[680px]">
            
            {/* Left Pane: PDF Document Viewer (40% width on desktop) */}
            <div className="lg:col-span-5 h-[650px] lg:h-auto">
              <PdfViewerPane
                analysis={
                  'documents' in activeAnalysis
                    ? activeAnalysis.documents[0]
                    : activeAnalysis
                }
                currentPage={currentPage}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>

            {/* Right Pane: Multi-Tab Insights Workspace (60% width on desktop) */}
            <div className="lg:col-span-7 h-[650px] lg:h-auto">
              <InsightsPane
                activeResult={activeAnalysis}
                onJumpToPage={(p) => setCurrentPage(p)}
                onResynthesize={handleResynthesize}
                isResynthesizing={isResynthesizing}
              />
            </div>

          </div>
        )}

      </main>

      {/* Modals */}
      <AnalysisHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onSelectResult={(item) => setActiveAnalysis(item)}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearAllHistory={handleClearAllHistory}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t-2 border-slate-900 dark:border-slate-800 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
        Lumina PDF Analyzer • Multimodal AI Intelligence Engine
      </footer>

    </div>
  );
}
