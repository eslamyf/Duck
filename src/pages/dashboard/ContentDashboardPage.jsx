import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faPenToSquare,
  faImages,
  faTags,
  faPlus,
  faCheck,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

import {
  DashboardShell,
  StatCard,
  DataTable,
} from '../../widgets/dashboard/index.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';

const CONTENT_STORAGE_KEY = 'duck_content_overrides';

function getStoredContentOverrides() {
  try {
    return JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveStoredContentOverrides(overrides) {
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

export default function ContentDashboardPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();

  const VALID_TABS = ['overview', 'copy', 'media', 'offers'];
  const urlTab = searchParams.get('tab');
  const [localTab, setLocalTab] = useState('overview');
  const activeTab = VALID_TABS.includes(urlTab) ? urlTab : localTab;

  const setActiveTab = (nextTab) => {
    setLocalTab(nextTab);
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  const [search, setSearch] = useState('');
  const [selectedTripKey, setSelectedTripKey] = useState(TRIPS[0]?.key || 'botanicalGarden');
  const [contentOverrides, setContentOverrides] = useState(getStoredContentOverrides);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState('');

  // Editing form state for selected trip
  const currentTrip = useMemo(
    () => TRIPS.find((tr) => tr.key === selectedTripKey) || TRIPS[0],
    [selectedTripKey]
  );

  const [editForm, setEditForm] = useState({
    titleAr: '',
    titleEn: '',
    descAr: '',
    descEn: '',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most Popular',
  });

  // Promotional Offers
  const [offers, setOffers] = useState([
    {
      id: 'offer-1',
      titleAr: 'خصم رحلات الغروب الصيفية',
      titleEn: 'Sunset Kayaking Special Promo',
      code: 'SUNSET15',
      discount: '15%',
      active: true,
      expiry: '2026-12-31',
    },
    {
      id: 'offer-2',
      titleAr: 'عرض المجموعات والشركات',
      titleEn: 'Corporate & Groups Package',
      code: 'DUCKTEAM',
      discount: '20%',
      active: true,
      expiry: '2026-11-30',
    },
  ]);

  const [newOfferForm, setNewOfferForm] = useState({
    titleAr: '',
    titleEn: '',
    code: '',
    discount: '10%',
  });

  const [showAddOffer, setShowAddOffer] = useState(false);

  const navItems = [
    { key: 'overview', label: isArabic ? 'نظرة عامة' : 'Overview', icon: faGaugeHigh },
    { key: 'copy', label: isArabic ? 'تحرير نصوص الرحلات' : 'Trip Copy & Text', icon: faPenToSquare },
    { key: 'media', label: isArabic ? 'معرض الصور والوسائط' : 'Media & Photos', icon: faImages },
    { key: 'offers', label: isArabic ? 'العروض والإعلانات' : 'Offers & Banners', icon: faTags },
  ];

  const handleSelectTripForEdit = (trip) => {
    setSelectedTripKey(trip.key);
    const saved = contentOverrides[trip.key] || {};
    setEditForm({
      titleAr: saved.titleAr || t(`trips.items.${trip.key}.title`, trip.titleAr || trip.key),
      titleEn: saved.titleEn || trip.titleEn || trip.key,
      descAr: saved.descAr || t(`trips.items.${trip.key}.desc`, ''),
      descEn: saved.descEn || trip.descEn || '',
      badgeAr: saved.badgeAr || 'الأكثر تميزاً',
      badgeEn: saved.badgeEn || 'Featured',
    });
    setActiveTab('copy');
  };

  const handleSaveTripContent = (e) => {
    e.preventDefault();
    const updated = {
      ...contentOverrides,
      [selectedTripKey]: {
        ...editForm,
        updatedAt: new Date().toISOString(),
      },
    };
    setContentOverrides(updated);
    saveStoredContentOverrides(updated);
    setSavedSuccessNotice(
      isArabic
        ? 'تم حفظ المحتوى بنجاح ونشره على الموقع!'
        : 'Content updated and published successfully!'
    );
    setTimeout(() => setSavedSuccessNotice(''), 3000);
  };

  const handleAddOffer = (e) => {
    e.preventDefault();
    if (!newOfferForm.titleAr.trim() || !newOfferForm.code.trim()) return;

    const newOffer = {
      id: `offer-${Date.now()}`,
      titleAr: newOfferForm.titleAr.trim(),
      titleEn: newOfferForm.titleEn.trim() || newOfferForm.titleAr.trim(),
      code: newOfferForm.code.trim().toUpperCase(),
      discount: newOfferForm.discount.trim(),
      active: true,
      expiry: '2026-12-31',
    };

    setOffers((prev) => [newOffer, ...prev]);
    setNewOfferForm({ titleAr: '', titleEn: '', code: '', discount: '10%' });
    setShowAddOffer(false);
  };

  const handleToggleOffer = (id) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
  };

  const filteredTrips = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TRIPS.filter(
      (tr) =>
        !q ||
        tr.key.toLowerCase().includes(q) ||
        (tr.titleEn && tr.titleEn.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <DashboardShell
      portalTitle={isArabic ? 'بوابة إدارة المحتوى والتسويق' : 'Content & Media Portal'}
      portalSubtitle={
        isArabic
          ? 'إدارة محتوى الرحلات، معرض الصور، والعروض الترويجية'
          : 'Trip descriptions, photo galleries & promotional banners'
      }
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={isArabic ? 'الرحلات والتجارب' : 'Active Experiences'}
              value={TRIPS.length}
              icon={faPenToSquare}
              tone="navy"
            />
            <StatCard
              title={isArabic ? 'الصور والوسائط المعتمدة' : 'Media Assets'}
              value={TRIPS.length * 4 + 12}
              icon={faImages}
              tone="blue"
            />
            <StatCard
              title={isArabic ? 'العروض النشطة' : 'Active Promos'}
              value={offers.filter((o) => o.active).length}
              icon={faTags}
              tone="yellow"
            />
          </div>

          <div className="rounded-[18px] border border-brand-blue/16 bg-surface-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                  {isArabic ? 'تجارب DUCK المنشورة على الموقع' : 'Published DUCK Experiences'}
                </h2>
                <p className="text-xs text-brand-navy/60">
                  {isArabic
                    ? 'انقر على "تعديل النصوص" للتحكم المباشر في العناوين والوصف والشارات'
                    : 'Click "Edit Content" to update descriptions, titles, and highlight badges'}
                </p>
              </div>
            </div>

            <DataTable
              rowKey={(row) => row.id}
              rows={filteredTrips}
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder={isArabic ? 'ابحث باسم التجربة...' : 'Search trip...'}
              columns={[
                {
                  key: 'image',
                  label: isArabic ? 'الصورة' : 'Visual',
                  render: (row) => (
                    <img
                      src={row.images?.thumb || row.images?.medium}
                      alt=""
                      className="h-10 w-14 rounded-lg object-cover shadow-xs border border-brand-navy/10"
                    />
                  ),
                },
                {
                  key: 'title',
                  label: isArabic ? 'التجربة' : 'Experience',
                  render: (row) => (
                    <div>
                      <p className="font-bold text-brand-navy">
                        {contentOverrides[row.key]?.titleAr ||
                          t(`trips.items.${row.key}.title`, row.titleAr || row.key)}
                      </p>
                      <p className="text-[11px] text-brand-blue font-mono">{row.key}</p>
                    </div>
                  ),
                },
                {
                  key: 'badge',
                  label: isArabic ? 'الشارة البارزة' : 'Badge',
                  render: (row) => (
                    <span className="inline-flex rounded-full bg-brand-yellow/20 px-2.5 py-0.5 text-xs font-bold text-brand-navy">
                      {contentOverrides[row.key]?.badgeAr || 'مميز'}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  label: isArabic ? 'إجراءات' : 'Actions',
                  render: (row) => (
                    <button
                      type="button"
                      onClick={() => handleSelectTripForEdit(row)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-blue transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                      <span>{isArabic ? 'تعديل النصوص' : 'Edit Content'}</span>
                    </button>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* 2. Copy Editing Tab */}
      {activeTab === 'copy' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic ? 'تحرير محتوى ونصوص التجربة' : 'Edit Trip Content & Copy'}
              </h2>
              <p className="text-xs text-brand-navy/65">
                {isArabic ? 'التجربة المحددة:' : 'Selected trip:'}{' '}
                <span className="font-bold text-brand-blue">{currentTrip?.key}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="tripSelect" className="text-xs font-bold text-brand-navy">
                {isArabic ? 'اختر تجربة:' : 'Select trip:'}
              </label>
              <select
                id="tripSelect"
                value={selectedTripKey}
                onChange={(e) => {
                  const tr = TRIPS.find((t) => t.key === e.target.value);
                  if (tr) handleSelectTripForEdit(tr);
                }}
                className="rounded-xl border border-brand-blue/20 bg-surface-white px-3 py-1.5 text-xs font-bold text-brand-navy shadow-xs cursor-pointer"
              >
                {TRIPS.map((tr) => (
                  <option key={tr.key} value={tr.key}>
                    {t(`trips.items.${tr.key}.title`, tr.key)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {savedSuccessNotice && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <FontAwesomeIcon icon={faCheck} className="text-emerald-600" />
              <span>{savedSuccessNotice}</span>
            </div>
          )}

          <form
            onSubmit={handleSaveTripContent}
            className="rounded-[20px] border border-brand-blue/16 bg-surface-white p-6 shadow-card space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  {isArabic ? 'العنوان بالعربية' : 'Arabic Title'}
                </label>
                <input
                  type="text"
                  value={editForm.titleAr}
                  onChange={(e) => setEditForm((p) => ({ ...p, titleAr: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3.5 py-2 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue"
                  placeholder="مثال: جولة كاياك حرة في نيل أسوان"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  {isArabic ? 'العنوان بالإنجليزية' : 'English Title'}
                </label>
                <input
                  type="text"
                  value={editForm.titleEn}
                  onChange={(e) => setEditForm((p) => ({ ...p, titleEn: e.target.value }))}
                  className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3.5 py-2 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue"
                  placeholder="e.g. Nile Kayak Adventure"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  {isArabic ? 'الشارة الترويجية (عربي)' : 'Promo Badge (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editForm.badgeAr}
                  onChange={(e) => setEditForm((p) => ({ ...p, badgeAr: e.target.value }))}
                  className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3.5 py-2 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue"
                  placeholder="مثال: الأكثر طلباً أو مغامرة غروب"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  {isArabic ? 'الشارة الترويجية (إنجليزي)' : 'Promo Badge (English)'}
                </label>
                <input
                  type="text"
                  value={editForm.badgeEn}
                  onChange={(e) => setEditForm((p) => ({ ...p, badgeEn: e.target.value }))}
                  className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist px-3.5 py-2 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue"
                  placeholder="e.g. Best Seller or Sunset Special"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                {isArabic ? 'الوصف التفصيلي للتجربة (عربي)' : 'Detailed Description (Arabic)'}
              </label>
              <textarea
                rows={4}
                value={editForm.descAr}
                onChange={(e) => setEditForm((p) => ({ ...p, descAr: e.target.value }))}
                className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist p-3.5 text-sm font-semibold text-brand-navy outline-none focus:border-brand-blue leading-relaxed"
                placeholder="اكتب وصفاً جذاباً يشرح تفاصيل التجربة وما تحتويه..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-extrabold text-brand-yellow hover:bg-brand-blue hover:text-white transition shadow-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faSave} />
                <span>{isArabic ? 'حفظ ونشر التعديل' : 'Save & Publish Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Media Gallery Tab */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic ? 'معرض صور ووسائط DUCK' : 'DUCK Media & Visual Library'}
              </h2>
              <p className="text-xs text-brand-navy/60">
                {isArabic
                  ? 'معاينة واعتماد صور الرحلات عالية الدقة على الموقع'
                  : 'Curate high-res trip photos and visual hero posters'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRIPS.map((tr) => (
              <div
                key={tr.id}
                className="group relative rounded-[20px] overflow-hidden border border-brand-blue/16 bg-surface-white shadow-card transition hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-brand-navy">
                  <img
                    src={tr.images.large || tr.images.medium}
                    alt={tr.key}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 start-3 text-xs font-bold text-white">
                    {t(`trips.items.${tr.key}.title`, tr.key)}
                  </span>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-brand-navy/60">
                    {tr.destKey} • {tr.act}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectTripForEdit(tr)}
                    className="rounded-lg bg-surface-mist px-2.5 py-1 text-xs font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition cursor-pointer"
                  >
                    {isArabic ? 'تعديل الصور' : 'Manage Photos'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Offers & Promos Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic ? 'العروض الترويجية والخصومات الميدانية' : 'Promotional Offers & Discounts'}
              </h2>
              <p className="text-xs text-brand-navy/60">
                {isArabic ? 'إدارة أكواد الخصم والبانرات النشطة' : 'Manage promo codes and seasonal banners'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddOffer((p) => !p)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-brand-yellow px-4 py-2 text-xs font-extrabold text-brand-navy hover:bg-brand-yellow-hover transition shadow-sm cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>{isArabic ? 'إضافة عرض جديد' : 'New Promo Offer'}</span>
            </button>
          </div>

          {showAddOffer && (
            <form
              onSubmit={handleAddOffer}
              className="rounded-[20px] border border-brand-yellow/50 bg-brand-yellow/10 p-5 space-y-4 animate-fadeIn"
            >
              <h3 className="font-heading text-sm font-extrabold text-brand-navy">
                {isArabic ? 'إنشاء كود عرض جديد' : 'Create New Promotional Offer'}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  placeholder={isArabic ? 'اسم العرض (عربي)' : 'Offer Title'}
                  value={newOfferForm.titleAr}
                  onChange={(e) => setNewOfferForm((p) => ({ ...p, titleAr: e.target.value }))}
                  required
                  className="rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-bold text-brand-navy outline-none"
                />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. NILE20)"
                  value={newOfferForm.code}
                  onChange={(e) => setNewOfferForm((p) => ({ ...p, code: e.target.value }))}
                  required
                  className="rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-bold text-brand-navy outline-none uppercase font-mono"
                  dir="ltr"
                />
                <input
                  type="text"
                  placeholder={isArabic ? 'نسبة الخصم (مثال: 15%)' : 'Discount (e.g. 15%)'}
                  value={newOfferForm.discount}
                  onChange={(e) => setNewOfferForm((p) => ({ ...p, discount: e.target.value }))}
                  required
                  className="rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-bold text-brand-navy outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-extrabold text-brand-yellow hover:bg-brand-blue hover:text-white transition cursor-pointer"
                >
                  {isArabic ? 'تفعيل العرض' : 'Activate Promo'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-[20px] border p-5 shadow-card flex items-start justify-between gap-4 transition ${
                  offer.active
                    ? 'border-brand-blue/20 bg-surface-white'
                    : 'border-brand-navy/10 bg-surface-mist/70 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-brand-navy text-brand-yellow">
                      {offer.code}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      {offer.discount} {isArabic ? 'خصم' : 'OFF'}
                    </span>
                  </div>
                  <h3 className="mt-2 font-heading text-base font-extrabold text-brand-navy">
                    {isArabic ? offer.titleAr : offer.titleEn}
                  </h3>
                  <p className="mt-1 text-xs text-brand-navy/60">
                    {isArabic ? 'صالح حتى:' : 'Valid until:'} {offer.expiry}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleOffer(offer.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    offer.active
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {offer.active
                    ? isArabic
                      ? 'تعطيل'
                      : 'Deactivate'
                    : isArabic
                      ? 'تفعيل'
                      : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
