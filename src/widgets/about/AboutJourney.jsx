import { useState } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import imgBeginning from '../../shared/assets/images/about/journey-beginning.webp';
import imgFleet from '../../shared/assets/images/about/journey-fleet.webp';
import imgCommunity from '../../shared/assets/images/about/journey-community.webp';
import imgExpansion from '../../shared/assets/images/about/journey-expansion.webp';

/**
 * Custom DUCK Kayak & Paddler icon using CSS design-token classes only.
 */
function KayakTrackIcon({ flipped = false }) {
  return (
    <svg
      viewBox="0 0 64 36"
      className={`h-8 w-14 drop-shadow-sm ${flipped ? '-scale-x-100' : ''}`}
      aria-hidden="true"
    >
      {/* Subtle water ripples below hull */}
      <path
        d="M8 31 Q18 28 28 31 T48 31 T58 31"
        fill="none"
        className="stroke-brand-blue"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Kayak hull */}
      <path
        d="M5 23 C14 29, 50 29, 59 22 C54 20, 44 19, 32 19 C20 19, 10 20, 5 23 Z"
        className="fill-brand-yellow stroke-brand-navy"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cockpit rim & paddler torso */}
      <circle cx="32" cy="10" r="3.5" className="fill-brand-navy" />
      <path
        d="M27 20 C27 15, 37 15, 37 20 Z"
        className="fill-brand-blue stroke-brand-navy"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Double-bladed kayak paddle */}
      <line
        x1="19"
        y1="26"
        x2="45"
        y2="11"
        className="stroke-brand-navy"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="17.5"
        cy="26.5"
        rx="4"
        ry="1.8"
        transform="rotate(-30 17.5 26.5)"
        className="fill-brand-navy"
      />
      <ellipse
        cx="46.5"
        cy="10.5"
        rx="4"
        ry="1.8"
        transform="rotate(-30 46.5 10.5)"
        className="fill-brand-navy"
      />
    </svg>
  );
}

