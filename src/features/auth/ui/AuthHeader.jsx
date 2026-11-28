import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';
import { ROUTES } from '../../../shared/config/routes.js';
import duckLogo from '../../../shared/assets/icons/duck-logo-280w.webp';
import { KayakLanguageSwitch } from '../../currency-language-switcher/index.js';

export default function AuthHeader() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <header className="w-full mb-2.5 sm:mb-3">
      {/* Top Action Bar: Back to Home & Language Switcher */}
      <div className="flex items-center justify-between gap-3">
        {/* Back to Home Link */}
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-mist hover:bg-brand-navy/10 text-brand-navy/80 hover:text-brand-navy border border-brand-navy/10 text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue group cursor-pointer"
        >
          <FontAwesomeIcon
            icon={isArabic ? faArrowRight : faArrowLeft}
            className="text-xs text-brand-blue group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
          />
          <span>{t('auth.common.backToHome')}</span>
        </Link>

        <KayakLanguageSwitch />
      </div>

      {/* Mobile Branding: Duck Official Logo & Tagline Badge (lg:hidden) */}
      <div className="lg:hidden text-center mt-5 mb-2">
        <Link
          to={ROUTES.HOME}
          className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-xl mb-1.5"
        >
          <img
            src={duckLogo}
            alt={t('common.brandName')}
            className="h-9 w-auto object-contain mx-auto"
          />
        </Link>
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-brand-yellow/30 text-brand-navy font-black text-[11px] sm:text-xs tracking-wider">
            {t('auth.common.inDuckWeTrust')}
          </span>
        </div>
      </div>
    </header>
  );
}
