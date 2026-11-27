import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './app/App.jsx';
import { I18nProvider } from './shared/i18n/index.js';

export function render(url = '/') {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </StaticRouter>
    </StrictMode>
  );
}
