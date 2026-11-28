import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../shared/i18n/index.js';
import DuckIcon from '../../shared/ui/Icon/DuckIcon.jsx';
import missionImage from '../../shared/assets/images/about/mission-vision.webp';

export default function AboutMissionVision() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const [activePillar, setActivePillar] = useState('goal');

  const pillars = [
    {
      id: 'goal',
      icon: 'faCompass',
      tag: isArabic ? 'هدف الشركة' : 'OUR CORE GOAL',
      title: isArabic
        ? 'نعيّشك النيل والبحر.. مش بس تتفرج عليهم'
        : 'Experience the Water, Not Just the View',
      description: isArabic
        ? 'هدفنا الأساسي في DUCK هو بناء ثقافة الترفيه المائي الآمن والمنظم في مصر؛ نخلي أي شخص — سواء مبتدئ أو محترف، لوحده أو مع شلته — يقدر ينزل الميه بثقة، يكتشف أماكن جديدة، ويخرج بتجربة حقيقية يستحق يحكيها.'
        : 'Our core goal at DUCK is to build a safe, organized water-adventure culture across Egypt — empowering anyone, from first-timers to explorers, to hit the water with confidence and leave with unforgettable stories.',
      highlight: isArabic ? 'تجربة حقيقية + أمان 100%' : 'Real Experience + 100% Safety',
    },
    {
      id: 'mission',
      icon: 'faWater',
      tag: isArabic ? 'رسالتنا' : 'OUR MISSION',
      title: t('about.missionVision.missionTitle'),
      description: t('about.missionVision.missionDescription'),
      highlight: isArabic ? 'معدات معتمدة ومرشدون محترفون' : 'Certified Gear & Pro Guides',
    },
    {
      id: 'vision',
      icon: 'faStar',
      tag: isArabic ? 'رؤيتنا' : 'OUR VISION',
      title: t('about.missionVision.visionTitle'),
      description: t('about.missionVision.visionDescription'),
      highlight: isArabic ? 'الوجهة الأولى للأنشطة المائية' : 'Egypt’s #1 Water Hub',
    },
  ];

  const currentPillar = pillars.find((p) => p.id === activePillar) || pillars[0];

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative overflow-hidden bg-surface-sand py-14 md:py-20 text-brand-navy"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16 space-y-10">
        {/* Non-Traditional Company Goal Manifesto Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-brand-navy bg-pattern-waves-dark p-7 sm:p-10 text-white shadow-ocean border border-brand-blue/25"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/15 border border-brand-yellow/35 px-3.5 py-1 text-xs font-extrabold tracking-wider text-brand-yellow">
                <DuckIcon icon="faCompass" />
                <span>{isArabic ? 'لماذا تأسست DUCK؟ — هدفنا' : 'WHY DUCK EXISTS — OUR GOAL'}</span>
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black leading-snug text-white">
                {isArabic
                  ? 'تحويل النيل والبحر من مجرد مشهد عابر.. لتجربة حياة آمنة وممتعة للجميع.'
                  : 'Turning Egypt’s Nile and sea from a passing view into a safe, unforgettable way of life.'}
              </h2>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-bold text-brand-yellow backdrop-blur-xs">
                <DuckIcon icon="faShieldHalved" />
                <span>{isArabic ? 'أمان دولي 100%' : '100% Certified Safety'}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs">
                <DuckIcon icon="faLocationDot" className="text-brand-yellow" />
                <span>{isArabic ? 'وجهات مصر المائية' : 'Across Egypt’s Waters'}</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Asymmetric Interactive Goal / Mission / Vision Stage */}
        <div
          dir="ltr"
          className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
        >
          {/* Floating Visual Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:col-span-5 relative h-[340px] overflow-hidden rounded-[28px] shadow-xl sm:h-[420px] lg:h-[480px] group ${
              isArabic ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <img
              src={missionImage}
              alt={t('about.missionVision.imageAlt')}
              className="h-full w-full object-cover object-[center_62%] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              decoding="async"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/15 to-transparent" />

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute bottom-5 rounded-2xl border border-white/25 bg-brand-navy/80 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md shadow-lg ${
                isArabic ? 'right-5 text-right' : 'left-5 text-left'
              }`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <span className="block text-[10px] font-extrabold text-brand-yellow uppercase tracking-wider">
                {currentPillar.tag}
              </span>
              <span>{currentPillar.highlight}</span>
            </motion.div>
          </motion.div>

          {/* Interactive Pillar Switcher + Animated Card */}
          <motion.div
            dir={isArabic ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:col-span-7 space-y-5 ${
              isArabic
                ? 'text-right lg:order-1'
                : 'text-left lg:order-2'
            }`}
          >
            {/* Interactive Pillar Pills */}
            <div className="flex flex-wrap gap-2.5" role="tablist" aria-label={t('about.missionVision.eyebrow')}>
              {pillars.map((pillar) => {
                const isSelected = pillar.id === activePillar;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActivePillar(pillar.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-navy text-brand-yellow shadow-md scale-[1.03]'
                        : 'bg-white text-brand-navy/75 border border-brand-blue/20 hover:border-brand-blue hover:text-brand-navy'
                    }`}
                  >
                    <DuckIcon icon={pillar.icon} />
                    <span>{pillar.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Animated Active Pillar Card */}
            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPillar.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[26px] border border-brand-blue/20 bg-white p-6 sm:p-8 shadow-card"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-brand-blue">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-yellow ring-4 ring-brand-yellow/25" />
                      {currentPillar.tag}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-brand-yellow text-base">
                      <DuckIcon icon={currentPillar.icon} />
                    </span>
                  </div>

                  <h3 className="mb-3 font-heading text-2xl sm:text-3xl font-black text-brand-navy leading-snug">
                    {currentPillar.title}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-brand-navy/75">
                    {currentPillar.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Note */}
            <div className="flex items-center gap-3 pt-1 text-xs font-bold text-brand-blue">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
              <span>{t('about.missionVision.note')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
