import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faPrint,
  faCalendarDay,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import QRCodeSVG from '../booking/QRCodeSVG.jsx';
import PrintableInvoice from '../booking/PrintableInvoice.jsx';
import StatusBadge from './StatusBadge.jsx';
import { useTranslation } from '../../shared/i18n/index.js';
import { CONTACT } from '../../shared/config/constants.js';
import { TRIPS } from '../trips/tripsData.js';

export default function BookingDetailsModal({ booking, onClose }) {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  if (!booking) return null;

  const selectedTrip =
    TRIPS.find((item) => item.key === booking.tripKey) || TRIPS[0];
  const ref = booking.reference || booking.id;
  const totalAmount = Number(booking.totalAmount) || 0;
  const amountToPay = Number(booking.amountToPay) || totalAmount;
  const remaining = Math.max(0, totalAmount - amountToPay);

  const whatsappText = encodeURIComponent(
    isArabic
      ? `مرحباً DUCK، أرسل لكم إيصال الحجز رقم ${ref} للرحلة: ${booking.tripTitle || booking.tripKey}`
      : `Hello DUCK, sharing booking receipt ${ref} for: ${booking.tripTitle || booking.tripKey}`
  );
  const whatsappUrl = `${CONTACT.WHATSAPP}?text=${whatsappText}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 p-4 backdrop-blur-xs print:hidden">
        <div className="w-full max-w-lg rounded-[22px] border border-brand-blue/20 bg-surface-white p-5 sm:p-6 shadow-ocean">
          <div className="flex items-start justify-between gap-3 border-b border-brand-navy/10 pb-3.5">
            <div>
              <p className="font-mono text-xs font-bold text-brand-blue" dir="ltr">
                {ref}
              </p>
              <h3 className="mt-1 font-heading text-lg font-extrabold text-brand-navy">
                {booking.tripTitle || booking.tripKey}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-brand-navy/60 hover:bg-surface-mist hover:text-brand-navy cursor-pointer"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-4 rounded-2xl border border-brand-blue/16 bg-surface-mist p-3.5">
            <div className="mx-auto rounded-xl bg-surface-white p-2 border border-brand-blue/15">
              <QRCodeSVG value={ref} size={76} />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-brand-navy/60">{isArabic ? 'الحالة' : 'Status'}</span>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-navy/60">
                  <FontAwesomeIcon icon={faCalendarDay} className="me-1" />
                  {isArabic ? 'الموعد' : 'Schedule'}
                </span>
                <b className="font-mono" dir="ltr">
                  {booking.date} · {booking.time || '10:00'}
                </b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-navy/60">
                  <FontAwesomeIcon icon={faUsers} className="me-1" />
                  {isArabic ? 'الضيوف' : 'Guests'}
                </span>
                <b>{booking.guests || 1}</b>
              </div>
              <div className="flex items-center justify-between border-t border-brand-navy/10 pt-1.5">
                <span className="text-brand-navy/60">
                  {isArabic ? 'الإجمالي / المدفوع' : 'Total / Paid'}
                </span>
                <b className="font-mono text-brand-navy" dir="ltr">
                  {totalAmount} / {amountToPay} EGP
                </b>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-whatsapp px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>{isArabic ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-xs font-bold text-brand-yellow shadow-sm transition hover:bg-brand-blue hover:text-white cursor-pointer"
            >
              <FontAwesomeIcon icon={faPrint} />
              <span>{isArabic ? 'طباعة الفاتورة / الإيصال' : 'Print Invoice / Receipt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Printable Invoice rendered during window.print() */}
      <PrintableInvoice
        bookingRef={ref}
        bookingData={{
          fullName: booking.fullName,
          phone: booking.phone,
          date: booking.date,
          time: booking.time || '10:00',
          duration: 1,
          equipment: booking.equipment || 'kayak',
          adults: booking.adults || booking.guests || 1,
          kids1to6: booking.kids1to6 || 0,
          kids7to12: booking.kids7to12 || 0,
          nationality: booking.nationality || 'all_egyptian',
          subtotal: totalAmount,
          totalAmount,
          amountToPay,
          remainingBalance: remaining,
        }}
        selectedTrip={selectedTrip}
        t={t}
        lang={lang}
      />
    </>
  );
}
