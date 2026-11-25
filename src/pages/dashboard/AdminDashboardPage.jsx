import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faCalendarCheck,
  faWater,
  faMapLocationDot,
  faHandshake,
  faUsersGear,
  faCoins,
  faClock,
  faCircleCheck,
  faEye,
  faBuilding,
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
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { DESTINATIONS } from '../../widgets/destinations/destinationsData.js';
import { DEMO_ACCOUNTS } from '../../shared/config/demoAccounts.js';
import { ROLE_PORTAL_MAP } from '../../shared/config/rbac.js';
import { DEFAULT_ROLE_PERMISSIONS } from '../../entities/user/model/roles.js';
import {
  updateBookingStatus,
  getGlobalBookingStats,
  updateB2BQuote,
} from '../../entities/booking/api/bookingService.js';

const ALL_STATUSES = [
  { value: 'pending', ar: 'قيد المراجعة', en: 'Pending' },
  { value: 'confirmed', ar: 'مؤكد', en: 'Confirmed' },
  { value: 'paid', ar: 'مدفوع', en: 'Paid' },
  { value: 'completed', ar: 'مكتمل', en: 'Completed' },
  { value: 'cancelled', ar: 'ملغي', en: 'Cancelled' },
  { value: 'refunded', ar: 'مسترد', en: 'Refunded' },
];

