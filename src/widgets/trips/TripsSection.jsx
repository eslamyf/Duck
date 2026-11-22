import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader, Button } from '../../shared/ui/index.js';
import { useCustomScrollbar } from '../../shared/hooks/index.js';
import { TRIPS, DESTINATIONS_FILTER, ACTIVITIES } from './tripsData.js';
import { SECTIONS, sectionLink } from '../../shared/config/routes.js';

export default function TripsSection({ externalFilter, onFilterChange }) {
  const { t, lang } = useTranslation();
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
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  // Filter visible trips
  const visibleTrips = useMemo(() => {
    if (activeFilter === 'all') {
      return TRIPS;
    }
    return TRIPS.filter((trip) => trip.loc === activeFilter);
  }, [activeFilter]);

  // Currently selected trip for big stage card
  const selectedTrip = useMemo(() => {
    const found = visibleTrips.find((trip) => trip.id === activeTripId);
    return found || visibleTrips[0] || TRIPS[0];
  }, [activeTripId, visibleTrips]);

  // Format currency display
  const formatPrice = (amount) => {
    if (!amount) return '';
    return `${amount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} ${t('trips.currency')}`;
  };

  // Track mobile carousel scroll position
  const handleCarouselScroll = () => {
    if (!carouselRef.current || visibleTrips.length === 0) return;
    const el = carouselRef.current;
    const itemWidth = el.firstElementChild ? el.firstElementChild.offsetWidth + 14 : 300;
    const idx = Math.min(visibleTrips.length - 1, Math.max(0, Math.round(Math.abs(el.scrollLeft) / itemWidth)));
    setMobileActiveIdx(idx);
  };

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

        {/* Destination Filter Tabs */}
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 min-[901px]:mb-8 scrollbar-none snap-x"
          role="group"
          aria-label={t('trips.filterAriaLabel')}
        >
          {DESTINATIONS_FILTER.map((dest) => {
            const isSelected = String(activeFilter) === String(dest.id);
            const count = dest.id === 'all'
              ? TRIPS.length
              : TRIPS.filter((tItem) => tItem.loc === dest.id).length;

            const label = dest.id === 'all'
              ? t('trips.filterAll')
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
                <source srcSet={selectedTrip.images.srcSet} sizes="(min-width: 901px) 60vw, 100vw" />
                <img
                  key={selectedTrip.id}
                  src={selectedTrip.images.large}
                  alt={t(`trips.items.${selectedTrip.key}.alt`)}
                  loading="lazy"
                  decoding="async"
                  width={960}
                  height={580}
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
                  <span aria-hidden="true">{ACTIVITIES[selectedTrip.act]?.icon}</span>
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
                    to={sectionLink(SECTIONS.BOOK)}
                    data-trip={selectedTrip.id}
                    variant="primary"
                    size="md"
                    className="font-bold px-6 shadow-md hover:bg-white text-brand-navy"
                  >
                    {t('trips.bookTrip')}
                  </Button>
                  <Button
                    as={Link}
                    to={`/trips/${selectedTrip.slug}`}
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
                    <span className={`text-xs font-bold ${isTripActive ? 'text-white/60' : 'text-brand-navy/40'}`}>
                      {formattedIdx}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-brand-navy/20 shrink-0">
                      <img
                        src={trip.images.thumb}
                        alt={t(`trips.items.${trip.key}.title`)}
                        loading="lazy"
                        decoding="async"
                        width={64}
                        height={64}
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

        {/* Mobile Layout: Horizontal Swipeable Carousel */}
        <div className="block min-[901px]:hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory -mx-[5vw] px-[5vw] pb-4 scrollbar-none"
            role="list"
            aria-label={t('trips.listAriaLabel')}
          >
            {visibleTrips.map((trip) => {
              return (
                <article
                  key={trip.id}
                  role="listitem"
                  className="flex-none w-[86%] max-w-[340px] h-[450px] snap-center rounded-[26px] overflow-hidden relative bg-brand-navy text-white shadow-xl border border-white/15 flex flex-col justify-end p-5"
                >
                  {/* Background Image & Gradient */}
                  <div className="absolute inset-0 z-0">
                    <picture>
                      <source srcSet={trip.images.srcSet} sizes="86vw" />
                      <img
                        src={trip.images.medium}
                        alt={t(`trips.items.${trip.key}.title`)}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={450}
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
                      <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white">
                        ⏱ {t(`trips.durations.${trip.durKey}`)}
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
                        to={sectionLink(SECTIONS.BOOK)}
                        data-trip={trip.id}
                        variant="primary"
                        size="sm"
                        className="flex-1 font-bold py-2.5 text-xs text-brand-navy bg-brand-yellow justify-center"
                      >
                        {t('trips.bookNow')}
                      </Button>
                      <Button
                        as={Link}
                        to={`/trips/${trip.slug}`}
                        variant="outline"
                        size="sm"
                        className="flex-1 font-semibold py-2.5 text-xs text-white border-white/50 justify-center hover:bg-white/15"
                      >
                        {t('trips.detailsShort')}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile Swipe / Counter Indicator */}
          {visibleTrips.length > 0 && (
            <p className="text-center font-bold text-xs text-brand-navy/70 mt-3" aria-live="polite">
              {t('trips.mobileSwipeNotice', {
                current: mobileActiveIdx + 1,
                total: visibleTrips.length,
              })}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
