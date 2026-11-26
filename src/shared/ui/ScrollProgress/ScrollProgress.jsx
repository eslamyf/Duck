import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/index.js';

export default function ScrollProgress() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;

          if (totalHeight > 0) {
            const currentProgress = Math.min(
              100,
              Math.max(0, (currentScroll / totalHeight) * 100)
            );
            setProgress(currentProgress);
          }

          setIsVisible(currentScroll > 320);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Top Reading Progress Bar (Fixed directly beneath navbar) */}
      <div
        className="fixed top-[var(--header-offset)] inset-x-0 z-[9998] h-[3px] pointer-events-none bg-black/5 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-yellow via-brand-blue to-brand-yellow shadow-[0_0_8px_rgba(253,251,69,0.7)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Back-To-Top Button with Circular Progress Ring */}
      <div
        className={`fixed bottom-24 md:bottom-5 start-4 md:start-5 z-[85] transition-all duration-300 ${
          isVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label={t('common.scrollToTop', 'العودة للأعلى')}
          title={t('common.scrollToTop', 'العودة للأعلى')}
          className="group relative w-12 h-12 rounded-full bg-white/95 hover:bg-brand-navy backdrop-blur-md shadow-[0_4px_16px_rgba(12,18,38,0.15)] hover:shadow-[0_6px_22px_rgba(12,18,38,0.25)] flex items-center justify-center text-brand-navy hover:text-brand-yellow transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow active:scale-95 border border-[rgba(20,125,159,0.18)] hover:border-brand-navy"
        >
          {/* SVG Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
            viewBox="0 0 44 44"
            aria-hidden="true"
          >
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-black/5"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-brand-yellow group-hover:text-brand-yellow transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Up Arrow Icon */}
          <FontAwesomeIcon
            icon={faArrowUp}
            className="text-sm transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </>
  );
}
