import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom Scrollbar Hook
 * - Thin 8px capsule track with 1fr 8px grid layout
 * - Vertical gradient teal-to-navy thumb with 2px white ring and floating shadow
 * - Yellow 4x4px indicator dot in thumb
 * - Direct translate3d movement via requestAnimationFrame
 * - Pointer events drag with setPointerCapture
 * - Track click smooth scrolling (respecting prefers-reduced-motion)
 * - Auto-hide when content fits without scroll
 */
export function useCustomScrollbar() {
  const listRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const [thumbHeight, setThumbHeight] = useState(44);
  const [isHidden, setIsHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ startY: 0, startScrollTop: 0 });
  const rafRef = useRef(null);
  const lastHeightRef = useRef(44);
  const isHiddenRef = useRef(false);

  const update = useCallback(() => {
    const list = listRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!list || !track) return;

    const clientH = list.clientHeight;
    const scrollH = list.scrollHeight;
    const trackH = track.clientHeight;

    if (scrollH <= clientH || trackH <= 0) {
      if (!isHiddenRef.current) {
        isHiddenRef.current = true;
        setIsHidden(true);
      }
      return;
    }

    if (isHiddenRef.current) {
      isHiddenRef.current = false;
      setIsHidden(false);
    }

    // Height: max(44px, clientHeight² ÷ scrollHeight)
    const h = Math.max(44, (clientH * clientH) / scrollH);
    if (Math.abs(h - lastHeightRef.current) > 1) {
      lastHeightRef.current = h;
      setThumbHeight(h);
    }

    const maxScroll = scrollH - clientH;
    const maxTravel = trackH - h;
    const ratio = maxScroll > 0 ? maxTravel / maxScroll : 0;
    const y = list.scrollTop * ratio;

    if (thumb) {
      thumb.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const track = trackRef.current;
    if (!list) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    list.addEventListener('scroll', onScroll, { passive: true });

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(update);
      });
      ro.observe(list);
      if (track) ro.observe(track);
    }

    update();

    return () => {
      list.removeEventListener('scroll', onScroll);
      if (ro) ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  // Thumb Drag Handling via Pointer Events
  const handleThumbPointerDown = useCallback((e) => {
    e.stopPropagation();
    const list = listRef.current;
    if (!list) return;

    setIsDragging(true);
    dragStartRef.current = {
      startY: e.clientY,
      startScrollTop: list.scrollTop,
    };

    if (thumbRef.current && thumbRef.current.setPointerCapture) {
      thumbRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const handleThumbPointerMove = useCallback((e) => {
    if (!isDragging) return;
    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track) return;

    const clientH = list.clientHeight;
    const scrollH = list.scrollHeight;
    const trackH = track.clientHeight;
    const h = lastHeightRef.current;
    const maxScroll = scrollH - clientH;
    const maxTravel = trackH - h;
    const ratio = maxScroll > 0 ? maxTravel / maxScroll : 0;

    if (ratio > 0) {
      const deltaY = e.clientY - dragStartRef.current.startY;
      list.scrollTop = dragStartRef.current.startScrollTop + deltaY / ratio;
    }
  }, [isDragging]);

  const handleThumbPointerUp = useCallback((e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (thumbRef.current?.releasePointerCapture) {
      try {
        thumbRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer was already released
      }
    }
  }, [isDragging]);

  // Track Click Handling
  const handleTrackPointerDown = useCallback((e) => {
    if (thumbRef.current && (e.target === thumbRef.current || thumbRef.current.contains(e.target))) {
      return;
    }
    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    const clientH = list.clientHeight;
    const scrollH = list.scrollHeight;
    const trackH = track.clientHeight;
    const h = lastHeightRef.current;
    const maxScroll = scrollH - clientH;
    const maxTravel = trackH - h;
    const ratio = maxScroll > 0 ? maxTravel / maxScroll : 0;

    if (ratio > 0) {
      const targetScroll = (clickY - h / 2) / ratio;
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      list.scrollTo({
        top: Math.max(0, Math.min(maxScroll, targetScroll)),
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    }
  }, []);

  return {
    listRef,
    trackRef,
    thumbRef,
    thumbHeight,
    isHidden,
    isDragging,
    handleThumbPointerDown,
    handleThumbPointerMove,
    handleThumbPointerUp,
    handleTrackPointerDown,
    update,
  };
}
