import { useTranslation } from '../../shared/i18n/index.js';

export default function AboutMissionVision() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const missionImage =
    'https://images.unsplash.com/photo-1762943107260-d080e13266b3?auto=format&fit=crop&fm=jpg&q=85&w=1400';

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-hidden bg-surface-sand py-16 text-brand-navy md:py-20 lg:py-24"
    >
      <div
        dir="ltr"
        className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16"
      >
        {/* Image */}
        <div
          className={`relative h-[360px] overflow-hidden rounded-3xl shadow-xl sm:h-[440px] lg:h-[min(68vh,580px)] ${
            isArabic ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <img
            src={missionImage}
            alt={t('about.missionVision.imageAlt')}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />

          <div
            className={`absolute bottom-6 rounded-full border border-white/30 bg-brand-navy/30 px-5 py-3 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md ${
              isArabic ? 'right-6' : 'left-6'
            }`}
          >
            {t('about.missionVision.badge', 'DUCK · WATER EXPERIENCES')}
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
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-brand-yellow" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              {t('about.missionVision.eyebrow')}
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`mb-8 font-heading text-4xl font-extrabold uppercase leading-tight text-brand-navy sm:text-5xl md:text-6xl ${
              isArabic ? 'leading-[1.4]' : ''
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
          <div className="space-y-6">
            {/* Mission Card */}
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-yellow" />
                <h3 className="font-heading text-xl font-bold uppercase text-brand-navy sm:text-2xl">
                  {t('about.missionVision.missionTitle')}
                </h3>
              </div>
              <p className="text-sm leading-7 text-brand-navy/70 sm:text-base">
                {t('about.missionVision.missionDescription')}
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-blue" />
                <h3 className="font-heading text-xl font-bold uppercase text-brand-navy sm:text-2xl">
                  {t('about.missionVision.visionTitle')}
                </h3>
              </div>
              <p className="text-sm leading-7 text-brand-navy/70 sm:text-base">
                {t('about.missionVision.visionDescription')}
              </p>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
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
