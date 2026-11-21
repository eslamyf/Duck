import { useTranslation } from '../../../shared/i18n/index.js';

export default function AboutMissionVision() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const missionImage =
    "https://images.unsplash.com/photo-1762943107260-d080e13266b3?auto=format&fit=crop&fm=jpg&q=85&w=1400";

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-hidden bg-[#F7F7F4] py-16 text-[#121528] md:py-20 lg:py-24"
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

          <div className="absolute inset-0 bg-gradient-to-t from-[#121528]/45 via-transparent to-transparent" />

          <div
            className={`absolute bottom-6 rounded-full border border-white/30 bg-[#121528]/30 px-5 py-3 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md ${
              isArabic ? 'right-6' : 'left-6'
            }`}
          >
            DUCK · WATER EXPERIENCES
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

            <span className="h-[2px] w-8 bg-[#F5E847]" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#067BA1]">
              {t('about.missionVision.eyebrow')}
            </span>

          </div>

          {/* Heading */}
          <h2
            className={`mb-8 font-heading text-4xl font-extrabold uppercase leading-tight text-[#121528] sm:text-5xl md:text-6xl ${
              isArabic ? 'leading-[1.4]' : ''
            }`}
          >

            {isArabic ? (
              <>
                {t('about.missionVision.title')}
                <br />

                <span className="text-[#F5E847]">
                  MISSION
                </span>

                {' & '}

                <span className="text-[#067BA1]">
                  VISION
                </span>
              </>
            ) : (
              <>
                OUR{' '}

                <span className="text-[#F5E847]">
                  MISSION
                </span>

                {' & '}

                <span className="text-[#067BA1]">
                  VISION
                </span>
              </>
            )}

          </h2>

          {/* Mission & Vision */}
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-7">

            {/* Mission */}
            <div className="relative border-t-2 border-[#F5E847] pt-5">

              <span className="mb-4 block text-xs font-bold tracking-[0.2em] text-[#B5A900]">
                01 / MISSION
              </span>

              <h3 className="mb-4 font-heading text-2xl font-extrabold text-[#121528] sm:text-3xl">
                {t('about.missionVision.missionTitle')}
              </h3>

              <p className="text-sm leading-8 text-[#121528]/65 sm:text-base">
                {t('about.missionVision.missionDescription')}
              </p>

            </div>

            {/* Vision */}
            <div className="relative border-t-2 border-[#067BA1] pt-5">

              <span className="mb-4 block text-xs font-bold tracking-[0.2em] text-[#067BA1]">
                02 / VISION
              </span>

              <h3 className="mb-4 font-heading text-2xl font-extrabold text-[#121528] sm:text-3xl">
                {t('about.missionVision.visionTitle')}
              </h3>

              <p className="text-sm leading-8 text-[#121528]/65 sm:text-base">
                {t('about.missionVision.visionDescription')}
              </p>

            </div>

          </div>

          {/* Bottom Accent */}
          <div className="mt-9 flex items-center gap-3">

            <span className="h-1.5 w-1.5 rounded-full bg-[#067BA1]" />

            <span className="h-px w-16 bg-[#121528]/15" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#121528]/40">
              {t('about.missionVision.footer')}
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}