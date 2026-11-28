import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import introImg480 from '../../shared/assets/images/image1-480w.webp';
import introImg540 from '../../shared/assets/images/image1-540w.webp';
import introImg720 from '../../shared/assets/images/image1-720w.webp';
import riverPattern from '../../shared/assets/images/duck-river-pattern.webp';
import './story-gallery.css';

/**
 * Story & Gallery Section for Duck Entertainment
 * Built strictly according to classic-3-gallery.html visual layout and specifications.
 */
export default function StoryGallerySection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // High-performance single-trigger GPU entry fade-up
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const node = sectionRef.current;
    if (!node) return undefined;

    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="story-gallery"
      ref={sectionRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby="story-gallery-heading"
      className="story-gallery-sec"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.86)), url(${riverPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '900px auto',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={`story-gallery-wrap transition-all duration-500 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]'
        }`}
      >
        {/* Section Header */}
        <header className="story-gallery-head">
          {/* Strictly Aligned "IN DUCK WE TRUST" Badge (Specification 2) */}
          <div
            dir="ltr"
            lang="en"
            className="inline-flex items-center justify-center gap-3 sm:gap-3.5 select-none mx-auto mb-2"
          >
            {/* Sleek Kayak & Paddle emblem */}
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 44 24" className="w-9 h-5 shrink-0 text-[#13708C]" fill="none">
                <path
                  d="M3 15c7 5 31 5 38 0-7-4-31-4-38 0z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                />
                <ellipse cx="22" cy="14.5" rx="5.5" ry="1.8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 21L32 4" stroke="#0C1226" strokeWidth="1.9" strokeLinecap="round" />
                <ellipse cx="10.5" cy="21.8" rx="3.2" ry="1.3" transform="rotate(-38 10.5 21.8)" fill="#0C1226" />
                <ellipse cx="33.5" cy="3.2" rx="3.2" ry="1.3" transform="rotate(-38 33.5 3.2)" fill="#0C1226" />
              </svg>
            </span>

            {/* Deconstructed Typographic Lockup — Solid High-Contrast Contrast Guarantee */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 uppercase text-xs sm:text-[13px] font-black tracking-[0.24em] select-none story-gallery-motto-text">
              <span className="story-gallery-motto-word">IN</span>

              {/* Tilted -10deg DUCK Badge with offset #13708C backing */}
              <span className="relative inline-flex items-center shrink-0">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#13708C] rounded-[6px] [transform:skewX(-10deg)_translate(3px,3px)] pointer-events-none"
                />
                <span className="relative inline-flex items-center px-2.5 py-[3px] sm:px-3 sm:py-1 bg-[#0C1226] text-[#FDFB4A] rounded-[6px] [transform:skewX(-10deg)]">
                  <span className="[transform:skewX(10deg)] font-black tracking-[0.14em] leading-none">
                    DUCK
                  </span>
                </span>
              </span>

              <span className="story-gallery-motto-word">WE TRUST</span>
            </div>
          </div>

          {/* Heading */}
          <h2 id="story-gallery-heading" className="story-gallery-title">
            <span>{t('storyGallery.titlePart1')}</span>
            <span>{t('storyGallery.titlePart2')}</span>
          </h2>
        </header>

        {/* 3-Column Balanced Gallery Grid */}
        <div className="story-gallery-grid">
          {/* Column 1: Story Text & Primary Action Button */}
          <div className="story-gallery-side">
            <p className="story-gallery-text">
              {t('storyGallery.description')}
            </p>

            <Link
              to={ROUTES.ACTIVITIES}
              className="story-gallery-btn group"
              aria-label={t('storyGallery.cta')}
            >
              <span>{t('storyGallery.cta')}</span>
              {isRtl ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 12H4m6-6-6 6 6 6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              )}
            </Link>
          </div>

          {/* Column 2: Center Showcase Frame (Aspect-Ratio 4 / 3.1, Lazy, Async, Zero CLS) */}
          <figure className="story-gallery-frame">
            <div className="story-gallery-img-container">
              <picture>
                <source
                  media="(min-width: 901px)"
                  srcSet={`${introImg540} 540w, ${introImg720} 720w`}
                  sizes="540px"
                  type="image/webp"
                />
                <source
                  media="(max-width: 900px)"
                  srcSet={`${introImg480} 480w, ${introImg540} 540w`}
                  sizes="(max-width: 639px) 480px, 540px"
                  type="image/webp"
                />
                <img
                  src={introImg540}
                  alt={t('storyGallery.imageAlt')}
                  width={540}
                  height={418}
                  loading="lazy"
                  decoding="async"
                  className="story-gallery-photo"
                />
              </picture>
            </div>
            <figcaption>
              <bdi lang="en">{t('storyGallery.caption')}</bdi>
            </figcaption>
          </figure>

          {/* Column 3: Triple Features List with Clean SVG Geometry */}
          <ul className="story-gallery-list" aria-label="Features List">
            <li>
              <svg className="story-gallery-ico" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m15.5 8.5-2 5-5 2 2-5z" />
              </svg>
              <span>{t('storyGallery.feature1')}</span>
            </li>

            <li>
              <svg className="story-gallery-ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15.5c3-3 6 3 9 0s6 3 9 0" />
              </svg>
              <span>{t('storyGallery.feature2')}</span>
            </li>

            <li>
              <svg className="story-gallery-ico" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.5M17 14.5a5 5 0 0 1 3.5 4.5" />
              </svg>
              <span>{t('storyGallery.feature3')}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
