import { useTranslation } from '../../shared/i18n/index.js';
import missionImage from '../../shared/assets/images/about/mission-vision.webp';

export default function AboutMissionVision() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-hidden bg-surface-sand py-12 md:py-16 text-brand-navy"
    >
      <div
        dir="ltr"
        className="mx-auto grid max-w-7xl items-center gap-8 px-6 md:px-10 lg:grid-cols-2 lg:gap-14 lg:px-16"
      >
        {/* Real Duck Image */}
        <div
          className={`relative h-[340px] overflow-hidden rounded-3xl shadow-xl sm:h-[420px] lg:h-[min(64vh,540px)] ${
            isArabic ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <img
            src={missionImage}
            alt={t('about.missionVision.imageAlt')}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="eager"
            decoding="async"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/55 via-transparent to-transparent" />

          <div
            className={`absolute bottom-5 rounded-full border border-white/30 bg-brand-navy/60 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md shadow-lg ${
              isArabic ? 'right-5' : 'left-5'
            }`}
          >
            {t('about.missionVision.badge', 'DUCK · تجارب مائية حقيقية')}
          </div>
        </div>

        {/* Content */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`${
            isArabic
              ? 'text-right lg:order-1'
              : 'text-left lg:order-2'
          }`}
        >
          {/* Section Label */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-brand-yellow" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              {t('about.missionVision.eyebrow')}
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`mb-6 font-heading text-3xl font-extrabold uppercase leading-tight text-brand-navy sm:text-4xl md:text-5xl ${
              isArabic ? 'leading-[1.3]' : ''
            }`}
          >
            {isArabic ? (
              <>
                {t('about.missionVision.title')}
                <br />
                <span className="text-brand-yellow">
                  MISSION
                </span>
                {' & '}
                <span className="text-brand-blue">
                  VISION
                </span>
              </>
            ) : (
              <>
                OUR{' '}
                <span className="text-brand-yellow">
                  MISSION
                </span>
                {' & '}
                <span className="text-brand-blue">
                  VISION
                </span>
              </>
            )}
          </h2>

          {/* Cards */}
          <div className="space-y-4">
            {/* Mission Card */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs transition-shadow duration-300 hover:shadow-md sm:p-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-yellow ring-4 ring-brand-yellow/20" />
                <h3 className="font-heading text-lg font-bold uppercase text-brand-navy sm:text-xl">
                  {t('about.missionVision.missionTitle')}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-brand-navy/70 sm:text-base">
                {t('about.missionVision.missionDescription')}
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs transition-shadow duration-300 hover:shadow-md sm:p-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-blue ring-4 ring-brand-blue/20" />
                <h3 className="font-heading text-lg font-bold uppercase text-brand-navy sm:text-xl">
                  {t('about.missionVision.visionTitle')}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-brand-navy/70 sm:text-base">
                {t('about.missionVision.visionDescription')}
              </p>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-6 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            <span className="h-[2px] w-6 bg-brand-yellow" />
            <span>
              {t('about.missionVision.footer')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
