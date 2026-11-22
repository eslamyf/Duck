import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faShareNodes,
  faHouse,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';

export default function TripTopBar({ trip, onShare }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const destinationName = t(`destinations.items.${trip.destKey}.name`);
  const tripTitle = t(`trips.items.${trip.key}.title`);
  const BackIcon = isArabic ? faArrowRight : faArrowLeft;
  const ChevronIcon = isArabic ? faChevronLeft : faChevronRight;

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
      <div className="dtop-inner">
        <div className="dtop-nav-group">
          <a
            className="dback group"
            href="#trips"
            onClick={handleBack}
            aria-label={t('tripDetails.allTrips')}
          >
            <FontAwesomeIcon
              icon={BackIcon}
              className="text-xs transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
            />
            <span>{t('tripDetails.allTrips')}</span>
          </a>

          <span className="dtop-divider" aria-hidden="true" />

          <nav className="bc" aria-label="مسار الصفحة">
            <Link to="/#top" className="bc-item">
              <FontAwesomeIcon icon={faHouse} className="text-[11px] opacity-70" />
              <span>{t('tripDetails.breadcrumbHome')}</span>
            </Link>
            <FontAwesomeIcon icon={ChevronIcon} className="bc-sep" aria-hidden="true" />
            <Link to="/#trips" className="bc-item">
              {t('tripDetails.breadcrumbTrips')}
            </Link>
            <FontAwesomeIcon icon={ChevronIcon} className="bc-sep" aria-hidden="true" />
            <Link to={`/#trips?dest=${trip.destKey}`} className="bc-item">
              {destinationName}
            </Link>
            <FontAwesomeIcon icon={ChevronIcon} className="bc-sep" aria-hidden="true" />
            <span className="bc-current" title={tripTitle}>
              {tripTitle}
            </span>
          </nav>
        </div>

        <button
          type="button"
          className="dsh group"
          onClick={onShare}
          aria-label={t('tripDetails.share')}
        >
          <FontAwesomeIcon
            icon={faShareNodes}
            className="text-xs transition-transform duration-200 group-hover:scale-110"
          />
          <span>{t('tripDetails.share')}</span>
        </button>
      </div>
    </div>
  );
}
