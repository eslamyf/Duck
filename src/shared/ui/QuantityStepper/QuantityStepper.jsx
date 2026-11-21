export default function QuantityStepper({
  value = 20,
  onChange,
  min = 20,
  max = 150,
  step = 5,
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
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={disabled || currentVal <= min}
          aria-label={decrementLabel}
          className="w-12 h-12 rounded-full border-2 border-brand-navy bg-white text-brand-navy font-bold text-2xl flex items-center justify-center cursor-pointer transition-all hover:bg-brand-yellow hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 flex-shrink-0"
        >
          −
        </button>

        {showSlider && (
          <div className="flex-1 px-1">
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
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-brand-navy focus:outline-none"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={disabled || currentVal >= max}
          aria-label={incrementLabel}
          className="w-12 h-12 rounded-full border-2 border-brand-navy bg-white text-brand-navy font-bold text-2xl flex items-center justify-center cursor-pointer transition-all hover:bg-brand-yellow hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 flex-shrink-0"
        >
          +
        </button>

        <div className="min-w-[72px] text-center font-black text-2xl min-[901px]:text-3xl tabular-nums text-brand-navy select-none">
          {formatNum(currentVal)}
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
