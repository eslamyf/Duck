import DuckIcon from '../Icon/DuckIcon.jsx';

export default function Checkbox({
  label,
  id,
  name,
  checked = false,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) {
  const checkboxId = id || name;
  const errorId = error && checkboxId ? `${checkboxId}-error` : undefined;
  const helperId = helperText && checkboxId ? `${checkboxId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`w-full ${className}`.trim()}>
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-start gap-3 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            type="checkbox"
            id={checkboxId}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-required={required ? 'true' : undefined}
            className="peer sr-only"
            {...rest}
          />
          <div
            className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
              checked
                ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                : error
                ? 'bg-surface-mist border-error'
                : 'bg-white border-brand-navy/25 hover:border-brand-blue'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-brand-blue/30 peer-focus-visible:ring-offset-1`}
          >
            {checked && <DuckIcon icon="faCheck" className="text-xs text-white" />}
          </div>
        </div>

        {label && (
          <span className="text-sm font-semibold text-brand-navy/85 leading-tight">
            {label}
            {required && <span className="text-error ms-1" aria-hidden="true">*</span>}
          </span>
        )}
      </label>

      {error && (
        <p id={errorId} role="alert" className="text-error text-xs font-bold mt-1.5 ms-8">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-brand-navy/60 text-xs mt-1.5 ms-8">
          {helperText}
        </p>
      )}
    </div>
  );
}
