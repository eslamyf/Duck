import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCircleCheck,
  faClock,
  faShieldHalved,
  faCompass,
  faUsers,
  faWater,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';

import { ROUTES } from '../../shared/config/routes.js';
import { useTranslation } from '../../shared/i18n/index.js';

import kayakHeroImg from '../../shared/assets/images/trips/botanical-garden-960w.webp';
import kayakCardImg from '../../shared/assets/images/trips/kayak-free-960w.webp';
import waterbikeCardImg from '../../shared/assets/images/trips/waterbike-nile-960w.webp';
import supCardImg from '../../shared/assets/images/trips/sup-nile-960w.webp';
import nileTripsCardImg from '../../shared/assets/images/trips/slouga-ghazal-960w.webp';

const activities = [
  {
    id: 'kayak',
    slug: 'kayaking',
    title: { en: 'Kayaking', ar: 'كاياك' },
    description: {
      en: 'Explore the Nile at your own pace and enjoy an unforgettable kayaking experience.',
      ar: 'استكشف النيل على راحتك واستمتع بتجربة كاياك مميزة لا تُنسى.',
    },
    duration: { en: '60 Minutes', ar: '٦٠ دقيقة' },
    capacity: { en: 'Up to 20 people', ar: 'حتى ٢٠ شخصًا' },
    image: kayakCardImg,
  },
  {
    id: 'water-bike',
    slug: 'water-bike',
    title: { en: 'Water Bike', ar: 'دراجة مائية' },
    description: {
      en: 'Enjoy a fun and relaxing ride across the water with a unique water-bike adventure.',
      ar: 'استمتع برحلة ممتعة وهادئة فوق المياه مع مغامرة الدراجة المائية.',
    },
    duration: { en: '45 Minutes', ar: '٤٥ دقيقة' },
    capacity: { en: '2 people', ar: 'شخصان' },
    image: waterbikeCardImg,
  },
  {
    id: 'sup',
    slug: 'sup',
    title: { en: 'Stand Up Paddle', ar: 'ستاند أب بادل' },
    description: {
      en: 'Find your balance, enjoy the peaceful water, and discover a new way to paddle.',
      ar: 'حافظ على توازنك واستمتع بهدوء المياه واكتشف طريقة جديدة للتجديف.',
    },
    duration: { en: '60 Minutes', ar: '٦٠ دقيقة' },
    capacity: { en: '1 person', ar: 'شخص واحد' },
    image: supCardImg,
  },
  {
    id: 'nile-trips',
    slug: 'nile-tours',
    title: { en: 'Nile Trips', ar: 'رحلات نيلية' },
    description: {
      en: 'Enjoy the beauty of the Nile on a relaxing trip and take in the river views.',
      ar: 'استكشف سحر النيل والجزر المحيطة في جولات موجهة بالكاياك.',
    },
    duration: { en: 'Varies by trip', ar: 'حسب برنامج الرحلة' },
    capacity: { en: 'Varies by trip', ar: 'حسب نوع الرحلة' },
    image: nileTripsCardImg,
  },
];

const copy = {
  en: {
    eyebrow: 'WATER EXPERIENCES',
    heroTitle: 'Make a splash. Make memories.',
    heroDescription:
      'Discover exciting water activities, explore the water your way, and make every moment an unforgettable experience.',
    heroButton: 'Book Now',
    exploreButton: 'Explore Activities',
    heroImageAlt: 'Water adventure on the Nile',
    activitiesEyebrow: 'FIND YOUR ADVENTURE',
    activitiesTitle: 'Explore our activities',
    activitiesDescription:
      'From peaceful paddling to exciting water rides, there is an experience waiting for you.',
    duration: 'Duration',
    capacity: 'Capacity',
    cardDetailsButton: 'Details',
    cardBookButton: 'Book Now',
    standardsEyebrow: 'YOUR EXPERIENCE, OUR PRIORITY',
    standardsTitle: 'Standards & Inclusions',
    safetyTitle: 'Certified Safety Gear',
    safetyDesc: 'Certified life jackets and essential safety equipment.',
    leadersTitle: 'Trained Trip Leaders',
    leadersDesc: 'Experienced and professional guides throughout your experience.',
    beginnersTitle: 'Accessible to Beginners',
    beginnersDesc: 'No previous experience needed. We will guide you every step.',
    ctaEyebrow: 'BOOK YOUR ADVENTURE',
    ctaTitle: 'Ready to paddle the Nile?',
    ctaDescription:
      'Choose your favorite water experience and make unforgettable memories in Aswan.',
    ctaButton: 'Book Your Adventure',
    location: 'Aswan, Egypt',
  },

  ar: {
    eyebrow: 'تجارب مائية',
    heroTitle: 'انطلق في المياه واصنع ذكريات.',
    heroDescription:
      'اكتشف أنشطة مائية ممتعة، واستمتع بالمياه بطريقتك، واجعل كل لحظة تجربة لا تُنسى.',
    heroButton: 'احجز الآن',
    exploreButton: 'اكتشف الأنشطة',
    heroImageAlt: 'مغامرة مائية على النيل',
    activitiesEyebrow: 'اعثر على مغامرتك',
    activitiesTitle: 'اكتشف أنشطتنا',
    activitiesDescription:
      'من التجديف الهادئ إلى الرحلات المائية الممتعة، هناك تجربة تنتظرك.',
    duration: 'المدة',
    capacity: 'السعة',
    cardDetailsButton: 'التفاصيل',
    cardBookButton: 'احجز الآن',
    standardsEyebrow: 'تجربتك أولويتنا',
    standardsTitle: 'معايير السلامة والخدمات',
    safetyTitle: 'معدات سلامة معتمدة',
    safetyDesc: 'سترات نجاة معتمدة ومعدات أمان أساسية.',
    leadersTitle: 'قادة رحلات مدربون',
    leadersDesc: 'مرشدون محترفون وأصحاب خبرة طوال تجربتك.',
    beginnersTitle: 'مناسبة للمبتدئين',
    beginnersDesc: 'لا تحتاج إلى خبرة سابقة، سنرشدك في كل خطوة.',
    ctaEyebrow: 'احجز مغامرتك',
    ctaTitle: 'جاهز للتجديف في النيل؟',
    ctaDescription:
      'اختر تجربتك المائية المفضلة واصنع ذكريات لا تُنسى في أسوان.',
    ctaButton: 'احجز مغامرتك',
    location: 'أسوان، مصر',
  },
};

