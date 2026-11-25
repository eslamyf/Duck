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
} from '@fortawesome/free-solid-svg-icons';

import {
  DashboardShell,
  StatCard,
  DataTable,
  StatusBadge,
  BookingDetailsModal,
} from '../../widgets/dashboard/index.js';
import { useBookingsSync } from '../../shared/hooks/index.js';
import { useTranslation } from '../../shared/i18n/index.js';
import {
  updateBookingStatus,
  getGlobalBookingStats,
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
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = ['overview', 'departures'];
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

  const { bookings } = useBookingsSync();

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

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </DashboardShell>
  );
}
