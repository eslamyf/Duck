import { useEffect, useRef } from 'react';

import { useTranslation } from '../../../shared/i18n/index.js';

import {
  useInView,
  useMotionValue,
  animate,
} from 'framer-motion';

const stats = [
  {
    key: 'founded',
    value: 2023,
    suffix: '',
  },
  {
    key: 'customers',
    value: 4000,
    suffix: '+',
  },
  {
    key: 'destinations',
    value: 4,
    suffix: '+',
  },
];

function Counter({ value, suffix, isArabic }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration: 2.2,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = motionValue.on('change', (latest) => {
      if (ref.current) {
        const rounded = Math.round(latest);

        const formatted =
          value === 2023
            ? String(rounded)
            : rounded.toLocaleString(
                isArabic ? 'ar-EG' : 'en-US'
              );

        ref.current.textContent = formatted + suffix;
      }
    });

    return () => unsubscribe();
  }, [motionValue, suffix, isArabic, value]);

  return (
    <span
      ref={ref}
      className="font-heading text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
    >
      0{suffix}
    </span>
  );
}

export default function AboutNumbers() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-[#121528] py-10 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16">

        {/* Heading */}
        <div className="mb-8 text-center md:mb-10">

          {/* Eyebrow */}
          <span className="mb-3 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#F5E847]">
            <span className="h-[2px] w-7 bg-[#067BA1]" />

            {t('about.numbers.eyebrow')}

            <span className="h-[2px] w-7 bg-[#067BA1]" />
          </span>

          {/* Title */}
          <h2 className="font-heading text-3xl font-extrabold uppercase text-white sm:text-4xl md:text-5xl">
            {t('about.numbers.title')}
            <span className="text-[#F5E847]">.</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-white/50 sm:text-sm">
            {t('about.numbers.subtitle')}
          </p>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-0">

          {stats.map((stat, index) => (
            <div
              key={stat.key}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`
                relative flex flex-col items-center text-center
                ${
                  index !== 0
                    ? 'md:border-l md:border-white/10'
                    : ''
                }
              `}
            >

              {/* Animated Number */}
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                isArabic={isArabic}
              />

              {/* Yellow Divider */}
              <span className="mt-3 h-[3px] w-8 rounded-full bg-[#F5E847]" />

              {/* Label */}
              <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-white/80 sm:text-sm">
                {t(
                  `about.numbers.items.${stat.key}.label`
                )}
              </h3>

              {/* Description */}
              <p className="mt-1 text-[11px] text-white/40 sm:text-xs">
                {t(
                  `about.numbers.items.${stat.key}.description`
                )}
              </p>

            </div>
          ))}

        </div>

        {/* Footer */}
        <p className="mt-9 text-center text-xs leading-6 text-white/40 sm:text-sm">
          {t('about.numbers.footer')}
        </p>

      </div>
    </section>
  );
}