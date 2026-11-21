import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faPrint,
  faFileInvoice,
  faBuilding,
  faUser,
  faPhone,
  faCalendarDays,
  faLocationDot,
  faUsers,
  faCompass,
  faTags,
  faArrowRotateLeft,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import duckLogo from '../../shared/assets/icons/Artboard 14.png';
import { GROUP_TYPES, GROUP_ACTIVITIES, TIMES_OF_DAY } from './sceneData.js';
import { DESTINATIONS } from '../destinations/destinationsData.js';
import { Button } from '../../shared/ui/index.js';

export default function GroupSuccess({
  state = {},
  refCode = '',
  waUrl = '',
  onEditAgain,
  t,
  lang = 'ar',
}) {
  const isRtl = lang === 'ar';
  const todayFormatted = new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentType = GROUP_TYPES[state.type] || GROUP_TYPES[0];
  const currentActivity = GROUP_ACTIVITIES.find((a) => a.id === state.act) || GROUP_ACTIVITIES[0];
  const currentDestination = DESTINATIONS[state.loc] || DESTINATIONS[0];
  const currentTime = TIMES_OF_DAY[state.time] || TIMES_OF_DAY[3];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300" role="status" aria-live="polite">
      {/* ================= Printable Invoice Paper Container ================= */}
      <div
        id="group-booking-invoice"
        className="bg-white border-2 border-brand-navy/15 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(12,18,38,0.08)] relative overflow-hidden"
      >
        {/* Top Watermark / Decorative Accent */}
        <div className="absolute -top-16 -end-16 w-44 h-44 rounded-full bg-brand-yellow/15 pointer-events-none blur-2xl" />

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-brand-navy/10 relative z-10">
          <div className="flex items-center gap-3.5">
            <img
              src={duckLogo}
              alt="Duck Entertainment"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-brand-navy flex items-center gap-2">
                <FontAwesomeIcon icon={faFileInvoice} className="text-brand-blue text-lg" />
                <span>{t('groupsPage.invoiceTitle')}</span>
              </h3>
              <p className="text-xs sm:text-sm text-brand-navy/70 font-medium">
                {t('groupsPage.invoiceSubtitle')}
              </p>
            </div>
          </div>

          {/* Reference & Status Badges */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-navy/70">
                {t('groupsPage.invoiceNumber')}:
              </span>
              <span className="bg-brand-navy text-brand-yellow px-3.5 py-1 rounded-full font-mono text-sm font-black tracking-wider shadow-xs" dir="ltr">
                {refCode || 'GRP-2026-PENDING'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-navy/80">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('groupsPage.invoiceStatusPending')}</span>
              <span className="text-brand-navy/40">·</span>
              <span className="text-brand-navy/60">{todayFormatted}</span>
            </div>
          </div>
        </div>

        {/* Invoice Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6 border-b border-brand-navy/10 text-sm">
          {/* Box 1: Organization & Contact Info */}
          <div className="bg-surface-mist/60 border border-brand-navy/10 rounded-2xl p-4.5 space-y-3">
            <h4 className="font-bold text-brand-navy flex items-center gap-2 text-xs tracking-wider uppercase text-brand-blue">
              <FontAwesomeIcon icon={faBuilding} />
              <span>{t('groupsPage.invoiceClientDetails')}</span>
            </h4>
            <div className="space-y-2 text-brand-navy">
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium">{t('groupsPage.groupEntityName')}:</span>
                <span className="font-bold text-sm text-end">{state.org || '—'}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUser} className="text-[10px] text-brand-blue" />
                  <span>{t('groupsPage.contactName')}:</span>
                </span>
                <span className="font-bold text-sm text-end">{state.nm || '—'}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faPhone} className="text-[10px] text-brand-blue" />
                  <span>{t('groupsPage.whatsapp')}:</span>
                </span>
                <span className="font-bold text-sm font-mono text-end" dir="ltr">{state.ph || '—'}</span>
              </div>
              {(state.notes || state.nt) && (
                <div className="pt-1">
                  <span className="text-brand-navy/70 text-xs font-medium block mb-0.5">{t('groupsPage.notesOptional')}:</span>
                  <p className="bg-white/80 p-2 rounded-xl text-xs font-medium text-brand-navy/85 border border-brand-navy/10">
                    {state.notes || state.nt}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Box 2: Trip & Activity Specifications */}
          <div className="bg-surface-mist/60 border border-brand-navy/10 rounded-2xl p-4.5 space-y-3">
            <h4 className="font-bold text-brand-navy flex items-center gap-2 text-xs tracking-wider uppercase text-brand-blue">
              <FontAwesomeIcon icon={faCompass} />
              <span>{t('groupsPage.invoiceTripDetails')}</span>
            </h4>
            <div className="space-y-2 text-brand-navy">
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium">{t('groupsPage.invoiceActivity')}:</span>
                <span className="font-black text-sm text-brand-blue text-end">
                  {t(`groupsPage.activities.${currentActivity.i18nKey}`)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} className="text-[10px] text-brand-blue" />
                  <span>{t('groupsPage.invoiceDestination')}:</span>
                </span>
                <span className="font-bold text-sm text-end">
                  {t(`destinations.items.${currentDestination.key}.name`)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUsers} className="text-[10px] text-brand-blue" />
                  <span>{t('groupsPage.invoiceGroupSize')}:</span>
                </span>
                <span className="font-black text-sm bg-brand-yellow/30 px-2.5 py-0.5 rounded-full text-brand-navy">
                  {state.size} {t('groupsPage.individuals')}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 border-b border-brand-navy/8 pb-1.5">
                <span className="text-brand-navy/70 text-xs font-medium flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-brand-blue" />
                  <span>{t('groupsPage.invoiceDateTime')}:</span>
                </span>
                <span className="font-bold text-xs sm:text-sm text-end" dir="ltr">
                  {state.date} · {t(`groupsPage.times.${currentTime.i18nKey}`)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 pt-0.5">
                <span className="text-brand-navy/70 text-xs font-medium">{t('groupsPage.groupTypeLabel')}:</span>
                <span className="font-bold text-xs text-end">
                  {t(`groupsPage.types.${currentType.i18nKey}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Policy Row */}
        <div className="pt-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-brand-navy/80 font-medium">
            <FontAwesomeIcon icon={faShieldHalved} className="text-brand-blue text-sm" />
            <span>{t('groupsPage.noFixedPriceNotice')}</span>
          </div>
          <div className="bg-brand-navy text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-bold w-fit">
            <FontAwesomeIcon icon={faTags} className="text-brand-yellow" />
            <span>{t('groupsPage.invoicePricingDesc')}</span>
          </div>
        </div>
      </div>

      {/* ================= Action Buttons (Excluded during Print) ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 print:hidden">
        {/* Edit Button */}
        <button
          type="button"
          onClick={onEditAgain}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-brand-navy/20 font-bold text-sm text-brand-navy hover:bg-surface-mist hover:border-brand-navy transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="text-xs" />
          <span>{t('groupsPage.invoiceEdit')}</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-brand-navy/20 bg-white font-bold text-sm text-brand-navy hover:bg-brand-navy hover:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>{t('groupsPage.invoicePrintDownload')}</span>
          </button>

          {/* Primary WhatsApp Action */}
          <Button
            as="a"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            icon={<FontAwesomeIcon icon={faWhatsapp} className="text-xl" />}
            className="w-full sm:w-auto px-7 py-3.5 font-black text-base shadow-[0_8px_24px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2"
          >
            {t('groupsPage.invoiceConfirmWhatsApp')}
          </Button>
        </div>
      </div>
    </div>
  );
}
