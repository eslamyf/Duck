import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.jsx';
import { I18nProvider } from './shared/i18n/index.js';

export function mountApp(container, shouldHydrate) {
  if (!container) return;

  const appTree = (
    <StrictMode>
      <BrowserRouter>
        <I18nProvider>
          <App />
        </I18nProvider>
      </BrowserRouter>
    </StrictMode>
  );

  if (shouldHydrate) {
    hydrateRoot(container, appTree);
  } else {
    createRoot(container).render(appTree);
  }
}
