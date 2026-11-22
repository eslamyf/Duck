import { useState, useId } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';

export default function TripBookingCard({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const dateInputId = useId();

  // Initial state matching Final_4.html
  const defaultGuests = Math.max(2, trip.min || 1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(isArabic ? 'صباحاً' : 'Morning');
  const [egyptianCount, setEgyptianCount] = useState(0);
  const [foreignerCount, setForeignerCount] = useState(defaultGuests);
  const [childrenCount, setChildrenCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  const formatNum = (num) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(num);

  // Today in YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  // Generate next 7 days
  const next7Days = Array.from({ length: 7 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() + k);
    const dateStr = d.toISOString().slice(0, 10);
    const isOff = trip.off && trip.off.includes(d.getDay());
    const dayLabel = k === 0
      ? t('tripDetails.today')
      : k === 1
        ? t('tripDetails.tomorrow')
        : d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { day: 'numeric' });
    const monthLabel = isOff
      ? t('tripDetails.closed')
      : d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short' });

    return {
      dateStr,
      dayLabel,
      dayNum,
      monthLabel,
      isOff,
    };
  });

  const timeSlots = [
    { id: 'sunrise', icon: '🌅', label: t('tripDetails.sunrise') },
    { id: 'morning', icon: '☀️', label: t('tripDetails.morning') },
    { id: 'afternoon', icon: '🌤️', label: t('tripDetails.afternoon') },
    { id: 'sunset', icon: '🌇', label: t('tripDetails.sunset') },
  ];

  // Steppers
  const handleCountChange = (type, delta) => {
    setErrorMessage('');
    if (type === 'egc') {
      const next = Math.max(0, Math.min(30, egyptianCount + delta));
      if (trip.act === 'waterbike' && next + foreignerCount > 2) {
        setErrorMessage(t('tripDetails.waterbikeMaxWarning'));
        return;
      }
      setEgyptianCount(next);
    } else if (type === 'foc') {
      const next = Math.max(0, Math.min(30, foreignerCount + delta));
      if (trip.act === 'waterbike' && egyptianCount + next > 2) {
        setErrorMessage(t('tripDetails.waterbikeMaxWarning'));
        return;
      }
      setForeignerCount(next);
    } else if (type === 'ch') {
      setChildrenCount((prev) => Math.max(0, Math.min(30, prev + delta)));
    }
  };

  // Total calculation
  const adultPriceEg = trip.priceEg || trip.price;
  const adultPriceFo = trip.price;
  const total = adultPriceEg * egyptianCount + adultPriceFo * foreignerCount;

  // Validation
  const validate = () => {
    const totalPeople = egyptianCount + foreignerCount + childrenCount;

    if (!selectedDate) {
      setErrorMessage(t('tripDetails.selectDateFirst'));
      return false;
    }

    if (selectedDate < today) {
      setErrorMessage(t('tripDetails.datePassed'));
      return false;
    }

    const d = new Date(selectedDate + 'T12:00:00');
    if (trip.off && trip.off.includes(d.getDay())) {
      const dayNames = isArabic
        ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      setErrorMessage(
        t('tripDetails.closedOnDay').replace('{day}', dayNames[d.getDay()])
      );
      return false;
    }

    if (egyptianCount === 0 && foreignerCount === 0) {
      setErrorMessage(t('tripDetails.selectTicketsFirst'));
      return false;
    }

    if (trip.act === 'waterbike' && egyptianCount + foreignerCount > 2) {
      setErrorMessage(t('tripDetails.waterbikeMaxWarning'));
      return false;
    }

    if (trip.min && totalPeople < trip.min) {
      setErrorMessage(
        t('tripDetails.minTripReq').replace(
          '{count}',
          isArabic && trip.min === 2 ? 'فردان' : `${trip.min} ${isArabic ? 'أفراد' : 'guests'}`
        )
      );
      return false;
    }

    if (trip.max && totalPeople > trip.max) {
      setErrorMessage(
        t('tripDetails.maxTripReq').replace('{count}', String(trip.max))
      );
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const tripTitle = t(`trips.items.${trip.key}.title`);
  const destinationName = t(`destinations.items.${trip.destKey}.name`);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const message = isArabic
      ? `مرحباً DUCK، أود حجز رحلة: ${tripTitle} (${destinationName})
- التاريخ: ${selectedDate}
- الميعاد: ${selectedTime}
- التذاكر (مصريين): ${egyptianCount}
- التذاكر (أجانب): ${foreignerCount}
- الأطفال: ${childrenCount}
- الإجمالي: ${formatPrice(total)} ${t('trips.currency')}`
      : `Hello DUCK, I would like to book the trip: ${tripTitle} (${destinationName})
- Date: ${selectedDate}
- Time: ${selectedTime}
- Egyptians: ${egyptianCount}
- Foreigners: ${foreignerCount}
- Children: ${childrenCount}
- Total: ${formatPrice(total)} ${t('trips.currency')}`;

    const whatsappUrl = buildWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const generalInquiryMessage = isArabic
    ? `أهلاً، عايز أسأل عن رحلة: ${tripTitle}`
    : `Hello, I have a question about the trip: ${tripTitle}`;
  const inquiryUrl = buildWhatsAppUrl(generalInquiryMessage);

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
            t('tripDetails.chooseDateAndCount')
          )}
        </p>
      </div>

      <div className="dqb">
        {/* Dual pricing pill */}
        {trip.price && (
          <>
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
          </>
        )}

        {/* 7 Days selector */}
        <span className="lb">{t('tripDetails.selectDay')}</span>
        <div className="dts" role="group" aria-label={t('tripDetails.selectDay')}>
          {next7Days.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                className="dcd"
                disabled={item.isOff}
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedDate(item.dateStr);
                  setErrorMessage('');
                }}
              >
                <span>{item.dayLabel}</span>
                <b>{item.dayNum}</b>
                <span>{item.monthLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Custom date picker */}
        <label htmlFor={dateInputId} className="lb">
          {t('tripDetails.orChooseDate')}
        </label>
        <input
          type="date"
          id={dateInputId}
          min={today}
          value={selectedDate}
          aria-invalid={Boolean(errorMessage && !selectedDate)}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setErrorMessage('');
          }}
        />

        {/* Time slots */}
        <span className="lb">{t('tripDetails.timeSlot')}</span>
        <div className="dtm" role="group" aria-label={t('tripDetails.timeSlot')}>
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.label;
            return (
              <button
                key={slot.id}
                type="button"
                className="cp"
                aria-pressed={isSelected}
                onClick={() => setSelectedTime(slot.label)}
              >
                <span>{slot.icon}</span>
                <span>{slot.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stepper: Egyptians */}
        <div className="stp-row">
          <div>
            <b>{t('tripDetails.egyptians')}</b>
            <small>{t('tripDetails.citizenPrice')}</small>
          </div>
          <div className="stp">
            <button
              type="button"
              disabled={egyptianCount <= 0}
              onClick={() => handleCountChange('egc', -1)}
              aria-label={t('tripDetails.decrease')}
            >
              −
            </button>
            <b id="dqe">{formatNum(egyptianCount)}</b>
            <button
              type="button"
              onClick={() => handleCountChange('egc', 1)}
              aria-label={t('tripDetails.increase')}
            >
              +
            </button>
          </div>
        </div>

        {/* Stepper: Foreigners */}
        <div className="stp-row">
          <div>
            <b>{t('tripDetails.foreigners')}</b>
            <small>{t('tripDetails.visitorPrice')}</small>
          </div>
          <div className="stp">
            <button
              type="button"
              disabled={foreignerCount <= 0}
              onClick={() => handleCountChange('foc', -1)}
              aria-label={t('tripDetails.decrease')}
            >
              −
            </button>
            <b id="dqn">{formatNum(foreignerCount)}</b>
            <button
              type="button"
              onClick={() => handleCountChange('foc', 1)}
              aria-label={t('tripDetails.increase')}
            >
              +
            </button>
          </div>
        </div>

        {/* Stepper: Children */}
        <div className="stp-row">
          <div>
            <b>{t('tripDetails.children')}</b>
            <small>{t('tripDetails.childrenPolicy')}</small>
          </div>
          <div className="stp">
            <button
              type="button"
              disabled={childrenCount <= 0}
              onClick={() => handleCountChange('ch', -1)}
              aria-label={t('tripDetails.decrease')}
            >
              −
            </button>
            <b id="dqc">{formatNum(childrenCount)}</b>
            <button
              type="button"
              onClick={() => handleCountChange('ch', 1)}
              aria-label={t('tripDetails.increase')}
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="dtot">
          <span>{t('tripDetails.total')}</span>
          <b id="dqt">
            {total > 0 ? `${formatPrice(total)} ${t('trips.currency')}` : '—'}
          </b>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="err" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Next / Book CTA */}
        <button
          type="button"
          onClick={handleBooking}
          className="w-full mt-4 min-h-[50px] rounded-full bg-brand-yellow text-brand-navy font-bold text-base border-2 border-brand-navy cursor-pointer transition-all hover:bg-brand-navy hover:text-white active:scale-98"
        >
          {t('tripDetails.nextBtn')}
        </button>

        {/* Free Cancellation Note */}
        <p className="dfc">{t('tripDetails.freeCancelFullRefund')}</p>

        {/* WhatsApp Questions Link */}
        <a
          className="dwa"
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
