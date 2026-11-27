import { useMemo } from 'react';
import duckIcon from '../../shared/assets/icons/duck-mark-192w.webp';

export default function GroupProgressBar({ state, step, setStep, submitted, t, lang }) {
  // Dynamic percentage calculation based on user interaction & data entry:
  // Step 0: range 14% to 50% as user chooses options
  // Step 1: range 50% to 95% as user types org name, contact name, whatsapp, notes
  // Submitted: 100%
  const percent = useMemo(() => {
    if (submitted) return 100;
    if (step === 0) {
      let p = 14;
      if (state?.type) p += 7;
      if (state?.size && Number(state.size) > 20) p += 7;
      if (state?.act) p += 7;
      if (state?.loc !== undefined && state?.loc !== null) p += 7;
      if (state?.date) p += 8;
      return Math.min(p, 50);
    }
    // Step 1: user is actively typing personal & booking details
    let p = 50;
    if (state?.org?.trim()) {
      p += Math.min(12, Math.max(3, state.org.trim().length * 2));
    }
    if (state?.nm?.trim()) {
      p += Math.min(13, Math.max(3, state.nm.trim().length * 2));
    }
    if (state?.ph?.trim()) {
      p += Math.min(15, Math.max(3, Math.floor(state.ph.trim().length * 1.5)));
    }
    if (state?.notes?.trim()) {
      p += 5;
    }
    return Math.min(p, 95);
  }, [state, step, submitted]);

  return (
    <div className="w-full my-6" aria-hidden="false">
      {/* Water River Track */}
      <div className="relative h-4 rounded-full bg-[#dbe8ee]">
        {/* Animated Nile Water Stream */}
        <div
          className="absolute inset-y-0 start-0 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percent}%`,
            background:
              'repeating-linear-gradient(135deg, var(--color-blue) 0 14px, #1a95bb 14px 28px)',
          }}
        />

        {/* Floating Duck Surfing on the River */}
        <div
          className="absolute -top-3.5 w-11 h-11 rounded-full bg-white shadow-md border-2 border-brand-yellow flex items-center justify-center p-1 overflow-hidden transition-all duration-300 ease-out select-none drop-shadow-md pointer-events-none"
          style={{
            [lang === 'ar' ? 'right' : 'left']: `${percent}%`,
            transform: `translateX(${lang === 'ar' ? '50%' : '-50%'})`,
          }}
        >
          <img
            src={duckIcon}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Step Indicator Labels */}
      <div className="flex items-center justify-between mt-3 text-xs min-[901px]:text-sm font-bold">
        <button
          type="button"
          onClick={() => setStep && !submitted && setStep(0)}
          disabled={submitted || step === 0}
          className={`transition-colors duration-300 text-start ${
            step === 0 && !submitted
              ? 'text-brand-blue font-extrabold cursor-default'
              : 'text-brand-navy/60 hover:text-brand-navy hover:underline cursor-pointer'
          }`}
        >
          {t('groupsPage.progressStep1')}
        </button>
        <button
          type="button"
          disabled
          className={`transition-colors duration-300 text-end ${
            step === 1 && !submitted ? 'text-brand-blue font-extrabold' : 'text-brand-navy/50'
          }`}
        >
          {t('groupsPage.progressStep2')}
        </button>
      </div>
    </div>
  );
}
