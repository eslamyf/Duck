import { useTranslation } from '../../shared/i18n/index.js';

export default function AboutStory() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const mainImage =
    'https://images.unsplash.com/photo-1762943107260-d080e13266b3?auto=format&fit=crop&fm=jpg&q=85&w=1400';

  return (
    <section
      id="about-story"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative min-h-[calc(100svh-100px)] overflow-hidden bg-surface-sand pb-16 pt-12 text-brand-navy lg:min-h-[calc(100svh-100px)] lg:py-16"
    >
      {/* Background Decoration */}
      <div
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-blue/5 blur-[120px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-brand-yellow/10 blur-[120px]"
        aria-hidden="true"
      />

      <div
        dir="ltr"
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-6 md:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16"
      >
        {/* Story Content */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`${
            isArabic
              ? 'text-right lg:order-2'
              : 'text-left lg:order-1'
          }`}
        >
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-brand-yellow" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              {t('about.story.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-4 font-heading text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block">
              {t('about.story.titleLine1')}
            </span>

            <span className="block text-brand-blue">
              {t('about.story.titleLine2')}
            </span>
          </h2>

          {/* Story Description */}
          <div className="max-w-xl space-y-3 text-sm leading-7 text-brand-navy/70 sm:text-base sm:leading-8">
            <p>{t('about.story.paragraph1')}</p>
            <p>{t('about.story.paragraph2')}</p>
            <p>{t('about.story.paragraph3')}</p>
          </div>

          {/* Closing */}
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-blue sm:text-sm">
            {t('about.story.closing')}
          </p>

          {/* Story Facts */}
          <div className="mt-6 grid max-w-xl grid-cols-2 gap-4 sm:mt-7">
            <div className="border-s-2 border-brand-yellow py-2 ps-3 sm:ps-4">
              <h3 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-4xl">
                2023
              </h3>
              <p className="mt-2 text-xs text-brand-navy/60 sm:text-sm">
                {t('about.story.fact1')}
              </p>
            </div>

            <div className="border-s-2 border-brand-blue py-2 ps-3 sm:ps-4">
              <h3 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-4xl">
                {t('about.story.fact2Value')}
              </h3>
              <p className="mt-2 text-xs text-brand-navy/60 sm:text-sm">
                {t('about.story.fact2')}
              </p>
            </div>
          </div>
        </div>

        {/* Story Image */}
        <div
          className={`relative h-[380px] overflow-hidden rounded-3xl shadow-xl sm:h-[460px] lg:h-[min(72vh,620px)] ${
            isArabic ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <img
            src={mainImage}
            alt={t('about.story.mainImageAlt', t('about.story.imageAlt', 'مغامرة كاياك على المياه'))}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />

          {/* Image Tag */}
          <div
            className={`absolute bottom-6 rounded-full border border-white/30 bg-brand-navy/40 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md ${
              isArabic ? 'right-6' : 'left-6'
            }`}
          >
            {t('about.story.imageTag', t('about.story.established', 'أسوان، مصر'))}
          </div>
        </div>
      </div>
    </section>
  );
}
