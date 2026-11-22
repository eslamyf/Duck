import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCheck,
  faPrint,
  faBolt,
  faClock,
  faArrowRotateLeft,
  faStar,
  faTicket,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Button, Badge } from '../../shared/ui/index.js';
import { CONTACT, buildWhatsAppUrl } from '../../shared/config/constants.js';
import QRCodeSVG from './QRCodeSVG.jsx';
import PrintableInvoice from './PrintableInvoice.jsx';

const INSTAPAY_IPA = 'duckegy@instapay';

export default function StepPaymentInvoice({
  bookingRef,
  bookingData,
  selectedTrip,
  onResetBooking,
  t,
  lang,
}) {
  const isArabic = lang === 'ar';
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedIpa, setCopiedIpa] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);

  const formatPrice = (p) =>
    Number(p).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  const tripTitle = selectedTrip
    ? t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug)
    : '';

  const amountToPay = bookingData.amountToPay || bookingData.totalAmount || 0;

  // Persist pending booking to localStorage on mount so reminder popup knows
  useEffect(() => {
    if (!bookingRef) return;
    try {
      const ticket = {
        ref: bookingRef,
        tripTitle,
        amount: amountToPay,
        total: bookingData.totalAmount,
        date: bookingData.date,
        time: bookingData.time,
        phone: bookingData.phone,
        fullName: bookingData.fullName,
        status: 'pending_confirmation',
        receiptSent: false,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('duck_pending_booking', JSON.stringify(ticket));
    } catch {
      // Fallback silently if storage blocked
    }
  }, [bookingRef, tripTitle, amountToPay, bookingData]);

  // Copy helpers
  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(bookingRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopyIpa = async () => {
    try {
      await navigator.clipboard.writeText(INSTAPAY_IPA);
      setCopiedIpa(true);
      setTimeout(() => setCopiedIpa(false), 2500);
    } catch {
      // ignore
    }
  };

  // WhatsApp receipt URL with prefilled template
  const waReceiptMessage = isArabic
    ? `مرحباً DUCK، تم تحويل العربون/المبلغ لرحلة: ${tripTitle}\n` +
      `رقم الحجز: ${bookingRef}\n` +
      `الاسم: ${bookingData.fullName}\n` +
      `الموعد: ${bookingData.date} في تمام ${bookingData.time}\n` +
      `المبلغ المحول: ${formatPrice(amountToPay)} ج.م\n` +
      `مرفق إيصال التحويل لتأكيد الحجز:`
    : `Hello DUCK, I have transferred the booking amount for: ${tripTitle}\n` +
      `Booking Ref: ${bookingRef}\n` +
      `Name: ${bookingData.fullName}\n` +
      `Date & Time: ${bookingData.date} at ${bookingData.time}\n` +
      `Transferred Amount: ${formatPrice(amountToPay)} EGP\n` +
      `Attached is the payment receipt for confirmation:`;

  const waUrl = buildWhatsAppUrl(waReceiptMessage, CONTACT.PHONE);

  const handleWhatsAppClick = () => {
    setReceiptSent(true);
    try {
      const stored = localStorage.getItem('duck_pending_booking');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.receiptSent = true;
        parsed.status = 'receipt_sent';
        localStorage.setItem('duck_pending_booking', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 font-body">
      {/* ON SCREEN VIEW (Hidden in print mode) */}
      <div className="space-y-8 print:hidden">
        {/* Step Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/30 text-brand-navy font-bold text-xs mb-1">
            <FontAwesomeIcon icon={faTicket} />
            <span>{t('booking.paymentInvoice.ticketCreatedBadge')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
            {t('booking.paymentInvoice.title')}
          </h2>
          <p className="text-sm sm:text-base text-brand-navy/70 max-w-lg mx-auto">
            {t('booking.paymentInvoice.subtitle')}
          </p>
        </div>

        {/* BOOKING REFERENCE & STATUS HERO CARD */}
        <div className="bg-brand-navy text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 end-0 -mt-6 -me-6 w-36 h-36 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            {/* Left: Ref and Status */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-yellow">
                {t('booking.paymentInvoice.refLabel')}
              </span>

              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider" dir="ltr">
                  {bookingRef}
                </span>

                <button
                  type="button"
                  onClick={handleCopyRef}
                  aria-label={t('booking.paymentInvoice.copyRef')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-yellow text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <FontAwesomeIcon icon={copiedRef ? faCheck : faCopy} />
                  <span>{copiedRef ? t('booking.paymentInvoice.copied') : t('booking.paymentInvoice.copy')}</span>
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="warning"
                  size="md"
                  className="font-black bg-amber-400 text-brand-navy gap-1.5 shadow-sm"
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span>{t('booking.paymentInvoice.pendingStatusBadge')}</span>
                </Badge>
              </div>
            </div>

            {/* Right: QR Code */}
            <div className="flex sm:flex-col items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <QRCodeSVG value={bookingRef} size={96} fgColor="#0C1226" bgColor="#ffffff" />
              <span className="text-[11px] text-white/70 font-semibold text-center">
                {t('booking.paymentInvoice.scanTicket')}
              </span>
            </div>
          </div>

          {/* Amount Due Banner */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-white/70 block">
                {t('booking.paymentInvoice.amountRequiredToConfirm')}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-brand-yellow tabular-nums mt-0.5">
                {formatPrice(amountToPay)}{' '}
                <span className="text-base sm:text-lg font-bold text-white">{t('trips.currency')}</span>
              </p>
            </div>

            {bookingData.remainingBalance > 0 && (
              <div className="text-start sm:text-end text-xs text-white/70">
                <span>{t('booking.reviewPay.remainingOnSite')}:</span>
                <b className="block text-sm text-white font-bold tabular-nums">
                  {formatPrice(bookingData.remainingBalance)} {t('trips.currency')}
                </b>
              </div>
            )}
          </div>
        </div>

        {/* STEP 1: PAY VIA INSTAPAY */}
        <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white font-black text-xs grid place-items-center shadow-sm">
                <FontAwesomeIcon icon={faBolt} className="text-sm" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy">
                  {t('booking.paymentInvoice.step1Title')}
                </h3>
                <p className="text-xs text-brand-navy/60 font-medium">
                  {t('booking.paymentInvoice.step1Subtitle')}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              InstaPay
            </span>
          </div>

          <p className="text-xs sm:text-sm text-brand-navy/80">
            {t('booking.paymentInvoice.step1Instructions', { amount: formatPrice(amountToPay) })}
          </p>

          {/* IPA Address Card */}
          <div className="p-4 bg-surface-mist rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-black/5">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-brand-navy/60 uppercase tracking-wide block">
                {t('booking.paymentInvoice.ipaAddressLabel')}
              </span>
              <p className="font-mono font-black text-sm sm:text-base text-brand-navy" dir="ltr">
                {INSTAPAY_IPA}
              </p>
              <p className="text-[11px] text-brand-navy/70">
                {t('booking.paymentInvoice.orMobile')} <span className="font-mono font-bold" dir="ltr">{CONTACT.PHONE}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyIpa}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-brand-navy border border-black/15 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer flex-none"
            >
              <FontAwesomeIcon icon={copiedIpa ? faCheck : faCopy} className={copiedIpa ? 'text-brand-blue' : ''} />
              <span>{copiedIpa ? t('booking.paymentInvoice.copied') : t('booking.paymentInvoice.copyIpa')}</span>
            </button>
          </div>

          {/* InstaPay Quick Action Button */}
          <a
            href="https://ipn.eg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <FontAwesomeIcon icon={faBolt} />
            <span>{t('booking.paymentInvoice.openInstaPayBtn', { amount: formatPrice(amountToPay) })}</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs opacity-80" />
          </a>
        </section>

        {/* STEP 2: SEND RECEIPT ON WHATSAPP */}
        <section className="bg-white p-5 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs grid place-items-center shadow-sm">
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy">
                  {t('booking.paymentInvoice.step2Title')}
                </h3>
                <p className="text-xs text-brand-navy/60 font-medium">
                  {t('booking.paymentInvoice.step2Subtitle')}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              WhatsApp
            </span>
          </div>

          <p className="text-xs sm:text-sm text-brand-navy/80">
            {t('booking.paymentInvoice.step2Desc')}
          </p>

          {/* WhatsApp Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-full min-h-[52px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
            <span>{t('booking.paymentInvoice.sendReceiptWhatsAppBtn')}</span>
          </a>

          {receiptSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
              <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />
              <span>{t('booking.paymentInvoice.receiptSentNotice')}</span>
            </div>
          )}

          {/* Instructions box */}
          <div className="p-3.5 bg-surface-mist rounded-2xl text-xs text-brand-navy/70 space-y-1">
            <p className="font-bold text-brand-navy">{t('booking.paymentInvoice.instructionsHeader')}</p>
            <p>1. {t('booking.paymentInvoice.instruction1')}</p>
            <p>2. {t('booking.paymentInvoice.instruction2')}</p>
            <p>3. {t('booking.paymentInvoice.instruction3')}</p>
          </div>
        </section>

        {/* PRINT INVOICE BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 bg-white rounded-3xl border border-black/10 shadow-sm">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faPrint} className="text-brand-blue text-xl" />
            <div>
              <p className="font-extrabold text-sm sm:text-base text-brand-navy">
                {t('booking.paymentInvoice.printableReceiptTitle')}
              </p>
              <p className="text-xs text-brand-navy/60">
                {t('booking.paymentInvoice.printableReceiptSubtitle')}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handlePrint}
            className="w-full sm:w-auto font-bold gap-2 px-6 border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white cursor-pointer"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>{t('booking.paymentInvoice.printBtn')}</span>
          </Button>
        </div>

        {/* POST-BOOKING NAVIGATION LINKS */}
        <div className="pt-4 border-t border-black/10 flex items-center justify-center gap-4 flex-wrap text-xs sm:text-sm">
          <button
            type="button"
            onClick={onResetBooking}
            className="font-bold text-brand-navy hover:text-brand-blue flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
            <span>{t('booking.paymentInvoice.bookAnotherTrip')}</span>
          </button>

          <span className="text-black/20">•</span>

          <a
            href="/#reviews"
            className="font-bold text-brand-navy hover:text-brand-blue flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faStar} className="text-amber-500" />
            <span>{t('booking.paymentInvoice.shareReview')}</span>
          </a>
        </div>
      </div>

      {/* PRINTABLE INVOICE COMPONENT (Rendered strictly during window.print()) */}
      <PrintableInvoice
        bookingRef={bookingRef}
        bookingData={bookingData}
        selectedTrip={selectedTrip}
        t={t}
        lang={lang}
      />
    </div>
  );
}
