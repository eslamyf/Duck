import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader } from '../../shared/ui/index.js';
import { MAP_PINS, DESTINATIONS } from './mapData.js';
import { useCMS } from '../../shared/hooks/index.js';
import DestinationMapCard from './DestinationMapCard.jsx';

// Lazy-load EgyptInteractiveMap so Leaflet (148KB), leaflet.css, and map tiles
// are strictly deferred until the user scrolls near the Map Section!
const EgyptInteractiveMap = lazy(() => import('./EgyptInteractiveMap.jsx'));

function MapSkeleton() {
  return (
    <div className="w-full h-full min-h-[460px] min-[901px]:min-h-[540px] flex flex-col items-center justify-center bg-[#f2efe9] text-brand-navy p-6">
      <div className="w-12 h-12 rounded-full border-3 border-brand-blue/30 border-t-brand-blue animate-spin mb-3" />
      <span className="font-bold text-xs tracking-wider text-brand-navy">جاري تحميل خريطة الوجهات...</span>
    </div>
  );
}

export default function MapSection({ onSelectDestination }) {
  const { t, lang } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(-1);
  const isEn = lang === 'en';
  const { destinations: dynamicDestinations } = useCMS();
  const destinationsList = dynamicDestinations?.length ? dynamicDestinations : DESTINATIONS;

  const mapFrameRef = useRef(null);
  const [isMapNear, setIsMapNear] = useState(false);

  useEffect(() => {
    if (!mapFrameRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMapNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px' }
    );
    observer.observe(mapFrameRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="map"
      className="bg-brand-navy text-white py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body relative overflow-hidden isolate z-0 border-t border-white/8 scroll-mt-[calc(var(--header-height-mobile)+16px)] min-[901px]:scroll-mt-[calc(var(--header-height-desktop)+20px)]"
      aria-label={t('map.sectionTitle', 'خريطة فروع ونقاط انطلاق Duck في مصر')}
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-6 min-[901px]:mb-8">
          <SectionHeader
            theme="dark"
            tag={
              <span
                className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-yellow"
                lang="en"
                dir="ltr"
              >
                {t('map.eyebrow')}
              </span>
            }
            title={t('map.sectionTitle', 'اعرف هتبدأ مغامرتك منين.')}
            subtitle={t(
              'map.sectionSubtitle',
              'اضغط على أي محافظة أو نقطة انطلاق على الخريطة عشان تشوف صورها ووصف المكان وتفاصيل التجمع والرحلات.'
            )}
            className="mb-4"
          />

          {/* Quick Hub Filter Chips */}
          <div
            className="flex gap-2 min-[901px]:gap-2.5 flex-wrap items-center"
            role="group"
            aria-label={t('map.sectionTitle', 'خريطة فروع ونقاط انطلاق Duck في مصر')}
          >
            {/* All Hubs Chip (-1) */}
            <button
              type="button"
              onClick={() => setActiveIdx(-1)}
              aria-pressed={activeIdx === -1}
              className={`min-h-[42px] min-[901px]:min-h-[46px] inline-flex items-center px-4 min-[901px]:px-5 py-2 rounded-full font-bold text-xs min-[901px]:text-sm transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-blue select-none ${
                activeIdx === -1
                  ? 'bg-brand-yellow text-brand-navy shadow-sm -translate-y-0.5'
                  : 'bg-white/8 text-white border border-white/20 hover:bg-white/15 hover:border-white/40'
              }`}
            >
              {t('map.allHubsChip', { count: MAP_PINS.length }, `كل فروعنا في مصر (${MAP_PINS.length})`)}
            </button>

            {/* Individual Hub Chips */}
            {MAP_PINS.map((pin) => {
              const isActive = activeIdx === pin.destId;
              const title = isEn ? (pin.titleEn || t(pin.titleKey)) : t(pin.titleKey);

              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setActiveIdx(pin.destId)}
                  aria-pressed={isActive}
                  className={`min-h-[42px] min-[901px]:min-h-[46px] inline-flex items-center px-4 min-[901px]:px-5 py-2 rounded-full font-bold text-xs min-[901px]:text-sm transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-blue select-none ${
                    isActive
                      ? 'bg-brand-yellow text-brand-navy shadow-sm -translate-y-0.5'
                      : 'bg-white/8 text-white border border-white/20 hover:bg-white/15 hover:border-white/40'
                  }`}
                >
                  {title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Responsive Grid: Map Frame & Destination Preview Card */}
        <div className="grid grid-cols-1 min-[901px]:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
          {/* Map Frame (.egframe) with On-Demand Near Viewport Mounting */}
          <div
            ref={mapFrameRef}
            className="rounded-[26px] overflow-hidden border border-brand-yellow/35 shadow-card bg-[#f2efe9] relative p-0 min-h-[460px] min-[901px]:min-h-[540px] flex items-center justify-center"
          >
            {isMapNear ? (
              <Suspense fallback={<MapSkeleton />}>
                <EgyptInteractiveMap
                  pins={MAP_PINS}
                  destinations={destinationsList}
                  activeIdx={activeIdx}
                  onSelectPin={setActiveIdx}
                />
              </Suspense>
            ) : (
              <MapSkeleton />
            )}
          </div>

          {/* Destination Preview Card */}
          <DestinationMapCard
            activeIdx={activeIdx}
            pins={MAP_PINS}
            destinations={destinationsList}
            onSelectPin={setActiveIdx}
            onSelectDestination={onSelectDestination}
          />
        </div>
      </div>
    </section>
  );
}
