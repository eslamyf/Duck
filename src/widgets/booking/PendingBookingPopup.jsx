import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTicket } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { useNotificationsSync } from '../../shared/hooks/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { CONTACT, buildWhatsAppUrl } from '../../shared/config/constants.js';
import {
  dismissPendingBooking,
  markPendingReceiptSent,
} from '../../entities/notification/index.js';

export default function PendingBookingPopup() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingBooking } = useNotificationsSync();

  if (!pendingBooking) {
    return null;
  }

  // Hide on invoice step itself to avoid redundant UI
  if (location.pathname === ROUTES.BOOKING && location.search.includes('step=4')) {
    return null;
  }

  const formatPrice = (p) =>
    Number(p).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  const waReceiptMessage = isArabic
    ? `مرحباً DUCK، أود تأكيد حجزي المبدئي:\n` +
      `رقم الحجز: ${pendingBooking.ref}\n` +
      `الرحلة: ${pendingBooking.tripTitle}\n` +
      `المبلغ: ${formatPrice(pendingBooking.amount)} ج.م\n` +
      `مرفق إيصال الدفع لتأكيد الحجز:`
    : `Hello DUCK, I want to confirm my pending booking:\n` +
      `Ref: ${pendingBooking.ref}\n` +
      `Trip: ${pendingBooking.tripTitle}\n` +
      `Amount: ${formatPrice(pendingBooking.amount)} EGP\n` +
      `Attached is the payment receipt for confirmation:`;

  const waUrl = buildWhatsAppUrl(waReceiptMessage, CONTACT.PHONE);

  const handleReturnToInvoice = () => {
    navigate(`${ROUTES.BOOKING}?ref=${encodeURIComponent(pendingBooking.ref)}&step=4`);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed bottom-5 start-5 z-[90] max-w-[calc(100vw-100px)] animate-in fade-in slide-in-from-bottom-3 duration-200 font-body"
      role="status"
      aria-label={t('booking.pendingPopup.title')}
    >
      <div className="inline-flex items-center gap-2 rounded-full border-2 border-brand-yellow bg-surface-white/95 px-2.5 py-1.5 text-brand-navy shadow-soft backdrop-blur-md">
        <button
          type="button"
          onClick={handleReturnToInvoice}
          title={t('booking.pendingPopup.returnToInvoiceBtn')}
          className="group flex min-w-0 items-center gap-2 text-start cursor-pointer focus-visible:outline-none"
        >
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs text-brand-navy shadow-xs transition-transform group-hover:scale-105">
            <FontAwesomeIcon icon={faTicket} />
            <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-brand-blue ring-2 ring-white" />
          </span>

          <span className="min-w-0 flex flex-col items-start">
            <span className="block font-mono text-[11px] font-extrabold leading-tight text-brand-navy">
              <bdi dir="ltr">{pendingBooking.ref}</bdi>
            </span>
            <span className="block max-w-[125px] sm:max-w-[170px] truncate text-[10.5px] font-bold leading-tight text-brand-blue">
              {pendingBooking.tripTitle || t('booking.pendingPopup.compactLabel')}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1 border-s border-brand-navy/10 ps-1.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markPendingReceiptSent}
            title={t('booking.pendingPopup.confirmWhatsAppBtn')}
            aria-label={t('booking.pendingPopup.confirmWhatsAppBtn')}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-whatsapp text-xs text-white shadow-xs transition-transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>

          <button
            type="button"
            onClick={dismissPendingBooking}
            title={t('booking.pendingPopup.dismiss')}
            aria-label={t('booking.pendingPopup.dismiss')}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-brand-navy/55 transition-colors hover:bg-surface-mist2 hover:text-brand-navy cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
}
