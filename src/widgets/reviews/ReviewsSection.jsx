import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { Button } from '../../shared/ui/index.js';
import { ReviewCard, reviewsData, GOOGLE_REVIEWS_URL } from '../../entities/review/index.js';

export default function ReviewsSection() {
  const { t, lang } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const isRtl = lang === 'ar';
  const total = reviewsData.length;

  const nextReview = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevReview = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Mobile / Autoplay timer (5 seconds)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    timerRef.current = setTimeout(() => {
      nextReview();
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isPaused, nextReview, total]);

  // Average Rating
  const averageRating = total > 0
    ? (reviewsData.reduce((acc, r) => acc + r.r, 0) / total).toFixed(1)
    : '5.0';

  if (total === 0) {
    return (
      <section
        id="reviews"
        className="bg-white text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body relative overflow-hidden border-t border-[rgba(20,125,159,0.12)] scroll-mt-[calc(var(--header-height-mobile)+16px)] min-[901px]:scroll-mt-[calc(var(--header-height-desktop)+20px)]"
        aria-label={t('reviews.sectionTitle')}
      >
        <div className="max-w-[1100px] mx-auto text-center flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-surface-mist text-brand-blue flex items-center justify-center text-3xl font-bold shadow-sm">
            <FontAwesomeIcon icon={faGoogle} className="text-[#4285f4]" />
          </div>
          <h3 className="text-2xl min-[901px]:text-3xl font-bold text-brand-navy">
            {t('reviews.emptyTitle', 'كن أول من يحكي تجربته')}
          </h3>
          <p className="text-sm min-[901px]:text-base text-brand-navy/70 max-w-[500px]">
            {t('reviews.emptyText', 'تقييمات ضيوفنا الحقيقية بتتجمّع على Google. جرّبت رحلة معانا؟ شاركنا رأيك، وهيظهر هنا.')}
          </p>
          <Button
            as="a"
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener"
            variant="subtle"
            size="md"
          >
            {t('reviews.viewOnGoogle', 'شوف التقييمات على Google')}
          </Button>
        </div>
      </section>
    );
  }

  const currentReview = reviewsData[activeIndex];

  // Icons for Prev/Next depending on text direction
  const PrevIcon = isRtl ? faChevronRight : faChevronLeft;
  const NextIcon = isRtl ? faChevronLeft : faChevronRight;

  return (
    <section
      id="reviews"
      className="bg-white text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body relative overflow-hidden border-t border-[rgba(20,125,159,0.12)] scroll-mt-[calc(var(--header-height-mobile)+16px)] min-[901px]:scroll-mt-[calc(var(--header-height-desktop)+20px)] select-none"
      aria-label={t('reviews.sectionTitle', 'ماذا يقول ضيوفنا')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Header: Title & Subtitle + Google Rating Summary Badge */}
        <div className="flex flex-col min-[901px]:flex-row justify-between items-start min-[901px]:items-end gap-6 mb-7 min-[901px]:mb-9">
          <div>
            <h2 className="text-2xl min-[901px]:text-4xl font-bold leading-tight tracking-tight text-brand-navy mb-2">
              {t('reviews.sectionTitle', 'ماذا يقول ضيوفنا')}
            </h2>
            <p className="text-sm min-[901px]:text-base leading-relaxed text-brand-navy/72 max-w-[62ch]">
              {t('reviews.sectionSubtitle', 'تقييمات حقيقية من مغامرين حقيقيين، مباشرةً من جوجل.')}
            </p>
          </div>

          {/* Google Summary Badge (.gsum) */}
          <div className="flex items-center gap-3.5 bg-surface-mist border border-[rgba(20,125,159,0.16)] px-4 min-[901px]:px-5 py-2.5 rounded-[20px] shadow-sm w-full min-[901px]:w-auto justify-between min-[901px]:justify-start">
            <span
              className="w-11 h-11 rounded-full grid place-items-center text-xl text-[#4285f4] bg-white border border-[rgba(20,125,159,0.16)] flex-none shadow-sm"
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faGoogle} />
            </span>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <b className="text-2xl min-[901px]:text-3xl font-extrabold text-brand-navy leading-none">
                  {averageRating}
                </b>
                <span className="flex items-center gap-0.5 text-[#f59e0b] text-sm" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </span>
              </div>
              <small className="text-xs text-brand-navy/75 font-medium mt-0.5">
                {t('reviews.basedOnGoogle', { count: total }, `بناءً على ${total} تقييم على Google`)}
              </small>
            </div>
          </div>
        </div>

        {/* Mobile Story Bars & Top Nav (.rf-top) - Only on Mobile */}
        <div className="block min-[901px]:hidden mb-3">
          {/* Instagram-style segmented progress bar (.rst) */}
          <div
            className="grid gap-1.5 w-full mb-2"
            style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
            role="tablist"
            aria-label={t('reviews.storyNavigation', 'التنقل بين آراء الضيوف')}
          >
            {reviewsData.map((_, j) => {
              const isPast = j < activeIndex;
              const isCurrent = j === activeIndex;

              return (
                <button
                  key={j}
                  type="button"
                  onClick={() => setActiveIndex(j)}
                  className="h-4 flex items-center p-0 border-0 bg-transparent cursor-pointer outline-none"
                  aria-label={t('reviews.reviewIndex', { current: j + 1, total }, `رأي ${j + 1} من ${total}`)}
                  aria-selected={isCurrent}
                >
                  <span className="w-full h-1 rounded-full bg-brand-navy/15 overflow-hidden block">
                    <i
                      className={`block h-full rounded-full transition-all duration-300 ${
                        isPast
                          ? 'w-full bg-brand-navy'
                          : isCurrent
                          ? 'w-full bg-brand-blue animate-rv-story'
                          : 'w-0 bg-transparent'
                      }`}
                      style={{
                        animationDuration: isCurrent ? '5s' : undefined,
                      }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Prev / Next Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevReview}
              className="w-9 h-9 rounded-full border border-[rgba(20,125,159,0.2)] bg-white text-brand-navy grid place-items-center shadow-sm cursor-pointer hover:bg-brand-navy hover:text-brand-yellow active:scale-95 transition-all"
              aria-label={t('reviews.prevReview', 'الرأي السابق')}
            >
              <FontAwesomeIcon icon={PrevIcon} className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold text-brand-navy bg-[rgba(6,123,161,0.08)] px-3 py-1 rounded-full" aria-hidden="true">
              {activeIndex + 1} / {total}
            </span>

            <button
              type="button"
              onClick={nextReview}
              className="w-9 h-9 rounded-full border border-[rgba(20,125,159,0.2)] bg-white text-brand-navy grid place-items-center shadow-sm cursor-pointer hover:bg-brand-navy hover:text-brand-yellow active:scale-95 transition-all"
              aria-label={t('reviews.nextReview', 'الرأي التالي')}
            >
              <FontAwesomeIcon icon={NextIcon} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Featured Review Active Card */}
        <div className="relative w-full" aria-live="polite">
          <ReviewCard review={currentReview} variant="featured" />
        </div>

        {/* Desktop Carousel Navigation (.rcn) */}
        {total > 1 && (
          <div className="hidden min-[901px]:flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={prevReview}
              className="w-10 h-10 rounded-full border border-[rgba(20,125,159,0.25)] bg-white text-brand-navy grid place-items-center shadow-sm cursor-pointer hover:bg-brand-navy hover:text-brand-yellow hover:border-brand-navy active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              aria-label={t('reviews.prevReview', 'الرأي السابق')}
            >
              <FontAwesomeIcon icon={PrevIcon} className="w-4 h-4" />
            </button>

            <span className="text-sm font-bold text-brand-navy bg-[rgba(6,123,161,0.08)] px-4 py-1.5 rounded-full select-none" aria-hidden="true">
              {activeIndex + 1} / {total}
            </span>

            <button
              type="button"
              onClick={nextReview}
              className="w-10 h-10 rounded-full border border-[rgba(20,125,159,0.25)] bg-white text-brand-navy grid place-items-center shadow-sm cursor-pointer hover:bg-brand-navy hover:text-brand-yellow hover:border-brand-navy active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              aria-label={t('reviews.nextReview', 'الرأي التالي')}
            >
              <FontAwesomeIcon icon={NextIcon} className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Infinite Marquee Ticker Track (Desktop Only: .rm -> .rmt) */}
        {total > 1 && (
          <div
            className="hidden min-[901px]:block overflow-hidden -mx-[6vw] mt-8 py-3.5 relative [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
            dir="ltr"
            role="group"
            aria-label={t('reviews.tickerAria', 'شريط آراء الضيوف المتحرك')}
          >
            <div className="flex gap-4 w-max px-4 will-change-transform animate-rv-scroll hover:[animation-play-state:paused]">
              {[...reviewsData, ...reviewsData].map((rev, idx) => {
                const originalIndex = idx % total;
                const isSelected = originalIndex === activeIndex;

                return (
                  <div key={`${rev.id}-${idx}`} dir={isRtl ? 'rtl' : 'ltr'}>
                    <ReviewCard
                      review={rev}
                      variant="marquee"
                      isActive={isSelected}
                      onClick={() => setActiveIndex(originalIndex)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA: Write a Review on Google */}
        <div className="flex justify-center mt-8 min-[901px]:mt-10">
          <Button
            as="a"
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener"
            variant="subtle"
            size="md"
            icon={<FontAwesomeIcon icon={faGoogle} className="text-[#4285f4] text-lg" />}
            className="shadow-sm font-bold border border-[rgba(20,125,159,0.25)]"
          >
            {t('reviews.writeReview', 'اكتب تقييمك على Google')}
          </Button>
        </div>
      </div>
    </section>
  );
}
