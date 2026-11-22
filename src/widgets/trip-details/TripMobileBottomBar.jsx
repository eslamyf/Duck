import { useEffect, useState } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripMobileBottomBar({ trip, targetId = 'dq' }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const [isVisible, setIsVisible] = useState(true);

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  useEffect(() => {
    const targetEl = document.getElementById(targetId);
    if (!targetEl || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          // If the booking card is visible in viewport, hide mobile bottom bar
          setIsVisible(!entries[0].isIntersecting);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(targetEl);
    return () => observer.disconnect();
  }, [targetId]);

  const handleScrollToBooking = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`dbar ${isVisible ? '' : 'off'}`} id="dbar">
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
        onClick={handleScrollToBooking}
        className="btn min-h-[44px] px-6 rounded-full bg-brand-yellow text-brand-navy font-bold text-sm border-2 border-brand-navy shadow-md cursor-pointer hover:bg-brand-navy hover:text-white transition-colors"
      >
        {t('tripDetails.bookTripBtn')}
      </button>
    </div>
  );
}
