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
  const waveBottomColor = isDark ? 'text-brand-blue' : 'text-brand-navy/35';

  const decalBackingClass = 'bg-brand-blue';
  const decalFaceClass = isDark
    ? 'bg-brand-yellow text-brand-navy'
    : 'bg-brand-navy text-brand-yellow';

  const tailGradientClass = isDark
    ? 'ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-brand-yellow/90 via-brand-blue/75 to-transparent'
    : 'ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-brand-blue/80 via-brand-navy/20 to-transparent';

  const centerLeftWingClass = isDark
    ? 'bg-gradient-to-r from-transparent via-brand-blue/75 to-brand-yellow/90'
    : 'bg-gradient-to-r from-transparent via-brand-navy/20 to-brand-blue/80';

  const centerRightWingClass = isDark
    ? 'bg-gradient-to-r from-brand-yellow/90 via-brand-blue/75 to-transparent'
    : 'bg-gradient-to-r from-brand-blue/80 via-brand-navy/20 to-transparent';

  const lockup = (
    <div
      dir="ltr"
      lang="en"
      className="inline-flex items-center gap-2 sm:gap-2.5 select-none shrink-0"
    >
      {/* Seamless GPU-composited dual-wave Nile current */}
      <span
        aria-hidden="true"
        className="relative flex flex-col justify-center gap-[3px] w-7 h-5 overflow-hidden shrink-0 [mask-image:linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)]"
      >
        <svg
          viewBox="0 0 56 10"
          className={`w-14 h-2.5 shrink-0 animate-river-flow ${waveTopColor}`}
          fill="none"
        >
          <path
            d="M0 5 Q7 0 14 5 T28 5 T42 5 T56 5"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 56 10"
          className={`w-14 h-2.5 shrink-0 animate-river-flow-slow ${waveBottomColor}`}
          fill="none"
        >
          <path
            d="M0 5 Q7 0 14 5 T28 5 T42 5 T56 5"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
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
        className={`flex items-center justify-center gap-3 sm:gap-4 group w-fit mx-auto max-w-full ${className}`.trim()}
      >
        <span
          aria-hidden="true"
          className={`hidden sm:block h-[2px] w-10 sm:w-14 rounded-full ${centerLeftWingClass}`}
        />
        {lockup}
        <span
          aria-hidden="true"
          className={`hidden sm:block h-[2px] w-10 sm:w-14 rounded-full ${centerRightWingClass}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 group w-fit max-w-full ${className}`.trim()}
    >
      {lockup}
      <span
        aria-hidden="true"
        className={`hidden sm:block h-[2px] w-12 min-[901px]:w-20 rounded-full transition-transform duration-300 ltr:origin-left rtl:origin-right group-hover:scale-x-110 motion-reduce:transform-none ${tailGradientClass}`}
      />
    </div>
  );
}
