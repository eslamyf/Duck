export default function QuantityStepper({
  value = 20,
  onChange,
  min = 20,
  max = 150,
  step = 1,
  label,
  id = 'quantity-stepper',
  showSlider = true,
  presets = [20, 30, 50, 75, 100],
  lang = 'ar',
  disabled = false,
  className = '',
  decrementLabel = 'أقل',
  incrementLabel = 'أكتر',
}) {
  const currentVal = Number(value) || min;

  const handleStep = (delta) => {
    if (disabled || !onChange) return;
    const next = Math.max(min, Math.min(max, currentVal + delta * step));
    onChange(next);
  };

  const handleSliderChange = (e) => {
    if (disabled || !onChange) return;
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    if (disabled || !onChange) return;
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  const formatNum = (n) => Number(n).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');

  const percent = Math.max(0, Math.min(100, ((currentVal - min) / (max - min)) * 100));

  return (
    <div className={`w-full ${className}`.trim()}>
      {label && (
        <div className="flex items-center justify-between gap-2 font-bold text-sm min-[901px]:text-base text-brand-navy mb-2">
          <span>{label}</span>
          <span className="text-xs min-[901px]:text-sm font-normal text-brand-navy/60">
            {lang === 'ar' ? `يبدأ من ${formatNum(min)} فرد` : `Starts from ${formatNum(min)} people`}
          </span>
        </div>
      )}

      {/* Stepper Row */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={disabled || currentVal <= min}
          aria-label={decrementLabel}
          className="w-11 h-11 min-[901px]:w-12 min-[901px]:h-12 rounded-full border-2 border-brand-navy bg-white text-brand-navy font-bold text-2xl flex items-center justify-center cursor-pointer transition-all hover:bg-brand-yellow hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 flex-shrink-0"
        >
          −
        </button>

        {showSlider && (
          <div className="flex-1 px-1 min-w-[100px]">
            <input
              type="range"
              id={id}
              min={min}
              max={max}
              step={step}
              value={currentVal}
              onChange={handleSliderChange}
              disabled={disabled}
              aria-label={label || 'Number of people'}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentVal}
              style={{
                background: `linear-gradient(to ${lang === 'ar' ? 'left' : 'right'}, var(--color-blue) ${percent}%, #dbe8ee ${percent}%)`,
              }}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-brand-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={disabled || currentVal >= max}
          aria-label={incrementLabel}
          className="w-11 h-11 min-[901px]:w-12 min-[901px]:h-12 rounded-full border-2 border-brand-navy bg-white text-brand-navy font-bold text-2xl flex items-center justify-center cursor-pointer transition-all hover:bg-brand-yellow hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 flex-shrink-0"
        >
          +
        </button>

        {/* Direct Number Input Box */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={currentVal}
            onChange={handleInputChange}
            disabled={disabled}
            aria-label={label || 'Enter custom number of people'}
            className="w-16 min-[901px]:w-20 h-11 min-[901px]:h-12 text-center font-black text-lg min-[901px]:text-xl tabular-nums text-brand-navy bg-surface-mist border-2 border-brand-navy/25 rounded-2xl focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-yellow focus:outline-none transition-all shadow-xs"
          />
          <span className="text-xs min-[901px]:text-sm font-bold text-brand-navy/70 select-none hidden min-[400px]:inline">
            {lang === 'ar' ? 'فرد' : 'ppl'}
          </span>
        </div>
      </div>

      {/* Presets Chips */}
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-3" role="group" aria-label="Quick presets">
          {presets.map((preset) => {
            const isSelected = currentVal === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => !disabled && onChange && onChange(preset)}
                aria-pressed={isSelected}
                className={`min-h-[36px] px-3.5 py-1 rounded-full font-bold text-xs min-[901px]:text-sm transition-all duration-200 cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-brand-yellow border-brand-navy text-brand-navy shadow-xs'
                    : 'bg-white border-brand-navy/15 text-brand-navy hover:bg-brand-yellow hover:border-brand-navy'
                }`}
              >
                {formatNum(preset)}+
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
