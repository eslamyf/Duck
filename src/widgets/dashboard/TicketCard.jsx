import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faClock,
  faUsers,
  faLocationDot,
  faPrint,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import QRCodeSVG from '../booking/QRCodeSVG.jsx';
import StatusBadge from './StatusBadge.jsx';
import { useTranslation } from '../../shared/i18n/index.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';
import { TRIPS } from '../trips/tripsData.js';

/**
 * Reusable Digital Ticket Card with inline QR Code aligned with Final_4.html (.tkcard).
 */
export default function TicketCard({ booking, onOpenDetails, onCancel }) {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  if (!booking) return null;

  const ref = booking.reference || booking.id;
  const matchedTrip = TRIPS.find((item) => item.key === booking.tripKey);
  const locKey = matchedTrip?.loc || 'aswan';
  const meetingPoint = t(
    `map.points.${locKey}.meetPoint`,
    t(`destinations.items.${locKey}.title`, locKey)
  );
  const totalAmount = Number(booking.totalAmount) || 0;
  const adults = Number(booking.adults) || Number(booking.guests) || 1;
  const childrenCount =
    (Number(booking.kids1to6) || 0) + (Number(booking.kids7to12) || 0);

  const canCancel = ['pending', 'confirmed'].includes(
    String(booking.status).toLowerCase()
  );

  const whatsappUrl = buildWhatsAppUrl(
    isArabic
      ? `حجز ${ref} - ${booking.tripTitle || booking.tripKey} (${booking.date} ${booking.time || '10:00'})`
      : `Booking ${ref} - ${booking.tripTitle || booking.tripKey} (${booking.date} ${booking.time || '10:00'})`
  );

  return (
    <article className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-4 sm:p-5 shadow-card flex flex-col gap-3">
      {/* Top Row: Ref + Title + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <b className="font-mono text-xs font-bold text-brand-blue" dir="ltr">
            {ref}
          </b>
          <h4 className="mt-0.5 font-heading text-base font-extrabold text-brand-navy leading-snug">
            {booking.tripTitle || booking.tripKey}
          </h4>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-navy/75">
        <span className="inline-flex items-center gap-1" dir="ltr">
          <FontAwesomeIcon icon={faCalendarDay} className="text-brand-blue" />
          {booking.date}
        </span>
        <span className="inline-flex items-center gap-1" dir="ltr">
          <FontAwesomeIcon icon={faClock} className="text-brand-blue" />
          {booking.time || '10:00'}
        </span>
        <span className="inline-flex items-center gap-1">
          <FontAwesomeIcon icon={faUsers} className="text-brand-blue" />
          {adults} {isArabic ? 'بالغ' : 'adults'}
          {childrenCount > 0 &&
            ` + ${childrenCount} ${isArabic ? 'أطفال' : 'child'}`}
        </span>
      </div>

      {/* QR + Price + Meeting Point Box (.tkcard-qr) */}
      <div className="grid grid-cols-1 sm:grid-cols-[88px_1fr] items-center gap-3.5 rounded-[14px] border border-brand-blue/16 bg-surface-mist p-3">
        <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-xl border border-brand-blue/15 bg-surface-white p-1.5">
          <QRCodeSVG value={ref} size={76} />
        </div>

        <div className="min-w-0 space-y-1">
          <b className="block font-heading text-base font-extrabold text-brand-blue">
            {totalAmount.toLocaleString(isArabic ? 'ar-EG' : 'en-US')}{' '}
            {isArabic ? 'ج.م' : 'EGP'}
          </b>
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-brand-navy/80">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="mt-0.5 shrink-0 text-brand-navy/60"
            />
            <span>{meetingPoint}</span>
          </p>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
        {onOpenDetails && (
          <button
            type="button"
            onClick={() => onOpenDetails(booking)}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-brand-navy px-4 py-1.5 text-xs font-bold text-brand-yellow shadow-xs transition hover:bg-brand-blue hover:text-white cursor-pointer"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>{isArabic ? 'التذكرة والفاتورة' : 'Ticket & Invoice'}</span>
          </button>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-brand-whatsapp px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:opacity-90"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
          <span>{isArabic ? 'واتساب الدعم' : 'WhatsApp Support'}</span>
        </a>

        {canCancel && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 cursor-pointer"
          >
            <FontAwesomeIcon icon={faBan} />
            <span>{isArabic ? 'إلغاء (سياسة ٢٤ ساعة)' : 'Cancel (24h Policy)'}</span>
          </button>
        )}
      </div>
    </article>
  );
}
