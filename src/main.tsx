import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Client-side safety against unhandled asynchronous rejections (e.g. cancelled fetches, browser extensions)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Gracefully handle unhandled rejections without breaking app
    console.debug('Handled unhandled promise rejection in browser:', event.reason);
  });

  window.addEventListener('error', (event) => {
    if (!event.message) {
      // Empty uncaught error suppression
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
