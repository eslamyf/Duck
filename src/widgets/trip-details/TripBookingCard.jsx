import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Card, Button } from '../../shared/ui/index.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripBookingCard({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const destination = t(`destinations.items.${trip.destKey}.name`);
  const tripTitle = t(`trips.items.${trip.key}.title`);
  const duration = t(`trips.durations.${trip.durKey}`);

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  const prefilledMessage = isArabic
    ? `مرحباً DUCK، أود حجز رحلة: ${tripTitle} (${destination} - السعر: ${formatPrice(trip.price)} ${t('trips.currency')})`
    : `Hello DUCK, I would like to book the trip: ${tripTitle} (${destination} - Price: ${formatPrice(trip.price)} ${t('trips.currency')})`;

  const whatsappBookingUrl = buildWhatsAppUrl(prefilledMessage);

  return (
    <aside className="w-full">
      <Card
        variant="default"
        padding="lg"
        className="lg:sticky lg:top-28 bg-white text-brand-navy shadow-xl border border-[rgba(20,125,159,0.18)] rounded-3xl"
      >
        <span className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider block mb-1">
          {t('tripDetails.tripPrice')}
        </span>

        <div className="mb-6">
          <p className="text-4xl font-extrabold text-brand-navy leading-none">
            {formatPrice(trip.price)}
            <span className="text-base font-semibold ms-2 text-brand-navy/75">
              {t('trips.currency')}
            </span>
          </p>

          {trip.priceEg !== null && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-mist border border-[rgba(20,125,159,0.2)]">
              <span className="text-xs font-semibold text-brand-navy/70">
                {t('tripDetails.egyptianPrice')}
              </span>
              <span className="text-sm font-bold text-brand-blue">
                {formatPrice(trip.priceEg)} {t('trips.currency')}
              </span>
            </div>
          )}

          {trip.isHourly && (
            <p className="text-xs text-brand-navy/60 mt-2 font-medium">
              {t('tripDetails.pricePerHour')}
            </p>
          )}
        </div>

        <div className="border-t border-brand-navy/10 pt-5 mb-6 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-brand-navy/65 font-medium">
              {t('tripDetails.duration')}
            </span>
            <span className="font-bold text-brand-navy">
              {duration}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-brand-navy/65 font-medium">
              {t('tripDetails.location')}
            </span>
            <span className="font-bold text-brand-navy">
              {destination}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-brand-navy/65 font-medium">
              {t('tripDetails.operator')}
            </span>
            <span className="font-bold text-brand-navy">
              {trip.op}
            </span>
          </div>
        </div>

        <Button
          as="a"
          href={whatsappBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          fullWidth
          icon={<FontAwesomeIcon icon={faWhatsapp} className="text-xl" />}
          className="font-bold shadow-lg"
        >
          {t('tripDetails.bookViaWhatsApp')}
        </Button>

        <div className="mt-6 pt-5 border-t border-brand-navy/10 space-y-2.5 text-xs text-brand-navy/70">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-brand-blue shrink-0 text-sm" />
            <span>{t('tripDetails.freeCancellation')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleCheck} className="text-brand-blue shrink-0 text-sm" />
            <span>{t('tripDetails.lifeJacketIncluded')}</span>
          </div>
        </div>
      </Card>
    </aside>
  );
}
