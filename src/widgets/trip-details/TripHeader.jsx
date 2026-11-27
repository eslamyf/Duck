import { useTranslation } from '../../shared/i18n/index.js';
import { ACTIVITIES } from '../trips/tripsData.js';
import { DuckIcon } from '../../shared/ui/index.js';

export default function TripHeader({ trip }) {
  const { t } = useTranslation();

  const destinationName = t(`destinations.items.${trip.destKey}.name`);
  const tripTitle = t(`trips.items.${trip.key}.title`);
  const activityName = t(`trips.activities.${trip.act}`);
  const actIcon = ACTIVITIES[trip.act]?.faIcon || 'faWater';

  return (
    <header className="dh1">
      <h1>
        {tripTitle}{' '}
        <span className="text-brand-blue text-[0.75em] font-bold">
          {t('tripDetails.titleSuffix')}
        </span>
      </h1>
      <p className="dsub">
        <span className="inline-flex items-center gap-1.5">
          <DuckIcon icon={actIcon} className="text-brand-blue" aria-hidden="true" />
          <span>{activityName}</span>
        </span>
        {' · '}
        <span className="inline-flex items-center gap-1.5">
          <DuckIcon icon="faLocationDot" className="text-brand-blue" aria-hidden="true" />
          <span>{destinationName}</span>
        </span>
        {' · '}
        <span>{t('tripDetails.operator')}: <b>{trip.op || 'Duck Entertainment'}</b></span>
      </p>
    </header>
  );
}
