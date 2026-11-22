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
  faCircleExclamation,
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
  const [customAmountError, setCustomAmountError] = useState('');

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

  // 3. Payment Option amount calculation
  const paymentType = bookingData.paymentType || 'full';
  let amountToPay = finalTotal;
  if (paymentType === 'deposit_50') {
    amountToPay = minDeposit;
  } else if (paymentType === 'custom') {
    amountToPay = bookingData.customPayAmount || minDeposit;
  }

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
    if (paymentType === 'custom') {
      const val = Number(bookingData.customPayAmount);
      if (!val || val < minDeposit || val > finalTotal) {
        setCustomAmountError(
          t('booking.reviewPay.customAmountRangeError', {
            min: formatPrice(minDeposit),
            max: formatPrice(finalTotal),
          })
        );
        return;
      }
    }

    // Save final amounts to state before proceeding to invoice
    updateBookingData({
      subtotal: rawSubtotal,
      discount: discountAmount,
      totalAmount: finalTotal,
      amountToPay,
      remainingBalance,
    });

    onNext();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 font-body">
      {/* Step Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
          {t('booking.reviewPay.title')}
        </h2>
        <p className="text-sm sm:text-base text-brand-navy/70">
          {t('booking.reviewPay.subtitle')}
        </p>
      </div>

      {/* SUMMARY CARD */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faShieldHalved} className="text-brand-blue text-lg" />
            <h3 className="font-heading font-extrabold text-lg text-brand-navy">
              {t('booking.reviewPay.summaryTitle')}
            </h3>
          </div>
          <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
            {t('booking.reviewPay.officialRate')}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
          {/* Trip */}
          <div className="p-3 bg-surface-mist rounded-2xl flex items-center gap-3">
            <FontAwesomeIcon icon={faSailboat} className="text-brand-blue text-base flex-none" />
            <div className="min-w-0">
              <span className="text-[11px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.tripLabel')}
              </span>
              <p className="font-extrabold text-brand-navy truncate">
                {selectedTrip ? t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug) : ''}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="p-3 bg-surface-mist rounded-2xl flex items-center gap-3">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-brand-blue text-base flex-none" />
            <div className="min-w-0">
              <span className="text-[11px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.dateTimeLabel')}
              </span>
              <p className="font-extrabold text-brand-navy truncate">
                {bookingData.date} • {formatTimeSlot(bookingData.time)}
              </p>
            </div>
          </div>

          {/* Duration & Equipment */}
          <div className="p-3 bg-surface-mist rounded-2xl flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} className="text-brand-blue text-base flex-none" />
            <div className="min-w-0">
              <span className="text-[11px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.durationEquipmentLabel')}
              </span>
              <p className="font-extrabold text-brand-navy truncate">
                {durationHours} {isArabic ? 'ساعة' : 'Hour(s)'} • {bookingData.equipment || 'Kayak'}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div className="p-3 bg-surface-mist rounded-2xl flex items-center gap-3">
            <FontAwesomeIcon icon={faUsers} className="text-brand-blue text-base flex-none" />
            <div className="min-w-0">
              <span className="text-[11px] text-brand-navy/60 font-semibold block">
                {t('booking.reviewPay.guestsLabel')}
              </span>
              <p className="font-extrabold text-brand-navy truncate">
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
        <div className="p-3.5 bg-brand-navy text-white rounded-2xl flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="text-[11px] text-white/60 block">{t('booking.reviewPay.bookerName')}</span>
            <span className="font-extrabold">{bookingData.fullName}</span>
          </div>
          <div className="text-end">
            <span className="text-[11px] text-white/60 block">{t('booking.reviewPay.bookerPhone')}</span>
            <span className="font-mono font-bold" dir="ltr">{bookingData.phone}</span>
          </div>
        </div>
      </section>

      {/* PROMO CODE SECTION */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faTag} className="text-brand-blue" />
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy">
            {t('booking.reviewPay.promoCodeTitle')}
          </h3>
        </div>

        {bookingData.appliedPromo ? (
          <div className="p-3.5 bg-brand-yellow/30 border border-brand-yellow rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-brand-navy" />
              <span className="font-black text-sm text-brand-navy">
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
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  if (promoError) setPromoError('');
                }}
                placeholder="DUCK10 / DUCK2026 / WELCOME"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-black/15 font-bold text-sm text-brand-navy uppercase tracking-wider focus:border-brand-blue focus:outline-none"
              />
              {promoError && (
                <p className="text-error text-xs font-bold mt-1.5">{promoError}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyPromo}
              className="font-bold py-2.5 px-5"
            >
              {t('booking.reviewPay.applyPromo')}
            </Button>
          </div>
        )}
      </section>

      {/* PRICE BREAKDOWN & PAYMENT FLEXIBILITY */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-black/5">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-brand-blue" />
          <h3 className="font-heading font-extrabold text-lg text-brand-navy">
            {t('booking.reviewPay.howMuchToPayTitle')}
          </h3>
        </div>

        {/* Calculation Details */}
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

          <div className="flex items-center justify-between pt-2 border-t border-black/5 text-base sm:text-lg font-black text-brand-navy">
            <span>{t('booking.reviewPay.totalAmount')}</span>
            <span className="tabular-nums">{formatPrice(finalTotal)} {t('trips.currency')}</span>
          </div>
        </div>

        {/* Payment Options: Full / 50% Deposit / Custom */}
        <div className="space-y-3 pt-2">
          <label className="block font-bold text-xs sm:text-sm text-brand-navy">
            {t('booking.reviewPay.selectPaymentOption')}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 100% Full */}
            <button
              type="button"
              onClick={() => {
                updateBookingData({ paymentType: 'full' });
                setCustomAmountError('');
              }}
              className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                paymentType === 'full'
                  ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-navy'
                  : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
              }`}
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-yellow text-brand-navy mb-1.5">
                  {t('booking.reviewPay.recommended')}
                </span>
                <p className="font-extrabold text-sm">{t('booking.reviewPay.fullPayment')}</p>
                <p className={`text-xs mt-0.5 ${paymentType === 'full' ? 'text-white/80' : 'text-brand-navy/60'}`}>
                  100% {t('booking.reviewPay.fullPaymentDesc')}
                </p>
              </div>
              <p className="font-black text-base sm:text-lg mt-3 tabular-nums">
                {formatPrice(finalTotal)} {t('trips.currency')}
              </p>
            </button>

            {/* 50% Deposit */}
            <button
              type="button"
              onClick={() => {
                updateBookingData({ paymentType: 'deposit_50' });
                setCustomAmountError('');
              }}
              className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                paymentType === 'deposit_50'
                  ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-navy'
                  : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
              }`}
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-blue/20 text-brand-blue mb-1.5">
                  50%
                </span>
                <p className="font-extrabold text-sm">{t('booking.reviewPay.deposit50')}</p>
                <p className={`text-xs mt-0.5 ${paymentType === 'deposit_50' ? 'text-white/80' : 'text-brand-navy/60'}`}>
                  {t('booking.reviewPay.deposit50Desc')}
                </p>
              </div>
              <p className="font-black text-base sm:text-lg mt-3 tabular-nums">
                {formatPrice(minDeposit)} {t('trips.currency')}
              </p>
            </button>

            {/* Custom Amount */}
            <button
              type="button"
              onClick={() => {
                updateBookingData({
                  paymentType: 'custom',
                  customPayAmount: bookingData.customPayAmount || minDeposit,
                });
              }}
              className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                paymentType === 'custom'
                  ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-navy'
                  : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
              }`}
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/10 text-brand-navy mb-1.5">
                  {t('booking.reviewPay.custom')}
                </span>
                <p className="font-extrabold text-sm">{t('booking.reviewPay.customAmount')}</p>
                <p className={`text-xs mt-0.5 ${paymentType === 'custom' ? 'text-white/80' : 'text-brand-navy/60'}`}>
                  {t('booking.reviewPay.min50Percent')}
                </p>
              </div>
              <p className="font-black text-sm mt-3">
                {t('booking.reviewPay.customSpecify')}
              </p>
            </button>
          </div>

          {/* Custom Amount Input Field */}
          {paymentType === 'custom' && (
            <div className="p-4 bg-surface-mist rounded-2xl space-y-2 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-brand-navy">
                {t('booking.reviewPay.enterCustomAmount', {
                  min: formatPrice(minDeposit),
                  max: formatPrice(finalTotal),
                })}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={minDeposit}
                  max={finalTotal}
                  value={bookingData.customPayAmount || minDeposit}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateBookingData({ customPayAmount: val });
                    if (val < minDeposit || val > finalTotal) {
                      setCustomAmountError(
                        t('booking.reviewPay.customAmountRangeError', {
                          min: formatPrice(minDeposit),
                          max: formatPrice(finalTotal),
                        })
                      );
                    } else {
                      setCustomAmountError('');
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black/15 font-bold text-base text-brand-navy bg-white focus:border-brand-blue focus:outline-none"
                />
                <span className="text-xs font-extrabold text-brand-navy flex-none">
                  {t('trips.currency')}
                </span>
              </div>
              {customAmountError && (
                <p className="text-error text-xs font-bold">{customAmountError}</p>
              )}
            </div>
          )}

          {/* Display Due Balance */}
          {remainingBalance > 0 && (
            <div className="p-3 bg-brand-blue/10 rounded-xl flex items-center justify-between text-xs font-bold text-brand-navy">
              <span>{t('booking.reviewPay.remainingOnSite')}</span>
              <span className="font-extrabold tabular-nums">
                {formatPrice(remainingBalance)} {t('trips.currency')}
              </span>
            </div>
          )}
        </div>

        {/* Explanation message */}
        <div className="p-3.5 bg-surface-mist rounded-2xl flex items-start gap-2.5 text-xs text-brand-navy/80 font-medium">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-brand-blue mt-0.5 flex-none" />
          <p>{t('booking.reviewPay.nextStepsNotice')}</p>
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          className="font-bold gap-2 px-6"
        >
          <FontAwesomeIcon icon={ArrowBack} />
          <span>{t('booking.nav.previous')}</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleProceed}
          className="font-black gap-2 px-8 bg-brand-yellow text-brand-navy shadow-lg hover:bg-brand-navy hover:text-white"
        >
          <span>{t('booking.nav.confirmAndPayInstaPay')}</span>
          <FontAwesomeIcon icon={ArrowNext} />
        </Button>
      </div>
    </div>
  );
}
