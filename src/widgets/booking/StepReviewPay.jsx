import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTag,
  faArrowLeft,
  faArrowRight,
  faMoneyBillWave,
  faClock,
  faCalendarCheck,
  faUsers,
  faSailboat,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../shared/ui/index.js';

// Approved promo codes
const PROMO_CODES = {
  DUCK10: { type: 'percent', value: 10, label: 'خصم 10%' },
  DUCK2026: { type: 'percent', value: 15, label: 'خصم 15%' },
  WELCOME: { type: 'fixed', value: 50, label: 'خصم 50 ج.م' },
};

export default function StepReviewPay({
  bookingData,
  updateBookingData,
  selectedTrip,
  onNext,
  onBack,
  t,
  lang,
}) {
  const isArabic = lang === 'ar';
  const ArrowNext = isArabic ? faArrowLeft : faArrowRight;
  const ArrowBack = isArabic ? faArrowRight : faArrowLeft;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const formatPrice = (p) =>
    Number(p).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  // Format time label for display
  const formatTimeSlot = (slot) => {
    if (!slot) return '';
    const [hStr, mStr] = slot.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr;
    const isPm = h >= 12;
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return isArabic ? `${h}:${m} ${isPm ? 'م' : 'ص'}` : `${h}:${m} ${isPm ? 'PM' : 'AM'}`;
  };

  // 1. Base price calculations
  const totalGuests =
    (bookingData.adults || 1) + (bookingData.kids1to6 || 0) + (bookingData.kids7to12 || 0);

  const durationHours = bookingData.duration || 1;
  const isHourly = Boolean(selectedTrip?.isHourly);

  const egRate = selectedTrip?.priceEg || selectedTrip?.price || 500;
  const foRate = selectedTrip?.price || 800;

  let rawSubtotal = 0;
  if (bookingData.nationality === 'all_foreign') {
    rawSubtotal = totalGuests * foRate;
  } else if (bookingData.nationality === 'mixed') {
    const egCount = bookingData.egyptianCount || 0;
    const foCount = bookingData.foreignCount || 0;
    rawSubtotal = egCount * egRate + foCount * foRate;
  } else {
    // all_egyptian
    rawSubtotal = totalGuests * egRate;
  }

  // Multiply by duration if hourly
  if (isHourly) {
    rawSubtotal *= durationHours;
  }

  // 2. Discount calculation
  let discountAmount = 0;
  if (bookingData.appliedPromo) {
    const code = PROMO_CODES[bookingData.appliedPromo];
    if (code) {
      if (code.type === 'percent') {
        discountAmount = Math.round(rawSubtotal * (code.value / 100));
      } else if (code.type === 'fixed') {
        discountAmount = Math.min(rawSubtotal, code.value);
      }
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - discountAmount);
  const minDeposit = Math.ceil(finalTotal * 0.5);

  // 3. Payment Option: Full 100% or 50% Deposit (Simplified & Clean)
  const paymentType = bookingData.paymentType === 'deposit_50' ? 'deposit_50' : 'full';
  const amountToPay = paymentType === 'deposit_50' ? minDeposit : finalTotal;
  const remainingBalance = Math.max(0, finalTotal - amountToPay);

  // Handle Promo apply
  const handleApplyPromo = () => {
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) return;

    if (PROMO_CODES[cleaned]) {
      updateBookingData({ appliedPromo: cleaned });
      setPromoError('');
    } else {
      setPromoError(t('booking.reviewPay.invalidPromo'));
    }
  };

  const handleRemovePromo = () => {
    updateBookingData({ appliedPromo: null });
    setPromoInput('');
    setPromoError('');
  };

  // Submit
  const handleProceed = () => {
    // Save final amounts to state before proceeding to invoice
    updateBookingData({
      subtotal: rawSubtotal,
      discount: discountAmount,
      totalAmount: finalTotal,
      amountToPay,
      remainingBalance,
      paymentType,
    });

    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 font-body">
      {/* Step Header - Compact */}
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-navy">
          {t('booking.reviewPay.title')}
        </h1>
        <p className="text-xs sm:text-sm text-brand-navy/70">
          {t('booking.reviewPay.subtitle')}
        </p>
      </div>

      {/* SUMMARY CARD */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-brand-blue text-sm" />
            <h2 className="font-heading font-extrabold text-sm sm:text-base text-brand-navy">
              {t('booking.reviewPay.summaryTitle')}
            </h2>
          </div>
          <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full">
            {t('booking.reviewPay.officialRate')}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
          {/* Trip */}
          <div className="p-2.5 bg-surface-mist rounded-xl flex items-center gap-2.5">
            <FontAwesomeIcon icon={faSailboat} className="text-brand-blue text-sm flex-none" />
            <div className="min-w-0">
              <span className="text-[10px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.tripLabel')}
              </span>
              <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                {selectedTrip ? t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug) : ''}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="p-2.5 bg-surface-mist rounded-xl flex items-center gap-2.5">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-brand-blue text-sm flex-none" />
            <div className="min-w-0">
              <span className="text-[10px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.dateTimeLabel')}
              </span>
              <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                {bookingData.date} • {formatTimeSlot(bookingData.time)}
              </p>
            </div>
          </div>

          {/* Duration & Equipment */}
          <div className="p-2.5 bg-surface-mist rounded-xl flex items-center gap-2.5">
            <FontAwesomeIcon icon={faClock} className="text-brand-blue text-sm flex-none" />
            <div className="min-w-0">
              <span className="text-[10px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.durationEquipmentLabel')}
              </span>
              <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                {durationHours} {isArabic ? (durationHours === 1 ? 'ساعة' : durationHours === 2 ? 'ساعتان' : 'ساعات') : 'Hour(s)'} • {bookingData.equipment || 'Kayak'}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div className="p-2.5 bg-surface-mist rounded-xl flex items-center gap-2.5">
            <FontAwesomeIcon icon={faUsers} className="text-brand-blue text-sm flex-none" />
            <div className="min-w-0">
              <span className="text-[10px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.guestsLabel')}
              </span>
              <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                {totalGuests} {t('booking.reviewPay.guestsCount')} (
                {bookingData.nationality === 'all_egyptian'
                  ? t('booking.guestDetails.allEgyptian')
                  : bookingData.nationality === 'all_foreign'
                  ? t('booking.guestDetails.allForeign')
                  : `${bookingData.egyptianCount || 0} ${t('booking.guestDetails.egyptian')} / ${
                      bookingData.foreignCount || 0
                    } ${t('booking.guestDetails.foreign')}`}
                )
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-3 bg-brand-navy text-white rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="text-[10px] text-white/60 block">{t('booking.reviewPay.bookerName')}</span>
            <span className="font-extrabold">{bookingData.fullName}</span>
          </div>
          <div className="text-end">
            <span className="text-[10px] text-white/60 block">{t('booking.reviewPay.bookerPhone')}</span>
            <span className="font-mono font-bold" dir="ltr">{bookingData.phone}</span>
          </div>
        </div>
      </section>

      {/* PROMO CODE & FINANCIALS (2-COL or COMPACT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Promo Code Section */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-black/5">
              <FontAwesomeIcon icon={faTag} className="text-brand-blue text-sm" />
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-brand-navy">
                {t('booking.reviewPay.promoCodeTitle')}
              </h3>
            </div>

            <div className="mt-3">
              {bookingData.appliedPromo ? (
                <div className="p-3 bg-brand-yellow/30 border border-brand-yellow rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="text-brand-navy text-sm" />
                    <span className="font-black text-xs sm:text-sm text-brand-navy">
                      {bookingData.appliedPromo} ({PROMO_CODES[bookingData.appliedPromo]?.label})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-bold text-error hover:underline cursor-pointer"
                  >
                    {t('booking.reviewPay.removePromo')}
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        if (promoError) setPromoError('');
                      }}
                      placeholder="DUCK10 / DUCK2026 / WELCOME"
                      className="flex-1 px-3 py-2 rounded-xl border border-black/15 font-bold text-xs uppercase tracking-wider focus:border-brand-blue focus:outline-none"
                    />
                    <Button
                      type="button"
                      variant="navy"
                      size="sm"
                      onClick={handleApplyPromo}
                      className="font-bold py-2 px-4 text-xs"
                    >
                      {t('booking.reviewPay.applyPromo')}
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-error text-xs font-bold">{promoError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Calculation Details */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="space-y-2 text-xs sm:text-sm text-brand-navy/80">
            <div className="flex items-center justify-between">
              <span>{t('booking.reviewPay.subtotal')}</span>
              <span className="font-bold tabular-nums">{formatPrice(rawSubtotal)} {t('trips.currency')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-brand-blue font-bold">
                <span>{t('booking.reviewPay.discountApplied')}</span>
                <span className="tabular-nums">- {formatPrice(discountAmount)} {t('trips.currency')}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-black/10 text-base sm:text-lg font-black text-brand-navy">
              <span>{t('booking.reviewPay.totalAmount')}</span>
              <span className="tabular-nums text-brand-navy">{formatPrice(finalTotal)} {t('trips.currency')}</span>
            </div>
          </div>
        </section>
      </div>

      {/* PAYMENT OPTIONS: ONLY 2 CLEAN CARDS SIDE-BY-SIDE */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-black/5">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-brand-blue text-sm" />
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-brand-navy">
            {t('booking.reviewPay.howMuchToPayTitle')}
          </h3>
        </div>

        {/* 2 Payment Cards Side-by-Side (Full Payment & 50% Deposit) with Checkmark on Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. 100% Full Payment Card */}
          <button
            type="button"
            onClick={() => updateBookingData({ paymentType: 'full' })}
            className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              paymentType === 'full'
                ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-yellow'
                : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
            }`}
          >
            {paymentType === 'full' && (
              <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center shadow-xs">
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
              </div>
            )}
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-yellow text-brand-navy mb-2">
                {t('booking.reviewPay.recommended')}
              </span>
              <p className="font-extrabold text-sm sm:text-base">{t('booking.reviewPay.fullPayment')}</p>
              <p className={`text-xs mt-1 ${paymentType === 'full' ? 'text-white/80' : 'text-brand-navy/60'}`}>
                100% {t('booking.reviewPay.fullPaymentDesc')}
              </p>
            </div>
            <p className="font-black text-lg sm:text-xl mt-4 tabular-nums">
              {formatPrice(finalTotal)} {t('trips.currency')}
            </p>
          </button>

          {/* 2. 50% Deposit Card */}
          <button
            type="button"
            onClick={() => updateBookingData({ paymentType: 'deposit_50' })}
            className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              paymentType === 'deposit_50'
                ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-yellow'
                : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
            }`}
          >
            {paymentType === 'deposit_50' && (
              <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center shadow-xs">
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
              </div>
            )}
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-blue/20 text-brand-blue mb-2">
                50%
              </span>
              <p className="font-extrabold text-sm sm:text-base">{t('booking.reviewPay.deposit50')}</p>
              <p className={`text-xs mt-1 ${paymentType === 'deposit_50' ? 'text-white/80' : 'text-brand-navy/60'}`}>
                {t('booking.reviewPay.deposit50Desc')}
              </p>
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl mt-4 tabular-nums">
                {formatPrice(minDeposit)} {t('trips.currency')}
              </p>
              <span className={`text-[11px] block mt-0.5 ${paymentType === 'deposit_50' ? 'text-white/70' : 'text-brand-navy/60'}`}>
                {t('booking.reviewPay.remainingOnSite')}: {formatPrice(finalTotal - minDeposit)} {t('trips.currency')}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="subtle"
          size="md"
          onClick={onBack}
          className="font-bold gap-2 px-5 py-2 border border-brand-navy/20"
        >
          <FontAwesomeIcon icon={ArrowBack} />
          <span>{t('booking.nav.previous')}</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleProceed}
          className="font-black gap-2 px-7 py-2.5 bg-brand-yellow text-brand-navy shadow-md hover:bg-brand-navy hover:text-white"
        >
          <span>{t('booking.nav.nextToInvoice')}</span>
          <FontAwesomeIcon icon={ArrowNext} />
        </Button>
      </div>
    </div>
  );
}
