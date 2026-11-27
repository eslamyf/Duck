import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const SSR_DIR = path.join(ROOT, 'dist-ssr');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');

/**
 * Parse top-level CSS blocks handling strings, comments, and nested braces.
 */
function parseCssBlocks(css) {
  const blocks = [];
  let i = 0;
  const n = css.length;
  let start = 0;

  while (i < n) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const q = ch;
      i++;
      while (i < n && css[i] !== q) {
        if (css[i] === '\\') i++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === '{') {
      const header = css.slice(start, i).trim();
      let depth = 1;
      const bodyStart = i + 1;
      i++;
      while (i < n && depth > 0) {
        const c = css[i];
        if (c === '/' && css[i + 1] === '*') {
          const end = css.indexOf('*/', i + 2);
          i = end === -1 ? n : end + 2;
          continue;
        }
        if (c === '"' || c === "'") {
          const q = c;
          i++;
          while (i < n && css[i] !== q) {
            if (css[i] === '\\') i++;
            i++;
          }
          i++;
          continue;
        }
        if (c === '\\') {
          i += 2;
          continue;
        }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        i++;
      }
      const body = css.slice(bodyStart, i - 1);
      blocks.push({ header, body, raw: css.slice(start, i).trim() });
      start = i;
      continue;
    }
    if (ch === ';' && css.slice(start, i).trim().startsWith('@')) {
      blocks.push({ header: '', body: '', raw: css.slice(start, i + 1).trim(), isStatement: true });
      start = i + 1;
    }
    i++;
  }
  return blocks;
}

/**
 * Collect class tokens from initial HTML (skip link, navbar, and above-the-fold hero + stats).
 */
function extractAboveFoldClasses(html) {
  const classes = new Set();
  // Take up to Destinations section (covers SkipLink + Navbar + Hero + Stats + BrandIntro)
  let cutoff = html.indexOf('id="locations"');
  if (cutoff === -1) cutoff = Math.min(html.length, 35000);
  const aboveHtml = html.slice(0, cutoff);

  const classRe = /class="([^"]+)"/g;
  let m;
  while ((m = classRe.exec(aboveHtml)) !== null) {
    for (const token of m[1].split(/\s+/)) {
      if (token) classes.add(token);
    }
  }
  return classes;
}

/**
 * Unescape CSS class selector tokens and check whether a selector is needed for critical CSS.
 */
