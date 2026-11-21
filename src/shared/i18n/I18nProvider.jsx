import { useState, useEffect, useCallback } from 'react';
import ar from './ar.json';
import en from './en.json';
import { I18nContext } from './I18nContext.js';

const translations = { ar, en };

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('duck_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // Safe fallback if localStorage is disabled or throws
    }
    return 'ar';
  });

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'ar' || newLang === 'en') {
      setLang(newLang);
      try {
        localStorage.setItem('duck_lang', newLang);
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
