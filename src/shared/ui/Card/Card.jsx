export default function Card({
  children,
  as: Component = 'div',
  variant = 'default',
  padding = 'md',
  className = '',
  ...rest
}) {
  const baseClasses = 'font-body transition-all duration-200';

  const variants = {
    default:
      'bg-white border border-[rgba(20,125,159,0.16)] rounded-[22px] shadow-[0_12px_32px_rgba(12,18,38,0.08)]',
    navy:
      'bg-brand-navy border border-white/8 text-white rounded-[22px] shadow-[0_20px_48px_rgba(20,125,159,0.12)]',
    glass:
      'bg-white/75 backdrop-blur-[14px] border border-white/20 rounded-[22px] shadow-[0_12px_32px_rgba(12,18,38,0.08)]',
    subtle:
      'bg-surface-mist border border-[rgba(20,125,159,0.16)] rounded-[22px]',
    plain:
      'bg-transparent border-0 shadow-none',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3 min-[901px]:p-4',
    md: 'p-5 min-[901px]:p-6',
    lg: 'p-7 min-[901px]:p-9',
  };

  const variantClass = variants[variant] || variants.default;
  const paddingClass = paddings[padding] || paddings.md;

  return (
    <Component className={`${baseClasses} ${variantClass} ${paddingClass} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}
