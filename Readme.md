# PDF Insight Analyzer

Multimodal document intelligence app that turns any PDF into a structured, citation-grounded analysis — executive summaries tailored to four different reader personas, extracted tables with live user-selectable charts, an action items checklist, and a grounded Q&A chat over the document. Single or batch (multi-PDF) analysis is supported, with an automatic cross-document comparison for batches.

Built with React + TypeScript on the frontend and an Express server that calls the Gemini API (`gemini-3.6-flash`) with structured JSON output on the backend.

## Features

**Analysis engine**
- Four selectable Persona Lenses — Executive Briefing, Academic & Technical Audit, Plain English (ELI5), Legal & Compliance Risk — each changing the focus and tone of the summary.
- Three summary depths — one-line, paragraph, and detailed — independent of the persona lens.
- Page-level citations (`[Doc 1, Page X, Para Y]`) attached to every insight, table, and action item.
- Batch mode: uploading multiple PDFs generates a Cross-Document Comparative Matrix (common themes, contrasting conclusions, overlapping data) in addition to per-document breakdowns.
- Action Items Checklist extracted from explicit and implied tasks, with priority and owner role.
- Document metadata (title, authors, date, topics, reading time, language, scanned-image detection).

**Workspace UI**
- Two-pane layout: document viewer + tabbed insights pane (Summary, Tables, Visual Assets, Action Items, Chat, Export).
- Editable extracted tables with a live chart preview (bar / line / pie / stacked bar) powered by Recharts.
- Grounded chat panel for follow-up questions, with citation badges that jump to the relevant page.
- Persona/depth can be changed after analysis — this re-synthesizes the summary without re-running full extraction.
- Analysis history saved locally, dark mode, and a privacy note explaining how uploads are handled.

**Export**
- Clean standalone Markdown report.
- CSV export of every extracted table.
- Google Docs API–ready JSON payload and Notion API–ready block JSON (see note below).
- Browser print-to-PDF.

## Tech Stack

- React 19 + TypeScript, Vite, Tailwind CSS
- Express server (`server.ts`) as the API layer
- `@google/genai` SDK calling `gemini-3.6-flash` with `responseSchema` for structured JSON output
- Recharts for chart rendering, Lucide for icons, Framer Motion for animation

## Getting Started

### Prerequisites
- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation
```bash
git clone https://github.com/M-sohaib-Hafeez/Ai-Pdf-Analyzer.git
cd Ai-Pdf-Analyzer
npm install
```

### Configuration
Copy the example environment file and add your key:
```bash
cp .env.example .env
```
Then edit `.env`:
```
GEMINI_API_KEY="your-gemini-api-key"
```
This key is only ever read server-side (`server.ts`) — it is never sent to or exposed in the browser bundle.

### Running locally
```bash
npm run dev
```
The app runs at `http://localhost:3000` (Vite in middleware mode, served through the same Express instance as the API).

### Production build
```bash
npm run build
npm start
```

## Project Structure
```
Ai-Pdf-Analyzer/
├── server.ts                    # Express API + Gemini integration
├── index.html
├── src/
│   ├── App.tsx                  # Top-level state, history, routing between views
│   ├── main.tsx
│   ├── types.ts                 # Shared TypeScript types
│   ├── index.css
│   ├── data/                    # Sample/demo document data
│   └── components/
│       ├── UploadPanel.tsx      # File upload, persona/depth selection
│       ├── PdfViewerPane.tsx    # Document preview pane
│       ├── InsightsPane.tsx     # Tabbed workspace (summary, tables, chat, export...)
│       ├── EditableTable.tsx    # Editable tables + live Recharts visualization
│       ├── DiagramViewer.tsx    # Visual asset display
│       ├── ChatPanel.tsx        # Grounded Q&A chat
│       ├── ActionItemsTab.tsx
│       ├── ComparativeMatrixView.tsx  # Batch cross-document comparison
│       ├── ExportCenterTab.tsx  # Markdown / CSV / Docs / Notion export
│       ├── AnalysisHistoryModal.tsx
│       ├── PrivacyModal.tsx
│       └── Header.tsx
└── package.json
```

## API Reference

| Method | Endpoint            | Description |
|--------|----------------------|--------------|
| GET    | `/api/health`        | Health check |
| POST   | `/api/analyze-pdf`   | Analyzes one or more PDFs (base64-encoded). Single file returns a document analysis; multiple files return a batch result plus a comparative matrix. |
| POST   | `/api/chat-pdf`      | Answers a follow-up question grounded in a previously analyzed document, with page citations. |
| POST   | `/api/re-synthesize` | Regenerates the executive summary and key insights for a new persona lens / summary depth without re-running full extraction. |

## Known Limitations & Roadmap

- **No access gate — protected only by IP-based rate limiting.** The API routes are rate-limited (`RATE_LIMIT_MAX` per 15 min per IP) and cap uploads at 30MB/file and 5 files/batch, but there's no login or access code in front of the app (an access-code gate was tried and rolled back). That's a reasonable tradeoff for sharing the link with a small, known group — worth revisiting before sharing more widely.
- **The document viewer doesn't render the actual PDF pages.** It shows a clearly labeled "AI-Reconstructed Page Summary" built from the extracted insights for that page, alongside a working download link to the original file. A real pixel-accurate preview would need a PDF rendering library (e.g. pdf.js).
- **Visual asset extraction returns descriptions, not real images**, for any document outside the built-in sample set. The Gemini schema returns a caption/description per asset, not image bytes — real extraction would need Gemini to return bounding boxes that get cropped from a rendered page.
- **Google Docs / Notion export produces API-ready JSON payloads, not a direct push.** Wiring this up to actually create a Doc or Notion page requires OAuth against those APIs.

## License

No license file yet — add one (MIT is a common default for a project like this) if you want others to be able to reuse the code.