export default function AdminDashboardPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { bookings, inventory, quotes } = useBookingsSync();

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
    { key: 'bookings', label: isArabic ? 'إدارة الحجوزات' : 'Bookings', icon: faCalendarCheck },
    { key: 'trips', label: isArabic ? 'الأنشطة والأسعار' : 'Activities & Pricing', icon: faWater },
    { key: 'destinations', label: isArabic ? 'الوجهات' : 'Destinations', icon: faMapLocationDot },
    { key: 'providers', label: isArabic ? 'الشركاء والمخزون' : 'Partners & Fleet', icon: faHandshake },
    { key: 'b2b', label: isArabic ? 'طلبات عروض B2B' : 'B2B Quotes', icon: faBuilding },
    { key: 'users', label: isArabic ? 'المستخدمون والصلاحيات' : 'Users & RBAC', icon: faUsersGear },
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
      key: 'fullName',
      label: isArabic ? 'العميل' : 'Guest',
      render: (row) => (
        <div>
          <p className="font-bold text-brand-navy">{row.fullName || '-'}</p>
          <p className="text-[11px] text-brand-navy/55" dir="ltr">{row.phone || row.email || ''}</p>
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
      label: isArabic ? 'الموعد' : 'Schedule',
      render: (row) => (
        <span className="text-xs text-brand-navy/80" dir="ltr">
          {row.date} • {row.time}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: isArabic ? 'المبلغ' : 'Amount',
      render: (row) => (
        <span className="font-bold text-brand-navy">
          {Number(row.totalAmount || 0).toLocaleString(isArabic ? 'ar-EG' : 'en-US')}{' '}
          {isArabic ? 'ج.م' : 'EGP'}
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
      label: isArabic ? 'تحديث / عرض' : 'Manage',
      render: (row) => (
        <div className="flex items-center gap-2">
          <select
            aria-label={isArabic ? 'تغيير الحالة' : 'Change status'}
            value={String(row.status || 'pending').toLowerCase()}
            onChange={(e) => updateBookingStatus(row.id, e.target.value)}
            className="rounded-lg border border-brand-blue/25 bg-surface-mist px-2 py-1 text-xs font-bold text-brand-navy outline-none focus:border-brand-blue cursor-pointer"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {isArabic ? s.ar : s.en}
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

  const tripColumns = [
    {
      key: 'title',
      label: isArabic ? 'النشاط / الرحلة' : 'Activity / Trip',
      render: (row) => (
        <span className="font-bold text-brand-navy">
          {t(`trips.items.${row.key}.title`, row.slug)}
        </span>
      ),
    },
    {
      key: 'destKey',
      label: isArabic ? 'الوجهة' : 'Destination',
      render: (row) => (
        <span>{t(`destinations.items.${row.destKey}.name`, row.destKey)}</span>
      ),
    },
    {
      key: 'priceEg',
      label: isArabic ? 'سعر المصريين' : 'Egyptian Price',
      render: (row) => (
        <span className="font-bold text-brand-navy">
          {row.priceEg || row.price} {isArabic ? 'ج.م' : 'EGP'}
        </span>
      ),
    },
    {
      key: 'price',
      label: isArabic ? 'سعر الأجانب' : 'Foreigner Price',
      render: (row) => (
        <span className="font-bold text-brand-blue">
          {row.price} {isArabic ? 'ج.م' : 'EGP'}
        </span>
      ),
    },
  ];

  const roleColumns = [
    {
      key: 'role',
      label: isArabic ? 'الدور الوظيفي' : 'Role',
      render: (row) => <span className="font-bold text-brand-navy">{row.role}</span>,
    },
    {
      key: 'email',
      label: isArabic ? 'البريد التجريبي' : 'Account Email',
      render: (row) => (
        <span className="font-mono text-xs text-brand-blue" dir="ltr">
          {row.email}
        </span>
      ),
    },
    {
      key: 'portal',
      label: isArabic ? 'مسار البوابة' : 'Portal Route',
      render: (row) => (
        <span className="font-mono text-xs text-brand-navy/75" dir="ltr">
          {ROLE_PORTAL_MAP[row.role]}
        </span>
      ),
    },
    {
      key: 'perms',
      label: isArabic ? 'عدد الصلاحيات' : 'Permissions',
      render: (row) => (
        <span className="inline-flex rounded-full bg-surface-mist px-2.5 py-0.5 text-xs font-bold text-brand-navy">
          {(DEFAULT_ROLE_PERMISSIONS[row.role] || []).length}
        </span>
      ),
    },
  ];

  return (
    <DashboardShell
      portalTitle={isArabic ? 'لوحة الإدارة التنفيذية' : 'Admin Executive Portal'}
      portalSubtitle={isArabic ? 'إدارة الحجوزات، التسعير، والمخزون لحظيًا' : 'Live bookings, pricing & fleet control'}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title={isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}
              value={stats.total}
              icon={faCalendarCheck}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'قيد المراجعة' : 'Pending Review'}
              value={stats.pending}
              icon={faClock}
              tone="yellow"
            />
            <StatCard
              title={isArabic ? 'مؤكد ومدفوع' : 'Confirmed & Paid'}
              value={stats.confirmed + stats.paid}
              icon={faCircleCheck}
              tone="success"
            />
            <StatCard
              title={isArabic ? 'إجمالي الإيرادات' : 'Total Revenue'}
              value={`${stats.revenueEgp.toLocaleString(isArabic ? 'ar-EG' : 'en-US')} ${isArabic ? 'ج.م' : 'EGP'}`}
              icon={faCoins}
              tone="blue"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-extrabold text-brand-navy">
                    {isArabic ? item.nameAr : item.nameEn}
                  </h3>
                  <span className="text-xs font-bold text-brand-blue">
                    {item.remainingUnits} / {item.maxUnits}{' '}
                    {isArabic ? 'متاح' : 'avail'}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-mist">
                  <div
                    className="h-full rounded-full bg-brand-blue transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((item.bookedUnits / item.maxUnits) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <DataTable
            columns={bookingColumns}
            rows={bookings.slice(0, 6)}
            emptyTitle={isArabic ? 'لا توجد حجوزات' : 'No bookings'}
          />
        </div>
      )}

      {activeTab === 'bookings' && (
        <DataTable
          columns={bookingColumns}
          rows={filteredBookings}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isArabic ? 'ابحث بالمرجع، الاسم أو الرحلة...' : 'Search ref, guest or trip...'}
          filters={[
            { key: 'all', label: isArabic ? 'الكل' : 'All' },
            ...ALL_STATUSES.map((s) => ({
              key: s.value,
              label: isArabic ? s.ar : s.en,
            })),
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          emptyTitle={isArabic ? 'لا توجد حجوزات مطابقة' : 'No matching bookings'}
        />
      )}

      {activeTab === 'trips' && (
        <DataTable
          columns={tripColumns}
          rows={TRIPS}
          rowKey={(row) => row.id}
        />
      )}

      {activeTab === 'destinations' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card"
            >
              <p className="text-xs font-bold text-brand-blue uppercase">
                {dest.num} • {dest.key}
              </p>
              <h3 className="mt-1 font-heading text-lg font-extrabold text-brand-navy">
                {t(`destinations.items.${dest.key}.name`, dest.key)}
              </h3>
              <p className="mt-2 text-xs text-brand-navy/65">
                {TRIPS.filter((tr) => tr.destKey === dest.key).length || dest.tripCount}{' '}
                {isArabic ? 'رحلات نشطة' : 'active trips'}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card">
            <h2 className="font-heading text-base font-extrabold text-brand-navy">
              {isArabic ? 'مخزون المعدات المباشر (يمنع الحجز الزائد)' : 'Live Fleet Inventory (Overbooking Guard)'}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-brand-blue/12 bg-surface-mist/60 p-4"
                >
                  <p className="font-bold text-brand-navy">
                    {isArabic ? item.nameAr : item.nameEn}
                  </p>
                  <p className="mt-1 text-xs text-brand-navy/70">
                    {isArabic ? 'المحجوز:' : 'Booked:'} {item.bookedUnits} •{' '}
                    {isArabic ? 'المتاح:' : 'Remaining:'} {item.remainingUnits} / {item.maxUnits}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'b2b' && (
        <DataTable
          rowKey={(row) => row.ref}
          rows={quotes}
          columns={[
            {
              key: 'ref',
              label: isArabic ? 'المرجع' : 'Ref',
              render: (row) => (
                <span className="font-mono text-xs font-bold text-brand-blue" dir="ltr">
                  {row.ref}
                </span>
              ),
            },
            {
              key: 'organization',
              label: isArabic ? 'الجهة / الشركة' : 'Organization',
              render: (row) => (
                <div>
                  <p className="font-bold text-brand-navy">{row.organization}</p>
                  <p className="text-[11px] text-brand-navy/60" dir="ltr">
                    {row.contactName} • {row.phone}
                  </p>
                </div>
              ),
            },
            {
              key: 'groupSize',
              label: isArabic ? 'العدد' : 'Size',
              render: (row) => <span className="font-bold">{row.groupSize}</span>,
            },
            {
              key: 'commission',
              label: isArabic ? 'العمولة %' : 'Comm %',
              render: (row) => (
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={row.commission || 0}
                  onChange={(e) => updateB2BQuote(row.ref, { commission: Number(e.target.value) })}
                  className="w-16 rounded-lg border border-brand-blue/25 bg-surface-mist px-2 py-1 text-xs font-bold text-brand-navy"
                />
              ),
            },
            {
              key: 'status',
              label: isArabic ? 'الحالة' : 'Status',
              render: (row) => (
                <select
                  value={row.status || 'New'}
                  onChange={(e) => updateB2BQuote(row.ref, { status: e.target.value })}
                  className="rounded-lg border border-brand-blue/25 bg-surface-mist px-2 py-1 text-xs font-bold text-brand-navy cursor-pointer"
                >
                  {['New', 'Contacted', 'Quoted', 'Confirmed'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ),
            },
          ]}
          emptyTitle={isArabic ? 'لا توجد طلبات B2B' : 'No B2B quotes'}
        />
      )}

      {activeTab === 'users' && (
        <DataTable
          columns={roleColumns}
          rows={DEMO_ACCOUNTS}
          rowKey={(row) => row.id}
        />
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </DashboardShell>
  );
}
