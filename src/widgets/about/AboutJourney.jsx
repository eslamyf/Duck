import { useTranslation } from '../../shared/i18n/index.js';
import imgBeginning from '../../shared/assets/images/about/journey-beginning.webp';
import imgFleet from '../../shared/assets/images/about/journey-fleet.webp';
import imgCommunity from '../../shared/assets/images/about/journey-community.webp';
import imgExpansion from '../../shared/assets/images/about/journey-expansion.webp';

export default function AboutJourney() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const milestones = [
    {
      key: 'beginning',
      year: '2023',
      image: imgBeginning,
      tag: isArabic ? 'الانطلاقة الأولى' : 'The First Spark',
    },
    {
      key: 'experiences',
      year: '2024',
      image: imgFleet,
      tag: isArabic ? 'تنوع الأسطول' : 'Fleet Expansion',
    },
    {
      key: 'customers',
      year: '2025',
      image: imgCommunity,
      tag: isArabic ? '+4000 مغامر' : '4,000+ Adventurers',
    },
    {
      key: 'beyond',
      year: '2026+',
      image: imgExpansion,
      tag: isArabic ? 'كل مياه مصر' : 'Across Egypt',
    },
  ];

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="overflow-hidden bg-surface-sand py-12 md:py-16 text-brand-navy"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Section Heading - Compact */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            <span className="h-[2px] w-8 bg-brand-yellow" />
            {t('about.journey.eyebrow')}
            <span className="h-[2px] w-8 bg-brand-yellow" />
          </span>

          <h2 className="font-heading text-3xl font-extrabold uppercase text-brand-navy sm:text-4xl md:text-5xl">
            {t('about.journey.title')}
            <span className="text-brand-blue">.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-brand-navy/70 leading-relaxed">
            {t('about.journey.subtitle')}
          </p>
        </div>

        {/* 4-Column Milestone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {milestones.map((item, idx) => (
            <div
              key={item.key}
              className="group relative flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {/* Year Badge & Step Number */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5">
                  <span className="font-heading text-xl font-extrabold text-brand-navy">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-yellow/30 text-brand-navy">
                    {item.tag}
                  </span>
                </div>

                {/* Real Duck Photo */}
                <div className="relative h-44 w-full overflow-hidden rounded-xl mb-3.5 bg-brand-navy">
                  <img
                    src={item.image}
                    alt={t(`about.journey.items.${item.key}.title`)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-2 end-2 font-mono text-[10px] font-black text-white/80 bg-brand-navy/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-base sm:text-lg font-bold text-brand-navy mb-1.5 leading-snug">
                  {t(`about.journey.items.${item.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-xs text-brand-navy/70 leading-relaxed">
                  {t(`about.journey.items.${item.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
