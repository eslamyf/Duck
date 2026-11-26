import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faWater } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { TRIPS, ACTIVITIES } from '../trips/tripsData.js';
import { ROUTES } from '../../shared/config/routes.js';

export default function TripRelatedTrips({ currentTrip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  // Filter out current trip and sort same destination first
  const related = TRIPS.filter((item) => item.id !== currentTrip.id)
    .sort((a, b) => (b.loc === currentTrip.loc) - (a.loc === currentTrip.loc))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="ds">
      <h2>{t('tripDetails.relatedTrips')}</h2>
      <div className="space-y-2.5">
        {related.map((trip) => {
          const destName = t(`destinations.items.${trip.destKey}.name`);
          const actName = t(`trips.activities.${trip.act}`);
          const actIcon = ACTIVITIES[trip.act]?.faIcon || faWater;
          const title = t(`trips.items.${trip.key}.title`);

          return (
            <Link
              key={trip.id}
              to={ROUTES.tripDetails(trip.slug)}
              className="drl"
            >
              <div className="zt">
                <img
                  src={trip.images.thumb || trip.images.medium}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="zx">
                <b>{title}</b>
                <small className="inline-flex items-center gap-1.5 flex-wrap">
                  <FontAwesomeIcon icon={actIcon} className="text-brand-blue text-[11px]" aria-hidden="true" />
                  <span>{actName}</span>
                  <span>·</span>
                  <FontAwesomeIcon icon={faLocationDot} className="text-brand-blue text-[11px]" aria-hidden="true" />
                  <span>{destName}</span>
                </small>
              </div>

              <span className="zp">
                {trip.price ? `${formatPrice(trip.price)} ${t('trips.currency')}` : t('trips.currency')}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
