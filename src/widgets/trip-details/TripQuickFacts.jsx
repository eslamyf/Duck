import { useTranslation } from '../../shared/i18n/index.js';

export default function TripQuickFacts({ trip }) {
  const { t } = useTranslation();
  const duration = t(`trips.durations.${trip.durKey}`);

  return (
    <div className="ds">
      <ul className="qf">
        <li>
          <i aria-hidden="true">⏱</i>
          <div>
            <small>{t('tripDetails.duration')}</small>
            <b>{duration || t('trips.durations.asPackage')}</b>
          </div>
        </li>
        <li>
          <i aria-hidden="true">🤝</i>
          <div>
            <small>{t('tripDetails.operator')}</small>
            <b>{trip.op || 'Duck Entertainment'}</b>
          </div>
        </li>
      </ul>
    </div>
  );
}
