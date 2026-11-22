import { useTranslation } from '../../shared/i18n/index.js';
import { ACTIVITIES } from '../trips/tripsData.js';

export default function TripHeader({ trip }) {
  const { t } = useTranslation();

  const destinationName = t(`destinations.items.${trip.destKey}.name`);
  const tripTitle = t(`trips.items.${trip.key}.title`);
  const activityName = t(`trips.activities.${trip.act}`);
  const activityIcon = ACTIVITIES[trip.act]?.icon || '🛶';

  return (
    <header className="dh1">
      <h1>{tripTitle}</h1>
      <p className="dsub">
        <span>{activityIcon} {activityName}</span>
        {' · '}
        <span>📍 {destinationName}</span>
        {' · '}
        <span>{t('tripDetails.operator')}: <b>{trip.op || 'Duck Entertainment'}</b></span>
      </p>
    </header>
  );
}
