import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faSailboat,
  faUsers,
  faCreditCard,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';

const STEP_ICONS = [faSailboat, faUsers, faCreditCard, faTicket];

export default function BookingStepper({
  currentStep = 1,
  onStepClick,
  t,
}) {
  const steps = [
    { number: 1, title: t('booking.steps.tripSelect') },
    { number: 2, title: t('booking.steps.guestDetails') },
    { number: 3, title: t('booking.steps.reviewPay') },
    { number: 4, title: t('booking.steps.paymentInvoice') },
  ];

  return (
    <nav
      aria-label={t('booking.stepperAria')}
      className="w-full max-w-3xl mx-auto px-4 py-2"
    >
      <ol className="flex items-center justify-between relative">
        {/* Background track line */}
        <div
          className="absolute top-1/2 -translate-y-1/2 inset-x-6 h-1 bg-surface-mist border border-black/5 -z-0"
          aria-hidden="true"
        >
          {/* Active progress fill */}
          <div
            className="h-full bg-brand-yellow transition-all duration-300 ease-out"
            style={{
              width: `${((Math.min(currentStep, 4) - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = isCompleted && onStepClick;
          const Icon = STEP_ICONS[idx];

          return (
            <li
              key={step.number}
              className="relative z-10 flex flex-col items-center group"
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm transition-all duration-200 outline-none ${
                  isCurrent
                    ? 'bg-brand-yellow text-brand-navy shadow-md ring-4 ring-brand-yellow/30 scale-105'
                    : isCompleted
                    ? 'bg-brand-navy text-brand-yellow hover:scale-105 cursor-pointer shadow-sm'
                    : 'bg-white text-brand-navy/40 border-2 border-slate-200 shadow-xs cursor-default'
                }`}
              >
                {isCompleted ? (
                  <FontAwesomeIcon icon={faCheck} className="text-base" />
                ) : (
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={Icon} className="text-xs sm:text-sm" />
                  </span>
                )}
              </button>

              <span
                className={`text-[11px] sm:text-xs font-bold mt-2 text-center transition-colors max-w-[75px] sm:max-w-[100px] leading-tight ${
                  isCurrent
                    ? 'text-brand-navy font-black'
                    : isCompleted
                    ? 'text-brand-navy/80'
                    : 'text-brand-navy/40'
                }`}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
