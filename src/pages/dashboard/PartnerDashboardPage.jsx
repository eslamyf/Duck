import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faLifeRing,
  faCalendarCheck,
  faEye,
  faCheck,
  faCoins,
  faTriangleExclamation,
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
import { updateBookingStatus } from '../../entities/booking/api/bookingService.js';

export default function PartnerDashboardPage() {
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { bookings, inventory } = useBookingsSync();

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

  const partnerStats = useMemo(() => {
    const active = bookings.filter(
      (b) => !['cancelled', 'refunded'].includes(String(b.status).toLowerCase())
    );
    const totalUnits = inventory.reduce((s, i) => s + i.maxUnits, 0);
    const remainingUnits = inventory.reduce((s, i) => s + i.remainingUnits, 0);
    const revenueEgp = active.reduce(
      (s, b) => s + (Number(b.totalAmount) || 0),
      0
    );
    return {
      assignedCount: active.length,
      remainingUnits,
      totalUnits,
      revenueEgp,
    };
  }, [bookings, inventory]);

  const navItems = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: faGaugeHigh },
    { key: 'inventory', label: isArabic ? 'المخزون والأسعار المتفق عليها' : 'Fleet & Rates', icon: faLifeRing },
    { key: 'bookings', label: isArabic ? 'الحجوزات المسندة' : 'Assigned Bookings', icon: faCalendarCheck },
  ];

  const bookingColumns = [
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
      key: 'tripTitle',
      label: isArabic ? 'النشاط' : 'Service',
      render: (row) => (
        <div>
          <p className="font-bold text-brand-navy">{row.tripTitle || row.tripKey}</p>
          <p className="text-[11px] text-brand-navy/60">
            {row.equipment || 'kayak'} • {row.units || row.guests || 1}{' '}
            {isArabic ? 'وحدة' : 'units'}
          </p>
        </div>
      ),
    },
    {
      key: 'date',
      label: isArabic ? 'الموعد' : 'Schedule',
      render: (row) => (
        <span className="text-xs text-brand-navy/80" dir="ltr">
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
      label: isArabic ? 'إجراءات' : 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {String(row.status).toLowerCase() === 'pending' && (
            <button
              type="button"
              onClick={() => updateBookingStatus(row.id, 'confirmed')}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faCheck} />
              <span>{isArabic ? 'تأكيد' : 'Confirm'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setSelectedBooking(row)}
            className="inline-flex items-center gap-1 rounded-lg bg-surface-mist px-2.5 py-1.5 text-xs font-bold text-brand-navy hover:bg-brand-blue hover:text-white transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faEye} />
            <span>{isArabic ? 'عرض' : 'View'}</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      portalTitle={isArabic ? 'بوابة مقدم الخدمة' : 'Partner & Fleet Portal'}
      portalSubtitle={isArabic ? 'إدارة الأسطول ومنع الحجز الزائد لحظيًا' : 'Live fleet capacity & assigned services'}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={isArabic ? 'حجوزات نشطة' : 'Active Bookings'}
              value={partnerStats.assignedCount}
              icon={faCalendarCheck}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'الوحدات المتاحة الآن' : 'Available Fleet Units'}
              value={`${partnerStats.remainingUnits} / ${partnerStats.totalUnits}`}
              icon={faLifeRing}
              tone="yellow"
            />
            <StatCard
              title={isArabic ? 'قيمة الخدمات' : 'Service Value'}
              value={`${partnerStats.revenueEgp.toLocaleString(isArabic ? 'ar-EG' : 'en-US')} ${isArabic ? 'ج.م' : 'EGP'}`}
              icon={faCoins}
              tone="success"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-base font-extrabold text-brand-navy">
                    {isArabic ? item.nameAr : item.nameEn}
                  </h3>
                  {item.isFull && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                      <FontAwesomeIcon icon={faTriangleExclamation} />
                      <span>{isArabic ? 'مكتمل' : 'Full'}</span>
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-brand-navy/65">
                  {isArabic ? 'المحجوز:' : 'Booked:'} {item.bookedUnits} •{' '}
                  {isArabic ? 'المتاح:' : 'Remaining:'} {item.remainingUnits} / {item.maxUnits}
                </p>
                <p className="mt-1 text-xs font-bold text-brand-blue">
                  {isArabic ? 'السعر المتفق عليه:' : 'Agreed Rate:'} {item.priceEgp}{' '}
                  {isArabic ? 'ج.م' : 'EGP'}
                </p>
              </div>
            ))}
          </div>

          <DataTable
            columns={bookingColumns}
            rows={bookings.slice(0, 5)}
            emptyTitle={isArabic ? 'لا توجد حجوزات' : 'No bookings'}
          />
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {inventory.map((item) => {
            const pct = Math.min(100, Math.round((item.bookedUnits / item.maxUnits) * 100));
            return (
              <div
                key={item.id}
                className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-3"
              >
                <h3 className="font-heading text-lg font-extrabold text-brand-navy">
                  {isArabic ? item.nameAr : item.nameEn}
                </h3>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-brand-navy/65">
                    {isArabic ? 'السعة القصوى' : 'Max Capacity'}: {item.maxUnits}
                  </span>
                  <span className="text-brand-blue">
                    {isArabic ? 'المتبقي' : 'Remaining'}: {item.remainingUnits}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-mist">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.isFull ? 'bg-red-600' : 'bg-brand-blue'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-brand-navy">
                  {isArabic ? 'السعر المتفق عليه:' : 'Agreed Rate:'} {item.priceEgp}{' '}
                  {isArabic ? 'ج.م / وحدة' : 'EGP / unit'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'bookings' && (
        <DataTable
          columns={bookingColumns}
          rows={filteredBookings}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isArabic ? 'ابحث بالمرجع أو الخدمة...' : 'Search ref or service...'}
          filters={[
            { key: 'all', label: isArabic ? 'الكل' : 'All' },
            { key: 'pending', label: isArabic ? 'قيد المراجعة' : 'Pending' },
            { key: 'confirmed', label: isArabic ? 'مؤكد' : 'Confirmed' },
            { key: 'paid', label: isArabic ? 'مدفوع' : 'Paid' },
            { key: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
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
