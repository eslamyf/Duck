import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './app/App.jsx';
import { I18nProvider } from './shared/i18n/index.js';

// Activate deferred main stylesheet once loaded (CSP-safe without inline onload)
const mainCss = document.getElementById('main-stylesheet');
if (mainCss && mainCss.media !== 'all') {
  if (mainCss.sheet) {
    mainCss.media = 'all';
  } else {
    mainCss.addEventListener('load', () => {
      mainCss.media = 'all';
    }, { once: true });
    // Safety fallback if load already fired right before listener attached
    setTimeout(() => {
      if (mainCss.media !== 'all') mainCss.media = 'all';
    }, 50);
  }
}

const container = document.getElementById('root');
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const ssrPath = container?.dataset?.ssrPath?.replace(/\/+$/, '') || '';

const appTree = (
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);

if (container && container.hasChildNodes() && ssrPath === currentPath) {
  hydrateRoot(container, appTree);
} else if (container) {
  createRoot(container).render(appTree);
}
