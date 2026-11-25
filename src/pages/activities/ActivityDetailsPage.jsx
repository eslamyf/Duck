import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Users,
  ShieldCheck,
  CheckCircle2,
  Waves,
} from 'lucide-react';
import { useTranslation } from '../../shared/i18n/useTranslation.js';

const activitiesData = {
  kayaking: {
    id: 'kayak',
    title: {
      ar: 'كاياك',
      en: 'Kayaking',
    },
    description: {
      ar: 'استكشف النيل على راحتك واستمتع بتجربة كاياك مميزة لا تُنسى.',
      en: 'Explore the Nile at your own pace and enjoy an unforgettable kayaking experience.',
    },
    duration: {
      ar: '٦٠ دقيقة',
      en: '60 Minutes',
    },
    capacity: {
      ar: 'حتى ٢٠ شخصًا',
      en: 'Up to 20 people',
    },
    image:
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1600&q=85',
  },

  'water-bike': {
    id: 'water-bike',
    title: {
      ar: 'دراجة مائية',
      en: 'Water Bike',
    },
    description: {
      ar: 'استمتع برحلة ممتعة وهادئة فوق المياه مع مغامرة الدراجة المائية.',
      en: 'Enjoy a fun and relaxing ride across the water with a unique water-bike adventure.',
    },
    duration: {
      ar: '٤٥ دقيقة',
      en: '45 Minutes',
    },
    capacity: {
      ar: 'شخصان',
      en: '2 people',
    },
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
  },

  sup: {
    id: 'sup',
    title: {
      ar: 'ستاند أب بادل',
      en: 'Stand Up Paddle',
    },
    description: {
      ar: 'حافظ على توازنك واستمتع بهدوء المياه واكتشف طريقة جديدة للتجديف.',
      en: 'Find your balance, enjoy the peaceful water, and discover a new way to paddle.',
    },
    duration: {
      ar: '٦٠ دقيقة',
      en: '60 Minutes',
    },
    capacity: {
      ar: 'شخص واحد',
      en: '1 person',
    },
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=85',
  },

  'nile-tours': {
    id: 'nile-trips',
    title: {
      ar: 'رحلات نيلية',
      en: 'Nile Trips',
    },
    description: {
      ar: 'استمتع بجمال النيل في رحلة هادئة وتأمل المناظر الساحرة على ضفافه.',
      en: 'Enjoy the beauty of the Nile on a relaxing trip and take in the river views.',
    },
    duration: {
      ar: 'حسب برنامج الرحلة',
      en: 'Varies by trip',
    },
    capacity: {
      ar: 'حسب نوع الرحلة',
      en: 'Varies by trip',
    },
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=85',
  },
};

const pageContent = {
  ar: {
    back: 'العودة إلى الأنشطة',
    badge: 'تجربة مائية',
    duration: 'مدة النشاط',
    capacity: 'السعة',
    overview: 'عن النشاط',
    overviewDescription:
      'استمتع بتجربة مميزة على مياه النيل، واكتشف جمال الطبيعة من منظور مختلف. تجربة مناسبة لقضاء وقت ممتع مع الأصدقاء أو العائلة.',
    highlights: 'مميزات التجربة',
    highlight1: 'استمتع بجمال النيل والطبيعة المحيطة.',
    highlight2: 'تجربة ممتعة ومناسبة لمحبي المغامرات.',
    highlight3: 'معدات السلامة الأساسية متوفرة.',
    safety: 'السلامة أولويتنا',
    safetyDescription:
      'نحرص على توفير معدات السلامة اللازمة وإرشادات قبل بدء النشاط لضمان تجربة مريحة وآمنة.',
    book: 'احجز النشاط الآن',
  },
  en: {
    back: 'Back to Activities',
    badge: 'Water Experience',
    duration: 'Duration',
    capacity: 'Capacity',
    overview: 'About This Activity',
    overviewDescription:
      'Enjoy a memorable experience on the Nile and discover the beauty of nature from a different perspective. A great way to spend time with friends or family.',
    highlights: 'Experience Highlights',
    highlight1: 'Enjoy the beauty of the Nile and its surroundings.',
    highlight2: 'A fun experience for adventure lovers.',
    highlight3: 'Essential safety equipment is provided.',
    safety: 'Your Safety Comes First',
    safetyDescription:
      'We provide essential safety equipment and instructions before the activity begins to help ensure a comfortable and safe experience.',
    book: 'Book This Activity',
  },
};

