export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  inputMode,
  dir,
  className = '',
  as: Component = 'input',
  rows = 3,
  ...rest
}) {
  const inputId = id || name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

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
      <Component
        id={inputId}
        name={name}
        type={Component === 'input' ? type : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        dir={dir}
        rows={Component === 'textarea' ? rows : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        aria-required={required ? 'true' : undefined}
        className={`w-full rounded-2xl border-2 transition-all duration-200 font-semibold text-base text-brand-navy placeholder:text-brand-navy/40 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${
          Component === 'textarea' ? 'min-h-[84px] py-3 px-4 resize-y' : 'min-h-[56px] px-4 py-3'
        } ${
          error
            ? 'border-error bg-surface-mist focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-brand-navy/15 bg-surface-mist hover:border-brand-navy/30 focus:border-brand-blue focus:bg-white'
        }`}
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className="text-error text-xs min-[901px]:text-sm font-bold mt-1.5 flex items-center gap-1">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-brand-navy/60 text-xs min-[901px]:text-sm mt-1.5">
          {helperText}
        </p>
      )}
    </div>
  );
}
