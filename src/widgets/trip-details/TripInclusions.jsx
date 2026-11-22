import { useTranslation } from '../../shared/i18n/index.js';

export default function TripInclusions({ inclusionsKeys = [] }) {
  const { t } = useTranslation();

  return (
    <div className="ds dix">
      <div>
        <h3>{t('tripDetails.includes')}</h3>
        <ul className="ck2">
          {inclusionsKeys.map((key) => (
            <li key={key}>{t(`trips.inclusions.${key}`)}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>{t('tripDetails.excludes')}</h3>
        <ul className="ck2 no">
          <li>{t('tripDetails.excludesItem')}</li>
        </ul>
      </div>
    </div>
  );
}
