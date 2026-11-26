import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader, Button, Badge } from '../../shared/ui/index.js';
import { DESTINATIONS } from './destinationsData.js';
import { SECTIONS, sectionLink } from '../../shared/config/routes.js';

export default function DestinationsSection({ onSelectDestination }) {
  const { t, lang } = useTranslation();
  const [activeId, setActiveId] = useState(0);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const hoverTimerRef = useRef(null);
  const carouselRef = useRef(null);
  const headingRefs = useRef([]);

  const isRtl = lang === 'ar';

  const selectTab = useCallback((id, shouldFocus = false) => {
    setActiveId(id);
    if (shouldFocus && headingRefs.current[id]) {
      headingRefs.current[id].focus({ preventScroll: true });
    }
  }, []);

  const handlePointerEnter = (id) => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      selectTab(id);
    }, 50);
  };

  const handlePointerLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  const handleKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight') {
      nextIndex = isRtl ? (index - 1 + DESTINATIONS.length) % DESTINATIONS.length : (index + 1) % DESTINATIONS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = isRtl ? (index + 1) % DESTINATIONS.length : (index - 1 + DESTINATIONS.length) % DESTINATIONS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = DESTINATIONS.length - 1;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectTab(DESTINATIONS[index].id, true);
      return;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      selectTab(DESTINATIONS[nextIndex].id, true);
    }
  };

  // Sync mobile carousel scroll with active dot
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = Math.abs(el.scrollLeft);
      const cardWidth = el.scrollWidth / DESTINATIONS.length;
      if (cardWidth > 0) {
        const idx = Math.min(
          DESTINATIONS.length - 1,
          Math.max(0, Math.round(scrollLeft / cardWidth))
        );
        setMobileActiveIdx(idx);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMobileCard = (index) => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('article');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setMobileActiveIdx(index);
    }
  };

  return (
    <section
      id="locations"
      className="bg-brand-navy text-white py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body relative border-t border-white/8 scroll-mt-[calc(var(--header-height-mobile)+16px)] min-[901px]:scroll-mt-[calc(var(--header-height-desktop)+20px)]"
      aria-label={t('destinations.title')}
    >
      <div className="max-w-[1360px] mx-auto">
        <div className="flex flex-col min-[901px]:flex-row min-[901px]:items-end justify-between gap-4 mb-7 min-[901px]:mb-9">
          <SectionHeader
            theme="dark"
            tag={
              <span
                className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-yellow"
                lang="en"
                dir="ltr"
              >
                {t('destinations.eyebrow')}
              </span>
            }
            title={t('destinations.title')}
            subtitle={t('destinations.subtitle')}
            className="mb-0"
          />

          <Button
            as={Link}
            to={sectionLink(SECTIONS.MAP)}
            variant="outline"
            size="sm"
            className="w-fit shrink-0 border-white/30 text-white hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow font-bold"
          >
            {t('destinations.exploreCta')}
          </Button>
        </div>

        {/* Desktop Expanding Strips / Mobile Snap Carousel */}
        <div
          ref={carouselRef}
          onPointerLeave={handlePointerLeave}
          className="dx flex flex-row overflow-x-auto min-[901px]:overflow-visible scroll-smooth snap-x snap-mandatory min-[901px]:snap-none gap-3.5 min-[901px]:gap-3 h-[460px] min-[901px]:h-[540px] -mx-[5vw] min-[901px]:mx-0 px-[5vw] min-[901px]:px-0 scrollbar-none"
          role="tablist"
          aria-label={t('destinations.tabAriaLabel')}
        >
          {DESTINATIONS.map((item, index) => {
            const isActive = activeId === item.id;
            const destName = t(`destinations.items.${item.key}.name`);
            const destDesc = t(`destinations.items.${item.key}.description`);
            const destAlt = t(`destinations.items.${item.key}.alt`);

            return (
              <article
                key={item.id}
                id={`pn${item.id}`}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPointerEnter={() => handlePointerEnter(item.id)}
                onClick={() => selectTab(item.id)}
                className={`relative min-w-0 rounded-[28px] overflow-hidden bg-[#0C1226] cursor-pointer transition-[flex,border-color] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] snap-center flex-shrink-0 ${
                  isActive
                    ? 'min-[901px]:flex-[5.5] border-2 border-brand-yellow shadow-[0_12px_36px_rgba(253,251,69,0.12)]'
                    : 'min-[901px]:flex-1 border border-white/18 hover:border-white/40'
                } w-[84%] max-w-[340px] min-[901px]:max-w-none min-[901px]:w-auto`}
                role="tabpanel"
                aria-expanded={isActive}
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 overflow-hidden bg-brand-navy" aria-hidden="true">
                  <img
                    src={isActive ? item.images.defaultSrc : item.images.stripSrc}
                    srcSet={isActive ? item.images.srcSet : undefined}
                    sizes={
                      isActive
                        ? '(max-width: 900px) 84vw, (min-width: 901px) 800px'
                        : '(max-width: 900px) 84vw, 360px'
                    }
                    alt={destAlt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className={`w-full h-full object-cover transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? 'scale-106' : 'scale-100'
                    }`}
                  />
                  {/* Subtle Top & Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121528] via-[#121528]/60 to-[rgba(6,123,161,0.18)] pointer-events-none" />
                </div>

                {/* Collapsed Strip Button (Desktop Only, Hidden when Active) */}
                <button
                  type="button"
                  id={`tb${item.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`dcc${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectTab(item.id, true);
                  }}
                  className={`hidden min-[901px]:flex absolute z-[3] inset-0 bg-transparent border-0 text-white cursor-pointer flex-col items-center justify-between py-6 px-1.5 focus-visible:outline-2 focus-visible:outline-brand-yellow ${
                    isActive ? 'min-[901px]:!hidden' : ''
                  }`}
                >
                  <span className="font-bold text-brand-yellow text-sm tracking-widest">{item.num}</span>
                  <div className="flex-1 flex items-center justify-center my-auto">
                    <span className="[writing-mode:vertical-rl] text-lg min-[1100px]:text-xl font-bold tracking-wide text-white drop-shadow-sm">
                      {destName}
                    </span>
                  </div>
                  <div className="h-6 flex items-center justify-center">
                    {item.soon ? (
                      <Badge variant="tag" size="xs" className="px-1.5 py-0.5 text-[10px] font-bold">
                        {t('destinations.badgeSoon')}
                      </Badge>
                    ) : null}
                  </div>
                </button>

                {/* Expanded Card Content (Desktop active / Always visible on mobile snap card) */}
                <div
                  id={`dcc${item.id}`}
                  className={`absolute z-[2] inset-x-0 bottom-0 p-5 min-[901px]:p-8 flex flex-col gap-2.5 text-start transition-opacity duration-300 ${
                    isActive
                      ? 'opacity-100 visible pointer-events-auto'
                      : 'min-[901px]:opacity-0 min-[901px]:invisible min-[901px]:pointer-events-none opacity-100 visible'
                  }`}
                >
                  <h3
                    ref={(el) => {
                      headingRefs.current[item.id] = el;
                    }}
                    tabIndex={-1}
                    className="text-2xl min-[901px]:text-3xl min-[1150px]:text-4xl font-extrabold text-white flex items-center gap-2.5 flex-wrap focus:outline-none drop-shadow-md"
                  >
                    <span>{destName}</span>
                    {item.soon && (
                      <Badge variant="accent" size="xs" className="font-bold tracking-wider uppercase">
                        {t('destinations.badgeSoon')}
                      </Badge>
                    )}
                  </h3>

                  <p className="text-white/92 text-xs min-[901px]:text-[13.5px] leading-relaxed max-w-[58ch] line-clamp-4 min-[901px]:line-clamp-none drop-shadow-sm">
                    {destDesc}
                  </p>

                  <div className="pt-1.5">
                    {item.tripCount > 0 ? (
                      <Button
                        as={Link}
                        to={sectionLink(SECTIONS.TRIPS)}
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectDestination) {
                            onSelectDestination(item.filterKey);
                          }
                        }}
                        className="w-full min-[901px]:w-fit shadow-md font-bold text-xs min-[901px]:text-sm inline-flex items-center justify-center gap-1"
                      >
                        <span>
                          {item.tripCount === 1
                            ? t('destinations.btnViewTripSingle', { name: destName, count: item.tripCount })
                            : t('destinations.btnViewTrips', { name: destName, count: item.tripCount })}
                        </span>
                        <span className="inline-block rtl:rotate-180 transition-transform select-none" aria-hidden="true">
                          →
                        </span>
                      </Button>
                    ) : (
                      <Badge
                        variant="safety"
                        size="md"
                        className="w-full min-[901px]:w-fit justify-center bg-white/10 text-white/90 border-white/20 py-1.5 px-3.5 text-xs font-semibold"
                      >
                        {t('destinations.tripsComingSoon')}
                      </Badge>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile Navigation Dots */}
        <div
          className="flex min-[901px]:hidden justify-center items-center gap-2 mt-5"
          role="group"
          aria-label={t('destinations.tabAriaLabel')}
        >
          {DESTINATIONS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToMobileCard(idx)}
              aria-label={t(`destinations.items.${item.key}.name`)}
              className={`h-2 rounded-full transition-all duration-300 ${
                mobileActiveIdx === idx ? 'w-6 bg-brand-yellow' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
