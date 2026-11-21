import { useTranslation } from '../../../shared/i18n/index.js';

import {
  Compass,
  Waves,
  Users,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export default function AboutPrinciples() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const principles = [
    {
      number: '01',
      key: 'adventure',
      icon: Compass,
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
      layout: 'large',
    },
    {
      number: '02',
      key: 'freedom',
      icon: Waves,
      image:
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=85',
      layout: 'small',
    },
    {
      number: '03',
      key: 'connection',
      icon: Users,
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85',
      layout: 'small',
    },
    {
      number: '04',
      key: 'safety',
      icon: ShieldCheck,
      image:
        'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85',
      layout: 'wide',
    },
  ];

  const renderCard = (principle, mobile = false) => {
    const Icon = principle.icon;

    const desktopLayout =
      principle.layout === 'large'
        ? 'lg:col-span-4 lg:row-span-2'
        : principle.layout === 'wide'
          ? 'lg:col-span-8 lg:row-span-1'
          : 'lg:col-span-4 lg:row-span-1';

    return (
      <article
        key={principle.key}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`
          group relative isolate overflow-hidden rounded-[24px]
          bg-[#121528] shadow-sm
          ${
            mobile
              ? 'h-[420px] w-[85vw] max-w-[380px] shrink-0 snap-center'
              : `h-full min-h-0 ${desktopLayout}`
          }
        `}
      >
        {/* Background Image */}
        <img
          src={principle.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#121528]/95 via-[#121528]/35 to-[#121528]/10 transition-all duration-500 group-hover:from-[#121528]/90"
          aria-hidden="true"
        />

        {/* Card Content */}
        <div
          className={`relative flex h-full flex-col justify-between p-5 text-white md:p-6 ${
            isArabic ? 'text-right' : 'text-left'
          }`}
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold tracking-widest text-white/80">
              {principle.number}
            </span>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[#F5E847] backdrop-blur-sm transition-all duration-300 group-hover:rotate-12 group-hover:bg-[#F5E847] group-hover:text-[#121528]">
              <Icon size={21} strokeWidth={1.8} />
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10">
            <h3 className="mb-2 font-heading text-2xl font-extrabold uppercase sm:text-3xl">
              {t(`about.principles.${principle.key}.title`)}
            </h3>

            <p className="max-w-md text-sm leading-7 text-white/80">
              {t(`about.principles.${principle.key}.description`)}
            </p>

            {principle.key === 'adventure' && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5E847]">
                <span>
                  {t('about.principles.highlight')}
                </span>

                <ArrowUpRight
                  size={16}
                  className={isArabic ? '-rotate-90' : ''}
                />
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="flex min-h-[calc(100svh-100px)] flex-col justify-center bg-[#F7F7F4] py-10 md:py-12 lg:min-h-[calc(100svh-100px)] lg:py-8"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">

        {/* Section Heading */}
        <div className="mb-7">

          {/* Eyebrow */}
          <span className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#067BA1]">
            <span className="h-[2px] w-8 bg-[#F5E847]" />

            {t('about.principles.eyebrow')}
          </span>

          {/* Title & Description */}
          <div
            dir="ltr"
            className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
          >

            {/* Title */}
            <h2
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`
                w-full max-w-2xl font-heading text-4xl font-extrabold
                uppercase leading-tight text-[#121528]
                sm:text-5xl md:w-1/2 md:text-6xl
                ${isArabic
                  ? 'text-right md:order-2'
                  : 'text-left md:order-1'
                }
              `}
            >
              <span className="block">
                {t('about.principles.titleLine1')}
              </span>

              <span className="block text-[#067BA1]">
                {t('about.principles.titleLine2')}
              </span>
            </h2>

            {/* Description */}
            <p
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`
                w-full max-w-md pb-2 text-sm leading-7
                text-[#121528]/60 sm:text-base md:w-1/2
                ${isArabic
                  ? 'text-right md:order-1'
                  : 'text-left md:order-2'
                }
              `}
            >
              {t('about.principles.description')}
            </p>

          </div>
        </div>

        {/* Mobile Slider */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:hidden [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {principles.map((principle) =>
            renderCard(principle, true)
          )}
        </div>

        {/* Desktop Bento Grid */}
        <div
          dir="ltr"
          className="hidden h-[min(58vh,430px)] grid-cols-12 grid-rows-2 gap-3 md:grid"
        >
          {principles.map((principle) =>
            renderCard(principle)
          )}
        </div>

        {/* Mobile Slider Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          {principles.map((principle) => (
            <span
              key={principle.key}
              className="h-1.5 w-6 rounded-full bg-[#067BA1]/20"
            />
          ))}
        </div>

      </div>
    </section>
  );
}