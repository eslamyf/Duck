import { useTranslation } from '../../shared/i18n/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass,
  faWater,
  faUsers,
  faShieldHalved,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

import imgAdventure from '../../shared/assets/images/about/principle-adventure.webp';
import imgFreedom from '../../shared/assets/images/about/principle-freedom.webp';
import imgConnection from '../../shared/assets/images/about/principle-connection.webp';
import imgSafety from '../../shared/assets/images/about/principle-safety.webp';

export default function AboutPrinciples() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const principles = [
    {
      number: '01',
      key: 'adventure',
      icon: faCompass,
      image: imgAdventure,
      layout: 'large',
    },
    {
      number: '02',
      key: 'freedom',
      icon: faWater,
      image: imgFreedom,
      layout: 'small',
    },
    {
      number: '03',
      key: 'connection',
      icon: faUsers,
      image: imgConnection,
      layout: 'small',
    },
    {
      number: '04',
      key: 'safety',
      icon: faShieldHalved,
      image: imgSafety,
      layout: 'wide',
    },
  ];

  const renderCard = (principle) => {
    const responsiveLayout =
      principle.layout === 'large'
        ? 'min-h-[280px] sm:min-h-[300px] lg:min-h-0 lg:col-span-4 lg:row-span-2'
        : principle.layout === 'wide'
          ? 'min-h-[260px] sm:col-span-2 lg:min-h-0 lg:col-span-8 lg:row-span-1'
          : 'min-h-[260px] lg:min-h-0 lg:col-span-4 lg:row-span-1';

    return (
      <article
        key={principle.key}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`group relative isolate overflow-hidden rounded-[24px] bg-brand-navy shadow-sm h-full ${responsiveLayout}`}
      >
        {/* Background Real Duck Image */}
        <img
          src={principle.image}
          alt={t(`about.principles.${principle.key}.title`)}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/50 to-brand-navy/20 transition-all duration-500 group-hover:from-brand-navy/90"
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
            <span className="text-xs font-black tracking-widest text-brand-yellow">
              {principle.number}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-brand-yellow backdrop-blur-sm transition-all duration-300 group-hover:rotate-12 group-hover:bg-brand-yellow group-hover:text-brand-navy">
              <FontAwesomeIcon icon={principle.icon} className="text-base" />
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8">
            <h3 className="mb-2 font-heading text-xl font-extrabold uppercase sm:text-2xl text-white">
              {t(`about.principles.${principle.key}.title`)}
            </h3>

            <p className="max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
              {t(`about.principles.${principle.key}.description`)}
            </p>

            {principle.key === 'adventure' && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-yellow">
                <span>{t('about.principles.highlight')}</span>
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className={`text-[10px] ${isArabic ? '-rotate-90' : ''}`}
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
      className="flex min-h-[calc(100svh-100px)] flex-col justify-center bg-surface-sand py-10 md:py-14"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Section Heading */}
        <div className="mb-6">
          <span className="mb-3 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            <span className="h-[2px] w-8 bg-brand-yellow" />
            {t('about.principles.eyebrow')}
          </span>

          <div
            dir="ltr"
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <h2
              dir={isArabic ? 'rtl' : 'ltr'}
              className="font-heading text-3xl font-extrabold uppercase leading-[1.15] text-brand-navy sm:text-4xl md:text-5xl"
            >
              <span>{t('about.principles.titleLine1')}</span>{' '}
              <span className="text-brand-blue">
                {t('about.principles.titleLine2')}
              </span>
            </h2>

            <p
              dir={isArabic ? 'rtl' : 'ltr'}
              className="max-w-md text-xs text-brand-navy/70 sm:text-sm leading-relaxed"
            >
              {t('about.principles.description')}
            </p>
          </div>
        </div>

        {/* Responsive Bento Grid (All screen sizes, single DOM) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:h-[540px] gap-4">
          {principles.map((p) => renderCard(p))}
        </div>
      </div>
    </section>
  );
}
