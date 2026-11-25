import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faCalendarCheck,
  faUser,
  faPlus,
  faEye,
  faBan,
  faCompass,
  faCircleCheck,
  faClock,
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
import { ROUTES } from '../../shared/config/routes.js';
import { Button } from '../../shared/ui/index.js';
import {
  getCurrentUser,
  updateCurrentUser,
} from '../../entities/user/api/authService.js';
import {
  getUserBookings,
  getBookingStats,
  updateBookingStatus,
} from '../../entities/booking/api/bookingService.js';

export default function CustomerDashboardPage() {
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [profileForm, setProfileForm] = useState(() => ({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
  }));
  const [profileSaved, setProfileSaved] = useState(false);

  // Subscribe to live booking changes
  const { bookings: allBookings } = useBookingsSync();

  const userBookings = useMemo(() => {
    void allBookings;
    return getUserBookings(currentUser);
  }, [allBookings, currentUser]);

  const stats = useMemo(() => {
    void allBookings;
    return getBookingStats(currentUser);
  }, [allBookings, currentUser]);

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return userBookings.filter((b) => {
      const matchesStatus =
        statusFilter === 'all' ||
        String(b.status).toLowerCase() === statusFilter;
      const matchesQuery =
        !q ||
        String(b.reference || b.id).toLowerCase().includes(q) ||
        String(b.tripTitle || b.tripKey || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [userBookings, search, statusFilter]);

  const nextUpcoming = useMemo(
    () =>
      userBookings.find(
        (b) => !['cancelled', 'refunded', 'completed'].includes(String(b.status).toLowerCase())
      ) || null,
    [userBookings]
  );

  const handleCancelBooking = (booking) => {
    const msg = isArabic
      ? `هل تريد طلب إلغاء الحجز ${booking.reference || booking.id}؟ (الإلغاء المجاني متاح قبل 24 ساعة من الرحلة)`
      : `Request cancellation for ${booking.reference || booking.id}? (Free cancellation up to 24h before trip)`;
    if (window.confirm(msg)) {
      updateBookingStatus(booking.id, 'cancelled');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = updateCurrentUser({
      fullName: profileForm.fullName.trim(),
      phone: profileForm.phone.trim(),
    });
    setCurrentUser(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const navItems = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: faGaugeHigh },
    { key: 'bookings', label: isArabic ? 'حجوزاتي' : 'My Bookings', icon: faCalendarCheck },
    { key: 'profile', label: isArabic ? 'الملف الشخصي' : 'Profile', icon: faUser },
  ];

  const statusFilters = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'pending', label: isArabic ? 'قيد المراجعة' : 'Pending' },
    { key: 'confirmed', label: isArabic ? 'مؤكد' : 'Confirmed' },
    { key: 'paid', label: isArabic ? 'مدفوع' : 'Paid' },
    { key: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
    { key: 'cancelled', label: isArabic ? 'ملغي' : 'Cancelled' },
  ];

  const bookingColumns = [
    {
      key: 'reference',
      label: isArabic ? 'رقم الحجز' : 'Ref',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-brand-blue" dir="ltr">
          {row.reference || row.id}
        </span>
      ),
    },
    {
      key: 'tripTitle',
      label: isArabic ? 'الرحلة' : 'Trip',
      render: (row) => (
        <span className="font-bold text-brand-navy">
          {row.tripTitle || row.tripKey}
        </span>
      ),
    },
    {
      key: 'date',
      label: isArabic ? 'التاريخ والوقت' : 'Date & Time',
      render: (row) => (
        <span className="text-xs text-brand-navy/80" dir="ltr">
          {row.date} • {row.time}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: isArabic ? 'الإجمالي' : 'Total',
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
      label: isArabic ? 'إجراءات' : 'Actions',
      render: (row) => {
        const canCancel = ['pending', 'confirmed'].includes(
          String(row.status).toLowerCase()
        );
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedBooking(row)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface-mist px-2.5 py-1.5 text-xs font-bold text-brand-navy hover:bg-brand-blue hover:text-white transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faEye} />
              <span>{isArabic ? 'التفاصيل' : 'Details'}</span>
            </button>
            {canCancel && (
              <button
                type="button"
                onClick={() => handleCancelBooking(row)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faBan} />
                <span>{isArabic ? 'إلغاء' : 'Cancel'}</span>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DashboardShell
      portalTitle={isArabic ? 'بوابة العميل' : 'Customer Portal'}
      portalSubtitle={isArabic ? 'متابعة حجوزاتك وتذاكرك في DUCK' : 'Manage your DUCK trips & tickets'}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={
        <Button as={Link} to={ROUTES.BOOKING} variant="primary" size="sm" className="gap-1.5 font-bold">
          <FontAwesomeIcon icon={faPlus} />
          <span>{isArabic ? 'حجز رحلة جديدة' : 'Book New Trip'}</span>
        </Button>
      }
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}
              value={stats.total}
              icon={faCompass}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'رحلات قادمة' : 'Upcoming Trips'}
              value={stats.upcoming}
              icon={faClock}
              tone="yellow"
            />
            <StatCard
              title={isArabic ? 'حجوزات مؤكدة' : 'Confirmed / Paid'}
              value={stats.confirmed}
              icon={faCircleCheck}
              tone="success"
            />
          </div>

          {nextUpcoming && (
            <div className="rounded-[18px] border border-brand-blue/20 bg-surface-white p-5 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                  {isArabic ? 'رحلتك القادمة' : 'Next Upcoming Adventure'}
                </p>
                <h2 className="mt-1 font-heading text-lg font-extrabold text-brand-navy">
                  {nextUpcoming.tripTitle || nextUpcoming.tripKey}
                </h2>
                <p className="mt-1 text-xs text-brand-navy/70" dir="ltr">
                  {nextUpcoming.reference || nextUpcoming.id} • {nextUpcoming.date} • {nextUpcoming.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={nextUpcoming.status} />
                <Button
                  type="button"
                  variant="navy"
                  size="sm"
                  onClick={() => setSelectedBooking(nextUpcoming)}
                  className="gap-1.5"
                >
                  <FontAwesomeIcon icon={faEye} />
                  <span>{isArabic ? 'التذكرة والفاتورة' : 'Ticket & Invoice'}</span>
                </Button>
              </div>
            </div>
          )}

          <DataTable
            columns={bookingColumns}
            rows={userBookings.slice(0, 5)}
            emptyTitle={isArabic ? 'لا توجد حجوزات حتى الآن' : 'No bookings yet'}
            emptyDescription={
              isArabic
                ? 'احجز أول مغامرة لك على النيل أو البحر المتوسط لتظهر هنا فورًا.'
                : 'Book your first Nile or Mediterranean adventure to see it here.'
            }
          />
        </div>
      )}

      {activeTab === 'bookings' && (
        <DataTable
          columns={bookingColumns}
          rows={filteredBookings}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isArabic ? 'ابحث برقم الحجز أو اسم الرحلة...' : 'Search by ref or trip...'}
          filters={statusFilters}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          emptyTitle={isArabic ? 'لا توجد حجوزات مطابقة' : 'No matching bookings'}
          emptyDescription={
            isArabic
              ? 'جرّب تغيير فلتر الحالة أو كلمة البحث.'
              : 'Try adjusting your status filter or search query.'
          }
        />
      )}

      {activeTab === 'profile' && (
        <div className="max-w-xl rounded-[18px] border border-brand-blue/16 bg-surface-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-extrabold text-brand-navy">
            {isArabic ? 'بيانات الحساب الشخصي' : 'Personal Account Details'}
          </h2>
          <p className="mt-1 text-xs text-brand-navy/65">
            {isArabic
              ? 'تُستخدم هذه البيانات لتسهيل حجوزاتك والتواصل عبر واتساب.'
              : 'Used to prefill bookings and coordinate via WhatsApp.'}
          </p>

          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                required
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue focus:bg-surface-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue focus:bg-surface-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                dir="ltr"
                value={currentUser?.email || ''}
                disabled
                className="w-full rounded-xl border border-brand-navy/10 bg-surface-sand px-3.5 py-2.5 text-sm text-brand-navy/60"
              />
            </div>

            {profileSaved && (
              <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-700">
                {isArabic ? 'تم حفظ التغييرات بنجاح.' : 'Profile changes saved successfully.'}
              </p>
            )}

            <Button type="submit" variant="navy" size="md" className="font-bold">
              {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
            </Button>
          </form>
        </div>
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </DashboardShell>
  );
}
