import { useState } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripAbout({ trip }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const description = t(`trips.items.${trip.key}.desc`);
  const isLong = description && description.length > 180;

  return (
    <div className="ds">
      <h2>{t('tripDetails.aboutTrip')}</h2>
      <p className={`dtx ${isLong && !isExpanded ? 'cl' : ''}`} id="ddesc">
        {description}
      </p>
      {isLong && (
        <button
          type="button"
          className="dmore"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? t('tripDetails.showLess') : t('tripDetails.readMore')}
        </button>
      )}
    </div>
  );
}
