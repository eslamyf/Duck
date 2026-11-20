export default function Badge({
  children,
  as: Component = 'span',
  variant = 'tag',
  size = 'md',
  icon = null,
  className = '',
  ...rest
}) {
  const baseClasses =
    'inline-flex items-center font-body rounded-full transition-colors w-fit';

  const variants = {
    tag: 'bg-brand-yellow/15 text-brand-yellow font-bold tracking-[0.18em] uppercase',
    safety: 'bg-white/6 text-brand-yellow border border-white/10 font-semibold',
    weather: 'bg-white/8 border border-white/14 text-white font-medium',
    subtle: 'bg-surface-mist text-brand-blue border border-[rgba(20,125,159,0.16)] font-semibold',
    accent: 'bg-brand-yellow text-brand-navy font-bold',
    outline: 'bg-transparent text-white border border-white/20 font-medium',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
    lg: 'px-4 py-2 text-sm gap-2',
  };

  const variantClass = variants[variant] || variants.tag;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <Component className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim()} {...rest}>
      {icon && (
        <span className="inline-flex items-center flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Component>
  );
}
