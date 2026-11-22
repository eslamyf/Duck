import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faXmark,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { CONTACT, buildWhatsAppUrl } from '../../shared/config/constants.js';

function getStoredPendingBooking() {
  if (typeof window === 'undefined') return null;
  if (sessionStorage.getItem('duck_pending_dismissed') === 'true') return null;
  try {
    const stored = localStorage.getItem('duck_pending_booking');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        parsed &&
        parsed.status === 'pending_confirmation' &&
        !parsed.receiptSent &&
        parsed.ref
      ) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export default function PendingBookingPopup() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingBooking, setPendingBooking] = useState(getStoredPendingBooking);

  useEffect(() => {
    const handleStorage = () => {
      setPendingBooking(getStoredPendingBooking());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!pendingBooking) {
    return null;
  }

  // Do not show on step 4 of booking page itself to avoid redundant clutter
  if (location.pathname === ROUTES.BOOKING && location.search.includes('step=4')) {
    return null;
  }

  const formatPrice = (p) =>
    Number(p).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  // WhatsApp confirm link
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

  const handleConfirmOnWhatsApp = () => {
    try {
      const updated = { ...pendingBooking, receiptSent: true, status: 'receipt_sent' };
      localStorage.setItem('duck_pending_booking', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setPendingBooking(null);
  };

  const handleReturnToInvoice = () => {
    navigate(`${ROUTES.BOOKING}?ref=${pendingBooking.ref}&step=4`);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('duck_pending_dismissed', 'true');
    setPendingBooking(null);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-5 sm:max-w-md z-[9990] animate-in fade-in slide-in-from-bottom-4 duration-300 font-body"
      role="dialog"
      aria-labelledby="pending-booking-heading"
      aria-modal="false"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-brand-yellow ring-4 ring-black/5 text-brand-navy">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-brand-navy flex items-center justify-center font-bold text-sm shadow-xs">
              <FontAwesomeIcon icon={faClock} />
            </span>
            <div>
              <h3 id="pending-booking-heading" className="font-heading font-black text-sm text-brand-navy">
                {t('booking.pendingPopup.title')}
              </h3>
              <p className="font-mono text-xs font-bold text-brand-blue" dir="ltr">
                {pendingBooking.ref}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label={t('booking.pendingPopup.dismiss')}
            className="w-7 h-7 rounded-full bg-surface-mist hover:bg-slate-200 text-brand-navy/60 hover:text-brand-navy flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body Message */}
        <p className="text-xs sm:text-sm text-brand-navy/80 font-medium py-3 leading-relaxed">
          {t('booking.pendingPopup.message', {
            ref: pendingBooking.ref,
            trip: pendingBooking.tripTitle,
          })}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Action 1: WhatsApp Confirm */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleConfirmOnWhatsApp}
            className="w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
            <span>{t('booking.pendingPopup.confirmWhatsAppBtn')}</span>
          </a>

          {/* Action 2 & 3: Return to invoice & Remind Later */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleReturnToInvoice}
              className="flex-1 py-2 rounded-xl bg-surface-mist hover:bg-slate-200 text-brand-navy font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-black/5"
            >
              <FontAwesomeIcon icon={faTicket} className="text-brand-blue" />
              <span>{t('booking.pendingPopup.returnToInvoiceBtn')}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="py-2 px-3 rounded-xl hover:bg-surface-mist text-brand-navy/60 hover:text-brand-navy font-semibold text-xs transition-colors cursor-pointer"
            >
              {t('booking.pendingPopup.remindLaterBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
