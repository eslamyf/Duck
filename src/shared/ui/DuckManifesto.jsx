/**
 * Editorial Nile-adventure brand signature for "IN DUCK WE TRUST".
 * Replaces generic rounded-pill / pulsing-dot badges with kinetic flowing
 * river waves, a tilted 3D-offset decal stamp, and a tapering wake line.
 */
export default function DuckManifesto({
  text = 'IN DUCK WE TRUST',
  theme = 'dark',
  align = 'start',
  className = '',
}) {
  const rawText = String(text || 'IN DUCK WE TRUST').trim();
  const match = rawText.match(/^(.*?)\b(DUCK)\b(.*)$/i);

  const isDark = theme === 'dark';
  const isCenter = align === 'center';

  const prefix = match ? match[1].trim() : '';
  const brandWord = match ? match[2] : rawText;
  const suffix = match ? match[3].trim() : '';

  const textShadowClass = isDark ? '[text-shadow:0_2px_10px_rgba(12,18,38,0.9)]' : '';
  const prefixColor = isDark ? 'text-white/85' : 'text-brand-navy/75';
  const suffixColor = isDark ? 'text-white' : 'text-brand-navy';
  const waveTopColor = isDark ? 'text-brand-yellow' : 'text-brand-blue';

  const decalBackingClass = 'bg-brand-blue';
  const decalFaceClass = isDark
    ? 'bg-brand-yellow text-brand-navy'
    : 'bg-brand-navy text-brand-yellow';

  const lockup = (
    <div
      dir="ltr"
      lang="en"
      className="inline-flex items-center gap-2 sm:gap-2.5 select-none shrink-0"
    >
      {/* Sleek Kayak & Paddle emblem */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center shrink-0"
      >
        <svg
          viewBox="0 0 44 24"
          className={`w-9 h-5 shrink-0 ${waveTopColor}`}
          fill="none"
        >
          {/* Kayak hull */}
          <path
            d="M3 15c7 5 31 5 38 0-7-4-31-4-38 0z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          {/* Cockpit */}
          <ellipse cx="22" cy="14.5" rx="5.5" ry="1.8" stroke="currentColor" strokeWidth="1.5" />
          {/* Diagonal double-bladed paddle */}
          <path
            d="M12 21L32 4"
            className={isDark ? 'stroke-white' : 'stroke-brand-navy'}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <ellipse
            cx="10.5"
            cy="21.8"
            rx="3.2"
            ry="1.3"
            transform="rotate(-38 10.5 21.8)"
            className={isDark ? 'fill-white' : 'fill-brand-navy'}
          />
          <ellipse
            cx="33.5"
            cy="3.2"
            rx="3.2"
            ry="1.3"
            transform="rotate(-38 33.5 3.2)"
            className={isDark ? 'fill-white' : 'fill-brand-navy'}
          />
        </svg>
      </span>

      {/* Deconstructed typographic signature */}
      <div className="inline-flex items-center gap-2 sm:gap-2.5 uppercase leading-none">
        {prefix && (
          <span
            className={`text-[11px] sm:text-xs font-extrabold tracking-[0.26em] ${prefixColor} ${textShadowClass}`}
          >
            {prefix}
          </span>
        )}

        {/* Tilted 3D-offset DUCK vinyl decal */}
        <span className="relative inline-flex items-center shrink-0">
          <span
            aria-hidden="true"
            className={`absolute inset-0 -skew-x-12 rounded-[3px] translate-x-[3px] translate-y-[3px] transition-transform duration-300 group-hover:translate-x-[5px] group-hover:translate-y-[4px] motion-reduce:transform-none ${decalBackingClass}`}
          />
          <span
            className={`relative inline-flex items-center px-2.5 py-[3px] -skew-x-12 rounded-[3px] transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none ${decalFaceClass}`}
          >
            <span className="skew-x-12 text-xs sm:text-[13px] font-black tracking-[0.14em] leading-none">
              {brandWord}
            </span>
          </span>
        </span>

        {suffix && (
          <span
            className={`text-[11px] sm:text-xs font-black tracking-[0.24em] ${suffixColor} ${textShadowClass}`}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  if (isCenter) {
    return (
      <div
        dir="ltr"
        className={`flex items-center justify-center group w-fit mx-auto max-w-full ${className}`.trim()}
      >
        {lockup}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center group w-fit max-w-full ${className}`.trim()}
    >
      {lockup}
    </div>
  );
}
