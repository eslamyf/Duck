import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faClock,
  faUsers,
  faSailboat,
  faWater,
  faBicycle,
  faCompass,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 transition-colors hover:border-brand-yellow/25">
      <div className="text-brand-yellow text-xl w-6 flex justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/55 mb-0.5 font-medium truncate">
          {label}
        </p>
        <p className="font-bold text-white text-base md:text-lg truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TripInfoGrid({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const destination = t(`destinations.items.${trip.destKey}.name`);
  const duration = t(`trips.durations.${trip.durKey}`);
  const activityTitle = t(`trips.activities.${trip.act}`);

  const activityIcons = {
    kayak: faSailboat,
    sup: faWater,
    waterbike: faBicycle,
  };
  const ActivityIcon = activityIcons[trip.act] || faCompass;

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-7 bg-brand-yellow rounded-full shrink-0" />
          <h2 className="text-2xl font-bold text-white">
            {t('tripDetails.aboutTrip')}
          </h2>
        </div>
        <p className="text-white/75 text-base md:text-lg leading-relaxed">
          {t(`trips.items.${trip.key}.desc`)}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-7 bg-brand-yellow rounded-full shrink-0" />
          <h2 className="text-2xl font-bold text-white">
            {t('tripDetails.tripInfo')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <InfoCard
            icon={<FontAwesomeIcon icon={faLocationDot} />}
            label={t('tripDetails.destination')}
            value={destination}
          />
          <InfoCard
            icon={<FontAwesomeIcon icon={ActivityIcon} />}
            label={t('tripDetails.activity')}
            value={activityTitle}
          />
          <InfoCard
            icon={<FontAwesomeIcon icon={faClock} />}
            label={t('tripDetails.duration')}
            value={duration}
          />
          <InfoCard
            icon={<FontAwesomeIcon icon={faUsers} />}
            label={t('tripDetails.operator')}
            value={trip.op}
          />
          {trip.min && (
            <InfoCard
              icon={<FontAwesomeIcon icon={faUsers} />}
              label={t('tripDetails.minParticipants')}
              value={formatPrice(trip.min)}
            />
          )}
          {trip.max && (
            <InfoCard
              icon={<FontAwesomeIcon icon={faUsers} />}
              label={t('tripDetails.maxParticipants')}
              value={formatPrice(trip.max)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
