import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faPlus,
  faRoute,
  faEye,
  faUsers,
  faCircleCheck,
  faCalendarCheck,
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
import { Button } from '../../shared/ui/index.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { addBooking } from '../../entities/booking/api/bookingService.js';
import { getCurrentUser } from '../../entities/user/api/authService.js';

export default function AgentDashboardPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [createdNotice, setCreatedNotice] = useState('');

  const { bookings, inventory } = useBookingsSync();
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    channel: 'B2B',
    tripKey: TRIPS[0]?.key || 'botanicalGarden',
    fullName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    guests: 4,
  });

  const agentBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesChannel =
        channelFilter === 'all' ||
        String(b.channel || 'B2C').toUpperCase() === channelFilter;
      const matchesQuery =
        !q ||
        String(b.reference || b.id).toLowerCase().includes(q) ||
        String(b.fullName || '').toLowerCase().includes(q) ||
        String(b.tripTitle || b.tripKey || '').toLowerCase().includes(q);
      return matchesChannel && matchesQuery;
    });
  }, [bookings, search, channelFilter]);

  const b2bCount = useMemo(
    () => bookings.filter((b) => String(b.channel).toUpperCase() === 'B2B').length,
    [bookings]
  );

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const trip = TRIPS.find((item) => item.key === form.tripKey) || TRIPS[0];
    const equipment = trip?.act || 'kayak';
    const invItem = inventory.find((i) => i.id === equipment);
    const units = Math.max(1, Number(form.guests) || 1);

    if (invItem && units > invItem.remainingUnits) {
      setCreatedNotice(
        isArabic
          ? `عذرًا، المتاح حاليًا من ${invItem.nameAr} هو ${invItem.remainingUnits} وحدة فقط.`
          : `Only ${invItem.remainingUnits} units available for ${invItem.nameEn}.`
      );
      return;
    }

    const totalAmount = (trip?.priceEg || 350) * units;
    const saved = addBooking({
      userId: currentUser?.id || 'demo-agent-01',
      email: currentUser?.email || '',
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      tripKey: trip.key,
      tripTitle: t(`trips.items.${trip.key}.title`, trip.slug),
      equipment,
      date: form.date,
      time: form.time,
      adults: units,
      guests: units,
      units,
      nationality: 'all_egyptian',
      totalAmount,
      amountToPay: totalAmount,
      remainingBalance: 0,
      status: 'pending',
      source: 'agent',
      channel: form.channel,
    });

    setCreatedNotice(
      isArabic
        ? `تم إنشاء الطلب ${saved.reference} ومزامنته مع الإدارة والعمليات بنجاح.`
        : `Request ${saved.reference} created & synced live.`
    );
    setForm((prev) => ({ ...prev, fullName: '', phone: '', guests: 2 }));
    setTimeout(() => setCreatedNotice(''), 5000);
  };

  const navItems = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: faGaugeHigh },
    { key: 'create', label: isArabic ? 'طلب حجز جديد (B2C / B2B)' : 'New Request (B2C / B2B)', icon: faPlus },
    { key: 'requests', label: isArabic ? 'متابعة الطلبات' : 'Track Requests', icon: faRoute },
  ];

  const columns = [
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
      key: 'channel',
      label: isArabic ? 'القناة' : 'Channel',
      render: (row) => (
        <span className="inline-flex rounded-full bg-surface-mist px-2.5 py-0.5 text-xs font-bold text-brand-navy">
          {row.channel || 'B2C'}
        </span>
      ),
    },
    {
      key: 'fullName',
      label: isArabic ? 'العميل / المجموعة' : 'Client / Group',
      render: (row) => <span className="font-bold text-brand-navy">{row.fullName}</span>,
    },
    {
      key: 'tripTitle',
      label: isArabic ? 'الرحلة' : 'Trip',
      render: (row) => <span>{row.tripTitle || row.tripKey}</span>,
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
      label: isArabic ? 'عرض' : 'View',
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedBooking(row)}
          className="inline-flex items-center gap-1 rounded-lg bg-surface-mist px-2.5 py-1.5 text-xs font-bold text-brand-navy hover:bg-brand-blue hover:text-white transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faEye} />
          <span>{isArabic ? 'التفاصيل' : 'Details'}</span>
        </button>
      ),
    },
  ];

  return (
    <DashboardShell
      portalTitle={isArabic ? 'بوابة المرشد والوكيل' : 'Tour Guide & Agent Portal'}
      portalSubtitle={isArabic ? 'تسجيل طلبات الأفراد والمجموعات ومتابعة جدول الرحلات' : 'Create B2C/B2B requests & track schedule'}
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}
              value={bookings.length}
              icon={faCalendarCheck}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'طلبات المجموعات (B2B)' : 'B2B Group Requests'}
              value={b2bCount}
              icon={faUsers}
              tone="yellow"
            />
            <StatCard
              title={isArabic ? 'المؤكد والمدفوع' : 'Confirmed & Paid'}
              value={bookings.filter((b) => ['confirmed', 'paid'].includes(String(b.status).toLowerCase())).length}
              icon={faCircleCheck}
              tone="success"
            />
          </div>

          <DataTable columns={columns} rows={bookings.slice(0, 6)} />
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-2xl rounded-[18px] border border-brand-blue/16 bg-surface-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-extrabold text-brand-navy">
            {isArabic ? 'إنشاء طلب حجز (B2C / B2B)' : 'Create B2C / B2B Booking Request'}
          </h2>
          <p className="mt-1 text-xs text-brand-navy/65">
            {isArabic
              ? 'يُضاف الطلب فورًا إلى النظام الموحد ويظهر لدى الإدارة والعمليات والشريك.'
              : 'Synced immediately to Admin, Operations, and Partner portals.'}
          </p>

          <form onSubmit={handleCreateRequest} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'نوع الطلب' : 'Channel'}
              </label>
              <select
                value={form.channel}
                onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-blue"
              >
                <option value="B2B">{isArabic ? 'مجموعة / شركة (B2B)' : 'Group / Corporate (B2B)'}</option>
                <option value="B2C">{isArabic ? 'فردي (B2C)' : 'Individual (B2C)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'الرحلة' : 'Trip'}
              </label>
              <select
                value={form.tripKey}
                onChange={(e) => setForm((p) => ({ ...p, tripKey: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-blue"
              >
                {TRIPS.map((tr) => (
                  <option key={tr.id} value={tr.key}>
                    {t(`trips.items.${tr.key}.title`, tr.slug)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'اسم العميل أو الجهة' : 'Client / Organization Name'}
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'عدد الأفراد / الوحدات' : 'Guests / Units'}
              </label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={form.guests}
                onChange={(e) => setForm((p) => ({ ...p, guests: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue"
              />
            </div>

            {createdNotice && (
              <div className="sm:col-span-2 rounded-xl bg-surface-mist border border-brand-blue/25 px-4 py-2.5 text-xs font-bold text-brand-navy">
                {createdNotice}
              </div>
            )}

            <div className="sm:col-span-2">
              <Button type="submit" variant="navy" size="md" className="font-bold">
                {isArabic ? 'إرسال وحفظ الطلب' : 'Submit & Sync Request'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'requests' && (
        <DataTable
          columns={columns}
          rows={agentBookings}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isArabic ? 'ابحث بالمرجع أو اسم الجهة...' : 'Search ref or client...'}
          filters={[
            { key: 'all', label: isArabic ? 'الكل' : 'All' },
            { key: 'B2B', label: 'B2B' },
            { key: 'B2C', label: 'B2C' },
          ]}
          activeFilter={channelFilter}
          onFilterChange={setChannelFilter}
        />
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </DashboardShell>
  );
}
