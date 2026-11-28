import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  faRightFromBracket,
  faBoxesStacked,
  faTriangleExclamation,
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
} from '../../entities/booking/api/bookingService.js';
import { KayakLanguageSwitch } from '../../features/currency-language-switcher/index.js';

const B2B_PACKAGES = [
  {
    id: 'starter',
    titleAr: 'مجموعات وأصدقاء (20 - 34 فرد)',
    titleEn: 'Groups & Friends (20 - 34 Guests)',
    descAr: 'تنظيم كامل ومرشد خاص + تنسيق مخصص لعدد المجموعة بدون أسعار مسبقة.',
    descEn: 'Full coordination & private guide tailored to your group size.',
    ctaAr: 'احجز لمجموعتك',
    ctaEn: 'Book Package',
    size: 20,
    typeIdx: 0,
  },
  {
    id: 'corporate',
    titleAr: 'جامعات وشركات (35 - 59 فرد)',
    titleEn: 'Corporates & Teams (35 - 59 Guests)',
    descAr: 'جدول تناوب منظم وتنسيق شامل للفعاليات + عرض خاص للمجموعة.',
    descEn: 'Structured rotation schedule & dedicated corporate event setup.',
    ctaAr: 'احجز لمجموعتك',
    ctaEn: 'Book Package',
    size: 35,
    typeIdx: 1,
  },
  {
    id: 'campus',
    titleAr: 'مدارس وفعاليات كبرى (60+ فرد)',
    titleEn: 'Schools & Large Events (60+ Guests)',
    descAr: 'تخصيص الأسطول بالكامل ومنسق فعالية وإشراف ميداني شامل.',
    descEn: 'Dedicated fleet allocation, event coordinator & full field support.',
    ctaAr: 'احجز لمجموعتك',
    ctaEn: 'Book Package',
    size: 60,
    typeIdx: 2,
  },
];

