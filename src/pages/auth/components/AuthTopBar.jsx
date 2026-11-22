import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';
import { ROUTES } from '../../../shared/config/routes.js';
import { Button } from '../../../shared/ui/index.js';
import duckLogo from '../../../shared/assets/icons/Artboard 14.png';

export default function AuthTopBar() {
  const { lang, setLanguage, t } = useTranslation();
  const isArabic = lang === 'ar';

  const toggleLanguage = () => {
    setLanguage(isArabic ? 'en' : 'ar');
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-navy/10 w-full">
      {/* Back to Home Link */}
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 text-xs min-[901px]:text-sm font-bold text-brand-navy/70 hover:text-brand-blue transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg px-2 py-1 -ms-2"
      >
        <FontAwesomeIcon
          icon={isArabic ? faArrowRight : faArrowLeft}
          className="text-xs transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
        />
        <span>{t('auth.common.backToHome')}</span>
      </Link>

      {/* Mobile Center Logo */}
      <div className="lg:hidden">
        <Link to={ROUTES.HOME} className="block focus:outline-none">
          <img
            src={duckLogo}
            alt={t('common.brandName')}
            className="h-7 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Language Switcher */}
      <Button
        type="button"
        variant="subtle"
        size="xs"
        icon={<FontAwesomeIcon icon={faLanguage} className="text-xs" />}
        onClick={toggleLanguage}
        className="text-xs font-bold px-3 py-1 bg-surface-mist hover:bg-brand-navy hover:text-brand-yellow border-brand-navy/15 transition-all"
        aria-label="Switch Language"
      >
        {isArabic ? 'English' : 'عربي'}
      </Button>
    </div>
  );
}
