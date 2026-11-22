import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';

export default function TripBookingCard({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  const tripTitle = t(`trips.items.${trip.key}.title`);
  const generalInquiryMessage = isArabic
    ? `أهلاً، عايز أسأل عن رحلة: ${tripTitle}`
    : `Hello, I have a question about the trip: ${tripTitle}`;
  const inquiryUrl = buildWhatsAppUrl(generalInquiryMessage);

  const handleBookNow = () => {
    navigate(ROUTES.booking(trip.slug));
  };

  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;

  return (
    <aside className="dq" id="dq" aria-label={t('tripDetails.ticketsAndPrices')}>
      {/* Header */}
      <div className="dqh">
        <h2>{t('tripDetails.ticketsAndPrices')}</h2>
        <p>
          {trip.price ? (
            <>
              {t('tripDetails.startingFrom')}{' '}
              <b>{formatPrice(trip.price)} {t('trips.currency')}</b>{' '}
              {trip.isHourly ? t('tripDetails.pricePerHour') : t('tripDetails.perPerson')}
            </>
          ) : (
            t('tripDetails.bookNow')
          )}
        </p>
      </div>

      <div className="dqb">
        {/* Dual pricing pill */}
        {trip.price && (
          <div className="mb-4">
            <span className="lb">{t('tripDetails.pricesBothNationalities')}</span>
            <div className="zk">
              <span className="zkf">
                <small>{t('tripDetails.foreigner')}</small>
                <b>{formatPrice(trip.price)} {t('trips.currency')}</b>
              </span>
              {trip.priceEg && (
                <span className="zke">
                  <small>{t('tripDetails.egyptian')}</small>
                  <b>{formatPrice(trip.priceEg)} {t('trips.currency')}</b>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Benefits List */}
        <ul className="ck2 mt-3 mb-5">
          <li>{t('tripDetails.freeCancelFullRefund')}</li>
          <li>{t('tripDetails.lifeJacketIncluded')}</li>
          <li>{t('tripDetails.whyFact1')}</li>
        </ul>

        {/* Book Now Button */}
        <button
          type="button"
          onClick={handleBookNow}
          className="w-full min-h-[52px] rounded-full bg-brand-yellow text-brand-navy font-extrabold text-base border-2 border-brand-navy cursor-pointer transition-all hover:bg-brand-navy hover:text-white active:scale-98 shadow-md flex items-center justify-center gap-2.5"
        >
          <span>{t('tripDetails.bookNow')}</span>
          <FontAwesomeIcon icon={ArrowIcon} className="text-sm" />
        </button>

        {/* WhatsApp Questions Link */}
        <a
          className="dwa mt-3"
          href={inquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('tripDetails.haveQuestionWhatsApp')}
        </a>
      </div>
    </aside>
  );
}
