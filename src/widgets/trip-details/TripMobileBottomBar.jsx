import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';

export default function TripMobileBottomBar({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  const handleBookNow = () => {
    navigate(ROUTES.booking(trip.slug));
  };

  return (
    <div className="dbar" id="dbar">
      <div>
        <small>{trip.price ? t('tripDetails.startingFrom') : t('tripDetails.tripPrice')}</small>
        <b>
          {trip.price
            ? `${formatPrice(trip.price)} ${t('trips.currency')}`
            : t('tripDetails.bookNow')}
        </b>
      </div>

      <button
        type="button"
        onClick={handleBookNow}
        className="btn min-h-[44px] px-6 rounded-full bg-brand-yellow text-brand-navy font-bold text-sm border-2 border-brand-navy shadow-md cursor-pointer hover:bg-brand-navy hover:text-white transition-colors"
      >
        {t('tripDetails.bookNow')}
      </button>
    </div>
  );
}
