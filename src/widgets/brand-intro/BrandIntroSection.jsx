import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faStar,
  faShieldHalved,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { Button } from '../../shared/ui/index.js';

// Visual Assets
import introImage from '../../shared/assets/images/image1.jpeg';
import adventureImage from '../../shared/assets/images/trips/gharb-adventure-960w.webp';
import communityImage from '../../shared/assets/images/about/community-1.webp';

export default function BrandIntroSection() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;

  // 3 Dynamic Experience Moods
  const vibes = [
    {
      id: 'sunset',
      emoji: '🌅',
      tabLabelAr: 'روقان وغروب',
      tabLabelEn: 'Sunset Serenity',
      taglineAr: 'هدوء النيل وانعكاس شمس الغروب الذهبية.. لحظات تفصلك عن زحمة الدنيا وتجدد سلامك الداخلي.',
      taglineEn: 'Calm waters and golden reflections that reset your mind and disconnect you from routine.',
      badgeAr: 'الأعلى تقييماً للاسترخاء 🌅',
      badgeEn: 'Top Rated for Relaxation 🌅',
      locationAr: 'أسوان · جولة الغروب النيلية',
      locationEn: 'Aswan · Sunset Nile Tour',
      image: introImage,
      altAr: 'مغامر كاياك يستمتع بالغروب على نيل أسوان',
      altEn: 'Kayaker enjoying golden hour on the Nile in Aswan',
    },
    {
      id: 'adventure',
      emoji: '⚡',
      tabLabelAr: 'تحدي ومغامرة',
      tabLabelEn: 'Pure Adventure',
      taglineAr: 'تجديف نشط وسط صخور الجزر وممرات المياه الطبيعية.. طاقة ولياقة بتشحنك بالحيوية.',
      taglineEn: 'Active paddling across granite islands and raw currents to ignite your stamina.',
      badgeAr: 'المغامرة الأكثر طلباً ⚡',
      badgeEn: 'Most Demanded Adventure ⚡',
      locationAr: 'غرب سهيل · جزر الشلال الأول',
      locationEn: 'Gharb Soheil · Cataract Islands',
      image: adventureImage,
      altAr: 'مجموعة كاياك في مغامرة نيلية',
      altEn: 'Group kayaking adventure on the river',
    },
    {
      id: 'community',
      emoji: '💛',
      tabLabelAr: 'لِمّة وصحبة',
      tabLabelEn: 'Friends & Family',
      taglineAr: 'ضحكات بتعلى فوق المية وذكريات حقيقية بتتخلد في ألبوم العمر مع الناس اللي بتحبهم.',
      taglineEn: 'Laughter floating over the water and unforgettable memories shared with loved ones.',
      badgeAr: 'مثالي للمجموعات والعائلات ❤️',
      badgeEn: 'Perfect for Groups & Families ❤️',
      locationAr: 'الجيزة · كوبري عباس والجزيرة',
      locationEn: 'Giza · Abbas Bridge & Island',
      image: communityImage,
      altAr: 'أصدقاء وعائلات يشاركون تجربة DUCK',
      altEn: 'Friends and families enjoying DUCK together',
    },
  ];

  const [activeVibeId, setActiveVibeId] = useState('sunset');
  const activeVibe = vibes.find((v) => v.id === activeVibeId) || vibes[0];

  return (
    <section
      id="brand-intro"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="brand-intro-heading"
      className="relative overflow-hidden bg-gradient-to-b from-white via-surface-mist/30 to-white py-14 sm:py-20 lg:py-24 px-[5vw] min-[901px]:px-[6vw] font-body border-b border-brand-blue/10"
    >
      {/* Ambient River Glow & Water Contour Ripples */}
      <div
        className="absolute top-10 -start-28 w-96 h-96 rounded-full bg-brand-yellow/12 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -end-28 w-96 h-96 rounded-full bg-brand-blue/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none text-brand-navy"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M-100 200 C 200 150, 400 350, 700 220 C 900 120, 1100 300, 1300 240" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M-100 350 C 150 400, 500 250, 800 420 C 1000 500, 1200 320, 1300 380" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="relative max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 min-[901px]:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Story & Interactive Selector Column */}
          <div className="min-[901px]:col-span-7 flex flex-col items-start z-10">
            {/* Live Trust Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-navy/5 border border-brand-navy/10 px-3.5 py-1.5 text-xs font-bold text-brand-navy backdrop-blur-xs mb-4 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue" />
              </span>
              <span lang="en" dir="ltr" className="tracking-wider font-extrabold uppercase text-[11px]">
                {t('brandIntro.badge', 'IN DUCK WE TRUST')}
              </span>
              <span className="w-1 h-1 rounded-full bg-brand-navy/30" />
              <span className="text-brand-blue font-extrabold">
                {isArabic ? 'حكايات نيلية حقيقية' : 'Authentic Nile Stories'}
              </span>
            </div>

            {/* Creative Headline */}
            <h2
              id="brand-intro-heading"
              className="text-2xl sm:text-3xl min-[901px]:text-4xl lg:text-[42px] font-heading font-extrabold leading-[1.25] text-brand-navy tracking-tight mb-4"
            >
              {isArabic ? (
                <>
                  مش مجرد خروجة عادية..{' '}
                  <span className="relative inline-block text-brand-blue">
                    دي حكاية جديدة
                    <svg
                      className="absolute -bottom-1.5 start-0 w-full h-2.5 text-brand-yellow pointer-events-none"
                      viewBox="0 0 100 12"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 6C20 1 40 11 60 4C80 -3 95 10 100 6"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{' '}
                  هتعيشها على النيل.
                </>
              ) : (
                t('brandIntro.title')
              )}
            </h2>

            {/* Narrative Paragraph */}
            <p className="text-xs sm:text-sm min-[901px]:text-base leading-relaxed text-brand-navy/80 max-w-[62ch] mb-5">
              {t('brandIntro.description')}
            </p>

            {/* Interactive Vibe Switcher Tabs */}
            <div className="w-full mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/60 block mb-2">
                {isArabic ? '✨ اختار أجواء تجربتك واستكشف المشهد:' : '✨ Choose your vibe and preview the moment:'}
              </span>
              <div className="inline-flex flex-wrap gap-2 p-1.5 rounded-2xl bg-surface-mist/80 border border-black/8 shadow-inner">
                {vibes.map((vibe) => {
                  const isActive = vibe.id === activeVibeId;
                  return (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setActiveVibeId(vibe.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-brand-navy text-brand-yellow shadow-md scale-102 font-extrabold'
                          : 'text-brand-navy/70 hover:text-brand-navy hover:bg-white/80'
                      }`}
                    >
                      <span className="text-sm">{vibe.emoji}</span>
                      <span>{isArabic ? vibe.tabLabelAr : vibe.tabLabelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Quote for Selected Vibe */}
            <div className="w-full relative rounded-2xl bg-white/90 border border-brand-blue/15 p-3.5 sm:p-4 shadow-sm mb-6 transition-all duration-300">
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl text-brand-yellow shrink-0 leading-none">❝</span>
                <p className="text-xs sm:text-sm font-bold text-brand-navy leading-relaxed">
                  {isArabic ? activeVibe.taglineAr : activeVibe.taglineEn}
                </p>
              </div>
            </div>

            {/* 3 Creative Feature Bento Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mb-7">
              <div className="rounded-2xl border border-black/8 bg-white/70 backdrop-blur-xs p-3 transition duration-200 hover:shadow-md hover:border-brand-blue/30 group">
                <span className="text-lg block mb-1 group-hover:scale-110 transition-transform">🌊</span>
                <h3 className="font-heading font-extrabold text-xs text-brand-navy mb-0.5">
                  {isArabic ? 'حرية وانطلاق' : 'Pure Freedom'}
                </h3>
                <p className="text-[11px] text-brand-navy/60 leading-tight">
                  {isArabic ? 'مسارات مائية آمنة' : 'Safe open waters'}
                </p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/70 backdrop-blur-xs p-3 transition duration-200 hover:shadow-md hover:border-brand-blue/30 group">
                <span className="text-lg block mb-1 group-hover:scale-110 transition-transform">🛶</span>
                <h3 className="font-heading font-extrabold text-xs text-brand-navy mb-0.5">
                  {isArabic ? 'أسطول متكامل' : 'Top Gear'}
                </h3>
                <p className="text-[11px] text-brand-navy/60 leading-tight">
                  {isArabic ? 'كاياك، SUP وبادلبورد' : 'Kayak, SUP & Bikes'}
                </p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/70 backdrop-blur-xs p-3 transition duration-200 hover:shadow-md hover:border-brand-blue/30 group">
                <span className="text-lg block mb-1 group-hover:scale-110 transition-transform">📍</span>
                <h3 className="font-heading font-extrabold text-xs text-brand-navy mb-0.5">
                  {isArabic ? 'وجهات ساحرة' : 'Iconic Spots'}
                </h3>
                <p className="text-[11px] text-brand-navy/60 leading-tight">
                  {isArabic ? 'أسوان، الجيزة وسيوة' : 'Aswan, Giza & Siwa'}
                </p>
              </div>
            </div>

            {/* Dual Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
              <Button
                as={Link}
                to={ROUTES.BOOKING}
                variant="secondary"
                size="md"
                icon={<FontAwesomeIcon icon={ArrowIcon} className="text-sm" />}
                iconPosition="end"
                className="font-extrabold shadow-card hover:scale-102 transition-transform px-6 py-3"
              >
                {isArabic ? 'احجز تجربتك الآن' : 'Book Your Experience'}
              </Button>

              <Link
                to={ROUTES.ABOUT}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-navy hover:text-brand-blue transition-colors px-3 py-2 cursor-pointer group"
              >
                <span>{t('brandIntro.cta', 'اكتشف حكاية DUCK الكاملة')}</span>
                <FontAwesomeIcon
                  icon={ArrowIcon}
                  className="text-xs group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[-3px] ltr:group-hover:translate-x-[3px] transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Visual Showcase: Layered Dynamic Canvas */}
          <div className="min-[901px]:col-span-5 relative mt-4 min-[901px]:mt-0">
            {/* Visual Ambient Frame */}
            <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden border-2 border-brand-blue/20 bg-brand-navy shadow-2xl aspect-[4/3] sm:aspect-[16/12] group">
              <img
                key={activeVibe.id}
                src={activeVibe.image}
                alt={isArabic ? activeVibe.altAr : activeVibe.altEn}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-[center_45%] transition-all duration-700 group-hover:scale-105 animate-in fade-in zoom-in-95 duration-500"
              />

              {/* Dynamic Gradient Scrim */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Top Floating Glassmorphic Social Proof Badge */}
              <div className="absolute top-4 sm:top-5 end-4 sm:end-5 backdrop-blur-md bg-white/90 border border-white/60 shadow-xl rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300 pointer-events-none">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-black">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div>
                  <div className="flex items-center gap-1 leading-none">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-brand-navy">5.0</span>
                    <span className="text-[10px] text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-brand-navy/70 font-semibold block mt-0.5">
                    {isArabic ? '+15,000 مغامر سعيد' : '+15,000 Happy Guests'}
                  </span>
                </div>
              </div>

              {/* Mood Tag & Location Bar Inside Image */}
              <div className="absolute bottom-4 sm:bottom-6 start-4 sm:start-6 end-4 sm:end-6 flex flex-wrap items-center justify-between gap-2">
                <span className="backdrop-blur-md bg-brand-navy/85 border border-white/20 text-brand-yellow font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <FontAwesomeIcon icon={faLocationDot} className="text-brand-yellow text-xs" />
                  <span>{isArabic ? activeVibe.locationAr : activeVibe.locationEn}</span>
                </span>

                <span className="backdrop-blur-md bg-white/20 border border-white/30 text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-xs">
                  {isArabic ? activeVibe.badgeAr : activeVibe.badgeEn}
                </span>
              </div>
            </div>

            {/* Bottom Overlapping Certified Safety Card */}
            <div className="relative min-[901px]:absolute -bottom-4 min-[901px]:-bottom-6 start-2 sm:start-4 end-auto backdrop-blur-md bg-brand-navy/95 border border-white/15 text-white shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3.5 max-w-sm mt-3 min-[901px]:mt-0 transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 text-brand-yellow flex items-center justify-center text-base shrink-0 shadow-inner">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <div className="leading-snug">
                <span className="text-xs font-heading font-extrabold text-brand-yellow block">
                  {isArabic ? 'أمان واحترافية معتمدة 100%' : '100% Certified Safety'}
                </span>
                <span className="text-[11px] text-white/75 block">
                  {isArabic
                    ? 'سترات نجاة مطابقة للمواصفات ومدربون مرافقون طوال الرحلة'
                    : 'ISO lifejackets and certified instructors on every trip'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
