import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteRight, faQuoteLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';
import { GOOGLE_REVIEWS_URL } from '../model/reviewsData.js';

export default function ReviewCard({
  review,
  variant = 'featured',
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
      <a
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-hidden={ariaHidden ? 'true' : undefined}
        className={`group relative flex-none rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300 no-underline cursor-pointer block ${
          isDark
            ? 'bg-brand-navy text-white border border-white/10 shadow-[0_12px_32px_rgba(12,18,38,0.16)] hover:shadow-[0_20px_48px_rgba(20,125,159,0.22)]'
            : 'bg-white text-brand-navy border border-[rgba(20,125,159,0.16)] shadow-[0_12px_32px_rgba(12,18,38,0.08)] hover:shadow-[0_20px_48px_rgba(20,125,159,0.14)]'
        } hover:-translate-y-1 hover:scale-[1.02] ${className}`.trim()}
      >
        {/* Real Customer Experience Photo */}
        {review.img && (
          <div className="w-full h-36 rounded-[16px] overflow-hidden bg-brand-navy/10 flex-none relative">
            <img
              src={review.img}
              alt={reviewerActivity || reviewerName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2.5 rtl:right-2.5 ltr:left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-brand-navy shadow-xs border border-black/5">
              <FontAwesomeIcon icon={faGoogle} className="text-[#4285f4]" />
              <span>Google</span>
              <FontAwesomeIcon icon={faCheck} className="text-[10px] text-emerald-600" />
            </span>
          </div>
        )}

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
        <blockquote className="text-[14px] leading-[1.65] font-normal line-clamp-3">
          "{reviewText}"
        </blockquote>

        {/* Reviewer Meta Row */}
        <div className="flex items-center gap-2.5 pt-2 mt-auto border-t border-black/5 dark:border-white/10">
          <span
            className="w-9 h-9 rounded-full grid place-items-center text-white font-bold text-sm flex-none select-none shadow-xs"
            style={{ background: gradientToken }}
            aria-hidden="true"
          >
            {initialChar}
          </span>
          <div className="min-w-0 flex-1">
            <b className={`block text-xs sm:text-[13px] leading-tight font-bold truncate ${isDark ? 'text-white' : 'text-brand-navy'}`}>
              {reviewerName}
            </b>
            <div className="flex items-center gap-1 text-[11px] opacity-70 truncate mt-0.5">
              {reviewerDate && <span>{reviewerDate}</span>}
              {reviewerDate && reviewerActivity && <span>•</span>}
              {reviewerActivity && <span className="truncate">{reviewerActivity}</span>}
            </div>
          </div>
          <span className="text-[11px] font-bold text-brand-blue group-hover:underline flex-none">
            {isEn ? 'Google Details ↗' : 'التفاصيل ↗'}
          </span>
        </div>
      </a>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     2. FEATURED / SINGLE CARD VARIANT (Used on Mobile & Featured View)
     ───────────────────────────────────────────────────────────── */
  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative grid grid-cols-1 min-[640px]:grid-cols-[180px_1fr] gap-4 p-4 sm:p-5 rounded-[24px] bg-gradient-to-br from-[#f3fafc] to-white border border-[rgba(20,125,159,0.18)] shadow-card max-w-[680px] w-full mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg no-underline cursor-pointer block text-brand-navy ${className}`.trim()}
      aria-label={`${reviewerName} - ${reviewerActivity}`}
    >
      {/* Decorative Quote Accent */}
      <span
        className="hidden min-[640px]:block absolute top-2 rtl:left-5 ltr:right-5 text-4xl text-brand-blue/15 pointer-events-none select-none"
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={QuoteIcon} />
      </span>

      {/* Real Customer Experience Photo */}
      {review.img && (
        <div className="w-full aspect-[16/10] min-[640px]:h-full min-[640px]:aspect-auto rounded-[18px] overflow-hidden border-2 border-brand-yellow/80 shadow-xs bg-brand-navy flex-none relative">
          <img
            src={review.img}
            alt={reviewerActivity || reviewerName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 rtl:right-2 ltr:left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-xs text-brand-navy shadow-xs border border-black/5">
            <FontAwesomeIcon icon={faGoogle} className="text-[#4285f4]" />
            <span>Google</span>
            <FontAwesomeIcon icon={faCheck} className="text-[9px] text-emerald-600" />
          </span>
        </div>
      )}

      {/* Body */}
      <div className="relative min-w-0 flex flex-col justify-between gap-2.5">
        {/* Star Rating */}
        <div
          className="flex items-center gap-1 text-[var(--color-star)] text-base"
          role="img"
          aria-label={t('reviews.starRatingAria', { rating: review.r }, `${review.r} من 5 نجوم`)}
        >
          {[...Array(review.r)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="w-3.5 h-3.5" />
          ))}
        </div>

        {/* Review Quote Text */}
        <blockquote className="text-xs sm:text-sm font-semibold text-brand-navy leading-relaxed overflow-wrap-anywhere">
          "{reviewText}"
        </blockquote>

        {/* Author Figcaption */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[rgba(18,21,40,0.08)] mt-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="w-8 h-8 rounded-full text-white font-extrabold text-xs grid place-items-center flex-none shadow-xs select-none"
              style={{ background: gradientToken }}
              aria-hidden="true"
            >
              {initialChar}
            </span>
            <div className="min-w-0 flex flex-col">
              <b className="text-xs sm:text-[13px] font-bold text-brand-navy leading-tight truncate">
                {reviewerName}
              </b>
              <div className="flex items-center gap-1 text-[11px] text-brand-navy/70 leading-normal truncate mt-0.5">
                {reviewerDate && <span>{reviewerDate}</span>}
                {reviewerDate && reviewerActivity && <span className="opacity-40">·</span>}
                {reviewerActivity && <span className="truncate">{reviewerActivity}</span>}
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold text-brand-blue group-hover:underline flex items-center gap-1 shrink-0">
            <span>{isEn ? 'Google Details ↗' : 'التفاصيل على Google ↗'}</span>
          </span>
        </div>
      </div>
    </a>
  );
}
