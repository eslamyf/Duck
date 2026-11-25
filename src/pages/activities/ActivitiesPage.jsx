import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes.js';
import {
  ArrowUpLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
  Waves,
} from 'lucide-react';
import { useTranslation } from '../../shared/i18n/useTranslation.js';

const heroImage =
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=90';

const activities = [
  {
    id: 'kayak',
    title: { en: 'Kayaking', ar: 'كاياك' },
    description: {
      en: 'Explore the Nile at your own pace and enjoy an unforgettable kayaking experience.',
      ar: 'استكشف النيل على راحتك واستمتع بتجربة كاياك مميزة لا تُنسى.',
    },
    duration: { en: '60 Minutes', ar: '٦٠ دقيقة' },
    capacity: { en: 'Up to 20 people', ar: 'حتى ٢٠ شخصًا' },
    image:
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'water-bike',
    title: { en: 'Water Bike', ar: 'دراجة مائية' },
    description: {
      en: 'Enjoy a fun and relaxing ride across the water with a unique water-bike adventure.',
      ar: 'استمتع برحلة ممتعة وهادئة فوق المياه مع مغامرة الدراجة المائية.',
    },
    duration: { en: '45 Minutes', ar: '٤٥ دقيقة' },
    capacity: { en: '2 people', ar: 'شخصان' },
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'sup',
    title: { en: 'Stand Up Paddle', ar: 'ستاند أب بادل' },
    description: {
      en: 'Find your balance, enjoy the peaceful water, and discover a new way to paddle.',
      ar: 'حافظ على توازنك واستمتع بهدوء المياه واكتشف طريقة جديدة للتجديف.',
    },
    duration: { en: '60 Minutes', ar: '٦٠ دقيقة' },
    capacity: { en: '1 person', ar: 'شخص واحد' },
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'nile-trips',
    title: { en: 'Nile Trips', ar: 'رحلات نيلية' },
    description: {
      en: 'Enjoy the beauty of the Nile on a relaxing trip and take in the river views.',
      ar: 'استمتع بجمال النيل في رحلة هادئة وتأمل المناظر الساحرة على ضفافه.',
    },
    duration: { en: 'Varies by trip', ar: 'حسب برنامج الرحلة' },
    capacity: { en: 'Varies by trip', ar: 'حسب نوع الرحلة' },
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',
  },
];

