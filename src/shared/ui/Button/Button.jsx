export default function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'start',
  fullWidth = false,
  className = '',
  disabled = false,
  pressed = undefined,
  ...rest
}) {
  const isPressed = pressed !== undefined ? pressed : rest['aria-pressed'];

  const baseClasses =
    'inline-flex items-center justify-center font-body rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary:
      'bg-brand-yellow text-brand-navy font-bold hover:bg-brand-yellow-hover shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'bg-transparent text-white border border-white/45 font-semibold hover:bg-white/15 active:bg-white/20',
    navy:
      'bg-brand-navy text-white font-semibold hover:bg-brand-blue shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    subtle:
      'bg-surface-mist text-brand-navy border border-[rgba(20,125,159,0.16)] font-bold hover:bg-brand-navy hover:text-brand-yellow',
    ghost:
      'bg-transparent text-inherit hover:bg-white/10',
    whatsapp:
      'bg-[#25D366] text-white font-bold shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95',
    chip: isPressed
      ? 'bg-brand-navy text-brand-yellow border-2 border-brand-navy shadow-md font-bold'
      : 'bg-white text-brand-navy/85 border border-[rgba(20,125,159,0.22)] font-semibold hover:bg-surface-mist hover:text-brand-navy',
    chipActive:
      'bg-brand-navy text-brand-yellow border-2 border-brand-navy shadow-md font-bold',
    chipDark: isPressed
      ? 'bg-brand-yellow text-brand-navy border-2 border-brand-yellow font-bold shadow-sm'
      : 'bg-white/10 text-white border border-white/25 font-semibold hover:bg-white/20',
  };

  const sizes = {
    xs: 'min-h-[28px] px-2.5 py-0.5 text-xs',
    sm: 'min-h-[36px] min-[901px]:min-h-[40px] px-3.5 min-[901px]:px-4 py-1.5 text-xs min-[901px]:text-[13.5px]',
    md: 'min-h-[48px] min-[901px]:min-h-[52px] px-7 py-2.5 text-base',
    lg: 'min-h-[54px] min-[901px]:min-h-[56px] px-8 py-3 text-lg',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const widthClass = fullWidth ? 'w-full' : 'w-fit';

  return (
    <Component
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={Component === 'button' ? disabled : undefined}
      aria-pressed={isPressed !== undefined ? Boolean(isPressed) : undefined}
      {...rest}
    >
      {icon && iconPosition === 'start' && (
        <span className="inline-flex items-center me-2 flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'end' && (
        <span className="inline-flex items-center ms-2 flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
    </Component>
  );
}