function splitSelectorsTopLevel(selector) {
  const parts = [];
  let cur = '';
  let parens = 0;
  let brackets = 0;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (c === '\\' && i + 1 < selector.length) {
      cur += c + selector[++i];
      continue;
    }
    if (c === '(') parens++;
    else if (c === ')' && parens > 0) parens--;
    else if (c === '[') brackets++;
    else if (c === ']' && brackets > 0) brackets--;
    else if (c === ',' && parens === 0 && brackets === 0) {
      if (cur.trim()) parts.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function isCriticalSelector(selector, aboveClasses) {
  if (selector.includes('leaflet')) return false;
  const parts = splitSelectorsTopLevel(selector);
  for (const part of parts) {
    // Extract each .className token respecting backslash-escaped characters
    const classMatches = [];
    let i = 0;
    while (i < part.length) {
      if (part[i] === '\\' && i + 1 < part.length) {
        i += 2;
        continue;
      }
      if (part[i] === '.') {
        let j = i + 1;
        let token = '';
        while (j < part.length) {
          if (part[j] === '\\' && j + 1 < part.length) {
            token += part[j + 1];
            j += 2;
            continue;
          }
          if (/[\s,>+~:()[\]]/.test(part[j])) break;
          token += part[j];
          j++;
        }
        if (token) classMatches.push(token);
        i = j;
        continue;
      }
      i++;
    }
    if (classMatches.length === 0) return true;
    if (classMatches.some((cls) => aboveClasses.has(cls))) return true;
  }
  return false;
}

function extractCriticalCss(fullCss, html) {
  const aboveClasses = extractAboveFoldClasses(html);
  const blocks = parseCssBlocks(fullCss);
  const out = [];

  function processBlocks(blockList, insideLayer = '') {
    const kept = [];
    for (const b of blockList) {
      if (b.isStatement) {
        if (!b.raw.includes('leaflet')) kept.push(b.raw);
        continue;
      }
      const h = b.header;
      if (h.startsWith('@font-face') || h === ':root' || h.startsWith('@property') || h.startsWith('@keyframes')) {
        kept.push(`${h}{${b.body}}`);
        continue;
      }
      if (h.startsWith('@layer properties') || h.startsWith('@layer theme') || h.startsWith('@layer base')) {
        kept.push(`${h}{${b.body}}`);
        continue;
      }
      if (h.startsWith('@layer ') || h.startsWith('@media') || h.startsWith('@supports')) {
        const inner = processBlocks(parseCssBlocks(b.body), h);
        if (inner.length > 0) {
          kept.push(`${h}{${inner.join('')}}`);
        }
        continue;
      }
      if (isCriticalSelector(h, aboveClasses)) {
        kept.push(`${h}{${b.body}}`);
      }
    }
    return kept;
  }

  out.push(...processBlocks(blocks));
  return out.join('');
}

async function run() {
  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error('dist/index.html not found. Run vite build first.');
  }

  const ssrFiles = fs.readdirSync(SSR_DIR).filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));
  const entryFile = ssrFiles.find((f) => f.startsWith('entry-server')) || ssrFiles[0];
  if (!entryFile) {
    throw new Error('SSR entry bundle not found in dist-ssr/');
  }

  const { render } = await import(pathToFileURL(path.join(SSR_DIR, entryFile)).href);
  let ssrHtml = render('/');

  // React 19 renderToString prepends <link rel="preload" as="image" ...> for eager logos inside #root;
  // strip those so Hero LCP image + font retain exclusive preload priority.
  ssrHtml = ssrHtml.replace(/^(?:<link\s+rel="preload"[^>]*\/>\s*)+/i, '');

  // Map every actual dist/assets/<base>-<hash>.<ext> so SSR asset hashes match client dist 100%
  const distAssetsDir = path.join(DIST_DIR, 'assets');
  const distAssets = fs.readdirSync(distAssetsDir);
  const assetByBaseExt = new Map();
  for (const file of distAssets) {
    const m = file.match(/^(.+)-[A-Za-z0-9_-]{6,12}(\.[^.]+)$/);
    if (m) {
      assetByBaseExt.set(`${m[1]}${m[2]}`, `/assets/${file}`);
    }
  }
  ssrHtml = ssrHtml.replace(/\/assets\/([^/"']+)-[A-Za-z0-9_-]{6,12}(\.[a-z0-9]+)/gi, (full, base, ext) => {
    const key = `${base}${ext}`;
    return assetByBaseExt.get(key) || full;
  });

  let html = fs.readFileSync(INDEX_PATH, 'utf8');

  // Inject SSR markup into #root with data-ssr-path="/"
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root" data-ssr-path="/">${ssrHtml}</div>`
  );

  // Clean up non-critical modulepreload tags that compete with LCP image & font on 4G
  html = html.replace(/<link rel="modulepreload"[^>]+href="\/assets\/([^"]+)"[^>]*>\s*/g, (tag, filename) => {
    // Keep only core runtime + React modulepreload; defer icons/i18n/auth/assets
    if (filename.startsWith('rolldown-runtime-') || filename.startsWith('vendor-react-')) {
      return tag;
    }
    return '';
  });

  // Extract main stylesheet URL and replace blocking <link rel="stylesheet"> with Critical CSS + non-blocking load
  const cssLinkRe = /<link rel="stylesheet"[^>]*href="(\/assets\/index-[^"]+\.css)"[^>]*>/;
  const cssMatch = html.match(cssLinkRe);
  if (cssMatch) {
    const cssHref = cssMatch[1];
    const cssFilePath = path.join(DIST_DIR, cssHref.replace(/^\//, ''));
    const fullCss = fs.readFileSync(cssFilePath, 'utf8');
    const criticalCss = extractCriticalCss(fullCss, ssrHtml);

    const replacement = [
      `<style id="critical-css">${criticalCss}</style>`,
      `<link id="main-stylesheet" rel="stylesheet" crossorigin href="${cssHref}" media="print" />`,
      `<noscript><link rel="stylesheet" crossorigin href="${cssHref}" /></noscript>`,
    ].join('\n  ');

    html = html.replace(cssMatch[0], replacement);
    console.log(`[prerender] / -> SSR ${(ssrHtml.length / 1024).toFixed(1)} KB, Critical CSS ${(criticalCss.length / 1024).toFixed(1)} KB (full CSS ${(fullCss.length / 1024).toFixed(1)} KB)`);
  }

  // Reorder head so high-priority LCP image preload comes BEFORE font & JS module scripts
  const heroPreloads = [];
  html = html.replace(/<link rel="preload" as="image"[^>]+hero-poster[^>]+>\s*/g, (m) => {
    heroPreloads.push(m.trim());
    return '';
  });
  if (heroPreloads.length > 0) {
    html = html.replace(
      '<!-- Critical Assets Preload -->',
      `<!-- Critical Assets Preload (Hero LCP Image First) -->\n  ${heroPreloads.join('\n  ')}`
    );
  }

  fs.writeFileSync(INDEX_PATH, html, 'utf8');

  // Remove temporary SSR build artifacts
  fs.rmSync(SSR_DIR, { recursive: true, force: true });
}

run().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
