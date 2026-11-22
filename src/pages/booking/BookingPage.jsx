import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { ROUTES } from '../../shared/config/routes.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const tripSlug = searchParams.get('trip');
  const trip = TRIPS.find((item) => item.slug === tripSlug);

  const tripTitle = trip ? t(`trips.items.${trip.key}.title`) : '';
  const waMessage = trip
    ? (isArabic
        ? `مرحباً DUCK، أود حجز رحلة: ${tripTitle}`
        : `Hello DUCK, I would like to book the trip: ${tripTitle}`)
    : (isArabic
        ? 'مرحباً DUCK، أود الاستفسار عن حجز رحلة'
        : 'Hello DUCK, I would like to inquire about booking a trip');
  const waUrl = buildWhatsAppUrl(waMessage);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-[70vh] flex items-center justify-center p-6 bg-surface-sand"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-md border border-[rgba(20,125,159,0.18)] text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-yellow/30 flex items-center justify-center text-3xl">
          🛶
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-brand-navy mb-2">
          {isArabic ? 'صفحة الحجز' : 'Booking Page'}
        </h1>
        {trip && (
          <p className="text-base font-bold text-brand-blue mb-2">
            {tripTitle}
          </p>
        )}
        <p className="text-sm text-brand-navy/65 mb-6 leading-relaxed">
          {isArabic
            ? 'سيتم إطلاق نظام الحجز الإلكتروني قريباً. للحجز والاستفسار الفوري تواصل معنا عبر واتساب.'
            : 'Online booking is launching soon. For immediate bookings and inquiries, contact us on WhatsApp.'}
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-yellow text-brand-navy font-bold text-sm shadow hover:bg-brand-navy hover:text-white transition-colors"
          >
            {isArabic ? 'الحجز عبر واتساب ↗' : 'Book via WhatsApp ↗'}
          </a>

          {trip ? (
            <Link
              to={ROUTES.tripDetails(trip.slug)}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-brand-navy/20 text-brand-navy font-semibold text-sm hover:bg-surface-mist transition-colors"
            >
              {isArabic ? 'العودة لتفاصيل الرحلة' : 'Back to Trip Details'}
            </Link>
          ) : (
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-brand-navy/20 text-brand-navy font-semibold text-sm hover:bg-surface-mist transition-colors"
            >
              {isArabic ? 'الرئيسية' : 'Home'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
