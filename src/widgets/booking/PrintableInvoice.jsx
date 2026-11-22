import QRCodeSVG from './QRCodeSVG.jsx';
import duckLogo from '../../shared/assets/icons/Artboard_8-removebg-preview.png';
import { CONTACT } from '../../shared/config/constants.js';

export default function PrintableInvoice({
  bookingRef,
  bookingData,
  selectedTrip,
  t,
  lang,
}) {
  const isArabic = lang === 'ar';
  const formatPrice = (p) =>
    Number(p).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  const tripTitle = selectedTrip
    ? t(`trips.items.${selectedTrip.key}.title`, selectedTrip.slug)
    : '';

  const totalGuests =
    (bookingData.adults || 1) + (bookingData.kids1to6 || 0) + (bookingData.kids7to12 || 0);

  return (
    <div
      id="printable-invoice"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="hidden print:block w-full max-w-[800px] mx-auto p-8 font-body text-black bg-white"
    >
      {/* Header with Logo and Title */}
      <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-6">
        <div className="flex items-center gap-3">
          <img src={duckLogo} alt="Duck Entertainment" className="h-14 object-contain" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black">DUCK ENTERTAINMENT</h1>
            <p className="text-xs text-gray-700">{t('booking.invoice.subtitle')}</p>
          </div>
        </div>

        <div className="text-end">
          <span className="text-xs text-gray-600 block">{t('booking.invoice.refNumber')}</span>
          <b className="text-lg font-mono font-black" dir="ltr">{bookingRef}</b>
          <div className="mt-1">
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-black border border-black bg-gray-100">
              {t('booking.invoice.statusPending')}
            </span>
          </div>
        </div>
      </div>

      {/* Customer & Booking Meta Info */}
      <div className="grid grid-cols-2 gap-6 p-4 border border-gray-300 rounded-xl mb-6 bg-gray-50/50">
        <div className="space-y-1">
          <span className="text-xs text-gray-600 block">{t('booking.invoice.customerInfo')}</span>
          <p className="font-bold text-sm">{bookingData.fullName}</p>
          <p className="font-mono text-xs" dir="ltr">{bookingData.phone}</p>
        </div>

        <div className="space-y-1 text-end">
          <span className="text-xs text-gray-600 block">{t('booking.invoice.bookingDateTime')}</span>
          <p className="font-bold text-sm">{bookingData.date} • {bookingData.time}</p>
          <p className="text-xs text-gray-700">
            {bookingData.duration || 1} {isArabic ? 'ساعة' : 'Hour(s)'} ({bookingData.equipment || 'Kayak'})
          </p>
        </div>
      </div>

      {/* Trip & Items Table */}
      <table className="w-full border-collapse mb-6 text-sm">
        <thead>
          <tr className="border-b-2 border-black bg-gray-100 text-xs">
            <th className="py-2.5 px-3 text-start font-black">{t('booking.invoice.tableItem')}</th>
            <th className="py-2.5 px-3 text-center font-black">{t('booking.invoice.tableQty')}</th>
            <th className="py-2.5 px-3 text-end font-black">{t('booking.invoice.tableTotal')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="py-3 px-3">
              <p className="font-bold text-sm">{tripTitle}</p>
              <p className="text-xs text-gray-600">
                {t('booking.guestDetails.adults')}: {bookingData.adults || 1} •{' '}
                {t('booking.guestDetails.kids1to6')}: {bookingData.kids1to6 || 0} •{' '}
                {t('booking.guestDetails.kids7to12')}: {bookingData.kids7to12 || 0}
              </p>
            </td>
            <td className="py-3 px-3 text-center font-bold">{totalGuests}</td>
            <td className="py-3 px-3 text-end font-bold tabular-nums">
              {formatPrice(bookingData.subtotal || 0)} {t('trips.currency')}
            </td>
          </tr>

          {bookingData.discount > 0 && (
            <tr className="text-gray-700">
              <td className="py-2.5 px-3">
                {t('booking.reviewPay.discountApplied')} ({bookingData.appliedPromo})
              </td>
              <td className="py-2.5 px-3 text-center">-</td>
              <td className="py-2.5 px-3 text-end tabular-nums">
                - {formatPrice(bookingData.discount)} {t('trips.currency')}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Financial Summary & QR Code */}
      <div className="flex items-center justify-between border-t-2 border-black pt-4 mb-8">
        {/* QR Code and verification instructions */}
        <div className="flex items-center gap-4">
          <QRCodeSVG value={bookingRef} size={88} />
          <div className="text-xs text-gray-600 max-w-[220px]">
            <p className="font-bold text-black mb-0.5">{t('booking.invoice.scanToVerify')}</p>
            <p>{t('booking.invoice.keepTicketSafe')}</p>
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="text-end space-y-1.5 min-w-[200px]">
          <div className="flex justify-between text-xs text-gray-700">
            <span>{t('booking.reviewPay.totalAmount')}:</span>
            <span className="font-bold tabular-nums">{formatPrice(bookingData.totalAmount || 0)} {t('trips.currency')}</span>
          </div>

          <div className="flex justify-between text-sm font-black border-t border-gray-300 pt-1">
            <span>{t('booking.invoice.amountPaidOrTransferred')}:</span>
            <span className="tabular-nums text-black">{formatPrice(bookingData.amountToPay || 0)} {t('trips.currency')}</span>
          </div>

          {bookingData.remainingBalance > 0 && (
            <div className="flex justify-between text-xs font-bold text-gray-600">
              <span>{t('booking.reviewPay.remainingOnSite')}:</span>
              <span className="tabular-nums">{formatPrice(bookingData.remainingBalance)} {t('trips.currency')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment & Transfer Notice */}
      <div className="p-4 border border-dashed border-black rounded-xl mb-6 bg-gray-50 text-xs space-y-1.5">
        <p className="font-black text-black">
          {t('booking.paymentInvoice.step1Title')}: InstaPay IPA: duckegy@instapay / {CONTACT.PHONE}
        </p>
        <p className="text-gray-700">
          {t('booking.paymentInvoice.step2Title')}: {t('booking.paymentInvoice.step2Desc')}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-500 border-t border-gray-200 pt-4">
        <p>Duck Entertainment • {CONTACT.ADDRESS_AR} • {CONTACT.PHONE} • {CONTACT.WEBSITE}</p>
        <p className="mt-0.5">{t('booking.invoice.printedNotice')}</p>
      </div>
    </div>
  );
}
