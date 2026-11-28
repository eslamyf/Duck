import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater } from '@fortawesome/free-solid-svg-icons';
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
      className={`relative h-[36px] w-[76px] shrink-0 overflow-hidden rounded-full border border-brand-blue/20 bg-surface-mist2 shadow-soft outline-none transition-[border-color,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 cursor-pointer ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 grid grid-cols-2 text-xs font-bold">
        <span className="flex items-center justify-center ps-1 text-brand-navy/45">EN</span>
        <span className="flex items-center justify-center pe-1 text-brand-navy/45">AR</span>
      </span>

      <span
        aria-hidden="true"
        className={`absolute start-[1px] z-20 top-[3px] flex h-[28px] w-[34px] items-center justify-center rounded-full bg-brand-navy shadow-md transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isArabic ? 'translate-x-[40px]' : 'translate-x-0'
        }`}
      >
        <span className="absolute -inset-x-1 bottom-0 h-[4px] rounded-full bg-brand-blue/20 blur-[1px] motion-reduce:hidden" />
        <FontAwesomeIcon icon={faWater} className="relative text-[15px] text-brand-yellow" />
      </span>
    </button>
  );
}