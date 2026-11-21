import backgroundImage from '../../shared/assets/images/about-background.jpg';
import mainImage from '../../shared/assets/images/about-main.jpg';
import secondaryImage from '../../shared/assets/images/about-secondary.jpg';
import { useTranslation } from '../../shared/i18n/index.js';

import {
  AboutStory,
  AboutMissionVision,
  AboutPrinciples,
  AboutJourney,
  AboutNumbers,
  AboutCommunity,
  AboutCTA,
} from '../../widgets/about/index.js';

export default function AboutPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <div className="text-brand-navy" dir={isArabic ? 'rtl' : 'ltr'}>
      <section
        className="relative h-[calc(100svh-52px)] w-full overflow-hidden bg-brand-navy text-white lg:h-[calc(100svh-100px)]"
        aria-labelledby="about-title"
      >
        <img
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_58%]"
          src={backgroundImage}
          alt={t('about.hero.imageAlt')}
          fetchPriority="high"
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-brand-navy/65"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-7xl items-center px-6 py-8 md:px-10 md:py-10 lg:px-16 lg:py-6">
          <div dir="ltr" className="grid w-full items-center gap-12 lg:grid-cols-2">
            <div
              role="group"
              className={`relative hidden h-[520px] lg:block ${isArabic ? 'lg:order-1' : 'lg:order-2'}`}
              aria-label={t('about.hero.collageLabel')}
            >
              <div
                className={`absolute top-1/2 h-[85%] w-[75%] -translate-y-1/2 overflow-hidden rounded-3xl shadow-2xl ${isArabic ? 'right-0' : 'left-0'}`}
              >
                <img
                  src={mainImage}
                  alt={t('about.hero.mainImageAlt')}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className={`absolute bottom-0 h-[42%] w-[48%] overflow-hidden rounded-3xl border-4 border-brand-navy shadow-2xl ${isArabic ? 'left-0' : 'right-0'}`}
              >
                <img
                  src={secondaryImage}
                  alt={t('about.hero.secondaryImageAlt')}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`text-white ${isArabic ? 'text-right lg:order-2' : 'text-left lg:order-1'}`}
            >
              <span className="mb-6 inline-block text-xs font-semibold uppercase text-brand-yellow">
                {t('about.hero.eyebrow')}
              </span>
              <h1
                id="about-title"
                className="mb-7 font-display text-4xl font-extrabold leading-[1.12] sm:text-5xl xl:text-[56px]"
              >
                <span className="block">{t('about.hero.titleLine1')}</span>{' '}
                <span className="block text-brand-blue">{t('about.hero.titleLine2')}</span>{' '}
                <span className="block">{t('about.hero.titleLine3')}</span>{' '}
                <span className="block text-brand-yellow">{t('about.hero.titleLine4')}</span>
              </h1>
              <p className="mb-8 max-w-xl text-sm leading-8 text-white/80 sm:text-base">
                {t('about.hero.description')}
              </p>
              <a
                href="#about-story"
                className="group inline-flex min-h-12 items-center gap-3 rounded-lg bg-brand-yellow px-7 py-3 font-bold text-brand-navy transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-yellow/20 motion-reduce:transition-none"
              >
                {t('about.hero.cta')}
                <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <AboutStory />
      <AboutMissionVision />
      <AboutPrinciples />
      <AboutJourney />
      <AboutNumbers />
      <AboutCommunity />
      <AboutCTA />
    </div>
  );
}
