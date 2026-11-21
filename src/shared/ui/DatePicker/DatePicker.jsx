export default function DatePicker({
  label,
  id,
  name,
  value,
  onChange,
  min,
  max,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const inputId = id || name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className={`w-full ${className}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center justify-between gap-2 font-bold text-sm min-[901px]:text-base text-brand-navy mb-2"
        >
          <span>
            {label}
            {required && <span className="text-error ms-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}
      <input
        type="date"
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        aria-required={required ? 'true' : undefined}
        className={`w-full min-h-[56px] px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-semibold text-base text-brand-navy bg-surface-mist hover:border-brand-navy/30 focus:border-brand-blue focus:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' : 'border-brand-navy/15'
        }`}
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className="text-error text-xs min-[901px]:text-sm font-bold mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
