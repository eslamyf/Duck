import { useState } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { AnimatePresence, motion } from 'framer-motion';

const communityImages = [
  {
    key: 'main',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=90',
  },
  {
    key: 'one',
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=85',
  },
  {
    key: 'two',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
  },
  {
    key: 'three',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85',
  },
];

export default function AboutCommunity() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = communityImages[activeIndex];

  const thumbnails = communityImages
    .map((item, index) => ({
      ...item,
      originalIndex: index,
    }))
    .filter((item) => item.originalIndex !== activeIndex);

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="h-[calc(100svh-100px)] min-h-[560px] overflow-hidden bg-surface-sand px-4 py-20 sm:px-6 md:px-10 md:py-20"
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        {/* Main Image */}
        <div className="group relative min-h-0 flex-1 overflow-hidden rounded-[24px] md:rounded-[30px]">
          {/* Animated Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage.key}
              src={activeImage.image}
              alt={
                activeIndex === 0
                  ? t('about.community.mainImageAlt')
                  : t(`about.community.gallery.${activeImage.key}`)
              }
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{
                duration: 0.45,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/35 to-brand-navy/10" />

          {/* Main Content */}
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 md:p-12 lg:p-14"
          >
            {/* Image Label */}
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.25em] text-brand-yellow sm:text-xs">
              {t('about.community.imageLabel')}
            </span>

            {/* Headline */}
            <h2 className="mb-3 max-w-3xl font-heading text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
              {t('about.community.headline')}
            </h2>

            {/* Description */}
            <p className="max-w-2xl text-xs leading-6 text-white/80 sm:text-sm sm:leading-7 md:text-base">
              {t('about.community.description')}
            </p>
          </div>

          {/* Image Number */}
          <span
            className={`
              absolute top-5 text-5xl font-extrabold text-white/30
              sm:top-7 sm:text-6xl md:top-9 md:text-7xl
              ${isArabic
                ? 'left-6 md:left-10'
                : 'right-6 md:right-10'
              }
            `}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Interactive Gallery */}
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          className="mt-3 grid h-[clamp(95px,17vh,145px)] shrink-0 grid-cols-3 gap-3 sm:mt-4 sm:gap-4"
        >
          {thumbnails.map((item) => (
            <motion.button
              key={item.key}
              type="button"
              layout
              onClick={() => setActiveIndex(item.originalIndex)}
              aria-label={t(
                `about.community.gallery.${item.key}`
              )}
              className="group relative min-h-0 overflow-hidden rounded-[16px] border-2 border-transparent transition-colors duration-300 hover:border-brand-yellow focus-visible:border-brand-yellow focus-visible:outline-none sm:rounded-[20px]"
            >
              {/* Thumbnail Image */}
              <img
                src={item.image}
                alt={t(
                  `about.community.gallery.${item.key}`
                )}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Thumbnail Overlay */}
              <div className="absolute inset-0 bg-brand-navy/15 transition-colors duration-300 group-hover:bg-transparent" />

              {/* Thumbnail Number */}
              <span className="absolute bottom-2 left-3 text-xl font-extrabold text-white/70 sm:bottom-3 sm:left-4 sm:text-2xl">
                {String(item.originalIndex + 1).padStart(2, '0')}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
