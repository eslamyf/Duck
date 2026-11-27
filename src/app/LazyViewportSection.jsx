import { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Defers mounting of heavy below-the-fold lazy sections until near the viewport
 * or explicitly activated by in-page hash navigation.
 */
export default function LazyViewportSection({
  id,
  fallback,
  rootMargin = '320px 0px',
  children,
}) {
  const { hash } = useLocation();
  const [inView, setInView] = useState(false);
  const hostRef = useRef(null);

  const isHashTargeted = Boolean(id && hash.replace(/^#/, '').split('?')[0] === id);
  const shouldMount = inView || isHashTargeted;

  useEffect(() => {
    if (shouldMount || !hostRef.current || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(hostRef.current);

    return () => observer.disconnect();
  }, [shouldMount, rootMargin]);

  return (
    <div
      ref={hostRef}
      id={id ? `${id}-section-anchor` : undefined}
      className="content-visibility-auto"
    >
      {shouldMount ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
