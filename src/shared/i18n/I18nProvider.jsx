import { useEffect, useCallback, useSyncExternalStore } from 'react';
import ar from './ar.json';
import en from './en.json';
import { I18nContext } from './I18nContext.js';

const translations = { ar, en };
const LANG_EVENT = 'duck:lang-change';

const subscribeLang = (callback) => {
  window.addEventListener(LANG_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(LANG_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

const getClientLang = () => {
  try {
    const saved = localStorage.getItem('duck_lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // Safe fallback if localStorage is disabled or throws
  }
  return 'ar';
};

const getServerLang = () => 'ar';

export function I18nProvider({ children }) {
  // Server and initial hydration both use getServerLang ('ar'), then React smoothly syncs getClientLang.
  const lang = useSyncExternalStore(subscribeLang, getClientLang, getServerLang);

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'ar' || newLang === 'en') {
      try {
        localStorage.setItem('duck_lang', newLang);
        window.dispatchEvent(new Event(LANG_EVENT));
      } catch {
        // Safe fallback if localStorage is unavailable
      }
    }
  }, []);

  useEffect(() => {
    const isAr = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.style.fontFamily = isAr ? 'var(--font-arabic)' : 'var(--font-body)';
    if (document.body) {
      document.body.style.fontFamily = isAr ? 'var(--font-arabic)' : 'var(--font-body)';
    }
  }, [lang]);

  const t = useCallback((path, paramsOrFallback = {}, maybeFallback = '') => {
    if (!path || typeof path !== 'string') return '';
    const isParamsObj = paramsOrFallback && typeof paramsOrFallback === 'object' && !Array.isArray(paramsOrFallback);
    const params = isParamsObj ? paramsOrFallback : {};
    const fallback = typeof paramsOrFallback === 'string' ? paramsOrFallback : maybeFallback;

    const keys = path.split('.');
    let current = translations[lang];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        if (import.meta.env?.DEV) {
          console.warn(`[i18n] Missing translation for key: "${path}" in language: "${lang}"`);
        }
        return fallback || path;
      }
    }

    let result = current !== undefined ? current : (fallback || path);
    if (typeof result === 'string') {
      result = result.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, paramKey) => {
        if (paramKey in params) {
          return String(params[paramKey]);
        }
        if (import.meta.env?.DEV) {
          console.warn(`[i18n] Missing param "${paramKey}" for translation key "${path}" in language "${lang}"`);
        }
        return '';
      });
    }

    return result;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}
