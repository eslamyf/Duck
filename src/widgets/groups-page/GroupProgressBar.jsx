import duckIcon from '../../shared/assets/icons/Artboard_8-removebg-preview.png';

export default function GroupProgressBar({ step, submitted, t, lang }) {
  // Percentage calculation: step 0 -> 12%, step 1 -> 65%, submitted -> 100%
  const percent = submitted ? 100 : step === 0 ? 12 : 65;

  return (
    <div className="w-full my-5" aria-hidden="false">
      {/* Water River Track */}
      <div className="relative h-4 rounded-full bg-[#dbe8ee] overflow-visible">
        {/* Animated Nile Water Stream */}
        <div
          className="absolute inset-y-0 start-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percent}%`,
            background:
              'repeating-linear-gradient(135deg, var(--color-blue) 0 14px, #1a95bb 14px 28px)',
          }}
        />

        {/* Floating Duck Icon Surfing on the River */}
        <div
          className="absolute -top-4 w-9 h-9 transition-all duration-700 ease-out select-none drop-shadow-md pointer-events-none"
          style={{
            [lang === 'ar' ? 'right' : 'left']: `${percent}%`,
            transform: `translateX(${lang === 'ar' ? '50%' : '-50%'})`,
          }}
        >
          <img
            src={duckIcon}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>
      </div>

      {/* Step Indicator Labels */}
      <div className="flex items-center justify-between mt-3 text-xs min-[901px]:text-sm font-bold">
        <span
          className={`transition-colors duration-300 ${
            step === 0 && !submitted ? 'text-brand-blue font-extrabold' : 'text-brand-navy/50'
          }`}
        >
          {t('groupsPage.progressStep1')}
        </span>
        <span
          className={`transition-colors duration-300 ${
            step === 1 && !submitted ? 'text-brand-blue font-extrabold' : 'text-brand-navy/50'
          }`}
        >
          {t('groupsPage.progressStep2')}
        </span>
      </div>
    </div>
  );
}
