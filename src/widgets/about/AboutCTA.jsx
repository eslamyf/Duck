import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import ctaBg from '../../shared/assets/images/about/cta-bg.webp';

export default function AboutCTA() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-brand-navy py-16 sm:py-20">
      {/* Real Duck Background Image */}
      <motion.img
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          ease: 'easeOut',
        }}
        src={ctaBg}
        alt={t('about.cta.title')}
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_65%]"
      />

      {/* Dark Navy Overlay */}
      <div className="absolute inset-0 bg-brand-navy/75" />

      {/* Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/40 via-transparent to-brand-navy/80" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
      >
        {/* Eyebrow */}
        <span className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-yellow">
          <span className="h-[2px] w-8 bg-brand-blue" />
          {t('about.cta.eyebrow')}
          <span className="h-[2px] w-8 bg-brand-blue" />
        </span>

        {/* Heading */}
        <h2 className="font-heading text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl md:text-5xl">
          {t('about.cta.title')}
          <span className="text-brand-yellow">.</span>
        </h2>

        {/* Description - Concise */}
        <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-white/80">
          {t('about.cta.description')}
        </p>

        {/* Button */}
        <Link
          to={ROUTES.BOOKING}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand-yellow px-8 py-3.5 text-xs font-black uppercase text-brand-navy transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg sm:text-sm"
        >
          {t('about.cta.button')}

          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className={`
              text-sm
              transition-transform duration-300
              group-hover:translate-x-1
              group-hover:-translate-y-1
              ${isArabic ? '-rotate-90' : ''}
            `}
          />
        </Link>
      </motion.div>
    </section>
  );
}
