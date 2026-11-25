import { useTranslation } from '../../shared/i18n/index.js';

const STATUS_VARIANTS = {
  pending: 'bg-brand-yellow/25 text-brand-navy border-brand-yellow/60',
  confirmed: 'bg-brand-blue/12 text-brand-blue border-brand-blue/30',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-brand-navy/10 text-brand-navy border-brand-navy/20',
  cancelled: 'bg-red-50 text-brand-error border-red-200',
  refunded: 'bg-slate-100 text-slate-600 border-slate-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

const LABELS = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  paid: { ar: 'مدفوع', en: 'Paid' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
  refunded: { ar: 'مسترد', en: 'Refunded' },
  active: { ar: 'نشط', en: 'Active' },
  inactive: { ar: 'غير نشط', en: 'Inactive' },
};

export default function StatusBadge({ status = 'pending', label }) {
  const { lang } = useTranslation();
  const key = String(status).toLowerCase();
  const styles = STATUS_VARIANTS[key] || STATUS_VARIANTS.pending;
  const text = label || LABELS[key]?.[lang] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold whitespace-nowrap ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}
