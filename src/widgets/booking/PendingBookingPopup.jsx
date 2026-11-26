import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faTicket,
  faHourglassHalf,
  faChevronUp,
  faChevronDown,
  faCalendarDay,
  faCopy,
  faCheck,
  faArrowUpRightFromSquare,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { useNotificationsSync } from '../../shared/hooks/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { CONTACT, buildWhatsAppUrl } from '../../shared/config/constants.js';
import {
  dismissPendingBooking,
  markPendingReceiptSent,
} from '../../entities/notification/index.js';
import { getAllBookings } from '../../entities/booking/api/bookingService.js';

export default function PendingBookingPopup() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingBooking } = useNotificationsSync();

  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  if (!pendingBooking) {
    return null;
  }

  // Hide on invoice step itself to avoid redundant UI
  if (location.pathname === ROUTES.BOOKING && location.search.includes('step=4')) {
    return null;
  }

  // Find any extra stored booking details if available
  const allBookings = getAllBookings();
  const matchedBooking = allBookings.find(
    (b) => b.reference === pendingBooking.ref || b.id === pendingBooking.ref
  );

  const bookingDate = pendingBooking.date || matchedBooking?.date;
  const bookingTime = pendingBooking.time || matchedBooking?.time;
  const amountDue = pendingBooking.amount || matchedBooking?.amountToPay || matchedBooking?.totalAmount;

  const formatPrice = (p) =>
    Number(p || 0).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  const waReceiptMessage = isArabic
    ? `مرحباً DUCK، أود تأكيد حجزي المبدئي:\n` +
      `رقم الحجز: ${pendingBooking.ref}\n` +
      `الرحلة: ${pendingBooking.tripTitle}\n` +
      (bookingDate ? `التاريخ: ${bookingDate}\n` : '') +
      (amountDue ? `المبلغ: ${formatPrice(amountDue)} ج.م\n` : '') +
      `مرفق إيصال الدفع لتأكيد الحجز:`
    : `Hello DUCK, I want to confirm my pending booking:\n` +
      `Ref: ${pendingBooking.ref}\n` +
      `Trip: ${pendingBooking.tripTitle}\n` +
      (bookingDate ? `Date: ${bookingDate}\n` : '') +
      (amountDue ? `Amount: ${formatPrice(amountDue)} EGP\n` : '') +
      `Attached is the payment receipt for confirmation:`;

  const waUrl = buildWhatsAppUrl(waReceiptMessage, CONTACT.PHONE);

  const handleReturnToInvoice = () => {
    navigate(`${ROUTES.BOOKING}?ref=${encodeURIComponent(pendingBooking.ref)}&step=4`);
  };

  const handleCopyRef = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(pendingBooking.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed bottom-[154px] md:bottom-5 start-4 md:start-5 z-[90] max-w-[calc(100vw-32px)] md:max-w-[420px] font-body transition-all duration-300"
      role="status"
      aria-label={t('booking.pendingPopup.title')}
    >
      {/* 1. Expandable Quick Summary Card (التفاصيل المختصرة للحجز غير المؤكد) */}
      {isExpanded && (
        <div className="mb-2.5 w-full rounded-2xl border-2 border-brand-yellow/80 bg-white p-4 text-brand-navy shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Card Top: Unconfirmed Status Header */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-navy/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800 border border-amber-200">
                <FontAwesomeIcon icon={faHourglassHalf} className="text-[10px]" />
                <span>{t('booking.pendingPopup.statusUnconfirmed')}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-brand-navy/50 hover:bg-surface-mist hover:text-brand-navy transition-colors cursor-pointer"
              aria-label={t('booking.pendingPopup.hideDetails')}
              title={t('booking.pendingPopup.hideDetails')}
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          </div>

          {/* Quick Details Fields (المعلومات الجوهرية بدون حشو الفاتورة الكاملة) */}
          <div className="py-3 space-y-2.5 text-xs">
            {/* Reference & Copy */}
            <div className="flex items-center justify-between bg-surface-mist/60 px-3 py-2 rounded-xl border border-brand-blue/10">
              <div className="flex items-center gap-1.5 text-brand-navy/70">
                <FontAwesomeIcon icon={faTicket} className="text-brand-blue" />
                <span className="font-semibold">{t('booking.pendingPopup.bookingRef')}:</span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-black text-brand-navy hover:text-brand-blue cursor-pointer transition-colors"
                title={t('booking.pendingPopup.copied')}
              >
                <bdi dir="ltr">{pendingBooking.ref}</bdi>
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className={copied ? 'text-green-600' : 'text-brand-navy/50'}
                />
              </button>
            </div>

            {/* Trip Title */}
            <div className="flex items-start justify-between gap-3 px-1">
              <span className="text-brand-navy/70 font-semibold shrink-0">
                {t('booking.pendingPopup.trip')}:
              </span>
              <span className="font-extrabold text-brand-navy text-end text-[12px] leading-snug">
                {pendingBooking.tripTitle || t('booking.pendingPopup.compactLabel')}
              </span>
            </div>

            {/* Date & Time (if present) */}
            {(bookingDate || bookingTime) && (
              <div className="flex items-center justify-between px-1">
                <span className="text-brand-navy/70 font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarDay} className="text-brand-blue/70 text-[11px]" />
                  <span>{t('booking.pendingPopup.dateAndTime')}:</span>
                </span>
                <span className="font-bold text-brand-navy">
                  {[bookingDate, bookingTime].filter(Boolean).join(' • ')}
                </span>
              </div>
            )}

            {/* Amount Due */}
            {amountDue ? (
              <div className="flex items-center justify-between px-1 pt-1 border-t border-brand-navy/8">
                <span className="text-brand-navy/70 font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-brand-blue/70 text-[11px]" />
                  <span>{t('booking.pendingPopup.amountDue')}:</span>
                </span>
                <span className="text-sm font-black text-brand-navy">
                  {formatPrice(amountDue)} {isArabic ? 'ج.م' : 'EGP'}
                </span>
              </div>
            ) : null}
          </div>

          {/* Friendly Status Notice */}
          <p className="rounded-xl bg-amber-500/10 p-2.5 text-[11px] font-medium leading-relaxed text-amber-900 border border-amber-500/20">
            {t('booking.pendingPopup.unconfirmedNotice')}
          </p>

          {/* Action CTAs */}
          <div className="mt-3.5 flex flex-col sm:flex-row gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={markPendingReceiptSent}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-whatsapp px-3.5 py-2.5 text-xs font-black text-white shadow-xs hover:brightness-105 transition-all text-center"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
              <span>{t('booking.pendingPopup.confirmWhatsAppBtn')}</span>
            </a>

            <button
              type="button"
              onClick={handleReturnToInvoice}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors cursor-pointer"
            >
              <span>{t('booking.pendingPopup.viewInvoice')}</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Compact Bottom Floating Pill (الشريط الدائري المعتمد) */}
      <div className="inline-flex items-center gap-2 rounded-full border-2 border-brand-yellow bg-surface-white/95 px-2.5 py-1.5 text-brand-navy shadow-soft backdrop-blur-md">
        {/* Clickable ticket summary toggles the quick details card */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          title={isExpanded ? t('booking.pendingPopup.hideDetails') : t('booking.pendingPopup.showDetails')}
          className="group flex min-w-0 items-center gap-2 text-start cursor-pointer focus-visible:outline-none"
        >
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs text-brand-navy shadow-xs transition-transform group-hover:scale-105">
            <FontAwesomeIcon icon={faTicket} />
            <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
          </span>

          <span className="min-w-0 flex flex-col items-start">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold leading-tight text-brand-navy">
              <bdi dir="ltr">{pendingBooking.ref}</bdi>
              <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                {t('booking.pendingPopup.statusPending')}
              </span>
            </span>
            <span className="block max-w-[130px] sm:max-w-[180px] truncate text-[10.5px] font-bold leading-tight text-brand-blue">
              {pendingBooking.tripTitle || t('booking.pendingPopup.compactLabel')}
            </span>
          </span>

          <span className="ms-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface-mist text-[10px] text-brand-navy/60 group-hover:bg-brand-navy group-hover:text-white transition-colors">
            <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronUp} />
          </span>
        </button>

        {/* WhatsApp & Dismiss Quick Actions */}
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
