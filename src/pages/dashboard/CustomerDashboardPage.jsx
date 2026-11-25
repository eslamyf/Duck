import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faCompass,
  faTicket,
  faBuilding,
  faUserGear,
  faPlus,
  faCalendarCheck,
  faCoins,
  faShieldHalved,
  faBolt,
  faArrowLeft,
  faArrowRight,
  faMagnifyingGlass,
  faGlobe,
  faRightFromBracket,
  faBoxesStacked,
} from '@fortawesome/free-solid-svg-icons';

import {
  DashboardShell,
  StatCard,
  DataTable,
  BookingDetailsModal,
  TicketCard,
} from '../../widgets/dashboard/index.js';
import { useBookingsSync } from '../../shared/hooks/index.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { B2B_PARTNER_TYPES } from '../../shared/config/constants.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { Button } from '../../shared/ui/index.js';
import {
  getCurrentUser,
  updateCurrentUser,
  logoutUser,
} from '../../entities/user/api/authService.js';
import {
  getUserBookings,
  updateBookingStatus,
  addB2BQuote,
} from '../../entities/booking/api/bookingService.js';

const B2B_PACKAGES = [
  {
    id: 'starter',
    titleAr: 'باقة المجموعات والرحلات (20 - 35 فرد)',
    titleEn: 'Starter Group Outing (20 - 35 Guests)',
    descAr: 'كاياك أو ستاند أب بادل + سترة نجاة + مرشدان معتمدان + تصوير تذكاري.',
    descEn: 'Kayak or SUP + life jackets + 2 certified guides + souvenir photos.',
    badgeAr: 'خصم 15%',
    badgeEn: '15% Off',
    size: 25,
    type: 'event',
  },
  {
    id: 'corporate',
    titleAr: 'باقة بناء الفريق للشركات (40 - 80 فرد)',
    titleEn: 'Corporate Team Building (40 - 80 Guests)',
    descAr: 'مسابقات تجديف جماعية + نقطة استقبال خاصة + ضيافة نوبية أو مشروبات.',
    descEn: 'Team paddling challenges + private launch access + refreshments.',
    badgeAr: 'خصم 22%',
    badgeEn: '22% Off',
    size: 50,
    type: 'company',
  },
  {
    id: 'campus',
    titleAr: 'باقة المدارس والجامعات (60+ طالب)',
    titleEn: 'Universities & Schools Package (60+ Students)',
    descAr: 'أسعار تعليمية مخفضة + تقسيم على أفواج آمنة + إشراف كامل.',
    descEn: 'Educational discount rates + supervised rotated batches.',
    badgeAr: 'سعر خاص',
    badgeEn: 'Campus Deal',
    size: 60,
    type: 'school',
  },
];

