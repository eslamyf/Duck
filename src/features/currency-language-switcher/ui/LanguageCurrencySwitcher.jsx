import kayakThumb from '../../../shared/assets/icons/kayak-language-thumb.svg';
import { useTranslation } from '../../../shared/i18n/index.js';

export default function KayakLanguageSwitch({ className = '' }) {
  const { lang, setLanguage, t } = useTranslation();
  const isArabic = lang === 'ar';
  const nextLanguage = isArabic ? 'en' : 'ar';
  const ariaLabel = t(isArabic ? 'common.switchToEnglish' : 'common.switchToArabic');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isArabic}
      aria-label={ariaLabel}
      dir="ltr"
      onClick={() => setLanguage(nextLanguage)}
      className={`relative h-[38px] w-[92px] shrink-0 overflow-hidden rounded-full border border-brand-blue/20 bg-surface-mist2 shadow-soft outline-none transition-[border-color,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-brand-blue/15"
      />
      <span
        aria-hidden="true"
        className={`absolute z-10 start-[6px] top-1/2 -translate-y-1/2 text-[10px] font-black tracking-wide transition-opacity duration-300 ${
          isArabic ? 'text-brand-navy/45' : 'text-brand-navy'
        }`}
      >
        AR
      </span>
      <span
        aria-hidden="true"
        className={`absolute z-10 end-[6px] top-1/2 -translate-y-1/2 text-[10px] font-black tracking-wide transition-opacity duration-300 ${
          isArabic ? 'text-brand-navy' : 'text-brand-navy/45'
        }`}
      >
        EN
      </span>

      <span
        aria-hidden="true"
        className={`absolute start-[2px] z-20 top-[2px] h-[32px] w-[34px] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isArabic ? 'translate-x-[54px]' : 'translate-x-0'
        }`}
      >
        <span className="absolute -inset-x-2 top-[23px] h-[5px] rounded-full bg-brand-blue/20 blur-[1px] motion-reduce:hidden" />
        <img
          src={kayakThumb}
          alt=""
          width="34"
          height="34"
          decoding="async"
          className="h-[34px] w-[34px] object-contain drop-shadow-md"
        />
      </span>
    </button>
  );
}