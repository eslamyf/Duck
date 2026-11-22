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
  inputClassName = '',
  labelClassName = '',
  size = 'md',
  startAdornment = null,
  endAdornment = null,
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
          className={`flex items-center justify-between gap-2 font-bold text-brand-navy ${
            size === 'sm' ? 'text-xs sm:text-sm mb-1' : 'text-sm min-[901px]:text-base mb-2'
          } ${labelClassName}`.trim()}
        >
          <span>
            {label}
            {required && <span className="text-error ms-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative w-full">
        {startAdornment && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-brand-navy/50">
            {startAdornment}
          </div>
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
          className={`w-full border-2 transition-all duration-200 font-semibold text-brand-navy placeholder:text-brand-navy/40 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${
            size === 'sm'
              ? Component === 'textarea'
                ? 'min-h-[72px] py-2 px-3 text-sm rounded-xl'
                : 'min-h-[38px] sm:min-h-[40px] py-1.5 sm:py-2 text-sm rounded-xl'
              : Component === 'textarea'
                ? 'min-h-[84px] py-3 px-4 text-base rounded-2xl'
                : 'min-h-[46px] sm:min-h-[50px] py-2 sm:py-2.5 text-base rounded-2xl'
          } ${startAdornment ? 'ps-11' : size === 'sm' ? 'ps-3.5' : 'ps-4'} ${
            endAdornment ? 'pe-12' : size === 'sm' ? 'pe-3.5' : 'pe-4'
          } ${
            error
              ? 'border-error bg-surface-mist focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border-brand-navy/15 bg-surface-mist hover:border-brand-navy/30 focus:border-brand-blue focus:bg-white'
          } ${inputClassName}`.trim()}
          {...rest}
        />

        {endAdornment && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-3">
            {endAdornment}
          </div>
        )}
      </div>

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
