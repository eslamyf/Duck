import { useEffect, useRef } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
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
      className="relative overflow-hidden bg-brand-navy py-10 md:py-12"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="mb-8 text-center md:mb-10">
          {/* Eyebrow */}
          <span className="mb-3 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-yellow">
            <span className="h-[2px] w-7 bg-brand-blue" />
            {t('about.numbers.eyebrow')}
            <span className="h-[2px] w-7 bg-brand-blue" />
          </span>

          {/* Title */}
          <h2 className="font-heading text-2xl font-extrabold uppercase text-white sm:text-3xl md:text-4xl">
            {t('about.numbers.title')}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-brand-yellow/30 hover:bg-white/10 sm:p-7"
            >
              <div className="mb-2">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  isArabic={isArabic}
                />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow sm:text-sm">
                {t(`about.numbers.items.${stat.key}.label`, t(`about.numbers.${stat.key}.label`))}
              </span>

              <p className="mt-2 text-xs text-white/60">
                {t(`about.numbers.items.${stat.key}.description`, t(`about.numbers.${stat.key}.description`))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