const copy = {
  en: {
    eyebrow: 'WATER EXPERIENCES',
    heroTitle: 'Make a splash. Make memories.',
    heroDescription:
      'Discover exciting water activities, explore the water your way, and make every moment an unforgettable experience.',
    heroButton: 'Explore Activities',
    heroImageAlt: 'Water adventure on the Nile',
    activitiesEyebrow: 'FIND YOUR ADVENTURE',
    activitiesTitle: 'Explore our activities',
    activitiesDescription:
      'From peaceful paddling to exciting water rides, there is an experience waiting for you.',
    duration: 'Duration',
    capacity: 'Capacity',
    cardButton: 'Explore Activity',
    standardsEyebrow: 'YOUR EXPERIENCE, OUR PRIORITY',
    standardsTitle: 'Standards & Inclusions',
    safetyTitle: 'Certified Safety Gear',
    safetyDesc: 'Certified life jackets and essential safety equipment.',
    leadersTitle: 'Trained Trip Leaders',
    leadersDesc:
      'Experienced and professional guides throughout your experience.',
    beginnersTitle: 'Accessible to Beginners',
    beginnersDesc:
      'No previous experience needed. We will guide you every step.',
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
    heroButton: 'اكتشف الأنشطة',
    heroImageAlt: 'مغامرة مائية على النيل',
    activitiesEyebrow: 'اعثر على مغامرتك',
    activitiesTitle: 'اكتشف أنشطتنا',
    activitiesDescription:
      'من التجديف الهادئ إلى الرحلات المائية الممتعة، هناك تجربة تنتظرك.',
    duration: 'المدة',
    capacity: 'السعة',
    cardButton: 'اكتشف النشاط',
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

  const scrollToActivities = () => {
    document.getElementById('activities-list')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

const handleActivityDetails = (activityId) => {
  const activitySlugs = {
    kayak: 'kayaking',
    'water-bike': 'water-bike',
    sup: 'sup',
    'nile-trips': 'nile-tours',
  };

  const slug = activitySlugs[activityId];

  if (slug) {
    navigate(`/${language}/activities/${slug}`);
  }
};

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F7F9FC] text-[#0C1226]"
    >
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#F7F9FC]">
        {/* Clear Hero Image - No Overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt={t.heroImageAlt}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Centered Hero Content */}
        <div className="flex h-[40vh] min-h-[300px] items-center justify-center px-5 py-6 sm:px-8 lg:px-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            {/* Eyebrow */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold text-[#147D9F] shadow-sm sm:text-sm">
              <Waves size={14} />
              {t.eyebrow}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black leading-tight text-[#0C1226] sm:text-4xl lg:text-5xl">
              {t.heroTitle}
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#0C1226] sm:text-base sm:leading-7">
              {t.heroDescription}
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={scrollToActivities}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FDFB45] px-6 py-3 text-sm font-bold text-[#0C1226] shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:text-base"
            >
              {t.heroButton}
              {isArabic ? (
                <ArrowUpLeft size={18} />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section
        id="activities-list"
        className="scroll-mt-20 px-5 py-16 sm:px-8 lg:px-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#147D9F]">
              {t.activitiesEyebrow}
            </p>

            <h2 className="text-4xl font-black text-[#0C1226] sm:text-5xl">
              {t.activitiesTitle}
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-slate-600">
              {t.activitiesDescription}
            </p>
          </div>

          {/* Activity Cards */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#20C5D8]/60 hover:shadow-xl"
              >
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title[language]}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1226]/80 via-transparent to-transparent" />

                  <h3
                    className={`absolute bottom-5 ${
                      isArabic ? 'right-5 left-5' : 'left-5 right-5'
                    } text-3xl font-black text-white`}
                  >
                    {activity.title[language]}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="min-h-[72px] text-sm leading-6 text-slate-600">
                    {activity.description[language]}
                  </p>

                  {/* Activity Details */}
                  <div className="mt-6 flex flex-wrap gap-4 border-y border-slate-200 py-4 text-xs text-slate-600">
                    <span className="flex items-center gap-2">
                      <Clock3 size={15} className="text-[#147D9F]" />
                      <span>
                        {t.duration}: {activity.duration[language]}
                      </span>
                    </span>

                    <span className="flex items-center gap-2">
                      <Users size={15} className="text-[#147D9F]" />
                      <span>
                        {t.capacity}: {activity.capacity[language]}
                      </span>
                    </span>
                  </div>

                  {/* Explore Button */}
                  <button
                    type="button"
                    onClick={() => handleActivityDetails(activity.id)}
                    className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#147D9F] px-5 py-4 font-bold text-white transition hover:bg-[#1896BD]"
                  >
                    <span>{t.cardButton}</span>

                    {isArabic ? (
                      <ArrowUpLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Standards & Inclusions */}
          <div className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#147D9F]">
                {t.standardsEyebrow}
              </p>

              <h2 className="text-3xl font-black text-[#0C1226] sm:text-4xl">
                {t.standardsTitle}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Safety Gear */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#20C5D8]/10 text-[#147D9F]">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <h3 className="font-extrabold text-[#0C1226]">
                    {t.safetyTitle}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t.safetyDesc}
                  </p>
                </div>
              </div>

              {/* Trip Leaders */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FDFB45]/30 text-[#0C1226]">
                  <Sparkles size={28} />
                </div>

                <div>
                  <h3 className="font-extrabold text-[#0C1226]">
                    {t.leadersTitle}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t.leadersDesc}
                  </p>
                </div>
              </div>

              {/* Beginners */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#20C5D8]/10 text-[#147D9F]">
                  <CheckCircle2 size={28} />
                </div>

                <div>
                  <h3 className="font-extrabold text-[#0C1226]">
                    {t.beginnersTitle}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t.beginnersDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-16">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-cover bg-center px-8 py-14 text-white sm:px-14 lg:py-20"
          style={{
            backgroundImage: `linear-gradient(rgba(12,18,38,.84), rgba(12,18,38,.88)), url(${heroImage})`,
          }}
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#FDFB45]">
                {t.ctaEyebrow}
              </p>

              <h2 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                {t.ctaTitle}
              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-white/75">
                {t.ctaDescription}
              </p>

              <p className="mt-4 text-sm font-semibold text-[#20C5D8]">
                {t.location}
              </p>
            </div>

           <Link
  to={ROUTES.BOOKING}
  className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#FDFB45] px-7 py-4 font-bold text-[#0C1226] transition hover:-translate-y-1"
>
  {t.ctaButton}

  {isArabic ? (
    <ArrowUpLeft size={20} />
  ) : (
    <ArrowUpRight size={20} />
  )}
</Link>
          </div>
        </div>
      </section>
    </main>
  );
}