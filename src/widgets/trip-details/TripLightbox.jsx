import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripLightbox({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onChangeIndex,
  tripTitle = '',
}) {
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const containerRef = useRef(null);

  // Scroll to active index when opened or changed
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: isArabic ? -currentIndex * width : currentIndex * width,
      behavior: 'auto',
    });
  }, [isOpen, currentIndex, isArabic]);

  // Keyboard navigation (ESC, Arrow keys)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (isArabic) {
          onChangeIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        } else {
          onChangeIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowLeft') {
        if (isArabic) {
          onChangeIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        } else {
          onChangeIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onChangeIndex, isArabic, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    onChangeIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    onChangeIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div
      className="pv"
      id="pv"
      role="dialog"
      aria-modal="true"
      aria-label={tripTitle}
    >
      <button
        type="button"
        className="pvx"
        onClick={onClose}
        aria-label="إغلاق"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <span className="pvc" aria-live="polite">
        {currentIndex + 1} / {images.length}
      </span>

      <button
        type="button"
        className="pvn pp"
        onClick={isArabic ? handleNext : handlePrev}
        aria-label="السابق"
      >
        <FontAwesomeIcon icon={isArabic ? faChevronRight : faChevronLeft} />
      </button>

      <button
        type="button"
        className="pvn nn"
        onClick={isArabic ? handlePrev : handleNext}
        aria-label="التالي"
      >
        <FontAwesomeIcon icon={isArabic ? faChevronLeft : faChevronRight} />
      </button>

      <div
        className="pvs"
        ref={containerRef}
      >
        {images.map((src, idx) => (
          <div key={idx} className="pvi">
            <img
              src={src}
              alt={`${tripTitle} - ${idx + 1}`}
              loading={idx === currentIndex ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
