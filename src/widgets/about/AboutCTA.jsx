import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { SECTIONS, sectionLink } from '../../shared/config/routes.js';

export default function AboutCTA() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section className="relative flex min-h-[550px] items-center justify-center overflow-hidden bg-brand-navy py-20 sm:py-24 md:min-h-[600px]">
      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          ease: 'easeOut',
        }}
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=90"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-brand-navy/65" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/30 via-transparent to-brand-navy/70" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        {/* Eyebrow */}
        <span className="mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-yellow">
          <span className="h-[2px] w-8 bg-brand-blue" />
          {t('about.cta.eyebrow')}
          <span className="h-[2px] w-8 bg-brand-blue" />
        </span>

        {/* Heading */}
        <h2 className="font-heading text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
          {t('about.cta.title')}
          <span className="text-brand-yellow">.</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/75 sm:mt-7 sm:text-base md:text-lg">
          {t('about.cta.description')}
        </p>

        {/* Button */}
        <Link
          to={sectionLink(SECTIONS.TRIPS)}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand-yellow px-7 py-3.5 text-xs font-extrabold uppercase text-brand-navy transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:mt-10 sm:px-8 sm:py-4 sm:text-sm"
        >
          {t('about.cta.button')}

          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className={`
              text-base
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