export default function CustomerDashboardPage() {
  const { lang, setLanguage, t } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [profileForm, setProfileForm] = useState(() => ({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
  }));
  const [profileSaved, setProfileSaved] = useState(false);

  const [b2bForm, setB2bForm] = useState({
    organization: '',
    groupSize: 25,
    partnerType: 'company',
  });
  const [quoteNotice, setQuoteNotice] = useState('');

  // Subscribe to live bookings, inventory, and B2B quotes
  const { bookings: allBookings, inventory, quotes } = useBookingsSync();

  const userBookings = useMemo(() => {
    void allBookings;
    return getUserBookings(currentUser);
  }, [allBookings, currentUser]);

  const metrics = useMemo(() => {
    const active = userBookings.filter(
      (b) => !['cancelled', 'refunded'].includes(String(b.status).toLowerCase())
    );
    const totalSpent = active.reduce(
      (sum, b) => sum + (Number(b.totalAmount) || 0),
      0
    );
    return {
      activeCount: active.length,
      totalCount: userBookings.length,
      totalSpent,
    };
  }, [userBookings]);

  const latestBooking = useMemo(
    () =>
      userBookings.find(
        (b) => !['cancelled', 'refunded'].includes(String(b.status).toLowerCase())
      ) ||
      userBookings[0] ||
      null,
    [userBookings]
  );

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

  const filteredTrips = useMemo(() => {
    if (serviceFilter === 'all') return TRIPS;
    return TRIPS.filter((tr) => tr.act === serviceFilter);
  }, [serviceFilter]);

  const firstName =
    (isArabic
      ? currentUser?.fullName
      : currentUser?.fullNameEn || currentUser?.fullName
    )
      ?.trim()
      .split(' ')[0] || 'DUCK';

  const handleCancelBooking = (booking) => {
    const msg = isArabic
      ? `هل تريد إلغاء الحجز ${booking.reference || booking.id}؟ (الإلغاء المجاني متاح قبل 24 ساعة من الرحلة)`
      : `Cancel booking ${booking.reference || booking.id}? (Free cancellation up to 24h before trip)`;
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

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    if (!b2bForm.organization.trim()) return;
    const saved = addB2BQuote({
      organization: b2bForm.organization.trim(),
      groupSize: b2bForm.groupSize,
      partnerType: b2bForm.partnerType,
      contactName: currentUser?.fullName || '',
      phone: currentUser?.phone || '',
      status: 'New',
    });
    setB2bForm({ organization: '', groupSize: 25, partnerType: 'company' });
    setQuoteNotice(
      isArabic
        ? `تم إرسال طلب عرض السعر رقم ${saved.ref} بنجاح.`
        : `Quote request ${saved.ref} submitted successfully.`
    );
    setTimeout(() => setQuoteNotice(''), 4000);
  };

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  // Sidebar navigation aligned 1:1 with Final_4.html Customer portal
  const navItems = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: faChartPie },
    { key: 'services', label: isArabic ? 'الخدمات والحجز' : 'Services & Book', icon: faCompass },
    { key: 'bookings', label: isArabic ? 'حجوزاتي وتذاكري' : 'My Bookings', icon: faTicket },
    { key: 'b2b', label: isArabic ? 'باقات وعروض B2B' : 'B2B Packages', icon: faBuilding },
    { key: 'profile', label: isArabic ? 'بياناتي والحساب' : 'Profile & Settings', icon: faUserGear },
  ];

  const quoteColumns = [
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
      render: (row) => <span className="font-bold text-brand-navy">{row.organization}</span>,
    },
    {
      key: 'partnerType',
      label: isArabic ? 'النوع والعدد' : 'Type & Size',
      render: (row) => {
        const pt = B2B_PARTNER_TYPES.find((p) => p.id === row.partnerType);
        const label = pt ? (isArabic ? pt.labelAr : pt.labelEn) : row.partnerType;
        return (
          <span className="text-xs font-semibold">
            {label} ({row.groupSize})
          </span>
        );
      },
    },
    {
      key: 'date',
      label: isArabic ? 'التاريخ' : 'Date',
      render: (row) => (
        <span className="font-mono text-xs text-brand-navy/75" dir="ltr">
          {row.date}
        </span>
      ),
    },
    {
      key: 'status',
      label: isArabic ? 'الحالة' : 'Status',
      render: (row) => (
        <span className="inline-flex rounded-full bg-brand-blue/12 px-2.5 py-0.5 text-xs font-bold text-brand-blue">
          {row.status}
        </span>
      ),
    },
  ];

  const actLabel = (act) => {
    if (act === 'waterbike') return isArabic ? 'دراجة مائية' : 'Water Bike';
    if (act === 'sup') return 'SUP';
    return isArabic ? 'كاياك' : 'Kayak';
  };

  const getInventoryForAct = (act) =>
    inventory.find((i) => i.id === (act || 'kayak').toLowerCase());

  return (
    <DashboardShell
      portalTitle={isArabic ? 'بوابة العميل' : 'Customer Portal'}
      portalSubtitle={
        isArabic
          ? 'حجوزاتك، تذاكر QR الرقمية، والخدمات السريعة'
          : 'Tickets, QR passes, services & group packages'
      }
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerActions={
        <Button
          as={Link}
          to={ROUTES.BOOKING}
          variant="primary"
          size="sm"
          className="gap-1.5 font-bold"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>{isArabic ? 'حجز رحلة جديدة' : 'Book New Trip'}</span>
        </Button>
      }
    >
      {/* OVERVIEW TAB (Matched to Final_4.html lines 1986-1995) */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* .pm-hero */}
          <div className="rounded-[20px] bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue p-5 sm:p-6 text-white shadow-ocean flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                {isArabic ? `أهلاً بك يا ${firstName}` : `Welcome, ${firstName}`}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
                {isArabic
                  ? 'كل خدمات DUCK في مكان واحد: تابع تذاكرك برمز QR، احجز مغامرتك القادمة، أو اطلب باقة مجموعات B2B.'
                  : 'Manage your active QR tickets, explore Kayak, SUP & Water Bike trips, or request a group package.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-extrabold text-brand-navy shadow-sm transition hover:bg-brand-yellow-hover cursor-pointer"
            >
              <FontAwesomeIcon icon={faCompass} />
              <span>{isArabic ? 'استكشف واحجز رحلة الآن' : 'Browse & Book Trips'}</span>
            </button>
          </div>

          {/* 4 KPI Cards (.kpis) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title={isArabic ? 'التذاكر النشطة' : 'Active Tickets'}
              value={metrics.activeCount}
              icon={faTicket}
              tone="blue"
            />
            <StatCard
              title={isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}
              value={metrics.totalCount}
              icon={faCalendarCheck}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'إجمالي القيمة (EGP)' : 'Total Value (EGP)'}
              value={`${metrics.totalSpent.toLocaleString(isArabic ? 'ar-EG' : 'en-US')} ${isArabic ? 'ج.م' : 'EGP'}`}
              icon={faCoins}
              tone="yellow"
            />
            <StatCard
              title={isArabic ? 'سياسة الإلغاء' : 'Cancellation Policy'}
              value={isArabic ? 'مجاني 24 ساعة' : '24h Free'}
              icon={faShieldHalved}
              tone="success"
            />
          </div>

          {/* 2-Column Split (.pm-split): Latest QR Ticket + Quick Book Services */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Latest Ticket & QR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-extrabold text-brand-navy flex items-center gap-2">
                  <FontAwesomeIcon icon={faTicket} className="text-brand-blue" />
                  <span>{isArabic ? 'أحدث تذكرة ورمز QR' : 'Your Latest Booking & QR'}</span>
                </h3>
                {userBookings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                  >
                    {isArabic ? 'عرض كل التذاكر' : 'View all tickets'}
                  </button>
                )}
              </div>

              {latestBooking ? (
                <TicketCard
                  booking={latestBooking}
                  onOpenDetails={setSelectedBooking}
                  onCancel={handleCancelBooking}
                />
              ) : (
                <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-6 text-center shadow-card space-y-3">
                  <p className="font-bold text-brand-navy">
                    {isArabic ? 'لا توجد حجوزات نشطة حاليًا' : 'No active bookings yet'}
                  </p>
                  <p className="text-xs text-brand-navy/65">
                    {isArabic
                      ? 'احجز أول تجربة كاياك أو ستاند أب بادل لتظهر تذكرتك برمز QR هنا.'
                      : 'Book your first kayak or SUP trip to unlock your QR ticket here.'}
                  </p>
                  <Button as={Link} to={ROUTES.BOOKING} variant="primary" size="sm">
                    {isArabic ? 'احجز رحلتك الأولى' : 'Book First Trip'}
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Book Services (.pcard) */}
            <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-3.5">
              <div>
                <h3 className="font-heading text-lg font-extrabold text-brand-navy flex items-center gap-2">
                  <FontAwesomeIcon icon={faBolt} className="text-brand-yellow bg-brand-navy p-1.5 rounded-lg text-xs" />
                  <span>{isArabic ? 'الخدمات الأساسية والحجز السريع' : 'Quick Book Services'}</span>
                </h3>
                <p className="mt-1 text-xs text-brand-navy/65">
                  {isArabic
                    ? 'تأكيد فوري · شامل سترة النجاة والمرشد المعتمد'
                    : 'Instant confirmation · Life jackets & guide included'}
                </p>
              </div>

              <div className="space-y-2.5">
                {TRIPS.slice(0, 3).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between gap-3 rounded-[14px] border border-brand-blue/15 bg-surface-mist p-3"
                  >
                    <div className="min-w-0">
                      <b className="block truncate text-sm font-bold text-brand-navy">
                        {t(`trips.items.${trip.key}.title`, trip.slug)}
                      </b>
                      <small className="block truncate text-xs text-brand-navy/65">
                        {t(`destinations.items.${trip.loc}.title`, trip.loc)} · {actLabel(trip.act)} ·{' '}
                        {trip.priceEg} {isArabic ? 'ج.م مصري' : 'EGP'}
                      </small>
                    </div>
                    <Link
                      to={`${ROUTES.BOOKING}?trip=${trip.slug}`}
                      className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-full bg-brand-yellow px-4 py-1 text-xs font-extrabold text-brand-navy shadow-xs transition hover:bg-brand-yellow-hover"
                    >
                      {isArabic ? 'احجز' : 'Book'}
                    </Link>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full border border-brand-navy/20 bg-surface-white px-4 text-xs font-bold text-brand-navy transition hover:bg-brand-navy hover:text-brand-yellow cursor-pointer"
              >
                <span>
                  {isArabic
                    ? `عرض جميع الخدمات والرحلات (${TRIPS.length})`
                    : `View All ${TRIPS.length} Experiences`}
                </span>
                <FontAwesomeIcon icon={isArabic ? faArrowLeft : faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICES & BOOK TAB (Matched to Final_4.html lines 1996-1999) */}
      {activeTab === 'services' && (
        <div className="space-y-5">
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy flex items-center gap-2">
                <FontAwesomeIcon icon={faCompass} className="text-brand-blue" />
                <span>
                  {isArabic
                    ? 'جميع خدمات DUCK والحجز السريع'
                    : 'All DUCK Services & Instant Booking'}
                </span>
              </h2>
              <p className="text-xs text-brand-navy/65">
                {isArabic
                  ? 'تسعير شفاف للمصريين والأجانب · تسوية أساسية بـ EGP'
                  : 'Dual Egyptian/Foreigner pricing · EGP accounting base'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: isArabic ? 'الكل' : 'All' },
                { key: 'kayak', label: isArabic ? 'كاياك' : 'Kayak' },
                { key: 'sup', label: 'SUP' },
                { key: 'waterbike', label: isArabic ? 'دراجات مائية' : 'Water Bike' },
              ].map((f) => {
                const isOn = serviceFilter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setServiceFilter(f.key)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      isOn
                        ? 'bg-brand-navy text-brand-yellow shadow-xs'
                        : 'bg-surface-mist text-brand-navy/80 hover:bg-surface-mist2'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTrips.map((trip) => {
              const inv = getInventoryForAct(trip.act);
              const imgSrc = trip.images?.medium || trip.images?.thumb;
              const remainingText = inv
                ? isArabic
                  ? `${inv.remainingUnits} / ${inv.maxUnits} وحدة متاحة`
                  : `${inv.remainingUnits} / ${inv.maxUnits} units available`
                : '';

              return (
                <article
                  key={trip.id}
                  className="overflow-hidden rounded-[18px] border border-brand-blue/16 bg-surface-white shadow-card flex flex-col justify-between transition hover:shadow-soft"
                >
                  <div>
                    <div className="h-[160px] w-full overflow-hidden bg-brand-navy">
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={t(`trips.items.${trip.key}.title`, trip.slug)}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-[11px] font-bold text-brand-blue">
                        {t(`destinations.items.${trip.loc}.title`, trip.loc)} ·{' '}
                        {actLabel(trip.act)}
                      </p>
                      <h3 className="font-heading text-base font-extrabold text-brand-navy leading-snug">
                        {t(`trips.items.${trip.key}.title`, trip.slug)}
                      </h3>
                      <p className="line-clamp-2 text-xs text-brand-navy/70 leading-relaxed">
                        {t(`trips.items.${trip.key}.desc`, '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-brand-navy/8 px-4 py-3 bg-surface-mist/40">
                    <div>
                      <b className="block text-sm font-extrabold text-brand-navy">
                        {trip.priceEg} {isArabic ? 'ج.م' : 'EGP'}{' '}
                        <small className="font-semibold text-brand-navy/60">
                          / ${trip.price} {isArabic ? 'أجنبي' : 'Foreign'}
                        </small>
                      </b>
                      {remainingText && (
                        <small
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            inv?.isFull ? 'text-red-600' : 'text-brand-navy/65'
                          }`}
                        >
                          <FontAwesomeIcon icon={faBoxesStacked} />
                          <span>{remainingText}</span>
                        </small>
                      )}
                    </div>

                    <Link
                      to={`${ROUTES.BOOKING}?trip=${trip.slug}`}
                      className="inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-extrabold text-brand-navy shadow-xs transition hover:bg-brand-yellow-hover"
                    >
                      {isArabic ? 'احجز الآن' : 'Book Now'}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* MY BOOKINGS & DIGITAL TICKETS TAB (Matched to Final_4.html lines 2000-2002) */}
      {activeTab === 'bookings' && (
        <div className="space-y-5">
          <div className="rounded-[20px] bg-gradient-to-br from-brand-navy to-brand-blue p-5 text-white shadow-ocean flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faTicket} className="text-brand-yellow" />
                <span>
                  {isArabic
                    ? 'حجوزاتي وتذاكري الرقمية'
                    : 'My Tickets & Digital Bookings'}
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-white/85">
                {isArabic
                  ? 'اعرض رمز الـ QR عند نقطة الانطلاق لتأكيد الصعود فورًا.'
                  : 'Show your QR code upon arrival at the launch point.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-brand-yellow px-5 py-2 text-xs font-extrabold text-brand-navy shadow-xs transition hover:bg-brand-yellow-hover cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>{isArabic ? 'حجز رحلة جديدة' : 'New Booking'}</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-4 shadow-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-xs text-brand-navy/40"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isArabic
                    ? 'ابحث برقم الحجز أو اسم الرحلة...'
                    : 'Search by ref or trip...'
                }
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 py-2.5 ps-9 pe-3 text-sm text-brand-navy outline-none focus:border-brand-blue focus:bg-surface-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'all', label: isArabic ? 'الكل' : 'All' },
                { key: 'pending', label: isArabic ? 'قيد الانتظار' : 'Pending' },
                { key: 'confirmed', label: isArabic ? 'مؤكد' : 'Confirmed' },
                { key: 'paid', label: isArabic ? 'مدفوع' : 'Paid' },
                { key: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
                { key: 'cancelled', label: isArabic ? 'ملغي' : 'Cancelled' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    statusFilter === f.key
                      ? 'bg-brand-navy text-brand-yellow shadow-xs'
                      : 'bg-surface-mist text-brand-navy/75 hover:bg-surface-mist2'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-10 text-center shadow-card">
              <p className="font-bold text-brand-navy">
                {isArabic ? 'لا توجد تذاكر مطابقة' : 'No matching tickets'}
              </p>
              <p className="mt-1 text-xs text-brand-navy/60">
                {isArabic
                  ? 'جرّب تغيير فلتر الحالة أو استكشف الرحلات المتاحة.'
                  : 'Try adjusting your filter or explore available trips.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredBookings.map((booking) => (
                <TicketCard
                  key={booking.id}
                  booking={booking}
                  onOpenDetails={setSelectedBooking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* B2B PACKAGES & CUSTOM QUOTES TAB (Matched to Final_4.html lines 2013-2016) */}
      {activeTab === 'b2b' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Ready Tiered Group Packages */}
            <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-3.5">
              <h2 className="font-heading text-lg font-extrabold text-brand-navy flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-brand-blue" />
                <span>
                  {isArabic
                    ? 'باقات المجموعات الجاهزة (B2B)'
                    : 'Ready Tiered Group Packages'}
                </span>
              </h2>

              <div className="space-y-3">
                {B2B_PACKAGES.map((pk) => (
                  <div
                    key={pk.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[14px] border border-brand-blue/15 bg-surface-mist p-3.5"
                  >
                    <div className="space-y-1">
                      <b className="block text-sm font-extrabold text-brand-navy">
                        {isArabic ? pk.titleAr : pk.titleEn}
                      </b>
                      <p className="text-xs text-brand-navy/70 leading-relaxed">
                        {isArabic ? pk.descAr : pk.descEn}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setB2bForm((prev) => ({
                          ...prev,
                          groupSize: pk.size,
                          partnerType: pk.type,
                        }))
                      }
                      className="shrink-0 rounded-full bg-brand-navy px-3.5 py-1.5 text-xs font-bold text-brand-yellow hover:bg-brand-blue hover:text-white transition cursor-pointer"
                    >
                      {isArabic ? pk.badgeAr : pk.badgeEn}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Custom Group Quote Form */}
            <form
              onSubmit={handleQuoteSubmit}
              className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-4"
            >
              <h3 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic
                  ? 'طلب عرض سعر مخصص للمجموعات'
                  : 'Request Custom Group Quote'}
              </h3>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  {isArabic
                    ? 'اسم الشركة / الجامعة / الجهة *'
                    : 'Organization / Group Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={b2bForm.organization}
                  onChange={(e) =>
                    setB2bForm((p) => ({ ...p, organization: e.target.value }))
                  }
                  placeholder={
                    isArabic
                      ? 'مثال: جامعة أسوان / شركة...'
                      : 'e.g. Aswan University / Acme Corp'
                  }
                  className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue focus:bg-surface-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    {isArabic ? 'العدد المتوقع (10+)' : 'Group Size (10+)'}
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    required
                    value={b2bForm.groupSize}
                    onChange={(e) =>
                      setB2bForm((p) => ({ ...p, groupSize: e.target.value }))
                    }
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue focus:bg-surface-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    {isArabic ? 'نوع الجهة' : 'Partner Type'}
                  </label>
                  <select
                    value={b2bForm.partnerType}
                    onChange={(e) =>
                      setB2bForm((p) => ({ ...p, partnerType: e.target.value }))
                    }
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-blue"
                  >
                    {B2B_PARTNER_TYPES.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {isArabic ? pt.labelAr : pt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {quoteNotice && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">
                  {quoteNotice}
                </p>
              )}

              <Button type="submit" variant="primary" size="md" className="w-full font-bold">
                {isArabic ? 'إرسال طلب عرض السعر' : 'Submit Quote Request'}
              </Button>
            </form>
          </div>

          <DataTable
            columns={quoteColumns}
            rows={quotes}
            rowKey={(row) => row.ref}
            emptyTitle={isArabic ? 'لا توجد طلبات عروض أسعار بعد' : 'No B2B quotes yet'}
          />
        </div>
      )}

      {/* PROFILE & SESSION PREFERENCES TAB (Matched to Final_4.html lines 2019-2021) */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-6 shadow-card space-y-4"
          >
            <h2 className="font-heading text-lg font-extrabold text-brand-navy">
              {isArabic ? 'بيانات الحساب الشخصية' : 'Account Information'}
            </h2>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, fullName: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/50 px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-blue focus:bg-surface-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'رقم الواتساب / الهاتف' : 'WhatsApp / Phone'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, phone: e.target.value }))
                }
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
                {isArabic
                  ? 'تم تحديث بيانات حسابك بنجاح.'
                  : 'Profile changes saved successfully.'}
              </p>
            )}

            <Button type="submit" variant="primary" size="md" className="font-bold">
              {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
            </Button>
          </form>

          {/* Session & Preferences Card */}
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-6 shadow-card space-y-4">
            <h3 className="font-heading text-lg font-extrabold text-brand-navy">
              {isArabic ? 'الجلسة والتفضيلات' : 'Session & Preferences'}
            </h3>
            <p className="text-xs leading-relaxed text-brand-navy/70">
              {isArabic
                ? 'اتجاه القائمة الجانبية والواجهة يتبعان اللغة المختارة تلقائيًا (RTL للعربية / LTR للإنجليزية). التسوية المالية الأساسية لجميع الحجوزات تتم دائمًا بالجنيه المصري (EGP).'
                : 'Sidebar direction and interface follow your selected language (RTL for Arabic / LTR for English). Accounting settlement always uses EGP.'}
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
                className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-brand-navy/20 bg-surface-mist px-4 text-xs font-bold text-brand-navy transition hover:bg-brand-navy hover:text-brand-yellow cursor-pointer"
              >
                <FontAwesomeIcon icon={faGlobe} />
                <span>
                  {isArabic
                    ? 'Switch to English (Sidebar Left)'
                    : 'التبديل إلى العربية (القائمة يمين)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-xs font-bold text-white shadow-xs transition hover:bg-red-700 cursor-pointer"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>{isArabic ? 'تسجيل الخروج من الحساب' : 'Sign Out'}</span>
              </button>
            </div>
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