export default function CustomerDashboardPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const VALID_TABS = ['overview', 'services', 'bookings', 'b2b', 'profile'];
  const urlTab = searchParams.get('tab');
  const [localTab, setLocalTab] = useState('overview');
  const activeTab = VALID_TABS.includes(urlTab) ? urlTab : localTab;
  const setActiveTab = (nextTab) => {
    setLocalTab(nextTab);
    setSearchParams({ tab: nextTab }, { replace: true });
  };
  const [serviceFilter, setServiceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelConfirmBooking, setCancelConfirmBooking] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [profileForm, setProfileForm] = useState(() => ({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
  }));
  const [profileSaved, setProfileSaved] = useState(false);

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
    setCancelConfirmBooking(booking);
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
                        {t(`destinations.items.${trip.destKey}.name`, trip.destKey)} · {actLabel(trip.act)} ·{' '}
                        {trip.priceEg || trip.price} {isArabic ? 'ج.م' : 'EGP'}
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
                        {t(`destinations.items.${trip.destKey}.name`, trip.destKey)} ·{' '}
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
                        {trip.priceEg ? (
                          <>
                            {trip.priceEg} {isArabic ? 'ج.م مصري' : 'EGP EG'}{' '}
                            <small className="font-semibold text-brand-navy/60">
                              / {trip.price} {isArabic ? 'ج.م أجنبي' : 'EGP Foreign'}
                            </small>
                          </>
                        ) : (
                          <>
                            {trip.price} {isArabic ? 'ج.م' : 'EGP'}
                          </>
                        )}
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

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={ROUTES.tripDetails(trip.slug)}
                        className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-full border border-brand-navy/20 bg-white px-3.5 py-1.5 text-xs font-extrabold text-brand-navy shadow-xs transition hover:bg-brand-navy hover:text-white"
                      >
                        {isArabic ? 'التفاصيل' : 'Details'}
                      </Link>
                      <Link
                        to={`${ROUTES.BOOKING}?trip=${trip.slug}`}
                        className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-full bg-brand-yellow px-4 py-1.5 text-xs font-extrabold text-brand-navy shadow-xs transition hover:bg-brand-yellow-hover"
                      >
                        {isArabic ? 'احجز الآن' : 'Book Now'}
                      </Link>
                    </div>
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

      {/* B2B PACKAGES & GROUP BOOKING REDIRECT TAB */}
      {activeTab === 'b2b' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr] items-start">
            {/* Group Packages (Zero upfront discounts, links to /groups) */}
            <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-3.5">
              <h2 className="font-heading text-lg font-extrabold text-brand-navy flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-brand-blue" />
                <span>
                  {isArabic
                    ? 'حجز المجموعات والفعاليات (B2B)'
                    : 'Group & Corporate Packages (B2B)'}
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
                    <Link
                      to={`${ROUTES.GROUPS}?size=${pk.size}&type=${pk.typeIdx}`}
                      className="inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-full bg-brand-navy px-4 py-1.5 text-xs font-bold text-brand-yellow shadow-xs transition hover:bg-brand-blue hover:text-white"
                    >
                      {isArabic ? pk.ctaAr : pk.ctaEn}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct CTA Card to Full Group Data Submission Page (/groups) */}
            <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-6 shadow-card space-y-4">
              <h3 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic
                  ? 'إرسال بيانات الحجز الجماعي'
                  : 'Submit Group Booking Details'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-navy/75 leading-relaxed">
                {isArabic
                  ? 'لا توجد أسعار أو خصومات ثابتة مسبقًا — فور تسجيل بيانات مجموعتك وعدد الأفراد في صفحة الحجز الجماعي يتواصل معك فريق المجموعات مباشرة لتنسيق الباقة المناسبة، ويظهر طلبك تلقائيًا في جدول المتابعة أدناه.'
                  : 'No fixed upfront discounts — submit your group count and preferences in our dedicated Group Booking page. Our team coordinates your custom deal and syncs it live below.'}
              </p>

              <Link
                to={ROUTES.GROUPS}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-extrabold text-brand-navy shadow-sm transition hover:bg-brand-yellow-hover"
              >
                <span>
                  {isArabic
                    ? 'الانتقال لصفحة إرسال بيانات الحجز الجماعي'
                    : 'Go to Group Booking Form'}
                </span>
                <FontAwesomeIcon icon={isArabic ? faArrowLeft : faArrowRight} />
              </Link>
            </div>
          </div>

          <DataTable
            columns={quoteColumns}
            rows={quotes}
            rowKey={(row) => row.ref}
            emptyTitle={isArabic ? 'لا توجد طلبات حجز جماعي بعد' : 'No group booking requests yet'}
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
              <div className="flex min-h-[42px] w-full items-center justify-center">
                <KayakLanguageSwitch />
              </div>

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

      {/* MODAL: CANCEL BOOKING CONFIRMATION */}
      {cancelConfirmBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl border border-black/10 space-y-4 animate-in zoom-in-95 duration-200 text-center font-body">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-xl shadow-inner">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-brand-navy">
                {isArabic ? 'تأكيد إلغاء الحجز' : 'Confirm Cancellation'}
              </h3>
              <p className="text-xs text-brand-navy/70 leading-relaxed">
                {isArabic
                  ? `هل تريد إلغاء الحجز ${cancelConfirmBooking.reference || cancelConfirmBooking.id}؟ (الإلغاء المجاني متاح قبل 24 ساعة من الرحلة)`
                  : `Cancel booking ${cancelConfirmBooking.reference || cancelConfirmBooking.id}? (Free cancellation up to 24h before trip)`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelConfirmBooking(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-black/15 bg-surface-mist text-brand-navy font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                {isArabic ? 'تراجع' : 'Keep'}
              </button>
              <button
                type="button"
                onClick={() => {
                  updateBookingStatus(cancelConfirmBooking.id, 'cancelled');
                  setCancelConfirmBooking(null);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-sm transition cursor-pointer"
              >
                {isArabic ? 'تأكيد الإلغاء' : 'Yes, Cancel'}
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
