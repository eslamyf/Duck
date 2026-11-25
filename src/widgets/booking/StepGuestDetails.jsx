import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCalendarDays,
  faSailboat,
  faShip,
  faUsers,
  faArrowLeft,
  faArrowRight,
  faCircleExclamation,
  faChild,
  faUser,
  faCheck,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { Input, DatePicker, Button } from '../../shared/ui/index.js';
import { isValidPhone, isNonEmpty } from '../../shared/utils/validators.js';

function getIsoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Operating hours: 6:00 AM to 6:30 PM in 30-min increments
const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30',
];

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];

const HEAR_OPTIONS = [
  { id: 'facebook', labelKey: 'facebook' },
  { id: 'instagram', labelKey: 'instagram' },
  { id: 'tiktok', labelKey: 'tiktok' },
  { id: 'friend', labelKey: 'friend' },
  { id: 'google', labelKey: 'google' },
  { id: 'other', labelKey: 'other' },
];

export default function StepGuestDetails({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
  selectedTrip,
  t,
  lang,
}) {
  const isArabic = lang === 'ar';
  const ArrowNext = isArabic ? faArrowLeft : faArrowRight;
  const ArrowBack = isArabic ? faArrowRight : faArrowLeft;

  const [errors, setErrors] = useState({});

  // Helper date generators
  const [todayIso] = useState(() => getIsoDate(0));
  const [tomorrowIso] = useState(() => getIsoDate(1));

  // Format time label for display (e.g. "6:00 ص" or "6:00 AM")
  const formatTimeSlot = (slot) => {
    const [hStr, mStr] = slot.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr;
    const isPm = h >= 12;
    if (h > 12) h -= 12;
    if (h === 0) h = 12;

    if (isArabic) {
      return `${h}:${m} ${isPm ? 'م' : 'ص'}`;
    }
    return `${h}:${m} ${isPm ? 'PM' : 'AM'}`;
  };



  // Total guests calculation
  const totalGuests = (bookingData.adults || 1) + (bookingData.kids1to6 || 0) + (bookingData.kids7to12 || 0);

  // Handle guest counts with 30 max limit - without any presets
  const handleGuestChange = (type, nextVal) => {
    const current = {
      adults: bookingData.adults || 1,
      kids1to6: bookingData.kids1to6 || 0,
      kids7to12: bookingData.kids7to12 || 0,
      ...{ [type]: nextVal },
    };

    const newTotal = current.adults + current.kids1to6 + current.kids7to12;
    if (newTotal > 30) {
      setErrors((prev) => ({
        ...prev,
        guests: t('booking.guestDetails.maxGuestsNotice'),
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.guests;
      return copy;
    });

    // Auto balance mixed nationalities when total guests change
    if (bookingData.nationality === 'mixed') {
      const diff = newTotal - (bookingData.egyptianCount + bookingData.foreignCount);
      updateBookingData({
        [type]: nextVal,
        egyptianCount: Math.max(0, (bookingData.egyptianCount || 0) + diff),
      });
    } else {
      updateBookingData({ [type]: nextVal });
    }
  };

  // Validate step 2
  const validate = () => {
    const errs = {};
    if (!isNonEmpty(bookingData.fullName) || bookingData.fullName.trim().length < 3) {
      errs.fullName = t('booking.errors.nameRequired');
    }

    if (!isValidPhone(bookingData.phone)) {
      errs.phone = t('booking.errors.phoneRequired');
    }

    if (!bookingData.date || bookingData.date < todayIso) {
      errs.date = t('booking.errors.dateRequired');
    }

    if (!bookingData.time) {
      errs.time = t('booking.errors.timeRequired');
    }

    if (totalGuests < 1) {
      errs.guests = t('booking.errors.minGuests');
    } else if (totalGuests > 30) {
      errs.guests = t('booking.guestDetails.maxGuestsNotice');
    }

    if (bookingData.nationality === 'mixed') {
      const sum = (bookingData.egyptianCount || 0) + (bookingData.foreignCount || 0);
      if (sum !== totalGuests) {
        errs.nationality = t('booking.errors.nationalitySumMismatch', { total: totalGuests });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-4 font-body">
      {/* Step Header - Compact */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-navy">
          {t('booking.guestDetails.title')}
        </h2>
        <p className="text-xs sm:text-sm text-brand-navy/70">
          {t('booking.guestDetails.subtitle')}
        </p>
      </div>

      {/* Selected Trip Bar (Compact) */}
      {selectedTrip && (
        <div className="bg-surface-mist border border-[rgba(20,125,159,0.2)] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-none bg-brand-navy">
              <img
                src={selectedTrip.images?.thumb || selectedTrip.images?.medium}
                alt={selectedTrip.slug}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wide block">
                {t('booking.guestDetails.selectedTripLabel')}
              </span>
              <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                {t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-brand-blue hover:text-brand-navy hover:underline flex-none cursor-pointer"
          >
            {t('booking.guestDetails.changeTrip')}
          </button>
        </div>
      )}

      {/* SECTION 1: 2-Column Responsive Layout for Contact & Date/Time (Saves massive vertical space) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info Card */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-black/5">
              <FontAwesomeIcon icon={faUser} className="text-brand-blue text-sm" />
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-brand-navy">
                {t('booking.guestDetails.contactSectionTitle')}
              </h3>
            </div>

            <div className="space-y-3 mt-3">
              <Input
                id="book-fullName"
                label={t('booking.guestDetails.fullName')}
                value={bookingData.fullName || ''}
                onChange={(e) => {
                  updateBookingData({ fullName: e.target.value });
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                placeholder={t('booking.guestDetails.fullNamePlaceholder')}
                error={errors.fullName}
                required
              />

              <Input
                id="book-phone"
                type="tel"
                dir="ltr"
                label={t('booking.guestDetails.phone')}
                value={bookingData.phone || ''}
                onChange={(e) => {
                  updateBookingData({ phone: e.target.value });
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="01012345678 / +20..."
                error={errors.phone}
                helperText={t('booking.guestDetails.phoneHelper')}
                required
              />
            </div>
          </div>
        </section>

        {/* Date & Time Card */}
        <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/5">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-brand-blue text-sm" />
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-brand-navy">
                {t('booking.guestDetails.dateTimeSectionTitle')}
              </h3>
            </div>
            <span className="text-[11px] text-brand-navy/60 font-semibold">
              {t('booking.guestDetails.operatingHoursNotice')}
            </span>
          </div>

          {/* Quick Date Pills with Checkmark on selection */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  updateBookingData({ date: todayIso });
                  if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bookingData.date === todayIso
                    ? 'bg-brand-navy text-brand-yellow shadow-xs ring-1 ring-brand-yellow'
                    : 'bg-surface-mist hover:bg-slate-200 text-brand-navy border border-black/5'
                }`}
              >
                {bookingData.date === todayIso && (
                  <FontAwesomeIcon icon={faCheck} className="text-xs text-brand-yellow shrink-0" />
                )}
                <FontAwesomeIcon icon={faCalendarDays} className="text-[11px]" />
                <span>{t('booking.guestDetails.today')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateBookingData({ date: tomorrowIso });
                  if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bookingData.date === tomorrowIso
                    ? 'bg-brand-navy text-brand-yellow shadow-xs ring-1 ring-brand-yellow'
                    : 'bg-surface-mist hover:bg-slate-200 text-brand-navy border border-black/5'
                }`}
              >
                {bookingData.date === tomorrowIso && (
                  <FontAwesomeIcon icon={faCheck} className="text-xs text-brand-yellow shrink-0" />
                )}
                <FontAwesomeIcon icon={faCalendarCheck} className="text-[11px]" />
                <span>{t('booking.guestDetails.tomorrow')}</span>
              </button>
            </div>

            <DatePicker
              id="book-date"
              value={bookingData.date || todayIso}
              min={todayIso}
              onChange={(e) => {
                updateBookingData({ date: e.target.value });
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              error={errors.date}
              required
            />
          </div>

          {/* Time Slot Selector - Compact Grid */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs text-brand-navy">
              {t('booking.guestDetails.bookingTime')} <span className="text-error">*</span>
            </label>
            <div
              className="grid grid-cols-4 sm:grid-cols-6 gap-1 max-h-28 overflow-y-auto p-1.5 border border-black/10 rounded-xl bg-surface-mist/40"
              role="group"
              aria-label={t('booking.guestDetails.timeSlotAria')}
            >
              {TIME_SLOTS.map((slot) => {
                const isSelected = bookingData.time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      updateBookingData({ time: slot });
                      if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
                    }}
                    aria-pressed={isSelected}
                    className={`py-1 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                      isSelected
                        ? 'bg-brand-navy text-brand-yellow shadow-xs ring-1 ring-brand-yellow font-black'
                        : 'bg-white hover:bg-slate-100 text-brand-navy border border-black/5'
                    }`}
                  >
                    {isSelected && (
                      <FontAwesomeIcon icon={faCheck} className="text-[9px] text-brand-yellow shrink-0" />
                    )}
                    <span>{formatTimeSlot(slot)}</span>
                  </button>
                );
              })}
            </div>
            {errors.time && (
              <p className="text-error text-xs font-bold">{errors.time}</p>
            )}
          </div>
        </section>
      </div>

      {/* SECTION 2: GUEST COUNTS - SIDE-BY-SIDE CARDS WITHOUT ANY PRESETS */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-brand-blue text-sm" />
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-brand-navy">
              {t('booking.guestDetails.guestsSectionTitle')}
            </h3>
          </div>
          <span className="text-xs font-black px-2.5 py-0.5 bg-brand-yellow/30 text-brand-navy rounded-full">
            {t('booking.guestDetails.totalGuests', { count: totalGuests })} / 30
          </span>
        </div>

        {/* 3 Columns Side-by-Side on Tablet/Desktop with Neat Inline Stepper [-] count [+] */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Adults */}
          <div className="p-3.5 bg-surface-mist rounded-xl border border-black/5 flex flex-col justify-between space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center flex-none">
                <FontAwesomeIcon icon={faUser} className="text-xs" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                  {t('booking.guestDetails.adults')}
                </p>
                <p className="text-[11px] text-brand-navy/60 font-medium truncate">
                  {t('booking.guestDetails.adultsDesc')}
                </p>
              </div>
            </div>

            {/* Custom Inline Stepper (Zero preset pills) */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-black/10 shadow-2xs">
              <button
                type="button"
                onClick={() => handleGuestChange('adults', Math.max(1, (bookingData.adults || 1) - 1))}
                disabled={(bookingData.adults || 1) <= 1}
                className="w-7 h-7 rounded-lg bg-slate-100 text-brand-navy flex items-center justify-center hover:bg-brand-navy hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Decrease adults"
              >
                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
              </button>
              <span className="font-heading font-black text-sm sm:text-base text-brand-navy tabular-nums">
                {bookingData.adults || 1}
              </span>
              <button
                type="button"
                onClick={() => handleGuestChange('adults', (bookingData.adults || 1) + 1)}
                disabled={totalGuests >= 30}
                className="w-7 h-7 rounded-lg bg-brand-navy text-brand-yellow flex items-center justify-center hover:bg-brand-blue hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Increase adults"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              </button>
            </div>
          </div>

          {/* 2. Kids 1 to 6 */}
          <div className="p-3.5 bg-surface-mist rounded-xl border border-black/5 flex flex-col justify-between space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-none">
                <FontAwesomeIcon icon={faChild} className="text-xs" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                  {t('booking.guestDetails.kids1to6')}
                </p>
                <p className="text-[11px] text-brand-blue font-bold truncate">
                  {t('booking.guestDetails.kidsSamePriceNotice')}
                </p>
              </div>
            </div>

            {/* Custom Inline Stepper (Zero preset pills) */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-black/10 shadow-2xs">
              <button
                type="button"
                onClick={() => handleGuestChange('kids1to6', Math.max(0, (bookingData.kids1to6 || 0) - 1))}
                disabled={(bookingData.kids1to6 || 0) <= 0}
                className="w-7 h-7 rounded-lg bg-slate-100 text-brand-navy flex items-center justify-center hover:bg-brand-navy hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Decrease kids 1 to 6"
              >
                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
              </button>
              <span className="font-heading font-black text-sm sm:text-base text-brand-navy tabular-nums">
                {bookingData.kids1to6 || 0}
              </span>
              <button
                type="button"
                onClick={() => handleGuestChange('kids1to6', (bookingData.kids1to6 || 0) + 1)}
                disabled={totalGuests >= 30}
                className="w-7 h-7 rounded-lg bg-brand-navy text-brand-yellow flex items-center justify-center hover:bg-brand-blue hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Increase kids 1 to 6"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              </button>
            </div>
          </div>

          {/* 3. Kids 7 to 12 */}
          <div className="p-3.5 bg-surface-mist rounded-xl border border-black/5 flex flex-col justify-between space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow/30 text-brand-navy flex items-center justify-center flex-none">
                <FontAwesomeIcon icon={faChild} className="text-xs" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm text-brand-navy truncate">
                  {t('booking.guestDetails.kids7to12')}
                </p>
                <p className="text-[11px] text-brand-navy/60 font-medium truncate">
                  {t('booking.guestDetails.kids7to12Desc')}
                </p>
              </div>
            </div>

            {/* Custom Inline Stepper (Zero preset pills) */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-black/10 shadow-2xs">
              <button
                type="button"
                onClick={() => handleGuestChange('kids7to12', Math.max(0, (bookingData.kids7to12 || 0) - 1))}
                disabled={(bookingData.kids7to12 || 0) <= 0}
                className="w-7 h-7 rounded-lg bg-slate-100 text-brand-navy flex items-center justify-center hover:bg-brand-navy hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Decrease kids 7 to 12"
              >
                <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
              </button>
              <span className="font-heading font-black text-sm sm:text-base text-brand-navy tabular-nums">
                {bookingData.kids7to12 || 0}
              </span>
              <button
                type="button"
                onClick={() => handleGuestChange('kids7to12', (bookingData.kids7to12 || 0) + 1)}
                disabled={totalGuests >= 30}
                className="w-7 h-7 rounded-lg bg-brand-navy text-brand-yellow flex items-center justify-center hover:bg-brand-blue hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Increase kids 7 to 12"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>

        {errors.guests && (
          <div className="p-2.5 bg-error/10 border border-error/30 rounded-xl flex items-center gap-2 text-xs font-bold text-error">
            <FontAwesomeIcon icon={faCircleExclamation} />
            <span>{errors.guests}</span>
          </div>
        )}

        {/* Nationalities Selector with Checkmarks on Selected Option */}
        <div className="space-y-2 pt-2 border-t border-black/5">
          <label className="block font-bold text-xs sm:text-sm text-brand-navy">
            {t('booking.guestDetails.nationalityTitle')}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'all_egyptian', label: t('booking.guestDetails.allEgyptian') },
              { id: 'all_foreign', label: t('booking.guestDetails.allForeign') },
              { id: 'mixed', label: t('booking.guestDetails.mixed') },
            ].map((nat) => {
              const isSelected = (bookingData.nationality || 'all_egyptian') === nat.id;
              return (
                <button
                  key={nat.id}
                  type="button"
                  onClick={() => {
                    if (nat.id === 'mixed') {
                      updateBookingData({
                        nationality: nat.id,
                        egyptianCount: Math.ceil(totalGuests / 2),
                        foreignCount: Math.floor(totalGuests / 2),
                      });
                    } else {
                      updateBookingData({
                        nationality: nat.id,
                        egyptianCount: nat.id === 'all_egyptian' ? totalGuests : 0,
                        foreignCount: nat.id === 'all_foreign' ? totalGuests : 0,
                      });
                    }
                    if (errors.nationality) setErrors((prev) => ({ ...prev, nationality: '' }));
                  }}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-xs ring-1 ring-brand-yellow'
                      : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
                  }`}
                >
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="text-xs text-brand-yellow shrink-0" />
                  )}
                  <span>{nat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mixed details breakdown */}
          {bookingData.nationality === 'mixed' && (
            <div className="p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl space-y-2 animate-in fade-in duration-200">
              <p className="text-xs font-bold text-brand-navy">
                {t('booking.guestDetails.mixedNotice', { total: totalGuests })}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="book-egCount"
                  type="number"
                  min="0"
                  max={totalGuests}
                  label={t('booking.guestDetails.egyptianCount')}
                  value={bookingData.egyptianCount ?? Math.ceil(totalGuests / 2)}
                  onChange={(e) => {
                    const eg = Math.max(0, parseInt(e.target.value, 10) || 0);
                    const fo = Math.max(0, totalGuests - eg);
                    updateBookingData({ egyptianCount: eg, foreignCount: fo });
                  }}
                />
                <Input
                  id="book-foCount"
                  type="number"
                  min="0"
                  max={totalGuests}
                  label={t('booking.guestDetails.foreignCount')}
                  value={bookingData.foreignCount ?? Math.floor(totalGuests / 2)}
                  onChange={(e) => {
                    const fo = Math.max(0, parseInt(e.target.value, 10) || 0);
                    const eg = Math.max(0, totalGuests - fo);
                    updateBookingData({ foreignCount: fo, egyptianCount: eg });
                  }}
                />
              </div>
              {errors.nationality && (
                <p className="text-error text-xs font-bold">{errors.nationality}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Duration & Equipment - Compact */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Equipment */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs sm:text-sm text-brand-navy">
              {t('booking.guestDetails.equipmentType')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'kayak', label: t('booking.tripSelect.kayak'), icon: faSailboat },
                { id: 'sup', label: t('booking.tripSelect.sup'), icon: faSailboat },
                { id: 'waterbike', label: t('booking.tripSelect.waterbike'), icon: faShip },
              ].map((eq) => {
                const isChosen = (bookingData.equipment || selectedTrip?.act || 'kayak') === eq.id;
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => updateBookingData({ equipment: eq.id })}
                    className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isChosen
                        ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-xs ring-1 ring-brand-yellow'
                        : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
                    }`}
                  >
                    {isChosen && (
                      <FontAwesomeIcon icon={faCheck} className="text-xs text-brand-yellow shrink-0" />
                    )}
                    <FontAwesomeIcon icon={eq.icon} className="text-xs" />
                    <span className="text-xs font-bold">{eq.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selector (1 to 6 hours) with Checkmarks */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs sm:text-sm text-brand-navy">
              {t('booking.guestDetails.duration')}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {DURATION_OPTIONS.map((hrs) => {
                const isSelected = (bookingData.duration || 1) === hrs;
                return (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => updateBookingData({ duration: hrs })}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                      isSelected
                        ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-xs ring-1 ring-brand-yellow'
                        : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
                    }`}
                  >
                    {isSelected && (
                      <FontAwesomeIcon icon={faCheck} className="text-[10px] text-brand-yellow shrink-0" />
                    )}
                    <span>
                      {hrs} {isArabic ? (hrs === 1 ? 'س' : hrs === 2 ? 'ساعتان' : 'ساعات') : 'h'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Optional Questions - Compact Row */}
      <section className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/10 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Previous experience */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-brand-navy/80">
              {t('booking.guestDetails.triedBeforeQuestion')}
            </span>
            {[
              { val: 'yes', label: t('booking.guestDetails.yes') },
              { val: 'no', label: t('booking.guestDetails.no') },
            ].map((opt) => {
              const isSelected = bookingData.triedBefore === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => updateBookingData({ triedBefore: opt.val })}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-xs ring-1 ring-brand-yellow'
                      : 'bg-surface-mist hover:bg-slate-200 text-brand-navy border-black/5'
                  }`}
                >
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="text-[10px] text-brand-yellow" />
                  )}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* How heard */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-brand-navy/80">
              {t('booking.guestDetails.howHeardQuestion')}:
            </span>
            {HEAR_OPTIONS.slice(0, 4).map((opt) => {
              const isSelected = bookingData.howHeard === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateBookingData({ howHeard: opt.id })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                      : 'bg-surface-mist hover:bg-slate-200 text-brand-navy border-black/5'
                  }`}
                >
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="text-[9px] text-white" />
                  )}
                  <span>{t(`booking.guestDetails.hearOptions.${opt.labelKey}`, opt.id)}</span>
                </button>
              );
            })}
          </div>
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
          type="submit"
          variant="primary"
          size="md"
          className="font-black gap-2 px-7 py-2.5 bg-brand-yellow text-brand-navy shadow-md hover:bg-brand-navy hover:text-white"
        >
          <span>{t('booking.nav.nextToReview')}</span>
          <FontAwesomeIcon icon={ArrowNext} />
        </Button>
      </div>
    </form>
  );
}
