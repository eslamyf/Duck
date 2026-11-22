import { useTranslation } from '../../shared/i18n/index.js';
import { MAP_PINS } from '../map/mapData.js';

export default function TripMeetingPoint({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const pin = MAP_PINS.find((p) => p.destId === trip.loc) || MAP_PINS[0];
  const meetingText = isArabic ? pin.meetingPointAr : pin.meetingPointEn;
  const mapsUrl = pin.googleMapsUrl;
  const lat = pin.flyLat || pin.lat;
  const lng = pin.flyLng || pin.lng;

  return (
    <div className="ds">
      <h2>{t('tripDetails.meetingPoint')}</h2>
      <div className={`dloc ${lat && lng ? '' : 'nomap'}`}>
        {lat && lng && (
          <iframe
            loading="lazy"
            title={t('tripDetails.meetingPoint')}
            src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
        <div className="dlt">
          <p>{meetingText}</p>
          <a
            className="dback font-bold"
            style={{ minHeight: '44px', textDecoration: 'none' }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('tripDetails.openInMaps')} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
