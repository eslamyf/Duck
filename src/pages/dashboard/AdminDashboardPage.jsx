import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  faRotateLeft,
  faChartLine,
  faPlus,
  faTrash,
  faPenToSquare,
  faXmark,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

import {
  DashboardShell,
  StatCard,
  DataTable,
  StatusBadge,
  BookingDetailsModal,
} from '../../widgets/dashboard/index.js';
import { useBookingsSync, useCMS, useAnalyticsFunnel } from '../../shared/hooks/index.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { DEMO_ACCOUNTS } from '../../shared/config/demoAccounts.js';
import { ROLE_PORTAL_MAP } from '../../shared/config/rbac.js';
import { DEFAULT_ROLE_PERMISSIONS } from '../../entities/user/model/roles.js';
import {
  updateBookingStatus,
  getGlobalBookingStats,
  updateB2BQuote,
} from '../../entities/booking/api/bookingService.js';
import {
  resetAllDemoData,
  addDynamicDestination,
  updateDynamicDestination,
  deleteDynamicDestination,
  addDynamicTrip,
  deleteDynamicTrip,
  updateDynamicTrip,
  updateEquipmentCapacity,
} from '../../shared/api/cmsService.js';
import { ImageFocusCropper } from '../../shared/ui/index.js';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = [
    'overview',
    'bookings',
    'trips',
    'destinations',
    'providers',
    'analytics',
    'b2b',
    'users',
  ];
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
  const [resetMessage, setResetMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  // Modals & form state
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editingDest, setEditingDest] = useState(null);

  const [newTripForm, setNewTripForm] = useState({
    titleAr: '',
    titleEn: '',
    destKey: 'aswan',
    act: 'kayak',
    priceEg: 350,
    price: 650,
    durKey: '2h',
    max: 10,
    imageUrl: '',
    imagePosition: '50% 50%',
  });

  const [newDestForm, setNewDestForm] = useState({
    key: '',
    num: '06',
    nameAr: '',
    nameEn: '',
    descAr: '',
    descEn: '',
    tripCount: 1,
    lat: 24.0889,
    lng: 32.8998,
    imageUrl: '',
    imagePosition: '50% 20%',
  });

  const [editDestForm, setEditDestForm] = useState({
    id: '',
    key: '',
    num: '',
    nameAr: '',
    nameEn: '',
    descAr: '',
    descEn: '',
    imageUrl: '',
    imagePosition: '50% 50%',
  });

  const [editTripForm, setEditTripForm] = useState({
    priceEg: '',
    price: '',
    titleAr: '',
    titleEn: '',
    imageUrl: '',
    imagePosition: '50% 50%',
  });

  // Dynamic Hooks
  const { bookings, inventory, quotes } = useBookingsSync();
  const { destinations: dynamicDestinations, trips: dynamicTrips, equipmentCapacity } = useCMS();
  const { metrics, events, clearLog } = useAnalyticsFunnel();

  const safeMetrics = useMemo(() => ({
    pageViews: 0,
    viewActivities: 0,
    searches: 0,
    initiatedBookings: 0,
    addedDetails: 0,
    initiatedCheckouts: 0,
    purchases: 0,
    leads: 0,
    revenueEgp: 0,
    conversionRate: '0.0',
    ...(metrics || {}),
  }), [metrics]);

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
    { key: 'providers', label: isArabic ? 'المخزون والأسطول' : 'Fleet & Capacity', icon: faHandshake },
    { key: 'analytics', label: isArabic ? 'قمع التحويلات' : 'Conversion Funnel', icon: faChartLine },
    { key: 'b2b', label: isArabic ? 'طلبات عروض B2B' : 'B2B Quotes', icon: faBuilding },
    { key: 'users', label: isArabic ? 'المستخدمون والصلاحيات' : 'Users & RBAC', icon: faUsersGear },
  ];

  // Actions
  const handleOpenResetModal = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    resetAllDemoData();
    setShowResetModal(false);
    setResetMessage(
      isArabic
        ? 'تم مسح وتصفير كافة البيانات التجريبية بنجاح!'
        : 'All demo data has been wiped and reset successfully!'
    );
    setTimeout(() => setResetMessage(''), 4000);
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert(isArabic ? 'حجم الصورة كبير جداً، الحد الأقصى 15 ميجابايت' : 'Image is too large, max 15MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimize & resize image on canvas (max 1280px) to prevent localStorage quota issues
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (!dataUrl || dataUrl.length < 50 || !dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        callback(dataUrl);
      };
      img.onerror = () => {
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (!newTripForm.titleAr || !newTripForm.titleEn) return;
    const key = `trip_${Date.now()}`;
    const slug = newTripForm.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalImg =
      newTripForm.imageUrl ||
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80';
    addDynamicTrip({
      key,
      slug,
      titleAr: newTripForm.titleAr,
      titleEn: newTripForm.titleEn,
      destKey: newTripForm.destKey,
      act: newTripForm.act,
      priceEg: Number(newTripForm.priceEg) || 350,
      price: Number(newTripForm.price) || 650,
      durKey: newTripForm.durKey,
      max: Number(newTripForm.max) || 10,
      imagePosition: newTripForm.imagePosition || '50% 50%',
      objectPosition: newTripForm.imagePosition || '50% 50%',
      images: {
        thumb: finalImg,
        medium: finalImg,
      },
    });
    setShowAddTripModal(false);
    setNewTripForm({
      titleAr: '',
      titleEn: '',
      destKey: 'aswan',
      act: 'kayak',
      priceEg: 350,
      price: 650,
      durKey: '2h',
      max: 10,
      imageUrl: '',
      imagePosition: '50% 50%',
    });
  };

  const handleSaveTripPricing = (tripId, priceEg, price, imageUrl, titleAr, titleEn, imagePosition) => {
    const updates = {
      priceEg: Number(priceEg),
      price: Number(price),
    };
    if (titleAr) updates.titleAr = titleAr;
    if (titleEn) updates.titleEn = titleEn;
    if (imageUrl) {
      updates.images = {
        thumb: imageUrl,
        medium: imageUrl,
      };
      updates.imageUrl = imageUrl;
    }
    if (imagePosition) {
      updates.imagePosition = imagePosition;
      updates.objectPosition = imagePosition;
    }
    updateDynamicTrip(tripId, updates);
    setEditingTrip(null);
  };

  const handleCreateDest = (e) => {
    e.preventDefault();
    if (!newDestForm.nameAr || !newDestForm.nameEn) return;
    const key = newDestForm.key.trim() || newDestForm.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const finalImg =
      newDestForm.imageUrl ||
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';
    const finalPos = newDestForm.imagePosition || '50% 20%';

    addDynamicDestination({
      key,
      num: newDestForm.num,
      nameAr: newDestForm.nameAr,
      nameEn: newDestForm.nameEn,
      descAr: newDestForm.descAr,
      descEn: newDestForm.descEn,
      tripCount: Number(newDestForm.tripCount) || 1,
      lat: Number(newDestForm.lat) || 24.0889,
      lng: Number(newDestForm.lng) || 32.8998,
      filterKey: key,
      imageUrl: finalImg,
      imagePosition: finalPos,
      objectPosition: finalPos,
      images: {
        cover: finalImg,
        defaultSrc: finalImg,
        stripSrc: finalImg,
        srcSet: '',
      },
    });
    setShowAddDestModal(false);
    setNewDestForm({
      key: '',
      num: '06',
      nameAr: '',
      nameEn: '',
      descAr: '',
      descEn: '',
      tripCount: 1,
      lat: 24.0889,
      lng: 32.8998,
      imageUrl: '',
      imagePosition: '50% 20%',
    });
  };

  const handleOpenEditDest = (dest) => {
    const img = dest.imageUrl || dest.images?.cover || dest.images?.defaultSrc || dest.images?.stripSrc || '';
    const pos = dest.imagePosition || dest.objectPosition || '50% 50%';
    setEditingDest(dest);
    setEditDestForm({
      id: dest.id,
      key: dest.key || '',
      num: dest.num || '',
      nameAr: dest.nameAr || '',
      nameEn: dest.nameEn || '',
      descAr: dest.descAr || '',
      descEn: dest.descEn || '',
      imageUrl: img,
      imagePosition: pos,
    });
  };

  const handleSaveDestEdit = (e) => {
    e.preventDefault();
    if (!editingDest) return;
    const finalImg =
      editDestForm.imageUrl ||
      editingDest.imageUrl ||
      editingDest.images?.cover ||
      editingDest.images?.defaultSrc ||
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';
    const finalPos = editDestForm.imagePosition || '50% 50%';

    updateDynamicDestination(editingDest.id, {
      num: editDestForm.num,
      nameAr: editDestForm.nameAr,
      nameEn: editDestForm.nameEn,
      descAr: editDestForm.descAr,
      descEn: editDestForm.descEn,
      imageUrl: finalImg,
      imagePosition: finalPos,
      objectPosition: finalPos,
      images: {
        cover: finalImg,
        defaultSrc: finalImg,
        stripSrc: finalImg,
        srcSet: '',
      },
    });
    setEditingDest(null);
  };

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
          {(row.totalAmount || 0).toLocaleString(isArabic ? 'ar-EG' : 'en-US')}{' '}
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
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-slate-100">
            <img
              src={row.images?.thumb || row.images?.medium || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80'}
              alt={row.titleAr || row.slug}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div>
            <span className="font-bold text-brand-navy block">
              {row.titleAr || t(`trips.items.${row.key}.title`, row.slug)}
            </span>
            <span className="text-[11px] text-brand-navy/60 font-medium">
              {row.act} • {row.durKey || '2h'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'destKey',
      label: isArabic ? 'الوجهة' : 'Destination',
      render: (row) => (
        <span className="text-xs font-bold text-brand-navy">
          {t(`destinations.items.${row.destKey}.name`, row.destKey)}
        </span>
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
    {
      key: 'actions',
      label: isArabic ? 'إدارة' : 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingTrip(row);
              setEditTripForm({
                priceEg: row.priceEg || row.price || '',
                price: row.price || '',
                titleAr: row.titleAr || '',
                titleEn: row.titleEn || '',
                imageUrl: row.images?.medium || row.images?.thumb || '',
                imagePosition: row.imagePosition || row.objectPosition || '50% 50%',
              });
            }}
            className="p-1.5 rounded-lg bg-surface-mist text-brand-navy hover:bg-brand-navy hover:text-brand-yellow transition text-xs cursor-pointer"
            title={isArabic ? 'تعديل السعر والصورة' : 'Edit Price & Photo'}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteModal({ type: 'trip', id: row.id, title: row.titleAr || row.slug })}
            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition text-xs cursor-pointer"
            title={isArabic ? 'حذف' : 'Delete'}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
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
      headerActions={
        <button
          type="button"
          onClick={handleOpenResetModal}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
          <span>{isArabic ? 'مسح وتصفير البيانات التجريبية' : 'Wipe & Reset Demo Data'}</span>
        </button>
      }
    >
      {resetMessage && (
        <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex items-center justify-between">
          <span>{resetMessage}</span>
          <button
            type="button"
            onClick={() => setResetMessage('')}
            className="text-emerald-800 hover:opacity-75 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {/* OVERVIEW TAB */}
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
                      width: `${Math.min(100, (item.bookedUnits / item.maxUnits) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <DataTable
            columns={bookingColumns}
            rows={bookings.slice(0, 5)}
            emptyTitle={isArabic ? 'لا توجد حجوزات حديثة' : 'No recent bookings'}
          />
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <DataTable
          columns={bookingColumns}
          rows={filteredBookings}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={isArabic ? 'ابحث بالمرجع أو اسم العميل...' : 'Search ref or guest...'}
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

      {/* TRIPS & PRICING TAB */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-extrabold text-brand-navy">
              {isArabic ? 'إدارة الرحلات والأسعار المزدوجة (مصريين / أجانب)' : 'Dynamic Trips & Dual Pricing'}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddTripModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-3.5 py-2 text-xs font-bold text-brand-yellow hover:bg-brand-blue hover:text-white transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>{isArabic ? 'إضافة رحلة جديدة' : 'Add New Trip'}</span>
            </button>
          </div>

          <DataTable
            columns={tripColumns}
            rows={dynamicTrips}
            rowKey={(row) => row.id}
          />
        </div>
      )}

      {/* DESTINATIONS TAB */}
      {activeTab === 'destinations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-extrabold text-brand-navy">
              {isArabic ? 'إدارة الوجهات ونقاط الانطلاق الحية' : 'Dynamic Destinations & Launch Points'}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddDestModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-3.5 py-2 text-xs font-bold text-brand-yellow hover:bg-brand-blue hover:text-white transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>{isArabic ? 'إضافة وجهة جديدة' : 'Add New Destination'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dynamicDestinations.map((dest) => (
              <div
                key={dest.id}
                className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-4 shadow-card flex flex-col justify-between space-y-3"
              >
                <div>
                  {(() => {
                    const coverImg =
                      dest.imageUrl ||
                      dest.images?.cover ||
                      dest.images?.defaultSrc ||
                      dest.images?.stripSrc;
                    if (!coverImg) return null;
                    return (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-surface-mist border border-black/5 relative group">
                        <img
                          src={coverImg}
                          alt={dest.nameAr || dest.key}
                          style={{
                            objectPosition: dest.imagePosition || dest.objectPosition || 'center center',
                          }}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="absolute bottom-1.5 start-1.5 rounded-md bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono text-white/90">
                          {dest.imagePosition || '50% 50%'}
                        </span>
                      </div>
                    );
                  })()}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brand-blue uppercase">
                      {dest.num} • {dest.key}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditDest(dest)}
                        className="p-1.5 rounded-lg text-brand-blue hover:bg-brand-blue/10 transition cursor-pointer text-xs"
                        title={isArabic ? 'تعديل الوجهة وتحديد موضع الصورة' : 'Edit destination & crop'}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteModal({ type: 'dest', id: dest.id, title: dest.nameAr || dest.key })}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer text-xs"
                        title={isArabic ? 'حذف الوجهة' : 'Delete destination'}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-1 font-heading text-base font-extrabold text-brand-navy">
                    {dest.nameAr || t(`destinations.items.${dest.key}.name`, dest.key)}
                  </h3>
                  <p className="mt-1 text-xs text-brand-navy/65 line-clamp-2">
                    {dest.descAr || t(`destinations.items.${dest.key}.desc`, '')}
                  </p>
                </div>
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-brand-navy/70">
                  <span>
                    {dynamicTrips.filter((tr) => tr.destKey === dest.key).length || dest.tripCount}{' '}
                    {isArabic ? 'رحلات نشطة' : 'active trips'}
                  </span>
                  <span className="font-mono text-[10px]" dir="ltr">
                    {dest.lat?.toFixed?.(2) || '24.08'}, {dest.lng?.toFixed?.(2) || '32.90'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROVIDERS & FLEET CAPACITY TAB */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-4">
            <div>
              <h2 className="font-heading text-base font-extrabold text-brand-navy">
                {isArabic ? 'مخزون المعدات الحي وحماية الحجز الزائد (Overbooking Guard)' : 'Live Fleet Capacity & Overbooking Guard'}
              </h2>
              <p className="text-xs text-brand-navy/65 mt-1">
                {isArabic
                  ? 'أي تعديل على السعة القصوى هنا ينعكس فوراً على نموذج الحجز ويمنع تجاوز السعة الميدانية.'
                  : 'Adjusting capacity updates the booking engine instantly, enforcing strict slot limits.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { id: 'kayak', nameAr: 'كاياك النيل', nameEn: 'Nile Kayak', defaultMax: 20 },
                { id: 'waterbike', nameAr: 'دراجة مائية', nameEn: 'Water Bike (BR-003 Limit)', defaultMax: 2 },
                { id: 'sup', nameAr: 'ستاند أب بادل (SUP)', nameEn: 'Stand Up Paddle (SUP)', defaultMax: 10 },
              ].map((eq) => {
                const currentMax = equipmentCapacity[eq.id] ?? eq.defaultMax;
                const invItem = inventory.find((i) => i.id === eq.id);
                const booked = invItem?.bookedUnits || 0;
                const remaining = Math.max(0, currentMax - booked);

                return (
                  <div
                    key={eq.id}
                    className="rounded-2xl border border-brand-blue/12 bg-surface-mist/60 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-sm text-brand-navy">
                        {isArabic ? eq.nameAr : eq.nameEn}
                      </p>
                      {eq.id === 'waterbike' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {isArabic ? 'سعة محدودة' : 'Strict Limit'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-brand-navy/70">
                      <span>{isArabic ? 'المحجوز حالياً:' : 'Active Bookings:'} <strong>{booked}</strong></span>
                      <span>{isArabic ? 'المتبقي:' : 'Remaining:'} <strong className="text-emerald-700">{remaining}</strong></span>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy">
                        {isArabic ? 'السعة الكلية:' : 'Total Max:'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateEquipmentCapacity(eq.id, Math.max(1, currentMax - 1))}
                          className="w-7 h-7 rounded-lg bg-surface-white border border-brand-blue/20 text-brand-navy font-bold hover:bg-brand-navy hover:text-white transition flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-black text-sm text-brand-navy w-6 text-center">
                          {currentMax}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateEquipmentCapacity(eq.id, currentMax + 1)}
                          className="w-7 h-7 rounded-lg bg-brand-navy text-brand-yellow font-bold hover:bg-brand-blue hover:text-white transition flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONVERSION FUNNEL & ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic ? 'قمع التحويلات وتتبع تحويلات المنصة' : 'Conversion Funnel & Analytics Engine'}
              </h2>
              <p className="text-xs text-brand-navy/65">
                {isArabic
                  ? 'تتبع حي لكافة أحداث GA4 / GTM و Meta Pixel من الزيارة حتى إتمام الدفع وطلبات الشركات.'
                  : 'Live event tracking for GA4 / GTM and Meta Pixel across all 8 funnel stages.'}
              </p>
            </div>
            <button
              type="button"
              onClick={clearLog}
              className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
            >
              {isArabic ? 'مسح سجل التحليلات' : 'Clear Event Log'}
            </button>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title={isArabic ? 'مشاهدات الصفحات' : 'Page Views'}
              value={safeMetrics.pageViews}
              icon={faEye}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'بدء الحجز' : 'Initiated Bookings'}
              value={safeMetrics.initiatedBookings}
              icon={faCalendarCheck}
              tone="blue"
            />
            <StatCard
              title={isArabic ? 'معدل التحويل النهائي' : 'Conversion Rate'}
              value={`${safeMetrics.conversionRate}%`}
              icon={faChartLine}
              tone="success"
            />
            <StatCard
              title={isArabic ? 'إيرادات التحويلات' : 'Tracked Revenue'}
              value={`${Number(safeMetrics.revenueEgp || 0).toLocaleString(isArabic ? 'ar-EG' : 'en-US')} ${isArabic ? 'ج.م' : 'EGP'}`}
              icon={faCoins}
              tone="yellow"
            />
          </div>

          {/* Funnel Progression Bars */}
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-4">
            <h3 className="font-heading text-sm font-extrabold text-brand-navy">
              {isArabic ? 'مراحل قمع التحويل التفصيلية (8 أحداث متكاملة)' : 'Detailed 8-Stage Conversion Funnel'}
            </h3>
            <div className="space-y-3">
              {[
                { label: isArabic ? '1. زيارة الصفحة (page_view)' : '1. Page Views', val: safeMetrics.pageViews, color: 'bg-brand-navy' },
                { label: isArabic ? '2. استعراض نشاط (view_activity)' : '2. View Activities', val: safeMetrics.viewActivities, color: 'bg-brand-blue' },
                { label: isArabic ? '3. بحث وفلترة (search)' : '3. Searches', val: safeMetrics.searches, color: 'bg-brand-blue' },
                { label: isArabic ? '4. بدء الحجز (initiate_booking)' : '4. Initiated Bookings', val: safeMetrics.initiatedBookings, color: 'bg-indigo-600' },
                { label: isArabic ? '5. إدخال بيانات الضيوف (add_booking_details)' : '5. Guest Details', val: safeMetrics.addedDetails, color: 'bg-amber-600' },
                { label: isArabic ? '6. بدء الدفع (initiate_checkout)' : '6. Initiated Checkout', val: safeMetrics.initiatedCheckouts, color: 'bg-orange-600' },
                { label: isArabic ? '7. تأكيد الحجز والشراء (purchase)' : '7. Purchases', val: safeMetrics.purchases, color: 'bg-emerald-600' },
                { label: isArabic ? '8. طلبات عروض الشركات (lead_submission)' : '8. B2B Leads', val: safeMetrics.leads, color: 'bg-cyan-600' },
              ].map((stage, idx) => {
                const maxVal = Math.max(1, safeMetrics.pageViews, safeMetrics.purchases);
                const pct = Math.min(100, Math.round((stage.val / maxVal) * 100));
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                      <span>{stage.label}</span>
                      <span className="font-mono">{stage.val}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-mist">
                      <div
                        className={`h-full rounded-full ${stage.color} transition-all duration-300`}
                        style={{ width: `${Math.max(3, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Events Table */}
          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card space-y-3">
            <h3 className="font-heading text-sm font-extrabold text-brand-navy">
              {isArabic ? 'سجل الأحداث المباشر لحظيًا' : 'Real-Time Event Stream'}
            </h3>
            <div className="max-h-72 overflow-y-auto space-y-1.5 font-mono text-xs">
              {events.length === 0 ? (
                <p className="text-brand-navy/50 text-center py-4 font-body">
                  {isArabic ? 'لا توجد أحداث مسجلة بعد. تصفح الموقع وسوف تظهر هنا فوراً!' : 'No events logged yet. Browse the site to see live events here!'}
                </p>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2 rounded-lg bg-surface-mist/60 border border-black/5 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-brand-navy text-brand-yellow font-bold text-[10px]">
                        {ev.name}
                      </span>
                      <span className="text-brand-navy/70 text-[11px] truncate max-w-xs" dir="ltr">
                        {ev.path || '/'}
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-navy/50" dir="ltr">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* B2B QUOTES TAB */}
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

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <DataTable
          columns={roleColumns}
          rows={DEMO_ACCOUNTS}
          rowKey={(row) => row.id}
        />
      )}

      {/* MODAL: ADD TRIP (Wide 2-Column Responsive Layout) */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden my-auto border border-black/10 animate-in zoom-in-95 duration-200">
            {/* Fixed Header */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
              <h3 className="font-heading font-extrabold text-base text-brand-navy">
                {isArabic ? 'إضافة نشاط / رحلة جديدة' : 'Add New Activity / Trip'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTripModal(false)}
                className="text-brand-navy/60 hover:text-brand-navy cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Scrollable Form Body: 2-Column Wide Grid */}
            <form id="addTripForm" onSubmit={handleCreateTrip} className="flex-1 overflow-y-auto p-5 sm:p-6 font-body text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-[901px]:gap-6 items-start">
                {/* Column 1: Details */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالعربي' : 'Title (Arabic)'}</label>
                    <input
                      type="text"
                      required
                      value={newTripForm.titleAr}
                      onChange={(e) => setNewTripForm({ ...newTripForm, titleAr: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold"
                      placeholder="مثال: جولة غروب كوبري عباس"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالإنجليزي' : 'Title (English)'}</label>
                    <input
                      type="text"
                      required
                      value={newTripForm.titleEn}
                      onChange={(e) => setNewTripForm({ ...newTripForm, titleEn: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                      placeholder="e.g. Sunset Kayak Tour"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الوجهة' : 'Destination'}</label>
                      <select
                        value={newTripForm.destKey}
                        onChange={(e) => setNewTripForm({ ...newTripForm, destKey: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                      >
                        {dynamicDestinations.map((d) => (
                          <option key={d.key} value={d.key}>
                            {d.nameAr || d.key}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'نوع المعدة' : 'Equipment'}</label>
                      <select
                        value={newTripForm.act}
                        onChange={(e) => setNewTripForm({ ...newTripForm, act: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                      >
                        <option value="kayak">Kayak</option>
                        <option value="sup">SUP</option>
                        <option value="waterbike">Water Bike</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'سعر المصريين (ج.م)' : 'Egyptian Price (EGP)'}</label>
                      <input
                        type="number"
                        min="50"
                        required
                        value={newTripForm.priceEg}
                        onChange={(e) => setNewTripForm({ ...newTripForm, priceEg: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'سعر الأجانب (ج.م)' : 'Foreigner Price (EGP)'}</label>
                      <input
                        type="number"
                        min="50"
                        required
                        value={newTripForm.price}
                        onChange={(e) => setNewTripForm({ ...newTripForm, price: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">
                      {isArabic ? 'رابط مباشر للصورة (URL اختياري)' : 'Direct Image URL (Optional)'}
                    </label>
                    <input
                      type="url"
                      placeholder={isArabic ? 'https://example.com/photo.jpg' : 'https://example.com/photo.jpg'}
                      value={newTripForm.imageUrl?.startsWith('data:') ? '' : (newTripForm.imageUrl || '')}
                      onChange={(e) => setNewTripForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy text-[11px] font-mono"
                    />
                  </div>
                </div>

                {/* Column 2: Upload & Focus Cropper */}
                <div className="space-y-3">
                  <label className="block font-bold text-brand-navy mb-1">
                    {isArabic ? 'صورة الغلاف وتحديد موضع الظهور' : 'Cover / Trip Photo & Crop Focus'}
                  </label>
                  {newTripForm.imageUrl ? (
                    <ImageFocusCropper
                      imageUrl={newTripForm.imageUrl}
                      position={newTripForm.imagePosition}
                      onChange={(pos) => setNewTripForm((p) => ({ ...p, imagePosition: pos }))}
                      onRemove={() => setNewTripForm((p) => ({ ...p, imageUrl: '' }))}
                      aspectRatio="16/9"
                      isArabic={isArabic}
                      label={isArabic ? 'حدد موضع التركيز ليظهر النشاط بوضوح' : 'Select focus to keep activity in frame'}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-surface-mist/50 p-6 text-center hover:border-brand-blue transition h-56">
                      <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                        <div className="h-11 w-11 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-lg">
                          <FontAwesomeIcon icon={faUpload} />
                        </div>
                        <span className="text-xs font-bold text-brand-navy">
                          {isArabic ? 'اضغط لرفع صورة من جهازك' : 'Click to upload image from device'}
                        </span>
                        <span className="text-[10px] text-brand-navy/60">PNG, JPG, WebP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setNewTripForm((p) => ({ ...p, imageUrl: url })));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-black/10 flex justify-end gap-3 bg-surface-mist/40">
              <button
                type="button"
                onClick={() => setShowAddTripModal(false)}
                className="rounded-xl px-4 py-2 border border-black/15 font-bold text-brand-navy hover:bg-slate-100 cursor-pointer text-xs"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                form="addTripForm"
                className="rounded-xl px-5 py-2 bg-brand-navy text-brand-yellow font-bold hover:bg-brand-blue hover:text-white transition cursor-pointer text-xs shadow-sm"
              >
                {isArabic ? 'حفظ الرحلة' : 'Save Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD DESTINATION (Wide 2-Column Responsive Layout) */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden my-auto border border-black/10 animate-in zoom-in-95 duration-200">
            {/* Fixed Header */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
              <h3 className="font-heading font-extrabold text-base text-brand-navy">
                {isArabic ? 'إضافة وجهة جديدة' : 'Add New Destination'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDestModal(false)}
                className="text-brand-navy/60 hover:text-brand-navy cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Scrollable Form Body: 2-Column Wide Grid */}
            <form id="addDestForm" onSubmit={handleCreateDest} className="flex-1 overflow-y-auto p-5 sm:p-6 font-body text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-[901px]:gap-6 items-start">
                {/* Column 1: Info Fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الرمز (Key/Slug)' : 'Key / Slug'}</label>
                      <input
                        type="text"
                        required
                        value={newDestForm.key}
                        onChange={(e) => setNewDestForm({ ...newDestForm, key: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-mono"
                        placeholder="e.g. giza"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الرقم التسلسلي' : 'Number Code'}</label>
                      <input
                        type="text"
                        required
                        value={newDestForm.num}
                        onChange={(e) => setNewDestForm({ ...newDestForm, num: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                        placeholder="06"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالعربي' : 'Name (Arabic)'}</label>
                    <input
                      type="text"
                      required
                      value={newDestForm.nameAr}
                      onChange={(e) => setNewDestForm({ ...newDestForm, nameAr: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold"
                      placeholder="مثال: الجيزة – كوبري عباس"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالإنجليزي' : 'Name (English)'}</label>
                    <input
                      type="text"
                      required
                      value={newDestForm.nameEn}
                      onChange={(e) => setNewDestForm({ ...newDestForm, nameEn: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                      placeholder="e.g. Giza – Abbas Bridge"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الوصف بالعربي' : 'Description (Arabic)'}</label>
                    <textarea
                      value={newDestForm.descAr}
                      onChange={(e) => setNewDestForm({ ...newDestForm, descAr: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy h-20 leading-relaxed"
                      placeholder="وصف مختصر للوجهة وطبيعة التجربة النيلية فيها..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">
                      {isArabic ? 'رابط مباشر للصورة (URL اختياري)' : 'Direct Image URL (Optional)'}
                    </label>
                    <input
                      type="url"
                      placeholder={isArabic ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                      value={newDestForm.imageUrl?.startsWith('data:') ? '' : (newDestForm.imageUrl || '')}
                      onChange={(e) => setNewDestForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy text-[11px] font-mono"
                    />
                  </div>
                </div>

                {/* Column 2: Upload & Live Focus Cropper */}
                <div className="space-y-3">
                  <label className="block font-bold text-brand-navy mb-1">
                    {isArabic ? 'صورة غلاف الوجهة وتحديد موضع الظهور' : 'Destination Cover Photo & Crop Focus'}
                  </label>

                  {newDestForm.imageUrl ? (
                    <ImageFocusCropper
                      imageUrl={newDestForm.imageUrl}
                      position={newDestForm.imagePosition}
                      onChange={(pos) => setNewDestForm((p) => ({ ...p, imagePosition: pos }))}
                      onRemove={() => setNewDestForm((p) => ({ ...p, imageUrl: '' }))}
                      aspectRatio="16/9"
                      isArabic={isArabic}
                      label={isArabic ? 'موضع التركيز (أعلى/وسط/أسفل) ليظهر الوجه بوضوح' : 'Select focus to keep faces/landscape in frame'}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-surface-mist/50 p-6 text-center hover:border-brand-blue transition h-56">
                      <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                        <div className="h-11 w-11 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-lg">
                          <FontAwesomeIcon icon={faUpload} />
                        </div>
                        <span className="text-xs font-bold text-brand-navy">
                          {isArabic ? 'اضغط لرفع صورة من جهازك' : 'Click to upload image from device'}
                        </span>
                        <span className="text-[10px] text-brand-navy/60">PNG, JPG, WebP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setNewDestForm((p) => ({ ...p, imageUrl: url })));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-black/10 flex justify-end gap-3 bg-surface-mist/40">
              <button
                type="button"
                onClick={() => setShowAddDestModal(false)}
                className="rounded-xl px-4 py-2 border border-black/15 font-bold text-brand-navy hover:bg-slate-100 cursor-pointer text-xs"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                form="addDestForm"
                className="rounded-xl px-5 py-2 bg-brand-navy text-brand-yellow font-bold hover:bg-brand-blue hover:text-white transition cursor-pointer text-xs shadow-sm"
              >
                {isArabic ? 'حفظ الوجهة' : 'Save Destination'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DESTINATION & FOCUS POSITION (Wide 2-Column Responsive Layout) */}
      {editingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden my-auto border border-black/10 animate-in zoom-in-95 duration-200">
            {/* Fixed Header */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
              <h3 className="font-heading font-extrabold text-base text-brand-navy">
                {isArabic ? 'تعديل الوجهة وتحديد موضع الصورة' : 'Edit Destination & Image Focus'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDest(null)}
                className="text-brand-navy/60 hover:text-brand-navy cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Scrollable Form Body: 2-Column Wide Grid */}
            <form id="editDestForm" onSubmit={handleSaveDestEdit} className="flex-1 overflow-y-auto p-5 sm:p-6 font-body text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-[901px]:gap-6 items-start">
                {/* Column 1: Text Fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الرمز (Key/Slug)' : 'Key / Slug'}</label>
                      <input
                        type="text"
                        disabled
                        value={editDestForm.key}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy bg-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الرقم التسلسلي' : 'Number Code'}</label>
                      <input
                        type="text"
                        required
                        value={editDestForm.num}
                        onChange={(e) => setEditDestForm({ ...editDestForm, num: e.target.value })}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالعربي' : 'Name (Arabic)'}</label>
                    <input
                      type="text"
                      required
                      value={editDestForm.nameAr}
                      onChange={(e) => setEditDestForm({ ...editDestForm, nameAr: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالإنجليزي' : 'Name (English)'}</label>
                    <input
                      type="text"
                      required
                      value={editDestForm.nameEn}
                      onChange={(e) => setEditDestForm({ ...editDestForm, nameEn: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الوصف بالعربي' : 'Description (Arabic)'}</label>
                    <textarea
                      value={editDestForm.descAr}
                      onChange={(e) => setEditDestForm({ ...editDestForm, descAr: e.target.value })}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy h-20 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">
                      {isArabic ? 'رابط مباشر للصورة (URL اختياري)' : 'Direct Image URL (Optional)'}
                    </label>
                    <input
                      type="url"
                      placeholder={isArabic ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                      value={editDestForm.imageUrl?.startsWith('data:') ? '' : (editDestForm.imageUrl || '')}
                      onChange={(e) => setEditDestForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy text-[11px] font-mono"
                    />
                  </div>
                </div>

                {/* Column 2: Image Focus Cropper & Upload */}
                <div className="space-y-3">
                  <label className="block font-bold text-brand-navy mb-1">
                    {isArabic ? 'صورة غلاف الوجهة وتحديد موضع الظهور' : 'Destination Cover Photo & Crop Focus'}
                  </label>

                  {editDestForm.imageUrl ? (
                    <ImageFocusCropper
                      imageUrl={editDestForm.imageUrl}
                      position={editDestForm.imagePosition}
                      onChange={(pos) => setEditDestForm((p) => ({ ...p, imagePosition: pos }))}
                      onRemove={() => setEditDestForm((p) => ({ ...p, imageUrl: '' }))}
                      aspectRatio="16/9"
                      isArabic={isArabic}
                      label={isArabic ? 'موضع التركيز (أعلى/وسط/أسفل) ليظهر الوجه بوضوح' : 'Select focus to keep faces/landscape in frame'}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-surface-mist/50 p-6 text-center hover:border-brand-blue transition h-56">
                      <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                        <div className="h-11 w-11 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-lg">
                          <FontAwesomeIcon icon={faUpload} />
                        </div>
                        <span className="text-xs font-bold text-brand-navy">
                          {isArabic ? 'اضغط لرفع صورة من جهازك' : 'Click to upload image from device'}
                        </span>
                        <span className="text-[10px] text-brand-navy/60">PNG, JPG, WebP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setEditDestForm((p) => ({ ...p, imageUrl: url })));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Fixed Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-black/10 flex justify-end gap-3 bg-surface-mist/40">
              <button
                type="button"
                onClick={() => setEditingDest(null)}
                className="rounded-xl px-4 py-2 border border-black/15 font-bold text-brand-navy hover:bg-slate-100 cursor-pointer text-xs"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                form="editDestForm"
                className="rounded-xl px-5 py-2 bg-brand-navy text-brand-yellow font-bold hover:bg-brand-blue hover:text-white transition cursor-pointer text-xs shadow-sm"
              >
                {isArabic ? 'حفظ التعديلات والصورة' : 'Save Changes & Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TRIP PRICING & PHOTO (Wide 2-Column Responsive Layout) */}
      {editingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-black/10 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Fixed Header */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
              <h3 className="font-heading font-extrabold text-base text-brand-navy">
                {isArabic ? 'تعديل أسعار وصورة النشاط' : 'Edit Trip Pricing & Photo'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTrip(null)}
                className="text-brand-navy/60 hover:text-brand-navy cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Scrollable Body: 2-Column Wide Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 font-body text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-[901px]:gap-6 items-start">
                {/* Column 1: Pricing and Title */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالعربي' : 'Title (Arabic)'}</label>
                    <input
                      type="text"
                      value={editTripForm.titleAr || ''}
                      onChange={(e) => setEditTripForm((p) => ({ ...p, titleAr: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">{isArabic ? 'الاسم بالإنجليزي' : 'Title (English)'}</label>
                    <input
                      type="text"
                      value={editTripForm.titleEn || ''}
                      onChange={(e) => setEditTripForm((p) => ({ ...p, titleEn: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-brand-navy mb-1">
                        {isArabic ? 'سعر المصريين (ج.م)' : 'Egyptian Price (EGP)'}
                      </label>
                      <input
                        type="number"
                        value={editTripForm.priceEg}
                        onChange={(e) => setEditTripForm((p) => ({ ...p, priceEg: e.target.value }))}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-brand-navy mb-1">
                        {isArabic ? 'سعر الأجانب (ج.م)' : 'Foreigner Price (EGP)'}
                      </label>
                      <input
                        type="number"
                        value={editTripForm.price}
                        onChange={(e) => setEditTripForm((p) => ({ ...p, price: e.target.value }))}
                        className="w-full rounded-xl border border-black/15 p-2 text-brand-navy font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy mb-1">
                      {isArabic ? 'رابط مباشر للصورة (URL اختياري)' : 'Direct Image URL (Optional)'}
                    </label>
                    <input
                      type="url"
                      placeholder={isArabic ? 'أو ضع رابط صورة مباشر (URL)...' : 'Or paste direct image URL...'}
                      value={editTripForm.imageUrl?.startsWith('data:') ? '' : (editTripForm.imageUrl || '')}
                      onChange={(e) => setEditTripForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full rounded-xl border border-black/15 p-2 text-brand-navy text-[11px] font-mono"
                    />
                  </div>
                </div>

                {/* Column 2: Upload & Focus Cropper */}
                <div className="space-y-3">
                  <label className="block font-bold text-brand-navy mb-1">
                    {isArabic ? 'صورة النشاط وتحديد موضع الظهور' : 'Trip Photo & Crop Focus'}
                  </label>

                  {editTripForm.imageUrl ? (
                    <ImageFocusCropper
                      imageUrl={editTripForm.imageUrl}
                      position={editTripForm.imagePosition}
                      onChange={(pos) => setEditTripForm((p) => ({ ...p, imagePosition: pos }))}
                      onRemove={() => setEditTripForm((p) => ({ ...p, imageUrl: '' }))}
                      aspectRatio="16/9"
                      isArabic={isArabic}
                      label={isArabic ? 'موضع التركيز (أعلى/وسط/أسفل) ليظهر النشاط بوضوح' : 'Select focus to keep activity in frame'}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-surface-mist/50 p-6 text-center hover:border-brand-blue transition h-56">
                      <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                        <div className="h-11 w-11 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-lg">
                          <FontAwesomeIcon icon={faUpload} />
                        </div>
                        <span className="text-xs font-bold text-brand-navy">
                          {isArabic ? 'اضغط لرفع صورة جديدة' : 'Click to upload new image'}
                        </span>
                        <span className="text-[10px] text-brand-navy/60">PNG, JPG, WebP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setEditTripForm((p) => ({ ...p, imageUrl: url })));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="shrink-0 px-6 py-3.5 border-t border-black/10 flex justify-end gap-3 bg-surface-mist/40">
              <button
                type="button"
                onClick={() => setEditingTrip(null)}
                className="rounded-xl px-4 py-2 border border-black/15 font-bold text-brand-navy hover:bg-slate-100 cursor-pointer text-xs"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveTripPricing(
                    editingTrip.id,
                    editTripForm.priceEg,
                    editTripForm.price,
                    editTripForm.imageUrl,
                    editTripForm.titleAr,
                    editTripForm.titleEn,
                    editTripForm.imagePosition
                  );
                }}
                className="rounded-xl px-5 py-2 bg-brand-navy text-brand-yellow font-bold hover:bg-brand-blue hover:text-white transition cursor-pointer text-xs shadow-sm"
              >
                {isArabic ? 'تحديث الرحلة والصورة' : 'Update Trip & Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET & WIPE ALL DEMO DATA */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-black/10 space-y-5 animate-in zoom-in-95 duration-200 text-center font-body">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <FontAwesomeIcon icon={faTrash} />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-brand-navy">
                {isArabic ? 'مسح وتصفير كافة البيانات التجريبية' : 'Wipe & Reset All Demo Data'}
              </h3>
              <p className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed">
                {isArabic
                  ? 'سيتم حذف كافة الحجوزات التجريبية، طلبات عروض B2B، وسجلات التحليلات نهائياً لتصبح الجداول فارغة تماماً وجاهزة لاستقبال بياناتك الحقيقية.'
                  : 'This will permanently wipe all demo bookings, B2B quotes, and analytics event logs so your tables become clean and empty for real data.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-black/15 bg-surface-mist text-brand-navy font-bold text-xs sm:text-sm hover:bg-slate-200 transition cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs sm:text-sm hover:bg-rose-700 shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>{isArabic ? 'تأكيد المسح والتصفير' : 'Confirm & Wipe Clean'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE TRIP OR DESTINATION */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl border border-black/10 space-y-4 animate-in zoom-in-95 duration-200 text-center font-body">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto text-xl shadow-inner">
              <FontAwesomeIcon icon={faTrash} />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-brand-navy">
                {isArabic
                  ? deleteModal.type === 'trip'
                    ? 'حذف النشاط / الرحلة'
                    : 'حذف الوجهة'
                  : deleteModal.type === 'trip'
                    ? 'Delete Trip'
                    : 'Delete Destination'}
              </h3>
              <p className="text-xs text-brand-navy/70 leading-relaxed">
                {isArabic
                  ? `هل أنت متأكد من رغبتك في حذف "${deleteModal.title}"؟`
                  : `Are you sure you want to delete "${deleteModal.title}"?`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-black/15 bg-surface-mist text-brand-navy font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteModal.type === 'trip') {
                    deleteDynamicTrip(deleteModal.id);
                  } else {
                    deleteDynamicDestination(deleteModal.id);
                  }
                  setDeleteModal(null);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>{isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
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
