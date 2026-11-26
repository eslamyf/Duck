import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteRight, faQuoteLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';

export default function ReviewCard({
  review,
  variant = 'wall',
  isDark = false,
  gradientIndex = 0,
  ariaHidden = false,
  className = '',
}) {
  const { t, lang } = useTranslation();
  const isEn = lang === 'en';
  const isRtl = lang === 'ar';

  if (!review) return null;

  const reviewerName = isEn && review.nEn ? review.nEn : review.n;
  const reviewerDate = isEn && review.dEn ? review.dEn : review.d;
  const reviewerActivity = isEn && review.aEn ? review.aEn : review.a;
  const reviewText = isEn && review.tEn ? review.tEn : review.t;

  // Extract clean initial letter for the avatar
  const initialChar = (
    reviewerName.trim().replace(/[^\p{L}\p{N} ]/gu, '')[0] || 'D'
  ).toUpperCase();

  // Gradient token based on index
  const gradientToken = `var(--grad-avatar-${(gradientIndex % 6) + 1})`;

  // Quote icon depends on text direction
  const QuoteIcon = isRtl ? faQuoteLeft : faQuoteRight;

  /* ─────────────────────────────────────────────────────────────
     1. DESKTOP WALL CARD VARIANT (Infinite Vertical Columns)
     ───────────────────────────────────────────────────────────── */
  if (variant === 'wall') {
    return (
      <article
        role="listitem"
        aria-hidden={ariaHidden ? 'true' : undefined}
        className={`group relative flex-none rounded-[24px] p-[22px_22px_20px] flex flex-col gap-3.5 transition-all duration-300 ${
          isDark
            ? 'bg-brand-navy text-white border border-white/10 shadow-[0_12px_32px_rgba(12,18,38,0.16)] hover:shadow-[0_20px_48px_rgba(20,125,159,0.22)]'
            : 'bg-white text-brand-navy border border-[rgba(20,125,159,0.16)] shadow-[0_12px_32px_rgba(12,18,38,0.08)] hover:shadow-[0_20px_48px_rgba(20,125,159,0.14)]'
        } hover:-translate-y-1 hover:scale-[1.02] ${className}`.trim()}
      >
        {/* Prominent Quote Icon */}
        <div
          className={`absolute top-4 rtl:left-5 ltr:right-5 text-3xl pointer-events-none select-none transition-opacity ${
            isDark ? 'text-brand-yellow/85' : 'text-brand-blue/20'
          }`}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={QuoteIcon} />
        </div>

        {/* 5-Star Rating */}
        <div
          className={`flex items-center gap-1 text-sm ${
            isDark ? 'text-brand-yellow' : 'text-[var(--color-star)]'
          }`}
          role="img"
          aria-label={t('reviews.starRatingAria', { rating: review.r }, `${review.r} من 5 نجوم`)}
        >
          {[...Array(review.r)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="w-3.5 h-3.5" />
          ))}
        </div>

        {/* Review Quote Text */}
        <blockquote className="text-[15px] leading-[1.75] font-normal">
          {reviewText}
        </blockquote>

        {/* Reviewer Meta Row */}
        <div className="flex items-center gap-3 pt-2 mt-auto border-t border-black/5 dark:border-white/10">
          <span
            className="w-[42px] h-[42px] rounded-full grid place-items-center text-white font-bold text-base flex-none select-none shadow-sm"
            style={{ background: gradientToken }}
            aria-hidden="true"
          >
            {initialChar}
          </span>
          <div className="min-w-0 flex-1">
            <b className={`block text-[15px] leading-tight font-bold truncate ${isDark ? 'text-white' : 'text-brand-navy'}`}>
              {reviewerName}
            </b>
            {reviewerActivity && (
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full truncate max-w-full ${
                  isDark
                    ? 'bg-white/16 text-white'
                    : 'bg-surface-mist text-brand-blue border border-[rgba(20,125,159,0.12)]'
                }`}
              >
                {reviewerActivity}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     2. MOBILE CAROUSEL CARD VARIANT (< 900px Snap Slide)
     ───────────────────────────────────────────────────────────── */
  if (variant === 'mobile') {
    return (
      <article
        role="listitem"
        className={`flex-none w-[86%] max-w-[340px] snap-center bg-brand-navy text-white rounded-[26px] p-6 shadow-[0_20px_48px_rgba(20,125,159,0.18)] relative overflow-hidden flex flex-col gap-4 border border-white/10 ${className}`.trim()}
      >
        {/* Large Brand Quote Accent */}
        <div
          className="absolute top-4 rtl:left-5 ltr:right-5 text-4xl text-brand-yellow/85 pointer-events-none select-none"
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={QuoteIcon} />
        </div>

        {/* Rating Stars */}
        <div
          className="flex items-center gap-1 text-brand-yellow text-sm pt-2"
          role="img"
          aria-label={t('reviews.starRatingAria', { rating: review.r }, `${review.r} من 5 نجوم`)}
        >
          {[...Array(review.r)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="w-3.5 h-3.5" />
          ))}
        </div>

        {/* Review Quote Text */}
        <blockquote className="text-base leading-[1.7] font-normal min-h-[4.5rem]">
          {reviewText}
        </blockquote>

        {/* Reviewer Meta Row */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/10">
          <span
            className="w-11 h-11 rounded-full grid place-items-center text-white font-bold text-base flex-none select-none shadow-sm"
            style={{ background: gradientToken }}
            aria-hidden="true"
          >
            {initialChar}
          </span>
          <div className="min-w-0 flex-1">
            <b className="block text-base font-bold text-white truncate">
              {reviewerName}
            </b>
            {reviewerActivity && (
              <span className="inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/16 text-white truncate max-w-full">
                {reviewerActivity}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     3. FEATURED REVIEW CARD VARIANT (Optional Hero/Detail View)
     ───────────────────────────────────────────────────────────── */
  return (
    <figure
      className={`relative grid grid-cols-1 min-[901px]:grid-cols-[220px_1fr] gap-4 min-[901px]:gap-7 items-center p-4 min-[901px]:p-7 rounded-[26px] bg-gradient-to-br from-surface-mist to-white border border-[rgba(20,125,159,0.18)] shadow-card max-w-[1100px] w-full mx-auto overflow-hidden ${className}`.trim()}
      aria-label={`${reviewerName} - ${reviewerActivity}`}
    >
      <div
        className="hidden min-[901px]:block absolute top-4 rtl:left-6 ltr:right-6 text-6xl text-brand-blue/10 pointer-events-none select-none"
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={QuoteIcon} />
      </div>

      {review.img && (
        <div className="w-full aspect-[16/9] min-[901px]:aspect-square rounded-[18px] min-[901px]:rounded-[20px] overflow-hidden border-2 border-brand-yellow shadow-sm bg-brand-navy flex-none">
          <img
            src={review.img}
            alt={reviewerActivity || reviewerName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="relative min-w-0 flex flex-col justify-between h-full">
        <div
          className="flex items-center gap-1 text-[var(--color-star)] text-base min-[901px]:text-lg mb-1"
          role="img"
          aria-label={t('reviews.starRatingAria', { rating: review.r }, `${review.r} من 5 نجوم`)}
        >
          {[...Array(review.r)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4 min-[901px]:w-5 min-[901px]:h-5" />
          ))}
        </div>

        <blockquote className="text-base min-[901px]:text-xl font-semibold text-brand-navy leading-relaxed my-2 min-[901px]:my-3">
          {reviewText}
        </blockquote>

        <figcaption className="flex items-center justify-between gap-3 pt-3 border-t border-[rgba(18,21,40,0.08)] mt-auto min-h-[44px]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span
              className="w-9 h-9 min-[901px]:w-10 min-[901px]:h-10 rounded-full text-white font-extrabold text-sm min-[901px]:text-base grid place-items-center flex-none shadow-sm select-none"
              style={{ background: gradientToken }}
              aria-hidden="true"
            >
              {initialChar}
            </span>
            <div className="min-w-0 flex flex-col">
              <b className="text-[13.5px] min-[901px]:text-[15px] font-bold text-brand-navy leading-tight truncate">
                {reviewerName}
              </b>
              <div className="flex items-center gap-1.5 text-[11px] min-[901px]:text-xs text-brand-navy/70 leading-normal truncate">
                {reviewerDate && <span>{reviewerDate}</span>}
                {reviewerDate && reviewerActivity && <span className="opacity-40">·</span>}
                {reviewerActivity && <span className="truncate">{reviewerActivity}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] min-[901px]:text-xs font-bold text-brand-blue bg-[rgba(6,123,161,0.1)] border border-[rgba(6,123,161,0.18)] whitespace-nowrap">
              <FontAwesomeIcon icon={faGoogle} className="text-[#4285f4]" />
              <span>Google</span>
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
            </span>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
