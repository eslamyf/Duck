import { useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { useGroupStudio } from './hooks/useGroupStudio.js';
import { burstConfetti } from './confetti.js';
import GroupStage from './GroupStage.jsx';
import GroupProgressBar from './GroupProgressBar.jsx';
import GroupForm from './GroupForm.jsx';
import GroupSuccess from './GroupSuccess.jsx';

export default function GroupsPage() {
  const { t, lang } = useTranslation();
  const cardRef = useRef(null);

  const {
    state,
    step,
    setStep,
    submitted,
    setSubmitted,
    refCode,
    errors,
    setField,
    setSize,
    validateStep1,
    submitRequest,
  } = useGroupStudio({ t, lang });

  const scrollToCard = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleStepChange = useCallback((nextStep) => {
    setStep(nextStep);
    scrollToCard();
  }, [setStep, scrollToCard]);

  const handleSubmit = useCallback(() => {
    const result = submitRequest();
    if (result) {
      burstConfetti();
      scrollToCard();
    }
  }, [submitRequest, scrollToCard]);

  const handleEditAgain = useCallback(() => {
    setSubmitted(false);
    setStep(1);
    scrollToCard();
  }, [setSubmitted, setStep, scrollToCard]);

  return (
    <div className="w-full font-body">
      {/* 1. Hero Group Stage with Real Photo & Dynamic Counter */}
      <GroupStage
        state={state}
        t={t}
        lang={lang}
      />

      {/* 2. Main Booking Card Section */}
      <main className="relative z-30 max-w-[980px] mx-auto -mt-12 sm:-mt-16 px-4 pb-20">
        <div
          ref={cardRef}
          className="bg-white rounded-[28px] p-6 sm:p-9 shadow-[0_30px_70px_rgba(12,18,38,0.22)] border border-[rgba(20,125,159,0.14)] scroll-mt-24"
        >
          {/* Card Header (hidden on success) */}
          {!submitted && (
            <div className="space-y-1 pb-2">
              <h2 className="text-2xl min-[901px]:text-3xl font-black text-brand-navy flex items-center gap-2.5">
                <FontAwesomeIcon icon={faShip} className="text-brand-blue text-xl" />
                <span>{t('groupsPage.cardHeading')}</span>
              </h2>
              <p className="text-sm min-[901px]:text-base text-brand-navy/70 font-medium">
                {t('groupsPage.cardSubheading')}
              </p>
            </div>
          )}

          {/* Dynamic Progress River connected to form state */}
          <GroupProgressBar
            state={state}
            step={step}
            submitted={submitted}
            t={t}
            lang={lang}
          />

          {/* Form or Success State */}
          {!submitted ? (
            <GroupForm
              state={state}
              step={step}
              setStep={handleStepChange}
              errors={errors}
              setField={setField}
              setSize={setSize}
              validateStep1={validateStep1}
              onSubmit={handleSubmit}
              t={t}
              lang={lang}
            />
          ) : (
            <GroupSuccess
              refCode={refCode}
              waUrl={submitRequest()?.waUrl || ''}
              onEditAgain={handleEditAgain}
              t={t}
            />
          )}
        </div>
      </main>
    </div>
  );
}
