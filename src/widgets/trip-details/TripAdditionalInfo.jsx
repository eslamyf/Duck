import { useTranslation } from '../../shared/i18n/index.js';

export default function TripAdditionalInfo({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const dayNames = isArabic
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const offDaysText = trip.off && trip.off.length > 0
    ? trip.off.map((d) => dayNames[d]).join(' و ')
    : null;

  return (
    <div className="ds">
      <h2>{t('tripDetails.additionalInfo')}</h2>
      <ul className="dinfo">
        <li>{t('tripDetails.maxWeight')}</li>
        <li>{t('tripDetails.childrenAccompanied')}</li>
        <li>{t('tripDetails.clothingAdvice')}</li>
        <li>{t('tripDetails.phoneAdvice')}</li>

        {trip.min && (
          <li>
            {t('tripDetails.minLimit').replace(
              '{count}',
              isArabic && trip.min === 2 ? 'فردان' : `${trip.min} ${isArabic ? 'أفراد' : 'guests'}`
            )}
          </li>
        )}

        {trip.max && (
          <li>
            {t('tripDetails.maxLimit').replace('{count}', String(trip.max))}
          </li>
        )}

        {offDaysText && (
          <li>
            {t('tripDetails.closedOn').replace('{day}', offDaysText)}
          </li>
        )}
      </ul>
    </div>
  );
}