export default function PublicActivitiesPage() {
  const navigate = useNavigate();
  const { lang } = useTranslation();

  const language = lang === 'en' ? 'en' : 'ar';
  const isArabic = language === 'ar';
  const t = copy[language];
  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;

  const scrollToActivities = () => {
    document.getElementById('activities-list')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface-mist text-brand-navy"
    >
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src={kayakHeroImg}
            alt={t.heroImageAlt}
            className="h-full w-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/55 to-brand-navy/85" />
        </div>

        <div className="flex min-h-[340px] items-center justify-center px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold text-brand-yellow backdrop-blur-xs sm:text-sm">
              <FontAwesomeIcon icon={faWater} />
              <span>{t.eyebrow}</span>
            </div>

            <h1 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t.heroTitle}
            </h1>

            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white/85 sm:text-base sm:leading-7">
              {t.heroDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={ROUTES.BOOKING}
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3 text-sm font-extrabold text-brand-navy shadow-md transition hover:-translate-y-0.5 hover:bg-brand-yellow-hover sm:text-base"
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
                <span>{t.heroButton}</span>
              </Link>

              <button
                type="button"
                onClick={scrollToActivities}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/20 cursor-pointer sm:text-base"
              >
                <span>{t.exploreButton}</span>
                <FontAwesomeIcon icon={ArrowIcon} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section
        id="activities-list"
        className="scroll-mt-20 px-5 py-14 sm:px-8 lg:px-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
              {t.activitiesEyebrow}
            </p>

            <h2 className="font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl lg:text-5xl">
              {t.activitiesTitle}
            </h2>

            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-brand-navy/70">
              {t.activitiesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="group overflow-hidden rounded-[22px] border border-brand-blue/15 bg-surface-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-brand-blue/40 hover:shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-brand-navy">
                    <img
                      src={activity.image}
                      alt={activity.title[language]}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent" />
                    <h3 className="absolute bottom-4 start-4 end-4 font-heading text-2xl font-extrabold text-white">
                      {activity.title[language]}
                    </h3>
                  </div>

                  <div className="p-5">
                    <p className="min-h-[60px] text-xs sm:text-sm leading-6 text-brand-navy/75">
                      {activity.description[language]}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 border-y border-brand-navy/10 py-3 text-xs text-brand-navy/70">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faClock} className="text-brand-blue" />
                        <span>
                          {t.duration}: {activity.duration[language]}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faUsers} className="text-brand-blue" />
                        <span>
                          {t.capacity}: {activity.capacity[language]}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 flex items-center gap-2">
                  <Link
                    to={`${ROUTES.BOOKING}?activity=${activity.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-yellow px-4 py-3 text-xs sm:text-sm font-extrabold text-brand-navy shadow-xs transition hover:bg-brand-yellow-hover"
                  >
                    <span>{t.cardBookButton}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => navigate(`/activities/${activity.slug}`)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy px-4 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-brand-blue cursor-pointer"
                  >
                    <span>{t.cardDetailsButton}</span>
                    <FontAwesomeIcon icon={ArrowIcon} className="text-xs" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Standards & Inclusions */}
          <div className="mt-14 rounded-[24px] border border-brand-blue/15 bg-surface-white p-7 shadow-card sm:p-10">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
                {t.standardsEyebrow}
              </p>

              <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
                {t.standardsTitle}
              </h2>
            </div>

            <div className="grid gap-7 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue text-xl">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{t.safetyTitle}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-6 text-brand-navy/70">
                    {t.safetyDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow/35 text-brand-navy text-xl">
                  <FontAwesomeIcon icon={faCompass} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{t.leadersTitle}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-6 text-brand-navy/70">
                    {t.leadersDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue text-xl">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy">{t.beginnersTitle}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-6 text-brand-navy/70">
                    {t.beginnersDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Booking CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:px-16">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-cover bg-center px-8 py-12 text-white shadow-ocean sm:px-12 lg:py-16"
          style={{
            backgroundImage: `linear-gradient(rgba(12,18,38,.84), rgba(12,18,38,.88)), url(${kayakHeroImg})`,
          }}
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow">
                {t.ctaEyebrow}
              </p>
              <h2 className="max-w-2xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                {t.ctaTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-white/80">
                {t.ctaDescription}
              </p>
              <p className="mt-3 text-xs sm:text-sm font-bold text-brand-yellow">
                {t.location}
              </p>
            </div>

            <Link
              to={ROUTES.BOOKING}
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-brand-yellow px-7 py-3.5 text-sm sm:text-base font-extrabold text-brand-navy shadow-md transition hover:-translate-y-0.5 hover:bg-brand-yellow-hover"
            >
              <span>{t.ctaButton}</span>
              <FontAwesomeIcon icon={ArrowIcon} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
