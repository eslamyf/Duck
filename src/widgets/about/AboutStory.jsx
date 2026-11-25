import { useTranslation } from '../../shared/i18n/index.js';
import storyImage from '../../shared/assets/images/about/story-aswan.webp';

export default function AboutStory() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      id="about-story"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative min-h-[calc(100svh-100px)] overflow-hidden bg-surface-sand pb-14 pt-10 text-brand-navy lg:py-16"
    >
      {/* Subtle Background Glows */}
      <div
        className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-brand-blue/5 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-yellow/10 blur-[100px]"
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
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-brand-yellow" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              {t('about.story.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-4 font-heading text-3xl font-extrabold uppercase leading-[1.15] tracking-tight text-brand-navy sm:text-4xl md:text-5xl lg:text-5xl">
            <span className="block">
              {t('about.story.titleLine1')}
            </span>
            <span className="block text-brand-blue">
              {t('about.story.titleLine2')}
            </span>
          </h2>

          {/* Story Description - Concise & Punchy */}
          <div className="max-w-xl space-y-3 text-sm leading-relaxed text-brand-navy/75 sm:text-base sm:leading-8">
            <p>{t('about.story.paragraph1')}</p>
            <p>{t('about.story.paragraph2')}</p>
          </div>

          {/* Closing Highlight */}
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-blue sm:text-sm">
            {t('about.story.closing')}
          </p>

          {/* Story Facts */}
          <div className="mt-6 grid max-w-xl grid-cols-2 gap-4 sm:mt-7">
            <div className="border-s-2 border-brand-yellow py-2 ps-3.5 sm:ps-4 bg-white/40 rounded-e-xl">
              <h3 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
                2023
              </h3>
              <p className="mt-1 text-xs font-medium text-brand-navy/60 sm:text-sm">
                {t('about.story.fact1')}
              </p>
            </div>

            <div className="border-s-2 border-brand-blue py-2 ps-3.5 sm:ps-4 bg-white/40 rounded-e-xl">
              <h3 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
                {t('about.story.fact2Value')}
              </h3>
              <p className="mt-1 text-xs font-medium text-brand-navy/60 sm:text-sm">
                {t('about.story.fact2')}
              </p>
            </div>
          </div>
        </div>

        {/* Story Image - Real Duck Aswan Image */}
        <div
          className={`relative h-[360px] overflow-hidden rounded-3xl shadow-xl sm:h-[440px] lg:h-[min(68vh,560px)] ${
            isArabic ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <img
            src={storyImage}
            alt={t('about.story.mainImageAlt', t('about.story.imageAlt', 'مغامرة كاياك على المياه'))}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />

          {/* Image Tag */}
          <div
            className={`absolute bottom-5 rounded-full border border-white/30 bg-brand-navy/60 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md shadow-lg ${
              isArabic ? 'right-5' : 'left-5'
            }`}
          >
            {t('about.story.imageTag', t('about.story.established', 'أسوان، مصر'))}
          </div>
        </div>
      </div>
    </section>
  );
}
