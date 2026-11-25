import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { useInView, animate } from 'framer-motion';

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
    value: 5,
    suffix: '+',
  },
  {
    key: 'safety',
    value: 100,
    suffix: '%',
  },
];

function Counter({ value, suffix, isArabic }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  const formatted =
    value === 2023
      ? String(displayValue)
      : displayValue.toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  return (
    <span
      ref={ref}
      className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white tabular-nums"
    >
      {formatted}{suffix}
    </span>
  );
}

export default function AboutNumbers() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-brand-navy py-12 md:py-16 text-white"
    >
      {/* Subtle Background Glows */}
      <div
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-brand-blue/15 blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-brand-yellow/10 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-yellow">
            <span className="h-[2px] w-7 bg-brand-blue" />
            {t('about.numbers.eyebrow')}
            <span className="h-[2px] w-7 bg-brand-blue" />
          </span>

          <h2 className="font-heading text-2xl font-extrabold uppercase text-white sm:text-3xl md:text-4xl">
            {t('about.numbers.title')}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-md mx-auto">
            {t('about.numbers.subtitle')}
          </p>
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-xs transition-all duration-300 hover:border-brand-yellow/40 hover:bg-white/10 flex flex-col justify-between"
            >
              <div className="mb-2">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  isArabic={isArabic}
                />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow sm:text-sm block">
                  {t(`about.numbers.items.${stat.key}.label`, t(`about.numbers.${stat.key}.label`))}
                </span>

                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                  {t(`about.numbers.items.${stat.key}.description`, t(`about.numbers.${stat.key}.description`))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
