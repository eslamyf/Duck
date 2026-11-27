const BASE_URL = 'https://duck-lac.vercel.app';

function upsertMeta(attrName, attrValue, content) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, extraAttrs = {}) {
  if (typeof document === 'undefined') return;
  const selectorParts = [`link[rel="${rel}"]`];
  Object.entries(extraAttrs).forEach(([k, v]) => {
    selectorParts.push(`[${k}="${v}"]`);
  });
  let el = document.head.querySelector(selectorParts.join(''));
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Synchronizes document title, self-referencing canonical URL, robots directive,
 * and Open Graph / Twitter metadata on SPA route and language transitions.
 */
export function applyRouteSeo({
  title,
  description,
  canonicalPath = '/',
  lang = 'ar',
  indexable = true,
  ogType = 'website',
}) {
  if (typeof document === 'undefined') return;

  const cleanPath =
    canonicalPath === '/' ? '/' : `/${canonicalPath.replace(/^\/+|\/+$/g, '')}`;
  const fullUrl = `${BASE_URL}${cleanPath}`;

  if (title) {
    document.title = title;
    upsertMeta('property', 'og:title', title);
    upsertMeta('name', 'twitter:title', title);
  }

  if (description) {
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:description', description);
  }

  upsertMeta('name', 'robots', indexable ? 'index, follow' : 'noindex, nofollow');
  upsertMeta('property', 'og:type', ogType);
  upsertMeta('property', 'og:locale', lang === 'ar' ? 'ar_EG' : 'en_US');
  upsertMeta('property', 'og:url', fullUrl);

  upsertLink('canonical', fullUrl);
  upsertLink('alternate', fullUrl, { hreflang: 'ar' });
  upsertLink('alternate', fullUrl, { hreflang: 'x-default' });
}
