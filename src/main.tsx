import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle and suppress benign Vite WebSocket HMR disconnection errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = typeof reason === 'string' ? reason : (reason?.message || String(reason || ''));
    if (
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('closed without opened') ||
      reasonStr.includes('vite')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || String(event.error || '');
    if (
      message.includes('WebSocket') ||
      message.includes('vite') ||
      message.includes('closed without opened')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

