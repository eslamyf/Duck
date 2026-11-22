import { useTranslation } from '../../shared/i18n/index.js';

export default function TripWhyBookWithUs() {
  const { t } = useTranslation();

  return (
    <div className="ds">
      <h2>{t('tripDetails.whyBookWithUs')}</h2>
      <ul className="ck2">
        <li>{t('tripDetails.whyFact1')}</li>
        <li>{t('tripDetails.whyFact2')}</li>
        <li>{t('tripDetails.whyFact3')}</li>
      </ul>
    </div>
  );
}
