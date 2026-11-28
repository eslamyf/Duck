import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { useCMS } from '../../shared/hooks/index.js';
import {
  trackInitiateBooking,
  trackAddBookingDetails,
  trackInitiateCheckout,
  trackPurchase,
} from '../../shared/utils/analytics.js';
import { generateBookingRef } from '../../shared/config/constants.js';
import { addBooking, getAllBookings } from '../../entities/booking/api/bookingService.js';
import { getCurrentUser } from '../../entities/user/api/authService.js';
import { getPendingBookingRaw } from '../../entities/notification/index.js';
import {
  BookingStepper,
  StepTripSelect,
  StepGuestDetails,
  StepReviewPay,
  StepPaymentInvoice,
} from '../../widgets/booking/index.js';

function findRestoredBooking(refParam) {
  if (!refParam) return null;
  const record = getAllBookings().find((b) => b.reference === refParam) || null;
  const rawPending = getPendingBookingRaw();
  const pendingMatch = rawPending?.ref === refParam ? rawPending : null;
  if (!record && !pendingMatch) return null;

  return {
    ...(pendingMatch || {}),
    ...(record || {}),
    totalAmount: record?.totalAmount ?? pendingMatch?.total ?? pendingMatch?.amount ?? 0,
    amountToPay: record?.amountToPay ?? pendingMatch?.amount ?? pendingMatch?.total ?? 0,
    remainingBalance: record?.remainingBalance ?? 0,
    restoredFromRef: true,
  };
}

export default function BookingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const refParam = searchParams.get('ref');
  const tripParam = searchParams.get('trip') || '';
  const activityParam = searchParams.get('activity') || '';
  const stepParam = parseInt(searchParams.get('step') || '0', 10);
  const instanceKey = refParam
    ? `ref-${refParam}-${stepParam}`
    : `booking-${tripParam || 'none'}-${activityParam || 'all'}-${stepParam}`;

  return (
    <BookingFlowContent
      key={instanceKey}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />
  );
}

