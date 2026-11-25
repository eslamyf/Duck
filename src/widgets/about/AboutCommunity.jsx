import { useState } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { AnimatePresence, motion } from 'framer-motion';

import imgComm1 from '../../shared/assets/images/about/community-1.webp';
import imgComm2 from '../../shared/assets/images/about/community-2.webp';
import imgComm3 from '../../shared/assets/images/about/community-3.webp';
import imgComm4 from '../../shared/assets/images/about/community-4.webp';

const communityImages = [
  {
    key: 'one',
    image: imgComm1,
    titleKey: 'one',
  },
  {
    key: 'two',
    image: imgComm2,
    titleKey: 'two',
  },
  {
    key: 'three',
    image: imgComm3,
    titleKey: 'three',
  },
  {
    key: 'four',
    image: imgComm4,
    titleKey: 'four',
  },
];

export default function AboutCommunity() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = communityImages[activeIndex];

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="bg-surface-sand py-12 md:py-16 text-brand-navy"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16 flex flex-col gap-6">
        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              <span className="h-[2px] w-8 bg-brand-yellow" />
              {t('about.community.eyebrow')}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-brand-navy">
              {t('about.community.title')}
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-brand-navy/70 leading-relaxed">
            {t('about.community.description')}
          </p>
        </div>

        {/* Main Interactive Stage */}
        <div className="relative h-[360px] sm:h-[440px] md:h-[500px] w-full overflow-hidden rounded-3xl shadow-xl bg-brand-navy">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeItem.key}
              src={activeItem.image}
              alt={t(`about.community.gallery.${activeItem.titleKey}`, 'مجتمع DUCK')}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />

          {/* Bottom Captions */}
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-yellow mb-1.5">
                {t('about.community.imageLabel')}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                {t(`about.community.gallery.${activeItem.titleKey}`, t('about.community.headline'))}
              </h3>
            </div>

            {/* Quick Indicator */}
            <span className="font-mono text-sm font-black text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs self-start sm:self-auto">
              0{activeIndex + 1} / 0{communityImages.length}
            </span>
          </div>
        </div>

        {/* 4 Interactive Thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {communityImages.map((item, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative h-24 sm:h-28 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer text-start ${
                  isSelected
                    ? 'border-brand-navy shadow-md ring-2 ring-brand-yellow scale-[1.02]'
                    : 'border-black/10 hover:border-brand-blue/50 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={item.image}
                  alt={t(`about.community.gallery.${item.titleKey}`)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
                <div className={`absolute inset-0 transition-colors ${
                  isSelected ? 'bg-transparent' : 'bg-black/25 group-hover:bg-transparent'
                }`} />

                <span className="absolute bottom-2 start-2 font-mono text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  0{index + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