export default function ActivityDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang: currentLang } = useTranslation();

  const language = currentLang === 'en' ? 'en' : 'ar';
  const isArabic = language === 'ar';

  const activity = activitiesData[slug];
  const t = pageContent[language];

  const [activeImage, setActiveImage] = React.useState('');

  const galleryImages = activity
    ? [
        activity.image,
        activity.gallery?.[0] ||
          'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
        activity.gallery?.[1] ||
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
      ].filter((image, index, arr) => arr.indexOf(image) === index)
    : [];

  React.useEffect(() => {
    setActiveImage(activity?.image || '');
  }, [slug, activity?.image]);

  if (!activity) {
    return (
      <main
        dir={isArabic ? 'rtl' : 'ltr'}
        className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F7F9FC] px-5 text-center"
      >
        <h1 className="text-3xl font-black text-[#0C1226]">
          {isArabic ? 'النشاط غير موجود' : 'Activity Not Found'}
        </h1>

        <button
          type="button"
          onClick={() => navigate('/activities')}
          className="mt-6 rounded-full bg-[#FDFB45] px-6 py-3 font-bold text-[#0C1226]"
        >
          {t.back}
        </button>
      </main>
    );
  }

  const handleBooking = () => {
    navigate(`/book?activity=${activity.id}`);
  };

  const relatedActivities = Object.entries(activitiesData)
    .filter(([activitySlug]) => activitySlug !== slug)
    .slice(0, 3);

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F7F9FC] text-[#0C1226]"
    >
      {/* Activity Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat pb-16 pt-28 text-white md:pb-24 md:pt-36"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=90')",
        }}
      >
        {/* Dark Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[#0C1226]/70" />

        {/* Water Grid */}
        <div className="water-grid-dark pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
          <button
            type="button"
            onClick={() => navigate('/activities')}
            className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#FDFB45] transition hover:opacity-80"
          >
            {isArabic ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
            <span>{t.back}</span>
          </button>

          <div className="max-w-3xl">
            <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FDFB45]">
              {isArabic
                ? 'تفاصيل النشاط • أسوان'
                : 'ACTIVITY SHOWCASE • ASWAN'}
            </span>

            <h1 className="mb-5 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              {activity.title[language]}
            </h1>

            <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              {activity.description[language]}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery, activity information and booking */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Gallery and overview */}
          <div className="space-y-7 lg:col-span-7">
            <div className="relative h-[320px] overflow-hidden rounded-3xl border-4 border-white bg-[#0C1226] shadow-2xl sm:h-[430px] md:h-[500px]">
              <img
                src={activeImage || activity.image}
                alt={activity.title[language]}
                className="h-full w-full object-cover transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1226]/55 via-transparent to-transparent" />

              <div className="absolute bottom-4 start-4 rounded-xl bg-[#0C1226]/80 px-3 py-2 text-xs font-bold text-[#FDFB45] backdrop-blur-md">
                {isArabic ? 'تجربة DUCK المميزة' : 'DUCK EXPERIENCE'}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-label={
                      isArabic
                        ? `عرض الصورة ${index + 1}`
                        : `Show image ${index + 1}`
                    }
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-24 ${
                      activeImage === image
                        ? 'scale-105 border-[#FDFB45] shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mt-8 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">
                {t.overview}
              </h2>

              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                {t.overviewDescription}
              </p>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-[#147D9F]">
                  {t.safety}
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  {t.safetyDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Booking and highlights */}
          <aside className="space-y-7 lg:sticky lg:top-28 lg:col-span-5">
            {/* Booking Card */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#FDFB45]/30 bg-[#0C1226] p-7 text-white shadow-2xl sm:p-9">
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#FDFB45]/10 blur-3xl" />

              <div className="relative z-10">
                <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-widest text-[#FDFB45]">
                  {isArabic ? 'متاح في أسوان' : 'AVAILABLE IN ASWAN'}
                </span>

                <h2 className="mb-3 text-2xl font-black sm:text-3xl">
                  {activity.title[language]}
                </h2>

                <p className="mb-7 text-sm leading-7 text-white/70">
                  {isArabic
                    ? 'احجز تجربتك واستمتع بمغامرة مميزة على مياه النيل.'
                    : 'Book your experience and enjoy a memorable adventure on the Nile.'}
                </p>

                <div className="mb-7 space-y-4 text-sm text-white/80">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 flex-shrink-0 text-[#FDFB45]" />
                    <div>
                      <p className="text-xs text-white/50">{t.duration}</p>
                      <p className="font-bold">
                        {activity.duration[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 flex-shrink-0 text-[#FDFB45]" />
                    <div>
                      <p className="text-xs text-white/50">{t.capacity}</p>
                      <p className="font-bold">
                        {activity.capacity[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0 text-[#FDFB45]" />
                    <span>
                      {isArabic
                        ? 'معدات السلامة متوفرة'
                        : 'Safety equipment provided'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[#FDFB45] px-5 py-4 text-sm font-black text-[#0C1226] transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {t.book}
                  {isArabic ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                </button>

                <a
                  href={`https://wa.me/201550061006?text=${encodeURIComponent(
                    isArabic
                      ? `مرحباً DUCK! أود الاستفسار عن حجز نشاط ${activity.title.ar} في أسوان.`
                      : `Hello DUCK! I would like to inquire about booking ${activity.title.en} in Aswan.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-600/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600/40"
                >
                  {isArabic
                    ? 'استفسر عبر واتساب'
                    : 'Inquire via WhatsApp'}
                </a>

                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/50">
                  {isArabic
                    ? 'يمكنك التواصل مع فريقنا لتنسيق موعد مناسب لتجربتك.'
                    : 'Contact our team to arrange a suitable time for your experience.'}
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-black">
                <Waves className="h-5 w-5 text-[#147D9F]" />
                <span>{t.highlights}</span>
              </h3>

              <ul className="space-y-4">
                {[t.highlight1, t.highlight2, t.highlight3].map(
                  (highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#147D9F]" />
                      <span>{highlight}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </aside>
        </div>

        {/* Related Activities */}
        <div className="mt-20 border-t border-slate-200 pt-14 md:mt-24 md:pt-16">
          <div className="mb-8">
            <span className="mb-2 block font-mono text-xs font-bold tracking-widest text-[#147D9F]">
              {isArabic ? 'مغامرات أخرى' : 'MORE ADVENTURES'}
            </span>

            <h2 className="text-2xl font-black sm:text-3xl">
              {isArabic
                ? 'اكتشف أنشطة أخرى'
                : 'Discover More Activities'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedActivities.map(([relatedSlug, related]) => (
              <button
                key={related.id}
                type="button"
                onClick={() => navigate(`/activities/${relatedSlug}`)}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-start shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden bg-[#0C1226]">
                  <img
                    src={related.image}
                    alt={related.title[language]}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black">
                    {related.title[language]}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {related.description[language]}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#147D9F]">
                    {isArabic ? 'اكتشف النشاط' : 'Explore Activity'}
                    {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}