function BookingFlowContent({ searchParams, setSearchParams }) {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const tripSlug = searchParams.get('trip');
  const rawActivityParam = (searchParams.get('activity') || '').toLowerCase();
  const initialActivity =
    rawActivityParam === 'water-bike'
      ? 'waterbike'
      : ['kayak', 'sup', 'waterbike'].includes(rawActivityParam)
        ? rawActivityParam
        : 'all';
  const refParam = searchParams.get('ref');
  const stepParam = parseInt(searchParams.get('step') || '0', 10);
  const restoredRecord = useMemo(() => findRestoredBooking(refParam), [refParam]);

  const { trips: dynamicTrips } = useCMS();
  const tripsList = dynamicTrips?.length ? dynamicTrips : TRIPS;

  // 1. Initial Trip match (by ?trip slug, restored booking ref, or single-trip ?activity)
  const initialTrip = useMemo(() => {
    if (tripSlug) {
      return tripsList.find((item) => item.slug === tripSlug) || null;
    }
    if (restoredRecord?.tripKey) {
      const byKey = tripsList.find((item) => item.key === restoredRecord.tripKey);
      if (byKey) return byKey;
    }
    if (restoredRecord?.tripTitle) {
      const byTitle = tripsList.find((item) =>
        restoredRecord.tripTitle.includes(item.slug) ||
        t(`trips.items.${item.key}.title`, item.slug) === restoredRecord.tripTitle
      );
      if (byTitle) return byTitle;
    }
    if (initialActivity === 'waterbike' || initialActivity === 'sup') {
      return tripsList.find((item) => item.act === initialActivity) || null;
    }
    return null;
  }, [tripSlug, initialActivity, restoredRecord, tripsList, t]);

  const isInvalidTripParam = Boolean(tripSlug && !initialTrip);

  const [userSelectedTrip, setUserSelectedTrip] = useState(null);
  const selectedTrip = userSelectedTrip || initialTrip;

  // Track Initiate Booking Event on mount
  useEffect(() => {
    trackInitiateBooking(selectedTrip, 'booking_page');
  }, [selectedTrip]);

  // 2. Initial Step
  // If trip is in URL: start on step 2 (guest details) as per spec. If refParam & step=4: start on 4.
  const [currentStep, setCurrentStep] = useState(() => {
    if (stepParam >= 1 && stepParam <= 4) return stepParam;
    if (initialTrip) return 2;
    return 1;
  });

  const effectiveStep = !selectedTrip && !restoredRecord ? 1 : currentStep;

  // 3. Unique Booking Ref (generated when reaching step 4 or restored from URL)
  const [bookingRef, setBookingRef] = useState(() => {
    if (refParam) return refParam;
    return generateBookingRef();
  });
  const savedBookingRef = useRef(Boolean(restoredRecord));

  // Today ISO
  const [todayIso] = useState(() => new Date().toISOString().split('T')[0]);

  // 4. Central Booking Form State
  const [bookingData, setBookingData] = useState(() => ({
    fullName: restoredRecord?.fullName || '',
    phone: restoredRecord?.phone || '',
    email: restoredRecord?.email || '',
    date: restoredRecord?.date || todayIso,
    time: restoredRecord?.time || '10:00',
    duration: restoredRecord?.duration || 1,
    equipment:
      restoredRecord?.equipment ||
      initialTrip?.act ||
      (initialActivity !== 'all' ? initialActivity : 'kayak'),
    adults: restoredRecord?.adults ?? 1,
    kids1to6: restoredRecord?.kids1to6 ?? 0,
    kids7to12: restoredRecord?.kids7to12 ?? 0,
    nationality: restoredRecord?.nationality || 'all_egyptian',
    egyptianCount: restoredRecord?.egyptianCount ?? 1,
    foreignCount: restoredRecord?.foreignCount ?? 0,
    triedBefore: null,
    howHeard: null,
    appliedPromo: null,
    paymentType: restoredRecord?.paymentType || 'full',
    customPayAmount: null,
    subtotal: restoredRecord?.subtotal ?? restoredRecord?.totalAmount ?? 0,
    discount: restoredRecord?.discount ?? 0,
    totalAmount: restoredRecord?.totalAmount ?? 0,
    amountToPay: restoredRecord?.amountToPay ?? 0,
    remainingBalance: restoredRecord?.remainingBalance ?? 0,
    receiptSent: Boolean(restoredRecord?.receiptSent),
    restoredFromRef: Boolean(restoredRecord?.restoredFromRef),
  }));

  // Scroll to top on step transition
  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateBookingData = (fields) => {
    setBookingData((prev) => ({ ...prev, ...fields }));
  };

  // Step 1: select trip
  const handleSelectTrip = (trip) => {
    setUserSelectedTrip(trip);
    updateBookingData({ equipment: trip.act || 'kayak' });
    goToStep(2);
  };

  // Reset booking flow
  const handleResetBooking = () => {
    savedBookingRef.current = false;
    setUserSelectedTrip(null);
    setBookingRef(generateBookingRef());
    setSearchParams({});
    setBookingData({
      fullName: '',
      phone: '',
      date: todayIso,
      time: '10:00',
      duration: 1,
      equipment: 'kayak',
      adults: 1,
      kids1to6: 0,
      kids7to12: 0,
      nationality: 'all_egyptian',
      egyptianCount: 1,
      foreignCount: 0,
      triedBefore: null,
      howHeard: null,
      appliedPromo: null,
      paymentType: 'full',
      customPayAmount: null,
      subtotal: 0,
      discount: 0,
      totalAmount: 0,
      amountToPay: 0,
      remainingBalance: 0,
    });
    goToStep(1);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface-sand text-brand-navy pt-16 sm:pt-20 min-[901px]:pt-24 pb-8 px-4 sm:px-6 relative isolate selection:bg-brand-yellow selection:text-brand-navy font-body print:p-0 print:m-0 print:bg-white print:bg-none"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top Back / Previous Bar */}
        <div className="print:hidden flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (effectiveStep > 1) {
                goToStep(effectiveStep - 1);
              } else if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate(ROUTES.HOME);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-brand-navy shadow-xs transition hover:bg-brand-navy hover:text-brand-yellow cursor-pointer"
          >
            <FontAwesomeIcon icon={isArabic ? faArrowRight : faArrowLeft} />
            <span>
              {effectiveStep > 1
                ? t('booking.nav.previous', isArabic ? 'السابق' : 'Previous')
                : isArabic
                  ? 'رجوع'
                  : 'Back'}
            </span>
          </button>
        </div>

        {/* Visual Stepper (Only on steps 1, 2, 3, 4) */}
        <div className="print:hidden">
          <BookingStepper
            currentStep={effectiveStep}
            onStepClick={(step) => {
              if (step < effectiveStep) goToStep(step);
            }}
            t={t}
          />
        </div>

        {/* STEP 1: Select Trip */}
        {effectiveStep === 1 && (
          <div className="animate-in fade-in duration-300">
            <StepTripSelect
              trips={tripsList}
              selectedTrip={selectedTrip}
              onSelectTrip={handleSelectTrip}
              initialActivity={initialActivity}
              invalidTripSlug={isInvalidTripParam ? tripSlug : ''}
              onClearTripFilter={() => setSearchParams({})}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* STEP 2: Guest & Booking Details */}
        {effectiveStep === 2 && (
          <div className="animate-in fade-in duration-300">
            <StepGuestDetails
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              selectedTrip={selectedTrip}
              onNext={() => {
                trackAddBookingDetails({
                  tripSlug: selectedTrip?.slug,
                  date: bookingData.date,
                  time: bookingData.time,
                  totalGuests:
                    (Number(bookingData.adults) || 1) +
                    (Number(bookingData.kids1to6) || 0) +
                    (Number(bookingData.kids7to12) || 0),
                  egyptianCount: bookingData.egyptianCount,
                  foreignCount: bookingData.foreignCount,
                  equipment: bookingData.equipment || selectedTrip?.act || 'kayak',
                });
                goToStep(3);
              }}
              onBack={() => goToStep(1)}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* STEP 3: Review & Payment Options */}
        {effectiveStep === 3 && (
          <div className="animate-in fade-in duration-300">
            <StepReviewPay
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              selectedTrip={selectedTrip}
              onNext={() => {
                trackInitiateCheckout({
                  tripSlug: selectedTrip?.slug,
                  date: bookingData.date,
                  time: bookingData.time,
                  totalAmount: bookingData.totalAmount || bookingData.amountToPay,
                  paymentMethod: bookingData.paymentType,
                });

                if (!savedBookingRef.current) {
                  savedBookingRef.current = true;
                  const currentUser = getCurrentUser();
                  const guests =
                    (Number(bookingData.adults) || 0) +
                    (Number(bookingData.kids1to6) || 0) +
                    (Number(bookingData.kids7to12) || 0);
                  const createdRecord = addBooking({
                    reference: bookingRef,
                    userId: currentUser?.id || 'guest',
                    email: currentUser?.email || '',
                    fullName: bookingData.fullName,
                    phone: bookingData.phone,
                    tripKey: selectedTrip?.key || '',
                    tripTitle: selectedTrip
                      ? t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug)
                      : '',
                    equipment: bookingData.equipment || selectedTrip?.act || 'kayak',
                    date: bookingData.date,
                    time: bookingData.time,
                    adults: bookingData.adults,
                    kids1to6: bookingData.kids1to6,
                    kids7to12: bookingData.kids7to12,
                    guests: guests || 1,
                    units: guests || 1,
                    nationality: bookingData.nationality,
                    totalAmount: bookingData.totalAmount,
                    amountToPay: bookingData.amountToPay,
                    remainingBalance: bookingData.remainingBalance,
                    status: 'pending',
                    source: 'web',
                    channel: 'B2C',
                  });

                  trackPurchase(createdRecord || {
                    reference: bookingRef,
                    totalAmount: bookingData.totalAmount,
                    tripKey: selectedTrip?.key,
                    tripTitle: selectedTrip?.slug,
                    equipment: bookingData.equipment,
                    guests,
                  });
                }
                goToStep(4);
              }}
              onBack={() => goToStep(2)}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* STEP 4: Payment & Invoice */}
        {effectiveStep === 4 && (
          <div className="animate-in fade-in duration-300">
            <StepPaymentInvoice
              bookingRef={bookingRef}
              bookingData={bookingData}
              selectedTrip={selectedTrip}
              onResetBooking={handleResetBooking}
              t={t}
              lang={lang}
            />
          </div>
        )}
      </div>
    </div>
  );
}
