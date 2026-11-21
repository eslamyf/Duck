import { useTranslation } from '../../../shared/i18n/index.js';

export default function AboutStory() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const mainImage =
    "https://images.unsplash.com/photo-1762943107260-d080e13266b3?auto=format&fit=crop&fm=jpg&q=85&w=1400";

  return (
    <section
      id="our-story"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative min-h-[calc(100svh-100px)] overflow-hidden bg-[#F7F7F4] pb-16 pt-12 text-[#121528] lg:min-h-[calc(100svh-100px)] lg:py-16"
    >
      {/* Background Decoration */}
      <div
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#067BA1]/5 blur-[120px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#F5E847]/10 blur-[120px]"
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
            <span className="h-[2px] w-8 bg-[#F5E847]" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#147D9F]">
              {t('about.story.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-4 font-heading text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-[#121528] sm:text-4xl md:text-5xl lg:text-6xl">

            <span className="block">
              {t('about.story.titleLine1')}
            </span>

            <span className="block text-[#067BA1]">
              {t('about.story.titleLine2')}
            </span>

          </h2>

          {/* Story Description */}
          <div className="max-w-xl space-y-3 text-sm leading-7 text-[#121528]/70 sm:text-base sm:leading-8">

            <p>{t('about.story.paragraph1')}</p>

            <p>{t('about.story.paragraph2')}</p>

            <p>{t('about.story.paragraph3')}</p>

          </div>

          {/* Closing */}
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-[#147D9F] sm:text-sm">
            {t('about.story.closing')}
          </p>

          {/* Story Facts */}
          <div className="mt-6 grid max-w-xl grid-cols-2 gap-4 sm:mt-7">

            <div className="border-s-2 border-[#F5E847] py-2 ps-3 sm:ps-4">

              <h3 className="font-heading text-2xl font-extrabold text-[#121528] sm:text-4xl">
                2023
              </h3>

              <p className="mt-2 text-xs text-[#121528]/60 sm:text-sm">
                {t('about.story.fact1')}
              </p>

            </div>

            <div className="border-s-2 border-[#067BA1] py-2 ps-3 sm:ps-4">

              <h3 className="font-heading text-2xl font-extrabold text-[#121528] sm:text-4xl">
                {t('about.story.fact2Value')}
              </h3>

              <p className="mt-2 text-xs text-[#121528]/60 sm:text-sm">
                {t('about.story.fact2')}
              </p>

            </div>

          </div>

        </div>

        {/* Main Image - Hidden on Mobile and Tablet */}
        <div
          className={`relative hidden lg:block ${
            isArabic ? 'lg:order-1' : 'lg:order-2'
          }`}
        >

          <div className="relative h-[min(68vh,520px)] overflow-hidden rounded-3xl border border-[#121528]/10 shadow-xl">

            <img
              src={mainImage}
              alt={t('about.story.mainImageAlt')}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
              decoding="async"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#121528]/60 via-transparent to-transparent" />

          </div>

          {/* Image Caption */}
          <div
            className={`absolute bottom-4 z-10 w-[235px] rounded-2xl bg-[#F5E847] p-6 shadow-xl ${
              isArabic ? 'left-4 sm:left-8' : 'right-4 sm:right-8'
            }`}
          >

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#121528]/65">
              {t('about.story.established')}
            </p>

            <h3 className="font-heading text-4xl font-extrabold text-[#121528]">
              2023
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#121528]/70">
              {t('about.story.imageCaption')}
            </p>

          </div>

        </div>

      </div>
      
    </section>
    
  );
}