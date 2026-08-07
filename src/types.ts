export type PersonaLens = 'academic' | 'executive' | 'eli5' | 'legal';

export type SummaryDepth = 'oneline' | 'paragraph' | 'detailed';

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'stacked_bar';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'ocr_estimated';

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  recommendedChartType: ChartType;
  selectedChartType?: ChartType;
  confidence: ConfidenceLevel;
  citation: string;
  pageNumber: number;
}

export interface VisualAsset {
  id: string;
  title: string;
  caption: string;
  pageNumber: number;
  category: 'diagram' | 'chart' | 'photo' | 'architecture' | 'formula' | 'table_snapshot';
  description: string;
}

export interface ActionItem {
  id: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  ownerRole?: string;
  deadline?: string;
  pageCitation: string;
  pageNumber: number;
  completed: boolean;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  pageNumber: number;
}

export interface KeyInsight {
  id: string;
  statement: string;
  impact: 'high' | 'medium' | 'low';
  citation: string;
  pageNumber: number;
  section: string;
}

export interface DocumentMetadata {
  title: string;
  authors: string[];
  publicationDate: string;
  primaryTopics: string[];
  estimatedReadingTime: string;
  totalPages: number;
  language: string;
  isScannedImage: boolean;
}

export interface AnalysisResult {
  id: string;
  documentName: string;
  fileDataUrl?: string; // base64 or blob URL for embedded preview
  fileSize: string;
  processedAt: string;
  personaLens: PersonaLens;
  summaryDepth: SummaryDepth;
  metadata: DocumentMetadata;
  tableOfContents: TableOfContentsItem[];
  executiveSummary: string;
  keyInsights: KeyInsight[];
  tables: TableData[];
  visualAssets: VisualAsset[];
  actionItems: ActionItem[];
  topicTags: string[];
  rawMarkdownReport: string;
}

export interface DocumentComparisonRow {
  docId: string;
  docName: string;
  coreTheme: string;
  keyMetrics: string;
  stanceOrConclusion: string;
}

export interface ComparativeMatrix {
  summary: string;
  documentComparisons: DocumentComparisonRow[];
  commonThemes: string[];
  contrastingConclusions: string[];
  overlappingDataPoints: string[];
}

export interface BatchAnalysisResult {
  id: string;
  createdAt: string;
  batchName: string;
  documentCount: number;
  documents: AnalysisResult[];
  comparativeMatrix: ComparativeMatrix;
}

export interface ChatCitation {
  docName?: string;
  pageNumber: number;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: ChatCitation[];
}

export interface SampleDoc {
  id: string;
  name: string;
  description: string;
  category: string;
  mockResult: AnalysisResult;
}
