import QRCodeSVG from './QRCodeSVG.jsx';
import duckLogo from '../../shared/assets/icons/duck-mark-192w.webp';
import { CONTACT } from '../../shared/config/constants.js';
import { MAP_PINS } from '../map/mapData.js';

const STATUS_LABELS = {
  pending: { ar: 'قيد المراجعة — بانتظار تأكيد الإيصال', en: 'Pending Verification' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  paid: { ar: 'مدفوع بالكامل', en: 'Paid' },
  completed: { ar: 'مكتمل', en: 'Completed' },
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
  refunded: { ar: 'مسترد', en: 'Refunded' },
};

const ACTIVITY_LABELS = {
  kayak: { ar: 'كاياك', en: 'Kayak' },
  sup: { ar: 'ستاند أب بادل (SUP)', en: 'Stand Up Paddle (SUP)' },
  waterbike: { ar: 'دراجة مائية', en: 'Water Bike' },
};

const NATIONALITY_LABELS = {
  all_egyptian: { ar: 'مصريين', en: 'Egyptians' },
  all_foreign: { ar: 'أجانب', en: 'Foreigners' },
  mixed: { ar: 'مختلط (مصريين وأجانب)', en: 'Mixed Group' },
};

export default function PrintableInvoice({
  bookingRef,
  bookingData = {},
  selectedTrip,
  t,
  lang,
}) {
  const isArabic = lang === 'ar';
  const formatPrice = (p) =>
    Number(p || 0).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  const tripTitle = selectedTrip
    ? t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug)
    : bookingData.tripTitle || bookingData.tripKey || '-';

  const destKey = selectedTrip?.destKey || 'aswan';
  const destName = t(`destinations.items.${destKey}.name`, destKey);
  const mapPin = MAP_PINS.find((p) => p.destKey === destKey) || MAP_PINS[0];
  const meetingPoint = mapPin
    ? isArabic
      ? mapPin.meetingPointAr
      : mapPin.meetingPointEn
    : destName;

  const actKey = (bookingData.equipment || selectedTrip?.act || 'kayak').toLowerCase();
  const actLabel = ACTIVITY_LABELS[actKey]?.[isArabic ? 'ar' : 'en'] || actKey;

  const natKey = bookingData.nationality || 'all_egyptian';
  const natLabel = NATIONALITY_LABELS[natKey]?.[isArabic ? 'ar' : 'en'] || natKey;

  const statusKey = String(bookingData.status || 'pending').toLowerCase();
  const statusLabel =
    STATUS_LABELS[statusKey]?.[isArabic ? 'ar' : 'en'] ||
    t('booking.invoice.statusPending');

  const adults = Number(bookingData.adults) || 1;
  const kids1to6 = Number(bookingData.kids1to6) || 0;
  const kids7to12 = Number(bookingData.kids7to12) || 0;
  const totalGuests = adults + kids1to6 + kids7to12;

  const totalAmount = Number(bookingData.totalAmount) || 0;
  const subtotal = Number(bookingData.subtotal) || totalAmount;
  const discount = Number(bookingData.discount) || 0;
  const amountToPay =
    bookingData.amountToPay !== undefined && bookingData.amountToPay !== null
      ? Number(bookingData.amountToPay)
      : totalAmount;
  const remainingBalance = Math.max(
    0,
    bookingData.remainingBalance !== undefined && bookingData.remainingBalance !== null
      ? Number(bookingData.remainingBalance)
      : totalAmount - amountToPay
  );

  const issuedDate = bookingData.createdAt
    ? new Date(bookingData.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')
    : new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US');

  const stripColon = (str) => String(str || '').replace(/[:：]\s*$/, '');
  const cleanMeetingPoint =
    isArabic && String(meetingPoint).startsWith('نقطة اللقاء')
      ? meetingPoint
      : `${isArabic ? 'نقطة اللقاء:' : 'Meeting Point:'} ${meetingPoint}`;

  return (
    <div
      id="printable-invoice"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="hidden print:block w-full max-w-[820px] mx-auto bg-white text-brand-navy"
    >
      {/* Top Executive DUCK Header */}
      <div className="flex items-start justify-between gap-4 border-b-2 border-brand-navy pb-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="rounded-xl border border-brand-navy/15 bg-white p-1.5">
            <img
              src={duckLogo}
              alt="Duck Entertainment"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-brand-navy">
              DUCK ENTERTAINMENT
            </h1>
            <p className="text-xs font-bold text-brand-blue mt-0.5">
              {t('booking.invoice.subtitle')}
            </p>
            <p className="text-xs font-semibold text-brand-navy mt-0.5">
              {isArabic ? 'إيصال وتذكرة حجز رسمية' : 'Official Booking Receipt & Pass'}
            </p>
          </div>
        </div>

        <div className="text-end space-y-1">
          <span className="text-xs font-bold text-brand-navy block">
            {t('booking.invoice.refNumber')}
          </span>
          <b className="text-lg font-mono font-extrabold text-brand-navy block" dir="ltr">
            {bookingRef}
          </b>
          <span className="inline-block rounded-md border border-brand-navy bg-brand-yellow px-3 py-0.5 text-xs font-extrabold text-brand-navy">
            {statusLabel}
          </span>
          <p className="text-[11px] font-semibold text-brand-navy pt-0.5">
            {isArabic ? 'تاريخ الإصدار:' : 'Issued:'} {issuedDate}
          </p>
        </div>
      </div>

      {/* Guest Info + Schedule & Meeting Point Grid */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-brand-navy/25 bg-surface-mist p-4 mb-5">
        <div className="space-y-1.5 text-xs">
          <p className="font-extrabold text-brand-blue border-b border-brand-navy/10 pb-1">
            {stripColon(t('booking.invoice.customerInfo'))}
          </p>
          <p className="text-sm font-extrabold text-brand-navy">
            {bookingData.fullName || (isArabic ? 'ضيف DUCK' : 'DUCK Guest')}
          </p>
          <p className="font-mono text-xs font-bold text-brand-navy">
            <span dir="ltr" className="inline-block">
              {bookingData.phone || '-'}
            </span>
          </p>
          {bookingData.email && (
            <p className="font-mono text-xs font-semibold text-brand-navy">
              <span dir="ltr" className="inline-block">
                {bookingData.email}
              </span>
            </p>
          )}
          <p className="text-xs font-bold text-brand-navy">
            {isArabic ? 'الفئة:' : 'Category:'} {natLabel}
          </p>
        </div>

        <div className="space-y-1.5 text-xs">
          <p className="font-extrabold text-brand-blue border-b border-brand-navy/10 pb-1">
            {stripColon(t('booking.invoice.bookingDateTime'))}
          </p>
          <p className="text-sm font-extrabold text-brand-navy">
            <span dir="ltr" className="inline-block">
              {bookingData.date || '-'} · {bookingData.time || '10:00'}
            </span>
          </p>
          <p className="text-xs font-bold text-brand-navy">
            {destName} · {actLabel} ({bookingData.duration || 1}{' '}
            {isArabic ? 'ساعة' : 'hr'})
          </p>
          <p className="text-xs font-semibold text-brand-navy leading-snug">
            {cleanMeetingPoint}
          </p>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full border-collapse mb-5 text-sm border border-brand-navy/20">
        <thead>
          <tr className="bg-brand-navy text-white text-xs">
            <th className="py-2.5 px-3 text-start font-extrabold">
              {t('booking.invoice.tableItem')}
            </th>
            <th className="py-2.5 px-3 text-center font-extrabold">
              {t('booking.invoice.tableQty')}
            </th>
            <th className="py-2.5 px-3 text-end font-extrabold">
              {t('booking.invoice.tableTotal')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-navy/15">
          <tr>
            <td className="py-3 px-3">
              <p className="font-extrabold text-sm text-brand-navy">{tripTitle}</p>
              <p className="text-xs font-semibold text-brand-navy mt-1">
                {t('booking.guestDetails.adults')}: {adults} •{' '}
                {t('booking.guestDetails.kids1to6')}: {kids1to6} •{' '}
                {t('booking.guestDetails.kids7to12')}: {kids7to12}
              </p>
            </td>
            <td className="py-3 px-3 text-center font-extrabold text-brand-navy">
              {totalGuests}
            </td>
            <td className="py-3 px-3 text-end font-extrabold text-brand-navy tabular-nums">
              {formatPrice(subtotal)} {t('trips.currency')}
            </td>
          </tr>

          {discount > 0 && (
            <tr className="bg-surface-mist">
              <td className="py-2.5 px-3 font-bold text-brand-blue">
                {t('booking.reviewPay.discountApplied')}{' '}
                {bookingData.appliedPromo ? `(${bookingData.appliedPromo})` : ''}
              </td>
              <td className="py-2.5 px-3 text-center font-bold">-</td>
              <td className="py-2.5 px-3 text-end font-extrabold text-brand-blue tabular-nums">
                - {formatPrice(discount)} {t('trips.currency')}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Financial Summary + QR Verification */}
      <div className="grid grid-cols-[1fr_310px] items-center gap-5 border-t-2 border-brand-navy pt-4 mb-5">
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-brand-navy/20 bg-white p-1.5 shrink-0">
            <QRCodeSVG value={bookingRef} size={90} />
          </div>
          <div className="text-xs space-y-1 text-brand-navy">
            <p className="font-extrabold text-sm">
              {stripColon(t('booking.invoice.scanToVerify'))}
            </p>
            <p className="font-semibold leading-relaxed">
              {t('booking.invoice.keepTicketSafe')}
            </p>
            <p className="font-bold text-brand-blue">
              {isArabic
                ? 'سياسة الإلغاء: إلغاء مجاني قبل 24 ساعة من موعد الرحلة.'
                : 'Policy: Free cancellation up to 24h before trip.'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-brand-navy/25 bg-surface-mist p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2 font-bold text-brand-navy">
            <span>{stripColon(t('booking.reviewPay.totalAmount'))}:</span>
            <span className="tabular-nums whitespace-nowrap">
              {formatPrice(totalAmount)} {t('trips.currency')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm font-extrabold border-t border-brand-navy/20 pt-2 text-brand-navy">
            <span>{stripColon(t('booking.invoice.amountPaidOrTransferred'))}:</span>
            <span className="tabular-nums whitespace-nowrap">
              {formatPrice(amountToPay)} {t('trips.currency')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 font-bold text-brand-blue border-t border-brand-navy/10 pt-1.5">
            <span>{stripColon(t('booking.reviewPay.remainingOnSite'))}:</span>
            <span className="tabular-nums whitespace-nowrap">
              {formatPrice(remainingBalance)} {t('trips.currency')}
            </span>
          </div>
        </div>
      </div>

      {/* Payment & Safety Instructions */}
      <div className="rounded-xl border border-brand-navy bg-surface-sand p-3.5 mb-4 text-xs space-y-1.5 text-brand-navy">
        <p className="font-extrabold">
          {stripColon(t('booking.paymentInvoice.step1Title'))}: duckegy@instapay ·{' '}
          <span dir="ltr" className="inline-block">{CONTACT.PHONE}</span>
        </p>
        <p className="font-semibold">
          {t('booking.paymentInvoice.step2Title')}: {t('booking.paymentInvoice.step2Desc')}
        </p>
        <p className="font-bold text-brand-blue">
          {isArabic
            ? 'تشمل الرحلة سترة النجاة المعتمدة وإرشادات السلامة · يُرجى الحضور قبل الموعد بـ 15 دقيقة.'
            : 'Certified life jacket & safety briefing included · Please arrive 15 minutes before departure.'}
        </p>
      </div>

      {/* Official Footer */}
      <div className="text-center text-xs font-semibold text-brand-navy border-t border-brand-navy/20 pt-3 space-y-0.5">
        <p>
          Duck Entertainment • {CONTACT.ADDRESS_AR} •{' '}
          <span dir="ltr">{CONTACT.PHONE}</span> • {CONTACT.EMAIL}
        </p>
        <p className="text-[11px]">{t('booking.invoice.printedNotice')}</p>
      </div>
    </div>
  );
}
