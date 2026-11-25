import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TONE_CLASSES = {
  navy: 'bg-brand-navy/10 text-brand-navy',
  blue: 'bg-brand-blue/12 text-brand-blue',
  yellow: 'bg-brand-yellow/35 text-brand-navy',
  success: 'bg-emerald-50 text-emerald-700',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'blue',
}) {
  return (
    <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-4 sm:p-5 shadow-card transition-shadow hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-navy/65">{title}</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-brand-navy/55">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              TONE_CLASSES[tone] || TONE_CLASSES.blue
            }`}
          >
            <FontAwesomeIcon icon={icon} className="text-base" />
          </div>
        )}
      </div>
    </div>
  );
}