export default function AboutJourney() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const [activeStep, setActiveStep] = useState(0);

  const milestones = [
    {
      key: 'beginning',
      year: '2023',
      image: imgBeginning,
      objectPos: 'object-[center_68%]',
      tag: isArabic ? 'الانطلاقة الأولى' : 'The First Spark',
    },
    {
      key: 'experiences',
      year: '2024',
      image: imgFleet,
      objectPos: 'object-[center_72%]',
      tag: isArabic ? 'تنوع الأسطول' : 'Fleet Expansion',
    },
    {
      key: 'customers',
      year: '2025',
      image: imgCommunity,
      objectPos: 'object-[center_65%]',
      tag: isArabic ? '+4000 مغامر' : '4,000+ Adventurers',
    },
    {
      key: 'beyond',
      year: '2026+',
      image: imgExpansion,
      objectPos: 'object-[center_62%]',
      tag: isArabic ? 'كل مياه مصر' : 'Across Egypt',
    },
  ];

  const centerShiftClass = isArabic ? 'translate-x-1/2' : '-translate-x-1/2';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-hidden bg-surface-sand py-12 md:py-16 text-brand-navy"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Section Heading - Compact */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            <span className="h-[2px] w-8 bg-brand-yellow" />
            {t('about.journey.eyebrow')}
            <span className="h-[2px] w-8 bg-brand-yellow" />
          </span>

          <h2 className="font-heading text-3xl font-extrabold uppercase text-brand-navy sm:text-4xl md:text-5xl">
            {t('about.journey.title')}
            <span className="text-brand-blue">.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-brand-navy/70 leading-relaxed">
            {t('about.journey.subtitle')}
          </p>
        </div>

        {/* Desktop Flowing River Connector + Kayak Boat Track (lg+) */}
        <div
          className="hidden lg:block relative h-20 select-none"
          aria-hidden="true"
        >
          {/* Dashed river base track connecting milestone 1 (12.5%) to milestone 4 (87.5%) */}
          <div
            className="absolute top-10 h-1 rounded-full border-t-2 border-dashed border-brand-blue/35"
            style={{ insetInlineStart: '12.5%', insetInlineEnd: '12.5%' }}
          />

          {/* Highlighted water path up to active milestone */}
          <div
            className="absolute top-[39px] h-1 rounded-full bg-gradient-to-l from-brand-blue via-brand-blue to-brand-yellow transition-all duration-500 motion-reduce:transition-none"
            style={{
              insetInlineStart: '12.5%',
              width: `${activeStep * 25}%`,
            }}
          />

          {/* Sailing Kayak / Boat moving smoothly along the connecting path */}
          <div
            className={`absolute top-1 z-20 transition-all duration-500 ease-out motion-reduce:transition-none ${centerShiftClass}`}
            style={{ insetInlineStart: `${12.5 + activeStep * 25}%` }}
          >
            <KayakTrackIcon flipped={isArabic} />
          </div>

          {/* 4 Anchor Waypoints + Vertical Connector Drops into each card */}
          {milestones.map((item, idx) => {
            const isActive = idx === activeStep;
            const isPassed = idx <= activeStep;
            return (
              <button
                key={item.key}
                type="button"
                tabIndex={-1}
                onClick={() => setActiveStep(idx)}
                className={`absolute top-[34px] z-10 flex flex-col items-center cursor-pointer ${centerShiftClass}`}
                style={{ insetInlineStart: `${12.5 + idx * 25}%` }}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'scale-125 border-brand-navy bg-brand-yellow shadow-sm'
                      : isPassed
                        ? 'border-brand-blue bg-brand-blue'
                        : 'border-brand-blue/40 bg-surface-white'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? 'bg-brand-navy' : 'bg-surface-white'
                    }`}
                  />
                </span>
                {/* Vertical connector line dropping into the card below */}
                <span
                  className={`h-7 w-[2px] transition-colors duration-300 ${
                    isActive ? 'bg-brand-blue' : 'bg-brand-blue/25'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* 4-Column Milestone Grid (With mobile dashed vertical connector) */}
        <div className="relative">
          {/* Mobile Vertical River Connector Line */}
          <div
            className="sm:hidden absolute top-6 bottom-6 start-3.5 w-[2px] border-s-2 border-dashed border-brand-blue/35"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((item, idx) => {
              const isActive = idx === activeStep;
              return (
                <div
                  key={item.key}
                  onMouseEnter={() => setActiveStep(idx)}
                  onFocus={() => setActiveStep(idx)}
                  onClick={() => setActiveStep(idx)}
                  tabIndex={0}
                  className={`group relative ms-7 sm:ms-0 flex flex-col justify-between rounded-2xl border bg-surface-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                    isActive
                      ? 'border-brand-blue/45 ring-2 ring-brand-yellow/60 shadow-soft'
                      : 'border-black/10'
                  }`}
                >
                  {/* Mobile Connector Waypoint */}
                  <span
                    className="sm:hidden absolute -start-[26px] top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-blue bg-brand-yellow shadow-xs"
                    aria-hidden="true"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-navy" />
                  </span>

                  <div>
                    {/* Year Badge & Step Number */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5">
                      <span className="font-heading text-xl font-extrabold text-brand-navy flex items-center gap-2">
                        {item.year}
                        {isActive && (
                          <span className="lg:hidden inline-block h-2 w-2 rounded-full bg-brand-blue" />
                        )}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-yellow/30 text-brand-navy">
                        {item.tag}
                      </span>
                    </div>

                    {/* Real Duck Photo */}
                    <div className="relative h-44 w-full overflow-hidden rounded-xl mb-3.5 bg-brand-navy">
                      <img
                        src={item.image}
                        alt={t(`about.journey.items.${item.key}.title`)}
                        className={`h-full w-full object-cover ${item.objectPos} transition-transform duration-500 group-hover:scale-105`}
                        loading="eager"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className="absolute bottom-2 end-2 font-mono text-[10px] font-black text-white/80 bg-brand-navy/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-base sm:text-lg font-bold text-brand-navy mb-1.5 leading-snug">
                      {t(`about.journey.items.${item.key}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-brand-navy/70 leading-relaxed">
                      {t(`about.journey.items.${item.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
