import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWater,
  faCompass,
  faBicycle,
  faClock,
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader, Button, Card } from '../../shared/ui/index.js';
import { useCustomScrollbar, useCMS } from '../../shared/hooks/index.js';
import { TRIPS, DESTINATIONS_FILTER, ACTIVITIES } from './tripsData.js';
import { ROUTES } from '../../shared/config/routes.js';
import { trackSearch } from '../../shared/utils/analytics.js';

const EXPERIENCE_TYPES = [
  { key: 'kayak', label: 'KAYAK', slug: 'kayaking', icon: faWater },
  { key: 'sup', label: 'SUP', slug: 'sup', icon: faCompass },
  { key: 'waterbike', label: 'WATER BIKE', slug: 'water-bike', icon: faBicycle },
];

export default function TripsSection({ externalFilter, onFilterChange }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const { trips: dynamicTrips, destinations: dynamicDestinations } = useCMS();
  const tripsList = dynamicTrips?.length ? dynamicTrips : TRIPS;

  const [activeTripId, setActiveTripId] = useState(0);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const carouselRef = useRef(null);

  const {
    listRef,
    trackRef,
    thumbRef,
    thumbHeight,
    isHidden,
    isDragging,
    handleThumbPointerDown,
    handleThumbPointerMove,
    handleThumbPointerUp,
    handleTrackPointerDown,
  } = useCustomScrollbar();

  const activeFilter = externalFilter !== undefined && externalFilter !== null ? externalFilter : 'all';

  const handleFilterSelect = (filterId) => {
    trackSearch(String(filterId), 'trips_filter');
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  // Build dynamic destination filters list
  const destinationFilters = useMemo(() => {
    const list = [{ id: 'all', key: 'all' }];
    const sourceDestinations = dynamicDestinations?.length ? dynamicDestinations : DESTINATIONS_FILTER.filter((d) => d.id !== 'all');
    sourceDestinations.forEach((d) => {
      list.push({
        id: d.filterKey !== undefined ? d.filterKey : d.id,
        key: d.key,
        nameAr: d.nameAr,
        nameEn: d.nameEn,
      });
    });
    return list;
  }, [dynamicDestinations]);

  // Filter visible trips
  const visibleTrips = useMemo(() => {
    if (activeFilter === 'all') {
      return tripsList;
    }
    return tripsList.filter((trip) => trip.loc === activeFilter || trip.destKey === activeFilter);
  }, [activeFilter, tripsList]);

  // Currently selected trip for big stage card
  const selectedTrip = useMemo(() => {
    const found = visibleTrips.find((trip) => trip.id === activeTripId);
    return found || visibleTrips[0] || tripsList[0] || TRIPS[0];
  }, [activeTripId, visibleTrips, tripsList]);

  // Format currency display
  const formatPrice = (amount) => {
    if (!amount) return '';
    return `${amount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} ${t('trips.currency')}`;
  };

  // Track mobile carousel scroll position accurately in RTL & LTR using card center proximity
  const handleCarouselScroll = () => {
    if (!carouselRef.current || visibleTrips.length === 0) return;
    const el = carouselRef.current;
    const cards = Array.from(el.querySelectorAll('article'));
    if (!cards.length) return;
    const elRect = el.getBoundingClientRect();
    const elCenter = elRect.left + elRect.width / 2;

    let closestIdx = 0;
    let closestDist = Infinity;
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - elCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });
    setMobileActiveIdx(closestIdx);
  };

  const scrollToMobileTrip = (targetIdx) => {
    const clampedIdx = Math.max(0, Math.min(visibleTrips.length - 1, targetIdx));
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('article');
    if (cards[clampedIdx]) {
      cards[clampedIdx].scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setMobileActiveIdx(clampedIdx);
    }
  };

  const isRtl = lang === 'ar';
  const PrevArrowIcon = isRtl ? faChevronRight : faChevronLeft;
  const NextArrowIcon = isRtl ? faChevronLeft : faChevronRight;
  const safeMobileIdx = Math.min(mobileActiveIdx, Math.max(0, visibleTrips.length - 1));

  return (
    <section
      id="trips"
      className="relative w-full bg-gradient-to-b from-[#f3fafc] to-white py-14 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body scroll-mt-[52px] min-[901px]:scroll-mt-[100px]"
      aria-label={t('trips.title')}
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <SectionHeader
          title={t('trips.title')}
          subtitle={t('trips.subtitle')}
          theme="light"
          align="start"
        />

        {/* Core Experience Types Strip (KAYAK · SUP · WATER BIKE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6 min-[901px]:mb-8">
          {EXPERIENCE_TYPES.map((exp) => {
            const ArrowIcon = lang === 'ar' ? faArrowLeft : faArrowRight;
            return (
              <Card
                key={exp.key}
                as={Link}
                to={`${ROUTES.ACTIVITIES}/${exp.slug}`}
                variant="default"
                padding="sm"
                className="group flex items-start gap-3.5 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-card"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-brand-yellow text-base transition-colors group-hover:bg-brand-blue group-hover:text-white"
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={exp.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-extrabold tracking-wider text-brand-navy" lang="en" dir="ltr">
                      {exp.label}
                    </span>
                    <FontAwesomeIcon
                      icon={ArrowIcon}
                      className="text-[11px] text-brand-blue opacity-70 transition-transform group-hover:translate-x-[-2px] ltr:group-hover:translate-x-[2px]"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-brand-navy/75 m-0">
                    {t(`trips.activityDescriptions.${exp.key}`)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Destination Filter Tabs */}
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 min-[901px]:mb-8 scrollbar-none snap-x"
          role="group"
          aria-label={t('trips.filterAriaLabel')}
        >
          {destinationFilters.map((dest) => {
            const isSelected = String(activeFilter) === String(dest.id);
            const count = dest.id === 'all'
              ? tripsList.length
              : tripsList.filter((tItem) => tItem.loc === dest.id || tItem.destKey === dest.key).length;

            const label = dest.id === 'all'
              ? t('trips.filterAll')
              : (dest.nameAr && dest.nameEn)
                ? (lang === 'ar' ? dest.nameAr : dest.nameEn)
                : t(`destinations.items.${dest.key}.name`);

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleFilterSelect(dest.id)}
                aria-pressed={isSelected}
                className={`snap-start shrink-0 min-h-[44px] px-4 py-2 rounded-full font-bold text-xs min-[901px]:text-sm transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-navy text-brand-yellow shadow-md border border-brand-navy'
                    : 'bg-white text-brand-navy/85 border border-[rgba(20,125,159,0.22)] hover:bg-surface-mist hover:text-brand-navy'
                }`}
              >
                <span>{label}</span>
                <span className="ms-1.5 opacity-80 font-normal">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Layout: Big Stage Card (Left) + Rail List (Right) */}
        <div className="hidden min-[901px]:grid min-[901px]:grid-cols-[1.45fr_1fr] min-[901px]:gap-7 items-stretch">
          {/* Big Stage Card */}
          <article
            className="relative min-h-[580px] rounded-[28px] overflow-hidden bg-brand-navy text-white shadow-xl border border-white/10 flex flex-col justify-end p-8"
            aria-live="polite"
          >
            {/* Background Image with smooth transition */}
            <div className="absolute inset-0 z-0 bg-brand-navy">
              <picture>
                {selectedTrip.images?.srcSet && (
                  <source srcSet={selectedTrip.images.srcSet} sizes="(min-width: 901px) 690px, 100vw" />
                )}
                <img
                  key={selectedTrip.id}
                  src={
                    selectedTrip.images?.large ||
                    selectedTrip.images?.medium ||
                    selectedTrip.images?.thumb ||
                    selectedTrip.imageUrl ||
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80'
                  }
                  alt={selectedTrip.titleAr || t(`trips.items.${selectedTrip.key}.alt`)}
                  loading="lazy"
                  decoding="async"
                  width={960}
                  height={580}
                  style={{
                    objectPosition: selectedTrip.imagePosition || selectedTrip.objectPosition || 'center center',
                  }}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </picture>
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#121528] via-[#121528]/80 to-[rgba(6,123,161,0.12)] pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Stage Foreground Content */}
            <div className="relative z-10 flex flex-col gap-3">
              {/* Meta tags */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                  {t(`destinations.items.${selectedTrip.destKey}.name`)}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={ACTIVITIES[selectedTrip.act]?.faIcon || faWater}
                    className="text-brand-yellow"
                    aria-hidden="true"
                  />
                  <span>{t(`trips.activities.${selectedTrip.act}`)}</span>
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                  {t(`trips.durations.${selectedTrip.durKey}`)}
                </span>
                {selectedTrip.op && (
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                    {selectedTrip.op}
                  </span>
                )}
                {selectedTrip.act === 'waterbike' && (
                  <span className="bg-brand-yellow text-brand-navy font-bold px-3 py-1 rounded-full">
                    {t('trips.waterbikeLimit')}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl min-[1100px]:text-3xl min-[1250px]:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                {t(`trips.items.${selectedTrip.key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-white/92 text-sm min-[1100px]:text-[15px] leading-relaxed line-clamp-3 max-w-[65ch]">
                {t(`trips.items.${selectedTrip.key}.desc`)}
              </p>

              {/* Inclusions Tags */}
              {selectedTrip.inclusionsKeys && selectedTrip.inclusionsKeys.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs text-brand-yellow font-bold">{t('trips.includesTitle')}</span>
                  {selectedTrip.inclusionsKeys.slice(0, 4).map((incKey) => (
                    <span
                      key={incKey}
                      className="bg-white/12 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-lg text-xs text-white/95"
                    >
                      {t(`trips.inclusions.${incKey}`)}
                    </span>
                  ))}
                  {selectedTrip.inclusionsKeys.length > 4 && (
                    <span className="text-xs text-white/80 font-medium">
                      {t('trips.includesMore', { count: selectedTrip.inclusionsKeys.length - 4 })}
                    </span>
                  )}
                </div>
              )}

              {/* Footer: Price Box & CTA Buttons */}
              <div className="flex items-center justify-between gap-4 flex-wrap pt-3 mt-1 border-t border-white/15">
                {/* Price Ticket */}
                <div className="bg-white/12 backdrop-blur-md border border-white/20 rounded-[18px] px-4 py-2.5 flex items-center gap-4">
                  {selectedTrip.priceEg ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-white/80">{t('trips.foreigner')}</span>
                        <b className="text-xl font-bold tabular-nums text-white">
                          {formatPrice(selectedTrip.price)}
                        </b>
                      </div>
                      <div className="flex flex-col ps-3 border-s border-brand-yellow/60">
                        <span className="text-[11px] text-brand-yellow font-semibold">{t('trips.egyptian')}</span>
                        <b className="text-xl font-bold tabular-nums text-brand-yellow">
                          {formatPrice(selectedTrip.priceEg)}
                        </b>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[11px] text-white/80">
                        {selectedTrip.isHourly ? t('trips.perHour') : t('trips.unified')}
                      </span>
                      <b className="text-xl font-bold tabular-nums text-white">
                        {formatPrice(selectedTrip.price)}
                      </b>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    as={Link}
                    to={ROUTES.booking(selectedTrip.slug)}
                    data-trip={selectedTrip.id}
                    variant="primary"
                    size="md"
                    className="font-bold px-6 shadow-md hover:bg-white text-brand-navy"
                  >
                    {t('trips.bookTrip')}
                  </Button>
                  <Button
                    as={Link}
                    to={ROUTES.tripDetails(selectedTrip.slug)}
                    variant="outline"
                    size="md"
                    className="font-semibold text-white border-white/50 hover:bg-white/15"
                  >
                    {t('trips.details')}
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Right Rail List of Trips with Custom Scrollbar */}
          <div className="grid grid-cols-[1fr_8px] gap-2.5 max-h-[580px] items-stretch relative">
            {/* The scrollable list */}
            <div
              ref={listRef}
              className="flex flex-col gap-2.5 overflow-y-auto overscroll-contain pe-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label={t('trips.listAriaLabel')}
            >
              {visibleTrips.map((trip, idx) => {
                const isTripActive = trip.id === selectedTrip.id;
                const formattedIdx = String(idx + 1).padStart(2, '0');

                return (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => setActiveTripId(trip.id)}
                    aria-pressed={isTripActive}
                    className={`grid grid-cols-[26px_64px_1fr_auto] gap-3 items-center p-3 rounded-2xl border text-start cursor-pointer transition-all duration-200 ${
                      isTripActive
                        ? 'bg-brand-navy text-white border-brand-navy shadow-lg -translate-y-0.5'
                        : 'bg-white text-brand-navy border-[rgba(20,125,159,0.14)] hover:bg-surface-mist hover:shadow-sm'
                    }`}
                  >
                    {/* Index Number */}
                    <span className={`text-xs font-bold ${isTripActive ? 'text-white/80' : 'text-brand-navy/60'}`}>
                      {formattedIdx}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-brand-navy/20 shrink-0">
                      <img
                        src={
                          trip.images?.thumb ||
                          trip.images?.medium ||
                          trip.imageUrl ||
                          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80'
                        }
                        alt={trip.titleAr || t(`trips.items.${trip.key}.title`)}
                        loading="lazy"
                        decoding="async"
                        width={64}
                        height={64}
                        style={{
                          objectPosition: trip.imagePosition || trip.objectPosition || 'center center',
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title & Meta */}
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <b className="text-sm font-bold truncate">
                        {t(`trips.items.${trip.key}.title`)}
                      </b>
                      <small className={`text-xs ${isTripActive ? 'text-white/75' : 'text-brand-navy/70'} truncate`}>
                        {t(`destinations.items.${trip.destKey}.name`)} · {t(`trips.activities.${trip.act}`)} · {t(`trips.durations.${trip.durKey}`)}
                      </small>
                      {trip.act === 'waterbike' && (
                        <span className="w-fit text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy mt-0.5">
                          {t('trips.waterbikeLimit')}
                        </span>
                      )}
                    </div>

                    {/* Price Block */}
                    <div className="text-end shrink-0 ps-2">
                      <span className={`font-bold text-xs ${isTripActive ? 'text-brand-yellow' : 'text-brand-blue'} block`}>
                        {formatPrice(trip.price)}
                      </span>
                      {trip.priceEg && (
                        <small className={`text-[10px] ${isTripActive ? 'text-white/80' : 'text-brand-navy/65'} block`}>
                          {t('trips.egyptian')} {formatPrice(trip.priceEg)}
                        </small>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Scrollbar Track: 8px capsule, light transparent teal */}
            <div
              ref={trackRef}
              onPointerDown={handleTrackPointerDown}
              className={`relative w-2 h-full rounded-full bg-[rgba(20,125,159,0.14)] touch-none cursor-pointer transition-opacity duration-200 select-none ${
                isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              aria-hidden="true"
            >
              {/* Custom Scrollbar Thumb: vertical teal-to-navy gradient with 2px white ring & floating shadow */}
              <div
                ref={thumbRef}
                onPointerDown={handleThumbPointerDown}
                onPointerMove={handleThumbPointerMove}
                onPointerUp={handleThumbPointerUp}
                onPointerCancel={handleThumbPointerUp}
                style={{
                  height: `${thumbHeight}px`,
                }}
                className={`absolute top-0 start-0 w-2 rounded-full bg-gradient-to-b from-[#147D9F] to-[#0C1226] shadow-[0_0_0_2px_#ffffff,0_4px_10px_rgba(12,18,38,0.25)] select-none will-change-transform touch-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {/* 4x4px Yellow Dot in center, 6px from top */}
                <span
                  className="absolute top-[6px] start-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FDFB45] pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout: Top-Side Arrows + Horizontal Swipeable Carousel */}
        <div className="block min-[901px]:hidden">
          {visibleTrips.length > 1 && (
            <div className="flex items-center justify-end gap-2 mb-3">
              <button
                type="button"
                onClick={() => scrollToMobileTrip(safeMobileIdx - 1)}
                disabled={safeMobileIdx <= 0}
                aria-label={t('nav.prevSlide')}
                className="w-9 h-9 rounded-full border border-brand-blue/25 bg-surface-white text-brand-navy flex items-center justify-center shadow-card transition-all hover:bg-brand-navy hover:text-brand-yellow hover:border-brand-navy disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
              >
                <FontAwesomeIcon icon={PrevArrowIcon} className="text-xs" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => scrollToMobileTrip(safeMobileIdx + 1)}
                disabled={safeMobileIdx >= visibleTrips.length - 1}
                aria-label={t('nav.nextSlide')}
                className="w-9 h-9 rounded-full border border-brand-blue/25 bg-surface-white text-brand-navy flex items-center justify-center shadow-card transition-all hover:bg-brand-navy hover:text-brand-yellow hover:border-brand-navy disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
              >
                <FontAwesomeIcon icon={NextArrowIcon} className="text-xs" aria-hidden="true" />
              </button>
            </div>
          )}

          <ul
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory -mx-[5vw] px-[5vw] pb-4 scrollbar-none list-none m-0"
            aria-label={t('trips.listAriaLabel')}
          >
            {visibleTrips.map((trip) => {
              return (
                <li
                  key={trip.id}
                  className="flex-none w-[86%] max-w-[340px] h-[450px] snap-center flex"
                >
                  <article className="w-full h-full rounded-[26px] overflow-hidden relative bg-brand-navy text-white shadow-xl border border-white/15 flex flex-col justify-end p-5">
                    {/* Background Image & Gradient */}
                    <div className="absolute inset-0 z-0">
                      <picture>
                        {trip.images?.srcSet && (
                          <source srcSet={trip.images.srcSet} sizes="(max-width: 640px) 300px, 440px" />
                        )}
                        <img
                          src={
                            trip.images?.medium ||
                            trip.images?.thumb ||
                            trip.imageUrl ||
                            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80'
                          }
                          alt={trip.titleAr || t(`trips.items.${trip.key}.title`)}
                          loading="lazy"
                          decoding="async"
                          width={640}
                          height={450}
                          style={{
                            objectPosition: trip.imagePosition || trip.objectPosition || 'center center',
                          }}
                          className="w-full h-full object-cover"
                        />
                      </picture>
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#121528] via-[#121528]/70 to-[#121528]/50 pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Top Bar Floating Badges */}
                    <div className="absolute top-4 inset-x-4 z-10 flex items-start justify-between gap-2 pointer-events-none">
                      <div className="bg-[#121528]/80 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 max-w-[60%]">
                        <small className="block text-[11px] text-brand-yellow font-bold">
                          {t(`destinations.items.${trip.destKey}.name`)} · {t(`trips.activities.${trip.act}`)}
                        </small>
                        <b className="block text-xs font-bold text-white truncate">
                          {t(`trips.items.${trip.key}.title`)}
                        </b>
                      </div>

                      <div className="bg-brand-yellow rounded-2xl px-3 py-1.5 text-brand-navy font-bold text-xs text-end shadow-md">
                        <span>{formatPrice(trip.price)}</span>
                        <small className="block text-[10px] font-semibold opacity-90">
                          {trip.priceEg ? `${t('trips.egyptian')} ${formatPrice(trip.priceEg)}` : (trip.isHourly ? t('trips.perHour') : t('trips.unified'))}
                        </small>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="relative z-10 flex flex-col gap-2">
                      {/* Meta tags */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white">
                          <FontAwesomeIcon icon={faClock} className="text-brand-yellow text-[10px]" aria-hidden="true" />
                          <span>{t(`trips.durations.${trip.durKey}`)}</span>
                        </span>
                        {trip.act === 'waterbike' ? (
                          <span className="bg-brand-yellow text-brand-navy font-bold px-2.5 py-0.5 rounded-full">
                            {t('trips.waterbikeLimit')}
                          </span>
                        ) : (
                          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white">
                            {t('trips.availableUnits')}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
                        {t(`trips.items.${trip.key}.desc`)}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          as={Link}
                          to={ROUTES.booking(trip.slug)}
                          data-trip={trip.id}
                          variant="primary"
                          size="sm"
                          className="flex-1 font-bold py-2.5 text-xs text-brand-navy bg-brand-yellow justify-center"
                        >
                          {t('trips.bookNow')}
                        </Button>
                        <Button
                          as={Link}
                          to={ROUTES.tripDetails(trip.slug)}
                          variant="outline"
                          size="sm"
                          className="flex-1 font-semibold py-2.5 text-xs text-white border-white/50 justify-center hover:bg-white/15"
                        >
                          {t('trips.detailsShort')}
                        </Button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Mobile Pagination Dots + Swipe Counter Indicator */}
          {visibleTrips.length > 0 && (
            <>
              {visibleTrips.length > 1 && (
                <div
                  className="flex justify-center items-center gap-1 mt-3"
                  role="group"
                  aria-label={t('trips.listAriaLabel')}
                >
                  {visibleTrips.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToMobileTrip(idx)}
                      aria-label={t(`trips.items.${item.key}.title`)}
                      aria-current={safeMobileIdx === idx ? 'true' : undefined}
                      className="grid place-items-center min-w-7 h-7 p-1 cursor-pointer"
                    >
                      <span
                        className={`block h-2 rounded-full transition-all duration-300 ${
                          safeMobileIdx === idx
                            ? 'w-6 bg-brand-navy'
                            : 'w-2 bg-brand-blue/30 hover:bg-brand-blue/60'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-center font-bold text-xs text-brand-navy/70 mt-2.5" aria-live="polite">
                <bdi dir="ltr" className="inline-block font-mono font-bold">
                  {safeMobileIdx + 1} / {visibleTrips.length}
                </bdi>
                {'  ·  '}
                <span>{isArabic ? 'اسحب لاستكشاف باقي الرحلات' : 'Swipe to explore remaining trips'}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
