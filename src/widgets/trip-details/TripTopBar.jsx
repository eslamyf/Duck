import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';

export default function TripTopBar({ trip, onShare }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const destinationName = t(`destinations.items.${trip.destKey}.name`);
  const BackIcon = isArabic ? faArrowRight : faArrowLeft;

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.HOME + '#trips');
    }
  };

  return (
    <div className="dtop">
      <a
        className="dback"
        href="#trips"
        onClick={handleBack}
        aria-label={t('tripDetails.allTrips')}
      >
        <FontAwesomeIcon icon={BackIcon} className="text-sm" />
        <span>{t('tripDetails.allTrips')}</span>
      </a>

      <nav className="bc" aria-label="مسار الصفحة">
        <Link to="/#top">{t('tripDetails.breadcrumbHome')}</Link>
        <span aria-hidden="true">›</span>
        <Link to="/#trips">{t('tripDetails.breadcrumbTrips')}</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/#trips?dest=${trip.destKey}`}>{destinationName}</Link>
      </nav>

      <button
        type="button"
        className="dsh"
        onClick={onShare}
        aria-label={t('tripDetails.share')}
      >
        <FontAwesomeIcon icon={faShareNodes} className="text-sm" />
        <span>{t('tripDetails.share')}</span>
      </button>
    </div>
  );
}
