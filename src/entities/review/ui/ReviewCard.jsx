import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';

export default function ReviewCard({
  review,
  variant = 'featured',
  isActive = false,
  onClick,
  className = '',
}) {
  const { t, lang } = useTranslation();
  const isEn = lang === 'en';

  if (!review) return null;

  const reviewerName = (isEn && review.nEn) ? review.nEn : review.n;
  const reviewerDate = (isEn && review.dEn) ? review.dEn : review.d;
  const reviewerActivity = (isEn && review.aEn) ? review.aEn : review.a;
  const reviewText = (isEn && review.tEn) ? review.tEn : review.t;
  const avatarInitial = reviewerName.trim()[0] || 'D';

  if (variant === 'marquee') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={`group relative flex items-center gap-3.5 w-[340px] min-[901px]:w-[360px] flex-none p-3 min-[901px]:p-3.5 rounded-[20px] border border-[rgba(20,125,159,0.18)] text-start cursor-pointer select-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
          isActive
            ? 'bg-brand-navy text-white border-brand-yellow shadow-md -translate-y-0.5'
            : 'bg-white text-brand-navy shadow-sm hover:bg-brand-navy hover:text-white hover:border-brand-yellow hover:-translate-y-0.5'
        } ${className}`.trim()}
      >
        {/* Thumbnail */}
        {review.img && (
          <div className="w-[72px] h-[72px] min-[901px]:w-[76px] min-[901px]:h-[76px] rounded-[16px] overflow-hidden flex-none bg-surface-mist border border-[rgba(20,125,159,0.2)]">
            <img
              src={review.img}
              alt={reviewerActivity || reviewerName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          {/* Top: Stars + Activity */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span
              className="flex items-center gap-0.5 text-[#f59e0b]"
              role="img"
              aria-label={t('reviews.starRatingAria', { rating: review.r }, `${review.r} of 5 stars`)}
            >
              {[...Array(review.r)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3" />
              ))}
            </span>
            <span
              className={`font-bold truncate text-[11px] min-[901px]:text-xs transition-colors ${
                isActive ? 'text-brand-yellow' : 'text-brand-blue group-hover:text-brand-yellow'
              }`}
            >
              {reviewerActivity || 'Google'}
            </span>
          </div>

          {/* Snippet (2 lines) */}
          <p className="text-xs min-[901px]:text-[13px] font-medium leading-[1.4] line-clamp-2">
            {reviewText}
          </p>

          {/* Name & Date */}
          <span className="text-[11px] opacity-75 font-semibold truncate">
            — {reviewerName} · {reviewerDate}
          </span>
        </div>
      </button>
    );
  }

  // Default: Featured Card
  return (
    <figure
      className={`relative grid grid-cols-1 min-[901px]:grid-cols-[220px_1fr] gap-4 min-[901px]:gap-7 items-center p-4 min-[901px]:p-7 rounded-[26px] bg-gradient-to-br from-[#f3fafc] to-white border border-[rgba(20,125,159,0.18)] shadow-card max-w-[1100px] w-full mx-auto overflow-hidden ${className}`.trim()}
      aria-label={`${reviewerName} - ${reviewerActivity}`}
    >
      {/* Large Decorative Quote Symbol (Desktop Only) */}
      <span
        className="hidden min-[901px]:block absolute -top-4 ltr:right-6 rtl:left-6 font-serif text-[130px] leading-none text-brand-blue/8 pointer-events-none select-none"
        aria-hidden="true"
      >
        “
      </span>

      {/* Media: Image */}
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

      {/* Body */}
      <div className="relative min-w-0 flex flex-col justify-between h-full">
        {/* Star Rating */}
        <div
          className="flex items-center gap-1 text-[#f59e0b] text-base min-[901px]:text-lg mb-1"
          role="img"
          aria-label={t('reviews.starRatingAria', { rating: review.r }, `${review.r} of 5 stars`)}
        >
          {[...Array(review.r)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4 min-[901px]:w-5 min-[901px]:h-5" />
          ))}
        </div>

        {/* Review Quote Text */}
        <blockquote className="text-base min-[901px]:text-xl font-semibold text-brand-navy leading-relaxed my-2 min-[901px]:my-3 overflow-wrap-anywhere">
          {reviewText}
        </blockquote>

        {/* Compact Author Figcaption (< 45px per BR-012) */}
        <figcaption className="flex items-center justify-between gap-3 pt-3 border-t border-[rgba(18,21,40,0.08)] mt-auto min-h-[44px]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Avatar Circle */}
            <span
              className="w-9 h-9 min-[901px]:w-10 min-[901px]:h-10 rounded-full bg-brand-navy text-brand-yellow font-extrabold text-sm min-[901px]:text-base grid place-items-center flex-none shadow-sm select-none"
              aria-hidden="true"
            >
              {avatarInitial}
            </span>

            {/* Author Meta */}
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

          {/* Badges */}
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


