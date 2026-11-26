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
  faUpload,
  faTrash,
  faCamera,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import {
  DashboardShell,
  StatCard,
  DataTable,
} from '../../widgets/dashboard/index.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { TRIPS } from '../../widgets/trips/tripsData.js';

const CONTENT_STORAGE_KEY = 'duck_content_overrides';
const MEDIA_STORAGE_KEY = 'duck_custom_media';

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

function getStoredCustomMedia() {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStoredCustomMedia(mediaList) {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaList));
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
  const [customMedia, setCustomMedia] = useState(getStoredCustomMedia);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New photo upload form state
  const [uploadForm, setUploadForm] = useState({
    titleAr: '',
    titleEn: '',
    tripKey: 'general',
    previewUrl: '',
  });

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
    customImage: '',
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
      customImage: saved.customImage || '',
    });
    setActiveTab('copy');
  };

  const handleTripPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setEditForm((p) => ({ ...p, customImage: loadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChangeForGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setUploadForm((p) => ({
        ...p,
        previewUrl: loadEvent.target.result,
        titleAr: p.titleAr || file.name.replace(/\.[^/.]+$/, ''),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUploadedPhoto = (e) => {
    e.preventDefault();
    if (!uploadForm.previewUrl) return;

    const newPhoto = {
      id: `media-${Date.now()}`,
      src: uploadForm.previewUrl,
      titleAr: uploadForm.titleAr.trim() || 'صورة DUCK جديدة',
      titleEn: uploadForm.titleEn.trim() || 'DUCK Photo',
      tripKey: uploadForm.tripKey,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPhoto, ...customMedia];
    setCustomMedia(updated);
    saveStoredCustomMedia(updated);

    if (uploadForm.tripKey && uploadForm.tripKey !== 'general') {
      const overrides = { ...contentOverrides };
      overrides[uploadForm.tripKey] = {
        ...(overrides[uploadForm.tripKey] || {}),
        customImage: uploadForm.previewUrl,
      };
      setContentOverrides(overrides);
      saveStoredContentOverrides(overrides);
    }

    setUploadForm({ titleAr: '', titleEn: '', tripKey: 'general', previewUrl: '' });
    setShowUploadModal(false);
    setSavedSuccessNotice(isArabic ? 'تم حفظ وإضافة الصورة للمعرض بنجاح!' : 'Photo added to library successfully!');
    setTimeout(() => setSavedSuccessNotice(''), 3000);
  };

  const handleDeleteCustomPhoto = (id) => {
    const updated = customMedia.filter((m) => m.id !== id);
    setCustomMedia(updated);
    saveStoredCustomMedia(updated);
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
        ? 'تم حفظ المحتوى والصورة بنجاح ونشرها على الموقع!'
        : 'Content and photo updated and published successfully!'
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

            {/* Trip Cover Image Upload & Preview */}
            <div className="rounded-2xl border border-brand-blue/15 bg-surface-mist/70 p-4">
              <label className="block text-xs font-bold text-brand-navy mb-2">
                {isArabic ? 'صورة غلاف التجربة المعروضة' : 'Trip Cover Image'}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-28 w-44 shrink-0 rounded-xl overflow-hidden border border-brand-navy/15 bg-brand-navy shadow-sm">
                  <img
                    src={editForm.customImage || currentTrip.images.large || currentTrip.images.medium}
                    alt={currentTrip.key}
                    className="h-full w-full object-cover"
                  />
                  {editForm.customImage && (
                    <span className="absolute top-1.5 start-1.5 rounded-md bg-brand-navy/90 px-2 py-0.5 text-[10px] font-bold text-brand-yellow">
                      {isArabic ? 'صورة مخصصة' : 'Custom Image'}
                    </span>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex min-h-[38px] items-center gap-2 rounded-xl bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-navy transition cursor-pointer shadow-xs">
                      <FontAwesomeIcon icon={faUpload} />
                      <span>{isArabic ? 'رفع صورة من جهازك' : 'Upload from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTripPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {editForm.customImage && (
                      <button
                        type="button"
                        onClick={() => setEditForm((p) => ({ ...p, customImage: '' }))}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span>{isArabic ? 'استعادة الصورة الأصلية' : 'Reset to Default'}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-navy/60">
                    {isArabic
                      ? 'يمكنك رفع صورة بصيغة JPG أو PNG أو WebP بوضوح عالٍ لاستبدال صورة غلاف الرحلة فوراً على الموقع.'
                      : 'Upload a JPG, PNG, or WebP photo to customize this trip’s cover image live on the website.'}
                  </p>
                </div>
              </div>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                {isArabic ? 'معرض صور ووسائط DUCK' : 'DUCK Media & Visual Library'}
              </h2>
              <p className="text-xs text-brand-navy/60">
                {isArabic
                  ? 'رفع وإدارة صور الرحلات عالية الدقة ونشرها على الموقع'
                  : 'Upload, manage, and curate high-res trip photos live on the site'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal((p) => !p)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-brand-yellow px-4 py-2 text-xs font-extrabold text-brand-navy hover:bg-brand-yellow-hover transition shadow-sm cursor-pointer"
            >
              <FontAwesomeIcon icon={showUploadModal ? faXmark : faPlus} />
              <span>{showUploadModal ? (isArabic ? 'إغلاق النموذج' : 'Close Form') : (isArabic ? 'إضافة / رفع صورة جديدة' : 'Add New Photo')}</span>
            </button>
          </div>

          {/* Upload Modal / Form */}
          {showUploadModal && (
            <form
              onSubmit={handleSaveUploadedPhoto}
              className="rounded-[20px] border-2 border-brand-yellow/60 bg-brand-yellow/10 p-5 space-y-4 animate-fadeIn"
            >
              <h3 className="font-heading text-sm font-extrabold text-brand-navy flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} className="text-brand-blue" />
                <span>{isArabic ? 'رفع صورة جديدة للمعرض أو لرحلة محددة' : 'Upload New Photo to Library'}</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Upload box */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-surface-white p-5 text-center hover:border-brand-blue transition">
                  {uploadForm.previewUrl ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={uploadForm.previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadForm((p) => ({ ...p, previewUrl: '' }))}
                        className="absolute top-2 end-2 h-7 w-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700 shadow"
                        title={isArabic ? 'حذف المعاينة' : 'Remove preview'}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer py-4">
                      <div className="h-12 w-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xl">
                        <FontAwesomeIcon icon={faUpload} />
                      </div>
                      <span className="text-xs font-bold text-brand-navy">
                        {isArabic ? 'اضغط لاختيار صورة من جهازك' : 'Click to select photo from device'}
                      </span>
                      <span className="text-[10px] text-brand-navy/60">
                        PNG, JPG, WebP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChangeForGallery}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Details Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">
                      {isArabic ? 'تسمية الصورة / العنوان' : 'Photo Caption / Title'}
                    </label>
                    <input
                      type="text"
                      placeholder={isArabic ? 'مثال: لحظة غروب ساحرة في كاياك النيل' : 'e.g. Magical sunset kayaking'}
                      value={uploadForm.titleAr}
                      onChange={(e) => setUploadForm((p) => ({ ...p, titleAr: e.target.value }))}
                      className="w-full rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-semibold text-brand-navy outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">
                      {isArabic ? 'ربط الصورة برحلة محددة' : 'Attach to Specific Trip'}
                    </label>
                    <select
                      value={uploadForm.tripKey}
                      onChange={(e) => setUploadForm((p) => ({ ...p, tripKey: e.target.value }))}
                      className="w-full rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-bold text-brand-navy outline-none"
                    >
                      <option value="general">{isArabic ? 'معرض عام (جميع الوجهات)' : 'General Gallery'}</option>
                      {TRIPS.map((tr) => (
                        <option key={tr.key} value={tr.key}>
                          {t(`trips.items.${tr.key}.title`, tr.key)} ({tr.destKey})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">
                      {isArabic ? 'أو أدخل رابط صورة مباشر (URL)' : 'Or Enter Direct Image URL'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={uploadForm.previewUrl.startsWith('data:') ? '' : uploadForm.previewUrl}
                      onChange={(e) => setUploadForm((p) => ({ ...p, previewUrl: e.target.value }))}
                      className="w-full rounded-xl border border-brand-navy/20 bg-surface-white px-3 py-2 text-xs font-mono text-brand-navy outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!uploadForm.previewUrl}
                    className="w-full inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-xs font-black text-brand-yellow hover:bg-brand-blue hover:text-white transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    <span>{isArabic ? 'حفظ الصورة وإضافتها للمعرض' : 'Save & Publish Photo'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Custom Uploaded Photos Section (if any) */}
          {customMedia.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading text-sm font-extrabold text-brand-navy flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-blue" />
                <span>{isArabic ? 'الصور المضافة حديثاً بواسطة فريق المحتوى' : 'Recently Uploaded Media'} ({customMedia.length})</span>
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customMedia.map((media) => (
                  <div
                    key={media.id}
                    className="group relative rounded-[20px] overflow-hidden border border-brand-yellow/60 bg-surface-white shadow-card"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-brand-navy">
                      <img
                        src={media.src}
                        alt={media.titleAr}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 start-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[9.5px] font-extrabold text-brand-navy shadow-xs">
                        {isArabic ? 'صورة مرفوعة' : 'Uploaded'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomPhoto(media.id)}
                        className="absolute top-2 end-2 h-7 w-7 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xs hover:bg-red-700 transition shadow"
                        title={isArabic ? 'حذف الصورة' : 'Delete Photo'}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-brand-navy truncate">{media.titleAr}</p>
                      <p className="text-[10px] text-brand-navy/60 font-mono mt-0.5">
                        {media.tripKey === 'general' ? (isArabic ? 'معرض عام' : 'General') : media.tripKey}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Photos Grid */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-extrabold text-brand-navy flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-navy/30" />
              <span>{isArabic ? 'مكتبة صور الرحلات الأساسية' : 'Primary Trip Visuals'}</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRIPS.map((tr) => {
                const customImg = contentOverrides[tr.key]?.customImage;
                const displayImg = customImg || tr.images.large || tr.images.medium;

                return (
                  <div
                    key={tr.id}
                    className="group relative rounded-[20px] overflow-hidden border border-brand-blue/16 bg-surface-white shadow-card transition hover:shadow-lg"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-brand-navy">
                      <img
                        src={displayImg}
                        alt={tr.key}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent pointer-events-none" />
                      {customImg && (
                        <span className="absolute top-2 start-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[9.5px] font-extrabold text-brand-navy shadow-xs">
                          {isArabic ? 'مخصصة' : 'Custom'}
                        </span>
                      )}
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
                        {isArabic ? 'تغيير صورة الرحلة' : 'Change Photo'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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
