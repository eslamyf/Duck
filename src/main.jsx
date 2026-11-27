import './index.css';

// Activate deferred main stylesheet once loaded (CSP-safe without inline onload)
const mainCss = document.getElementById('main-stylesheet');
if (mainCss && mainCss.media !== 'all') {
  if (mainCss.sheet) {
    mainCss.media = 'all';
  } else {
    mainCss.addEventListener(
      'load',
      () => {
        mainCss.media = 'all';
      },
      { once: true }
    );
    // Safety fallback if load already fired right before listener attached
    setTimeout(() => {
      if (mainCss.media !== 'all') mainCss.media = 'all';
    }, 50);
  }
}

const container = document.getElementById('root');
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const rawSsrPath = container?.dataset?.ssrPath;
const ssrPath = rawSsrPath !== undefined ? rawSsrPath.replace(/\/+$/, '') || '/' : '';
const shouldHydrate = Boolean(container && container.hasChildNodes() && ssrPath === currentPath);

let mounted = false;
const loadAndMount = () => {
  if (mounted) return;
  mounted = true;
  import('./bootstrapApp.jsx').then(({ mountApp }) => {
    mountApp(container, shouldHydrate);
  });
};

if (shouldHydrate) {
  // Yield hydration until LCP candidate paints (or immediate user interaction / 250ms cap)
  // so SSR Hero image & typography render uncontested on Slow 4G.
  let timerId = null;
  let observer = null;
  const triggerHydration = () => {
    if (timerId) clearTimeout(timerId);
    if (observer) observer.disconnect();
    window.removeEventListener('pointerdown', triggerHydration);
    window.removeEventListener('keydown', triggerHydration);
    setTimeout(loadAndMount, 0);
  };

  window.addEventListener('pointerdown', triggerHydration, { once: true, passive: true });
  window.addEventListener('keydown', triggerHydration, { once: true, passive: true });

  if ('PerformanceObserver' in window) {
    try {
      observer = new PerformanceObserver((list) => {
        if (list.getEntries().length > 0) {
          triggerHydration();
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // ignore unsupported observer entryType
    }
  }

  timerId = setTimeout(triggerHydration, 250);
} else if (container) {
  loadAndMount();
}
