import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader, Badge, Button } from '../../shared/ui/index.js';
import { ReviewCard, reviewsData, GOOGLE_REVIEWS_URL } from '../../entities/review/index.js';

export default function ReviewsSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const total = reviewsData.length;

  const nextReview = useCallback(() => {
    setMobileActiveIdx((prev) => (prev + 1) % total);
  }, [total]);

  const prevReview = useCallback(() => {
    setMobileActiveIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Mobile Autoplay: Rotates every 3 seconds per user request
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setMobileActiveIdx((prev) => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Touch Swipe Handlers for mobile card
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      // Swiped
      if (isRtl) prevReview();
      else nextReview();
    } else if (diff < -45) {
      if (isRtl) nextReview();
      else prevReview();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  // Average Rating calculated dynamically from unified source of truth
  const averageRating = useMemo(() => {
    if (total === 0) return '5.0';
    const sum = reviewsData.reduce((acc, r) => acc + (r.r || 5), 0);
    return (sum / total).toFixed(1);
  }, [total]);

  // Shard reviews into 3 columns for desktop infinite moving wall
  const columns = useMemo(() => {
    const numCols = 3;
    const cols = Array.from({ length: numCols }, () => []);

    reviewsData.forEach((rev, idx) => {
      cols[idx % numCols].push({ review: rev, globalIndex: idx });
    });

    // Ensure each column has sufficient height before duplicating (at least 3 cards per half)
    return cols.map((col, colIdx) => {
      let half = [...col];
      while (half.length < 3) {
        half = [...half, ...col];
      }
      return {
        colIdx,
        items: [...half, ...half],
        halfCount: half.length,
      };
    });
  }, []);

  // Empty state fallback
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
            rel="noopener noreferrer"
            variant="subtle"
            size="md"
          >
            {t('reviews.viewOnGoogle', 'شوف التقييمات على Google')}
          </Button>
        </div>
      </section>
    );
  }

  const currentMobileReview = reviewsData[mobileActiveIdx] || reviewsData[0];
  const PrevIcon = isRtl ? faChevronRight : faChevronLeft;
  const NextIcon = isRtl ? faChevronLeft : faChevronRight;

  return (
    <section
      id="reviews"
      className="bg-gradient-to-b from-white to-surface-mist text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body relative overflow-hidden border-t border-[rgba(20,125,159,0.12)] scroll-mt-[calc(var(--header-height-mobile)+16px)] min-[901px]:scroll-mt-[calc(var(--header-height-desktop)+20px)]"
      aria-label={t('reviews.sectionTitle')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header: Badge + Marketing H2 + Subtitle */}
        <SectionHeader
          tag={
            <span
              className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-blue"
              lang="en"
              dir="ltr"
            >
              {t('reviews.realBadge')}
            </span>
          }
          title={t('reviews.sectionTitle')}
          subtitle={t('reviews.sectionSubtitle')}
          className="mb-8 min-[901px]:mb-10"
        />

        {/* ─────────────────────────────────────────────────────────────
            DESKTOP VIEW (>= 901px): Rating Summary Aside + 3-Column Infinite Wall
            ───────────────────────────────────────────────────────────── */}
        <div className="hidden min-[901px]:grid grid-cols-[250px_1fr] min-[1281px]:grid-cols-[290px_1fr] gap-6 items-stretch">
          {/* Rating Summary Card (Side Aside) */}
          <aside
            aria-label={t('reviews.ratingSummary', 'ملخص التقييمات')}
            className="flex flex-col justify-center items-center text-center gap-3.5 p-6 min-[901px]:p-8 rounded-[28px] bg-white border border-[rgba(20,125,159,0.16)] shadow-[0_12px_32px_rgba(12,18,38,0.08)] h-full"
          >
            <div className="flex items-start justify-center font-bold text-6xl min-[901px]:text-7xl min-[1281px]:text-8xl leading-none text-brand-navy tabular-nums select-none">
              <span>{averageRating}</span>
              <sup className="text-xl min-[901px]:text-2xl text-brand-blue font-bold ms-1 top-2 relative">
                /5
              </sup>
            </div>

            <div
              className="flex items-center gap-1.5 text-[var(--color-star)] text-xl min-[901px]:text-2xl"
              role="img"
              aria-label={t('reviews.outOfFive', { rating: averageRating }, `${averageRating} من 5`)}
            >
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} />
              ))}
            </div>

            <Badge
              variant="subtle"
              size="md"
              className="mt-1 font-bold text-xs min-[901px]:text-[13px] px-3.5 py-1.5 rounded-full border border-[rgba(20,125,159,0.16)] bg-surface-mist text-brand-blue"
            >
              {t('reviews.trustBadge', 'رحلات مائية بإشراف محترفين')}
            </Badge>

            <div className="pt-2 w-full">
              <Button
                as="a"
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                fullWidth
                className="mt-2 text-xs min-[901px]:text-sm font-bold shadow-sm"
              >
                {t('reviews.writeReview', 'شوف تجارب ضيوفنا')}
              </Button>
            </div>
          </aside>

          {/* 3-Column Infinite Vertical Review Wall */}
          <div
            className="rv-wall relative grid grid-cols-2 min-[1281px]:grid-cols-3 gap-[18px] h-[580px] overflow-hidden rounded-[28px] [mask-image:linear-gradient(to_bottom,transparent_0,#000_12%,#000_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,#000_12%,#000_88%,transparent_100%)] select-none"
            role="list"
            aria-label={t('reviews.guestReviewsWall', 'آراء العملاء')}
          >
            {/* Column 0: Standard Downward Roll */}
            <div
              className="col flex flex-col gap-[18px] will-change-transform animate-rv-roll self-start"
              style={{ '--roll-duration': '46s' }}
            >
              {columns[0].items.map((item, itemIdx) => {
                const isAriaHidden = itemIdx >= columns[0].halfCount;
                const isDark = itemIdx % 3 === 1;

                return (
                  <ReviewCard
                    key={`c0-${item.review.id}-${itemIdx}`}
                    review={item.review}
                    variant="wall"
                    isDark={isDark}
                    gradientIndex={item.globalIndex}
                    ariaHidden={isAriaHidden}
                  />
                );
              })}
            </div>

            {/* Column 1: Reversed Upward Roll */}
            <div
              className="col flex flex-col gap-[18px] will-change-transform animate-rv-roll-reverse self-start"
              style={{ '--roll-duration': '53s' }}
            >
              {columns[1].items.map((item, itemIdx) => {
                const isAriaHidden = itemIdx >= columns[1].halfCount;
                const isDark = itemIdx % 3 === 0;

                return (
                  <ReviewCard
                    key={`c1-${item.review.id}-${itemIdx}`}
                    review={item.review}
                    variant="wall"
                    isDark={isDark}
                    gradientIndex={item.globalIndex}
                    ariaHidden={isAriaHidden}
                  />
                );
              })}
            </div>

            {/* Column 2: Standard Downward Roll (Visible on > 1280px) */}
            <div
              className="col hidden min-[1281px]:flex flex-col gap-[18px] will-change-transform animate-rv-roll self-start"
              style={{ '--roll-duration': '60s' }}
            >
              {columns[2].items.map((item, itemIdx) => {
                const isAriaHidden = itemIdx >= columns[2].halfCount;
                const isDark = itemIdx % 3 === 2;

                return (
                  <ReviewCard
                    key={`c2-${item.review.id}-${itemIdx}`}
                    review={item.review}
                    variant="wall"
                    isDark={isDark}
                    gradientIndex={item.globalIndex}
                    ariaHidden={isAriaHidden}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MOBILE VIEW (< 901px): Single Card Carousel with 3s Autoplay & Manual Controls
            ───────────────────────────────────────────────────────────── */}
        <div
          className="flex min-[901px]:hidden flex-col items-center gap-4 w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Quick Rating Badge */}
          <div className="flex items-center justify-between w-full max-w-[680px] px-1 text-xs">
            <div className="flex items-center gap-1.5 font-extrabold text-brand-navy">
              <span className="text-lg leading-none font-black">{averageRating}</span>
              <div className="flex text-[var(--color-star)] text-xs">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
            </div>

            {/* Carousel Navigation Buttons & Counter */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevReview}
                className="w-8 h-8 rounded-full border border-brand-blue/20 bg-white text-brand-navy flex items-center justify-center shadow-xs cursor-pointer hover:bg-brand-navy hover:text-brand-yellow active:scale-95 transition-all"
                aria-label={t('reviews.prevReview', 'الرأي السابق')}
              >
                <FontAwesomeIcon icon={PrevIcon} className="text-xs" />
              </button>

              <span className="font-mono text-xs font-bold text-brand-navy px-2 py-0.5 rounded-full bg-brand-navy/5">
                {mobileActiveIdx + 1} / {total}
              </span>

              <button
                type="button"
                onClick={nextReview}
                className="w-8 h-8 rounded-full border border-brand-blue/20 bg-white text-brand-navy flex items-center justify-center shadow-xs cursor-pointer hover:bg-brand-navy hover:text-brand-yellow active:scale-95 transition-all"
                aria-label={t('reviews.nextReview', 'الرأي التالي')}
              >
                <FontAwesomeIcon icon={NextIcon} className="text-xs" />
              </button>
            </div>
          </div>

          {/* Single Active Review Card (With Real Customer Photo) */}
          <div className="w-full relative animate-in fade-in zoom-in-95 duration-300">
            <ReviewCard
              key={currentMobileReview.id}
              review={currentMobileReview}
              variant="featured"
              gradientIndex={mobileActiveIdx}
            />
          </div>

          {/* Indicator Dots for Easy 1-Click Jumping */}
          <div className="flex items-center justify-center gap-1.5 pt-1" role="tablist">
            {reviewsData.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                role="tab"
                aria-selected={dotIdx === mobileActiveIdx}
                aria-label={`Review ${dotIdx + 1}`}
                onClick={() => setMobileActiveIdx(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === mobileActiveIdx
                    ? 'w-6 h-2 bg-brand-navy'
                    : 'w-2 h-2 bg-brand-navy/20 hover:bg-brand-navy/40'
                }`}
              />
            ))}
          </div>

          {/* Mobile CTA: View all reviews on Google */}
          <div className="pt-2 w-full max-w-[680px]">
            <Button
              as="a"
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              fullWidth
              className="shadow-sm font-bold text-xs sm:text-sm"
            >
              {t('reviews.writeReview', 'شوف تجارب ضيوفنا على Google')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
