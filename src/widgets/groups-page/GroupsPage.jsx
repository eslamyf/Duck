import { useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { useGroupStudio } from '../../shared/hooks/index.js';
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
    waUrl,
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
      scrollToCard();
    }
  }, [submitRequest, scrollToCard]);

  const handleEditAgain = useCallback(() => {
    setSubmitted(false);
    setStep(1);
    scrollToCard();
  }, [setSubmitted, setStep, scrollToCard]);

  return (
    <div className="w-full font-body print:p-0 print:m-0">
      {/* 1. Hero Group Stage with Real Photo & Dynamic Counter */}
      <div className="print:hidden">
        <GroupStage
          state={state}
          t={t}
          lang={lang}
        />
      </div>

      {/* 2. Main Booking Card Section */}
      <main className="relative z-30 max-w-[980px] mx-auto -mt-12 sm:-mt-16 px-4 pb-20 print:m-0 print:p-0 print:max-w-none print:static">
        <div
          ref={cardRef}
          className="bg-white rounded-[28px] p-6 sm:p-9 shadow-[0_30px_70px_rgba(12,18,38,0.22)] border border-[rgba(20,125,159,0.14)] scroll-mt-24 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none"
        >
          {/* Card Header (hidden on success or print) */}
          {!submitted && (
            <div className="space-y-1 pb-2 print:hidden">
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
          <div className="print:hidden">
            <GroupProgressBar
              state={state}
              step={step}
              setStep={handleStepChange}
              submitted={submitted}
              t={t}
              lang={lang}
            />
          </div>

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
              state={state}
              refCode={refCode}
              waUrl={waUrl}
              onEditAgain={handleEditAgain}
              t={t}
              lang={lang}
            />
          )}
        </div>
      </main>
    </div>
  );
}
