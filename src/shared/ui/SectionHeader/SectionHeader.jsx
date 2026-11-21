export default function SectionHeader({
  title,
  subtitle,
  tag,
  align = 'start',
  theme = 'light',
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
  const isDark = theme === 'dark';

  const defaultTitleClass = isDark ? 'text-white' : 'text-brand-navy';
  const defaultSubtitleClass = isDark ? 'text-white/80' : 'text-brand-navy/72';

  return (
    <header className={`flex flex-col mb-7 min-[901px]:mb-9 ${alignClass} ${className}`.trim()} {...rest}>
      {tag && (
        <div className="mb-3">
          {tag}
        </div>
      )}
      {title && (
        <h2 className={`text-2xl min-[901px]:text-4xl font-bold leading-tight tracking-tight mb-2 ${defaultTitleClass} ${titleClassName}`.trim()}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`text-sm min-[901px]:text-base leading-relaxed max-w-[62ch] ${defaultSubtitleClass} ${subtitleClassName}`.trim()}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
