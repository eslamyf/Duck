import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../shared/ui/index.js';
import { SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripNotFound() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-[calc(100svh-100px)] bg-brand-navy flex items-center justify-center px-6 py-20 font-body text-white"
      aria-label="Trip Not Found"
    >
      <div className="text-center max-w-md mx-auto">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-5xl text-brand-yellow mb-5"
        />

        <h1 className="text-3xl font-bold text-white mb-3">
          {t('tripDetails.notFoundTitle')}
        </h1>

        <p className="text-white/75 text-base mb-8 leading-relaxed">
          {t('tripDetails.notFoundDesc')}
        </p>

        <Button
          as={Link}
          to={sectionLink(SECTIONS.TRIPS)}
          variant="primary"
          size="md"
          className="font-bold px-8 shadow-md"
        >
          {t('tripDetails.notFoundButton')}
        </Button>
      </div>
    </section>
  );
}
