import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  ExternalLink,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { ChatMessage, AnalysisResult } from '../types';

interface ChatPanelProps {
  analysis: AnalysisResult;
  onJumpToPage: (page: number) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ analysis, onJumpToPage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I have created an interactive semantic index for **"${analysis.documentName}"**. Ask me any follow-up questions, metric verifications, or clause summaries. All answers will include direct page citations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What are the primary financial risks or liabilities mentioned?',
    'List all action items and their specified deadlines.',
    'Summarize the core findings on page 1 and page 2.',
    'Extract key numerical metrics from the document tables.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: messages.slice(-6),
          documentSummary: analysis.executiveSummary,
          fileBase64: analysis.fileDataUrl,
          docName: analysis.documentName
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate answer.');
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an issue searching the document: ${err.message}. Please try rephrasing your question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      
      {/* Panel Header */}
      <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between border-b-2 border-slate-900 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <MessageSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">Document Q&A Assistant</h3>
            <p className="bento-eyebrow text-indigo-300">
              Grounded Semantic Index • Citation Anchored
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black border-2 border-slate-900 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  : 'bg-amber-300 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4 stroke-[2.5]" /> : <Bot className="w-4 h-4 stroke-[2.5]" />}
            </div>

            <div className={`max-w-[85%] space-y-1.5 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block text-xs p-3.5 rounded-2xl text-left leading-relaxed border-2 border-slate-900 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Citations list if present */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t-2 border-slate-100 dark:border-slate-700/80 flex flex-wrap gap-1.5">
                    <span className="bento-eyebrow text-slate-500 dark:text-slate-400 w-full">
                      Cited Pages:
                    </span>
                    {msg.citations.map((c, ci) => (
                      <button
                        key={ci}
                        onClick={() => onJumpToPage(c.pageNumber)}
                        className="bento-btn inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase bg-amber-300 text-slate-900 border border-slate-900"
                      >
                        <ExternalLink className="w-2.5 h-2.5 stroke-[2.5]" />
                        Page {c.pageNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 font-mono font-bold px-1">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 p-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] w-fit">
            <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
            <span>Searching document semantic index & generating citations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Question Chips */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t-2 border-slate-900 shrink-0">
        <p className="bento-eyebrow text-slate-500 mb-2 px-1">
          Suggested Follow-ups
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bento-btn text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t-2 border-slate-900 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask anything about this PDF..."
          disabled={isSending}
          className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-xs font-semibold outline-none border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="bento-btn p-3 bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl shrink-0"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

    </div>
  );
};
