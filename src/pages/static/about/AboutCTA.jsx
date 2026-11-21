import { motion } from 'framer-motion';

import { useTranslation } from '../../../shared/i18n/index.js';

import { ArrowUpRight } from 'lucide-react';

export default function AboutCTA() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      className="relative flex min-h-[550px] items-center justify-center overflow-hidden bg-[#121528] py-20 sm:py-24 md:min-h-[600px]"
    >

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
      <div className="absolute inset-0 bg-[#121528]/65" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121528]/30 via-transparent to-[#121528]/70" />

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
        <span className="mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#F5E847]">
          <span className="h-[2px] w-8 bg-[#067BA1]" />

          {t('about.cta.eyebrow')}

          <span className="h-[2px] w-8 bg-[#067BA1]" />
        </span>

        {/* Heading */}
        <h2 className="font-heading text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
          {t('about.cta.title')}
          <span className="text-[#F5E847]">.</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/75 sm:mt-7 sm:text-base md:text-lg">
          {t('about.cta.description')}
        </p>

        {/* Button */}
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#F5E847] px-7 py-3.5 text-xs font-extrabold uppercase text-[#121528] transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:mt-10 sm:px-8 sm:py-4 sm:text-sm"
        >
          {t('about.cta.button')}

          <ArrowUpRight
            size={19}
            className={`
              transition-transform duration-300
              group-hover:translate-x-1
              group-hover:-translate-y-1
              ${isArabic ? '-rotate-90' : ''}
            `}
          />
        </a>

      </motion.div>
    </section>
  );
}