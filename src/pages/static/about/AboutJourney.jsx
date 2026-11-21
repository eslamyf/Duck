import { useState, useRef } from 'react';

import { useTranslation } from '../../../shared/i18n/index.js';

import { ArrowUpRight } from 'lucide-react';

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';

export default function AboutJourney() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const timelineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const journeyItems = [
    {
      number: '01',
      key: 'beginning',
      year: '2023',
      image:
        'https://images.unsplash.com/photo-1655163394362-97de2d3c5c85?auto=format&fit=crop&w=1400&q=85',
      position: 'left',
    },
    {
      number: '02',
      key: 'experiences',
      image:
        'https://images.unsplash.com/photo-1685527200496-b92600a39955?auto=format&fit=crop&w=1400&q=85',
      position: 'right',
    },
    {
      number: '03',
      key: 'customers',
      highlight: isArabic ? '٤٠٠٠+' : '4,000+',
      image:
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1400&q=85',
      position: 'left',
    },
    {
      number: '04',
      key: 'beyond',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85',
      position: 'right',
    },
  ];

  // Track timeline scrolling
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 45%'],
  });

  // Animate yellow timeline line
  const lineHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  // Activate timeline nodes
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const thresholds = [0.08, 0.35, 0.62, 0.88];

    let currentIndex = -1;

    thresholds.forEach((threshold, index) => {
      if (latest >= threshold) {
        currentIndex = index;
      }
    });

    setActiveIndex((previous) =>
      previous === currentIndex ? previous : currentIndex
    );
  });

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-hidden bg-[#F7F7F4] py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">

        {/* Section Heading */}
        <div className="mb-14 text-center md:mb-20">

          {/* Eyebrow */}
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#067BA1]">
            <span className="h-[2px] w-8 bg-[#F5E847]" />

            {t('about.journey.eyebrow')}

            <span className="h-[2px] w-8 bg-[#F5E847]" />
          </span>

          {/* Title */}
          <h2 className="font-heading text-4xl font-extrabold uppercase text-[#121528] sm:text-5xl md:text-6xl">
            {t('about.journey.title')}
            <span className="text-[#067BA1]">.</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#121528]/60 sm:text-base">
            {t('about.journey.subtitle')}
          </p>

        </div>

        {/* Desktop Timeline */}
        <div
          ref={timelineRef}
          dir="ltr"
          className="relative hidden md:block"
        >

          {/* Base Blue Line */}
          <div className="absolute bottom-0 left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full bg-[#067BA1]/20" />

          {/* Animated Yellow Line */}
          <motion.div
            style={{
              height: lineHeight,
              originY: 0,
            }}
            className="absolute left-1/2 top-0 z-10 w-[3px] -translate-x-1/2 rounded-full bg-[#F5E847] shadow-[0_0_12px_rgba(245,232,71,0.65)]"
          />

          {/* Timeline Items */}
          <div className="space-y-24">

            {journeyItems.map((item, index) => {
              const isLeft = item.position === 'left';
              const isActive = activeIndex >= index;

              return (
                <div
                  key={item.key}
                  className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16"
                >

                  {/* Timeline Node */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive
                        ? '#F5E847'
                        : '#067BA1',

                      scale: isActive ? 1.25 : 1,

                      boxShadow: isActive
                        ? '0 0 0 7px rgba(245,232,71,0.25), 0 0 18px rgba(245,232,71,0.7)'
                        : '0 0 0 5px rgba(6,123,161,0.15)',
                    }}
                    transition={{ duration: 0.35 }}
                    className="absolute left-1/2 top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#F7F7F4]"
                  />

                  {/* Image */}
                  <div
                    className={`
                      relative h-[390px] overflow-hidden rounded-[28px]
                      ${isLeft
                        ? 'md:col-start-1'
                        : 'md:col-start-2'
                      }
                    `}
                  >
                    <img
                      src={item.image}
                      alt={t(
                        `about.journey.items.${item.key}.imageAlt`
                      )}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#121528]/50 to-transparent" />

                    <span
                      className={`
                        absolute bottom-5 text-6xl font-extrabold
                        text-white/30 md:text-7xl
                        ${isArabic ? 'right-6' : 'left-6'}
                      `}
                    >
                      {item.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className={`
                      relative
                      ${
                        isLeft
                          ? 'md:col-start-2 md:row-start-1 md:pl-12'
                          : 'md:col-start-1 md:row-start-1 md:pr-12'
                      }
                    `}
                  >

                    {/* Year / Number */}
                    <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#067BA1]">
                      {item.year || item.number}
                    </span>

                    {/* Highlight */}
                    {item.highlight && (
                      <div className="mb-3 font-heading text-5xl font-extrabold text-[#067BA1] md:text-6xl">
                        {item.highlight}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="mb-5 font-heading text-2xl font-extrabold uppercase leading-tight text-[#121528] md:text-3xl">
                      {t(
                        `about.journey.items.${item.key}.title`
                      )}
                    </h3>

                    {/* Description */}
                    <p className="max-w-lg text-sm leading-8 text-[#121528]/65 md:text-base">
                      {t(
                        `about.journey.items.${item.key}.description`
                      )}
                    </p>

                    {/* Arrow */}
                    <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#F5E847] text-[#121528]">
                      <ArrowUpRight
                        size={20}
                        className={isArabic ? '-rotate-90' : ''}
                      />
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Mobile Slider */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="md:hidden"
        >
          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >

            {journeyItems.map((item) => (
              <article
                key={item.key}
                className="group relative h-[480px] w-[85vw] max-w-[390px] shrink-0 snap-center overflow-hidden rounded-[28px]"
              >

                {/* Background Image */}
                <img
                  src={item.image}
                  alt={t(
                    `about.journey.items.${item.key}.imageAlt`
                  )}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121528] via-[#121528]/65 to-[#121528]/10" />

                {/* Card Content */}
                <div
                  dir={isArabic ? 'rtl' : 'ltr'}
                  className="relative flex h-full flex-col justify-between p-6 text-white"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between">

                    <span className="text-sm font-bold tracking-[0.2em] text-white/80">
                      {item.year || item.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[#F5E847] backdrop-blur-sm">
                      <ArrowUpRight
                        size={20}
                        className={isArabic ? '-rotate-90' : ''}
                      />
                    </div>

                  </div>

                  {/* Bottom Content */}
                  <div>

                    <span className="mb-4 block text-6xl font-extrabold text-white/20">
                      {item.number}
                    </span>

                    {/* Highlight */}
                    {item.highlight && (
                      <div className="mb-3 font-heading text-5xl font-extrabold text-[#F5E847]">
                        {item.highlight}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="mb-4 font-heading text-2xl font-extrabold uppercase leading-tight text-white">
                      {t(
                        `about.journey.items.${item.key}.title`
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-7 text-white/80">
                      {t(
                        `about.journey.items.${item.key}.description`
                      )}
                    </p>

                    <div className="mt-6 h-[3px] w-12 rounded-full bg-[#F5E847]" />

                  </div>
                </div>
              </article>
            ))}

          </div>

          {/* Slider Hint */}
          <div className="mt-4 flex items-center justify-center gap-3 text-xs font-semibold text-[#121528]/50">
            <span className="h-[1px] w-8 bg-[#067BA1]/30" />

            {isArabic
              ? 'اسحب لاكتشاف رحلتنا'
              : 'SWIPE TO EXPLORE'
            }

            <span className="h-[1px] w-8 bg-[#067BA1]/30" />
          </div>

        </div>

      </div>
    </section>
  );
}