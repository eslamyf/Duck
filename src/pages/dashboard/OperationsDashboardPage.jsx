import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faClipboardCheck,
  faClock,
  faCircleCheck,
  faFlagCheckered,
  faEye,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

import {
  DashboardShell,
  StatCard,
  DataTable,
  StatusBadge,
  BookingDetailsModal,
} from '../../widgets/dashboard/index.js';
import { useBookingsSync, useCMS } from '../../shared/hooks/index.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import {
  updateBookingStatus,
  getGlobalBookingStats,
  addBooking,
} from '../../entities/booking/api/bookingService.js';

const OPS_STATUS_OPTIONS = [
  { value: 'pending', ar: 'قيد المراجعة', en: 'Pending' },
  { value: 'confirmed', ar: 'مؤكد', en: 'Confirmed' },
  { value: 'paid', ar: 'مدفوع', en: 'Paid' },
  { value: 'completed', ar: 'مكتمل', en: 'Completed' },
  { value: 'cancelled', ar: 'ملغي', en: 'Cancelled' },
  { value: 'refunded', ar: 'مسترد', en: 'Refunded' },
];

export default function OperationsDashboardPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = ['overview', 'departures', 'dispatch'];
  const urlTab = searchParams.get('tab');
  const [localTab, setLocalTab] = useState('overview');
  const activeTab = VALID_TABS.includes(urlTab) ? urlTab : localTab;
  const setActiveTab = (nextTab) => {
    setLocalTab(nextTab);
    setSearchParams({ tab: nextTab }, { replace: true });
  };
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dispatchSuccess, setDispatchSuccess] = useState('');

  const [dispatchForm, setDispatchForm] = useState({
    fullName: '',
    phone: '',
    tripKey: TRIPS[0]?.key || 'botanicalGarden',
    time: '10:00',
    guests: 2,
    notes: '',
  });

  const { bookings } = useBookingsSync();
  const { trips: dynamicTrips } = useCMS();
  const tripsList = dynamicTrips?.length ? dynamicTrips : TRIPS;

  const handleCreateDispatch = (e) => {
    e.preventDefault();
    if (!dispatchForm.fullName.trim()) return;

    const trip = tripsList.find((t) => t.key === dispatchForm.tripKey) || tripsList[0];
    const totalAmount = (trip?.priceEg || 350) * Number(dispatchForm.guests || 1);

    addBooking({
      fullName: dispatchForm.fullName.trim(),
      phone: dispatchForm.phone.trim(),
      email: 'ops@duck.demo',
      tripKey: trip.key,
      tripTitle: trip.titleAr || trip.key,
      destKey: trip.destKey,
      equipment: trip.act,
      date: new Date().toISOString().split('T')[0],
      time: dispatchForm.time,
      guests: Number(dispatchForm.guests) || 1,
      totalAmount,
      currency: 'EGP',
      status: 'confirmed',
      channel: 'Field Operations',
      source: 'Ops Portal',
    });

    setDispatchSuccess(
      isArabic
        ? 'تم تسجيل وتأكيد انطلاق الرحلة الميدانية بنجاح!'
        : 'Field departure dispatched and confirmed successfully!'
    );
    setDispatchForm({
      fullName: '',
      phone: '',
      tripKey: TRIPS[0]?.key || 'botanicalGarden',
      time: '10:00',
      guests: 2,
      notes: '',
    });
    setTimeout(() => {
      setDispatchSuccess('');
      setActiveTab('departures');
    }, 1500);
  };

  const stats = useMemo(() => {
    void bookings;
    return getGlobalBookingStats();
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStatus =
        statusFilter === 'all' ||
        String(b.status).toLowerCase() === statusFilter;
      const matchesQuery =
        !q ||
        String(b.reference || b.id).toLowerCase().includes(q) ||
        String(b.fullName || '').toLowerCase().includes(q) ||
        String(b.tripTitle || b.tripKey || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [bookings, search, statusFilter]);

  const navItems = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: faGaugeHigh },
    { key: 'departures', label: isArabic ? 'جدول التشغيل الميداني' : 'Field Departures', icon: faClipboardCheck },
    { key: 'dispatch', label: isArabic ? 'تسجيل انطلاق فوري' : 'Instant Field Dispatch', icon: faPlus },
  ];

  const opsColumns = [
    {
      key: 'reference',
      label: isArabic ? 'المرجع' : 'Ref',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-brand-blue" dir="ltr">
          {row.reference || row.id}
        </span>
      ),
    },
    {
      key: 'fullName',
      label: isArabic ? 'العميل / الضيف' : 'Guest',
      render: (row) => (
        <div>
          <p className="font-bold text-brand-navy">{row.fullName || '-'}</p>
          <p className="text-[11px] text-brand-navy/60" dir="ltr">
            {row.phone || '-'} • {row.guests || 1} {isArabic ? 'أفراد' : 'guests'}
          </p>
        </div>
      ),
    },
    {
      key: 'tripTitle',
      label: isArabic ? 'الرحلة' : 'Trip',
      render: (row) => <span className="font-semibold">{row.tripTitle || row.tripKey}</span>,
    },
    {
      key: 'date',
      label: isArabic ? 'وقت الانطلاق' : 'Departure',
      render: (row) => (
        <span className="text-xs font-bold text-brand-navy" dir="ltr">
          {row.date} • {row.time}
        </span>
      ),
    },
    {
      key: 'status',
      label: isArabic ? 'الحالة' : 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: isArabic ? 'تحديث ميداني' : 'Field Update',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <select
            aria-label={isArabic ? 'تغيير الحالة' : 'Update status'}
            value={String(row.status || 'pending').toLowerCase()}
            onChange={(e) => updateBookingStatus(row.id, e.target.value)}
            className="rounded-lg border border-brand-blue/25 bg-surface-mist px-2 py-1 text-xs font-bold text-brand-navy outline-none focus:border-brand-blue cursor-pointer"
          >
            {OPS_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {isArabic ? opt.ar : opt.en}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSelectedBooking(row)}
            className="rounded-lg bg-surface-mist p-1.5 text-brand-navy hover:bg-brand-blue hover:text-white transition cursor-pointer"
            aria-label={isArabic ? 'التفاصيل' : 'Details'}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portalTitle={isArabic ? 'بوابة فريق العمليات' : 'Operations Portal'}
      portalSubtitle={isArabic ? 'متابعة الانطلاقات اليومية وتحديث الحالات لحظيًا' : 'Daily departures & 1-click field status'}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={isArabic ? 'بانتظار التأكيد' : 'Pending Check-in'}
              value={stats.pending}
              icon={faClock}
              tone="yellow"
            />
            <StatCard
              title={isArabic ? 'جاهز للانطلاق (مؤكد/مدفوع)' : 'Ready for Departure'}
              value={stats.confirmed + stats.paid}
              icon={faCircleCheck}
              tone="blue"
            />
            <StatCard
              title={isArabic ? 'رحلات مكتملة' : 'Completed Trips'}
              value={stats.completed}
              icon={faFlagCheckered}
              tone="success"
            />
          </div>

          <DataTable
            columns={opsColumns}
            rows={bookings.slice(0, 6)}
            emptyTitle={isArabic ? 'لا توجد رحلات اليوم' : 'No departures'}
          />
        </div>
      )}

      {activeTab === 'departures' && (
        <DataTable
          columns={opsColumns}
          rows={filteredBookings}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isArabic ? 'ابحث برقم الحجز أو اسم الضيف...' : 'Search ref or guest...'}
          filters={[
            { key: 'all', label: isArabic ? 'الكل' : 'All' },
            ...OPS_STATUS_OPTIONS.map((s) => ({
              key: s.value,
              label: isArabic ? s.ar : s.en,
            })),
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      )}

      {activeTab === 'dispatch' && (
        <div className="space-y-4 max-w-2xl">
          <div className="rounded-[20px] border border-brand-blue/16 bg-surface-white p-6 shadow-card space-y-4">
            <h2 className="font-heading text-lg font-extrabold text-brand-navy">
              {isArabic ? 'تسجيل وتأكيد انطلاق رحلة ميدانية' : 'Dispatch & Confirm Field Departure'}
            </h2>
            <p className="text-xs text-brand-navy/60">
              {isArabic
                ? 'تسجيل فوري للمجموعات والزائرين عند نقطة الإنزال وتحديث حالة المقاعد فورياً'
                : 'Walk-in or direct field guest registration with live slot synchronization'}
            </p>

            {dispatchSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600" />
                <span>{dispatchSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateDispatch} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">
                    {isArabic ? 'اسم الضيف / العميل' : 'Guest Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchForm.fullName}
                    onChange={(e) =>
                      setDispatchForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    placeholder={isArabic ? 'مثال: محمد علي' : 'e.g. John Doe'}
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3.5 py-2 text-xs font-bold text-brand-navy outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">
                    {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={dispatchForm.phone}
                    onChange={(e) =>
                      setDispatchForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+201..."
                    dir="ltr"
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3.5 py-2 text-xs font-bold text-brand-navy outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">
                    {isArabic ? 'التجربة الميدانية' : 'Experience'}
                  </label>
                  <select
                    value={dispatchForm.tripKey}
                    onChange={(e) =>
                      setDispatchForm((p) => ({ ...p, tripKey: e.target.value }))
                    }
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3 py-2 text-xs font-bold text-brand-navy outline-none cursor-pointer"
                  >
                    {tripsList.map((tr) => (
                      <option key={tr.key} value={tr.key}>
                        {tr.titleAr || t(`trips.items.${tr.key}.title`, tr.key)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">
                    {isArabic ? 'وقت الانطلاق' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={dispatchForm.time}
                    onChange={(e) =>
                      setDispatchForm((p) => ({ ...p, time: e.target.value }))
                    }
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3 py-2 text-xs font-bold text-brand-navy outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1">
                    {isArabic ? 'عدد الأفراد' : 'Guests Count'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={dispatchForm.guests}
                    onChange={(e) =>
                      setDispatchForm((p) => ({ ...p, guests: e.target.value }))
                    }
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3 py-2 text-xs font-bold text-brand-navy outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-black text-brand-yellow hover:bg-brand-blue hover:text-white transition shadow-sm cursor-pointer"
                >
                  {isArabic ? 'تأكيد الانطلاق الفوري' : 'Confirm Instant Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </DashboardShell>
  );
}
