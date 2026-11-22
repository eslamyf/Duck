import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCalendarDays,
  faClock,
  faSailboat,
  faShip,
  faUsers,
  faArrowLeft,
  faArrowRight,
  faCircleExclamation,
  faChild,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Input, DatePicker, QuantityStepper, Button } from '../../shared/ui/index.js';
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

  // Format date readable
  const formatReadableDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr + 'T12:00:00');
      return d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  // Total guests calculation
  const totalGuests = (bookingData.adults || 1) + (bookingData.kids1to6 || 0) + (bookingData.kids7to12 || 0);

  // Handle guest counts with 30 max limit
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-8 font-body">
      {/* Step Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
          {t('booking.guestDetails.title')}
        </h2>
        <p className="text-sm sm:text-base text-brand-navy/70">
          {t('booking.guestDetails.subtitle')}
        </p>
      </div>

      {/* Selected Trip Bar (Quick reminder) */}
      {selectedTrip && (
        <div className="bg-surface-mist border border-[rgba(20,125,159,0.2)] p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-none bg-brand-navy">
              <img
                src={selectedTrip.images?.thumb || selectedTrip.images?.medium}
                alt={selectedTrip.slug}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wide block">
                {t('booking.guestDetails.selectedTripLabel')}
              </span>
              <p className="font-extrabold text-sm sm:text-base text-brand-navy truncate">
                {t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs sm:text-sm font-bold text-brand-blue hover:text-brand-navy hover:underline flex-none cursor-pointer"
          >
            {t('booking.guestDetails.changeTrip')}
          </button>
        </div>
      )}

      {/* SECTION 1: Contact Information */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-black/5">
          <FontAwesomeIcon icon={faUser} className="text-brand-blue" />
          <h3 className="font-heading font-extrabold text-lg text-brand-navy">
            {t('booking.guestDetails.contactSectionTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </section>

      {/* SECTION 2: Date & Time */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-black/5">
          <FontAwesomeIcon icon={faCalendarCheck} className="text-brand-blue" />
          <h3 className="font-heading font-extrabold text-lg text-brand-navy">
            {t('booking.guestDetails.dateTimeSectionTitle')}
          </h3>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="block font-bold text-sm text-brand-navy">
            {t('booking.guestDetails.bookingDate')} <span className="text-error">*</span>
          </label>

          {/* Quick Date Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                updateBookingData({ date: todayIso });
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                bookingData.date === todayIso
                  ? 'bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-yellow'
                  : 'bg-surface-mist hover:bg-slate-200 text-brand-navy'
              }`}
            >
              <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
              <span>{t('booking.guestDetails.today')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                updateBookingData({ date: tomorrowIso });
                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                bookingData.date === tomorrowIso
                  ? 'bg-brand-navy text-brand-yellow shadow-md ring-2 ring-brand-yellow'
                  : 'bg-surface-mist hover:bg-slate-200 text-brand-navy'
              }`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="text-xs" />
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

        {/* Time Slot Selection (6:00 AM - 6:30 PM, half-hour steps) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-sm text-brand-navy">
              {t('booking.guestDetails.bookingTime')} <span className="text-error">*</span>
            </label>
            <span className="text-xs text-brand-navy/60 font-medium">
              {t('booking.guestDetails.operatingHoursNotice')}
            </span>
          </div>

          <div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-black/10 rounded-2xl bg-surface-mist/50"
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
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-brand-navy text-brand-yellow shadow-sm scale-102 ring-2 ring-brand-yellow font-black'
                      : 'bg-white hover:bg-slate-100 text-brand-navy border border-black/5'
                  }`}
                >
                  {formatTimeSlot(slot)}
                </button>
              );
            })}
          </div>

          {errors.time && (
            <p className="text-error text-xs font-bold">{errors.time}</p>
          )}

          {/* Live confirmation message under time slot */}
          {bookingData.date && bookingData.time && (
            <div className="p-3 bg-brand-yellow/20 border border-brand-yellow/60 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold text-brand-navy animate-in fade-in duration-200">
              <FontAwesomeIcon icon={faClock} className="text-brand-navy text-base flex-none" />
              <span>
                {t('booking.guestDetails.liveConfirmationNotice', {
                  date: formatReadableDate(bookingData.date),
                  time: formatTimeSlot(bookingData.time),
                })}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Equipment & Duration */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-black/5">
          <FontAwesomeIcon icon={faSailboat} className="text-brand-blue" />
          <h3 className="font-heading font-extrabold text-lg text-brand-navy">
            {t('booking.guestDetails.equipmentDurationTitle')}
          </h3>
        </div>

        {/* Equipment Selector */}
        <div className="space-y-2">
          <label className="block font-bold text-sm text-brand-navy">
            {t('booking.guestDetails.equipmentType')}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
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
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border-2 transition-all cursor-pointer ${
                    isChosen
                      ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md'
                      : 'border-black/10 bg-white hover:bg-surface-mist text-brand-navy'
                  }`}
                >
                  <FontAwesomeIcon icon={eq.icon} className="text-lg" />
                  <span className="text-xs font-extrabold">{eq.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Selector (1 to 6 hours) */}
        <div className="space-y-2">
          <label className="block font-bold text-sm text-brand-navy">
            {t('booking.guestDetails.duration')}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DURATION_OPTIONS.map((hrs) => {
              const isSelected = (bookingData.duration || 1) === hrs;
              return (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => updateBookingData({ duration: hrs })}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'border-brand-navy bg-brand-yellow text-brand-navy shadow-sm ring-2 ring-brand-navy/20'
                      : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
                  }`}
                >
                  {isArabic
                    ? hrs === 1
                      ? 'ساعة واحدة'
                      : hrs === 2
                      ? 'ساعتان'
                      : `${hrs} ساعات`
                    : `${hrs} ${hrs === 1 ? 'Hour' : 'Hours'}`}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: Guests Breakdown & Dual Pricing Nationalities */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-brand-blue" />
            <h3 className="font-heading font-extrabold text-lg text-brand-navy">
              {t('booking.guestDetails.guestsSectionTitle')}
            </h3>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-brand-yellow/30 text-brand-navy rounded-full">
            {t('booking.guestDetails.totalGuests', { count: totalGuests })} / 30
          </span>
        </div>

        {/* Steppers */}
        <div className="space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between gap-3 p-3 bg-surface-mist rounded-2xl">
            <div>
              <p className="font-extrabold text-sm sm:text-base text-brand-navy">
                {t('booking.guestDetails.adults')}
              </p>
              <p className="text-xs text-brand-navy/60 font-medium">
                {t('booking.guestDetails.adultsDesc')}
              </p>
            </div>
            <QuantityStepper
              value={bookingData.adults || 1}
              min={1}
              max={30}
              onChange={(val) => handleGuestChange('adults', val)}
              showSlider={false}
              lang={lang}
              className="w-auto flex-none"
            />
          </div>

          {/* Kids 1 to 6 */}
          <div className="flex items-center justify-between gap-3 p-3 bg-surface-mist rounded-2xl">
            <div>
              <div className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faChild} className="text-brand-blue text-xs" />
                <p className="font-extrabold text-sm sm:text-base text-brand-navy">
                  {t('booking.guestDetails.kids1to6')}
                </p>
              </div>
              <p className="text-xs text-brand-blue font-bold mt-0.5">
                {t('booking.guestDetails.kidsSamePriceNotice')}
              </p>
            </div>
            <QuantityStepper
              value={bookingData.kids1to6 || 0}
              min={0}
              max={29}
              onChange={(val) => handleGuestChange('kids1to6', val)}
              showSlider={false}
              lang={lang}
              className="w-auto flex-none"
            />
          </div>

          {/* Kids 7 to 12 */}
          <div className="flex items-center justify-between gap-3 p-3 bg-surface-mist rounded-2xl">
            <div>
              <div className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faChild} className="text-brand-blue text-xs" />
                <p className="font-extrabold text-sm sm:text-base text-brand-navy">
                  {t('booking.guestDetails.kids7to12')}
                </p>
              </div>
              <p className="text-xs text-brand-navy/60 font-medium">
                {t('booking.guestDetails.kids7to12Desc')}
              </p>
            </div>
            <QuantityStepper
              value={bookingData.kids7to12 || 0}
              min={0}
              max={29}
              onChange={(val) => handleGuestChange('kids7to12', val)}
              showSlider={false}
              lang={lang}
              className="w-auto flex-none"
            />
          </div>

          {errors.guests && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-xl flex items-center gap-2 text-xs font-bold text-error">
              <FontAwesomeIcon icon={faCircleExclamation} />
              <span>{errors.guests}</span>
            </div>
          )}
        </div>

        {/* Nationalities (Dual Pricing Selection) */}
        <div className="space-y-3 pt-3 border-t border-black/5">
          <label className="block font-bold text-sm text-brand-navy">
            {t('booking.guestDetails.nationalityTitle')}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                  className={`p-3.5 rounded-2xl border-2 font-extrabold text-xs sm:text-sm transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-md'
                      : 'border-black/10 bg-surface-mist hover:bg-slate-200 text-brand-navy'
                  }`}
                >
                  {nat.label}
                </button>
              );
            })}
          </div>

          {/* Mixed details breakdown */}
          {bookingData.nationality === 'mixed' && (
            <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <p className="text-xs font-bold text-brand-navy">
                {t('booking.guestDetails.mixedNotice', { total: totalGuests })}
              </p>
              <div className="grid grid-cols-2 gap-3">
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

      {/* SECTION 5: Optional Questions */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-4">
        <h3 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy">
          {t('booking.guestDetails.optionalSectionTitle')}
        </h3>

        {/* Previous experience */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-brand-navy/80">
            {t('booking.guestDetails.triedBeforeQuestion')}
          </label>
          <div className="flex items-center gap-2">
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                      : 'bg-surface-mist hover:bg-slate-200 text-brand-navy border-black/5'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* How did you hear about us */}
        <div className="space-y-2 pt-2 border-t border-black/5">
          <label className="block text-xs sm:text-sm font-bold text-brand-navy/80">
            {t('booking.guestDetails.howHeardQuestion')}
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {HEAR_OPTIONS.map((opt) => {
              const isSelected = bookingData.howHeard === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateBookingData({ howHeard: opt.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                      : 'bg-surface-mist hover:bg-slate-200 text-brand-navy border-black/5'
                  }`}
                >
                  {t(`booking.guestDetails.hearOptions.${opt.labelKey}`, opt.id)}
                </button>
              );
            })}
          </div>
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
          type="submit"
          variant="primary"
          size="md"
          className="font-black gap-2 px-8 bg-brand-yellow text-brand-navy shadow-md hover:bg-brand-navy hover:text-white"
        >
          <span>{t('booking.nav.nextToReview')}</span>
          <FontAwesomeIcon icon={ArrowNext} />
        </Button>
      </div>
    </form>
  );
}
