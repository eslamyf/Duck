export default function SectionHeader({
  title,
  subtitle,
  tag,
  align = 'start',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  ...rest
}) {
  const alignClasses = {
    start: 'text-start items-start',
    center: 'text-center items-center mx-auto',
  };

  const alignClass = alignClasses[align] || alignClasses.start;

  return (
    <header className={`flex flex-col mb-7 min-[901px]:mb-9 ${alignClass} ${className}`.trim()} {...rest}>
      {tag && (
        <div className="mb-3">
          {tag}
        </div>
      )}
      {title && (
        <h2 className={`text-2xl min-[901px]:text-4xl font-bold text-brand-navy leading-tight tracking-tight mb-2 ${titleClassName}`.trim()}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`text-sm min-[901px]:text-base text-brand-navy/72 leading-relaxed max-w-[62ch] ${subtitleClassName}`.trim()}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
