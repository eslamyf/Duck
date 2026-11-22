import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { generateBookingRef } from '../../shared/config/constants.js';
import {
  BookingStepper,
  StepTripSelect,
  StepGuestDetails,
  StepReviewPay,
  StepPaymentInvoice,
} from '../../widgets/booking/index.js';

export default function BookingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const tripSlug = searchParams.get('trip');
  const refParam = searchParams.get('ref');
  const stepParam = parseInt(searchParams.get('step') || '0', 10);

  // 1. Initial Trip match
  const initialTrip = useMemo(() => {
    if (!tripSlug) return null;
    return TRIPS.find((item) => item.slug === tripSlug) || null;
  }, [tripSlug]);

  const [userSelectedTrip, setUserSelectedTrip] = useState(null);
  const selectedTrip = userSelectedTrip || initialTrip;

  // 2. Initial Step
  // If trip is in URL: start on step 2 (guest details) as per spec. If refParam & step=4: start on 4.
  const [currentStep, setCurrentStep] = useState(() => {
    if (stepParam >= 1 && stepParam <= 4) return stepParam;
    if (initialTrip) return 2;
    return 1;
  });

  // 3. Unique Booking Ref (generated when reaching step 4 or restored from URL)
  const [bookingRef, setBookingRef] = useState(() => {
    if (refParam) return refParam;
    return generateBookingRef();
  });

  // Today ISO
  const [todayIso] = useState(() => new Date().toISOString().split('T')[0]);

  // 4. Central Booking Form State
  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 1,
    equipment: initialTrip?.act || 'kayak',
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
      className="min-h-screen bg-surface-sand text-brand-navy pt-28 min-[901px]:pt-36 pb-20 px-4 sm:px-6 relative isolate selection:bg-brand-yellow selection:text-brand-navy font-body"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Visual Stepper (Only on steps 1, 2, 3, 4) */}
        <div className="print:hidden">
          <BookingStepper
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) goToStep(step);
            }}
            t={t}
          />
        </div>

        {/* STEP 1: Select Trip */}
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-300">
            <StepTripSelect
              selectedTrip={selectedTrip}
              onSelectTrip={handleSelectTrip}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* STEP 2: Guest & Booking Details */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-300">
            <StepGuestDetails
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              selectedTrip={selectedTrip}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* STEP 3: Review & Payment Options */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-300">
            <StepReviewPay
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              selectedTrip={selectedTrip}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
              t={t}
              lang={lang}
            />
          </div>
        )}

        {/* STEP 4: Payment & Invoice */}
        {currentStep === 4 && (
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
