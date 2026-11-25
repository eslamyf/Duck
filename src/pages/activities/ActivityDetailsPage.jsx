import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faClock,
  faUsers,
  faShieldHalved,
  faCircleCheck,
  faWater,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';

import kayakImg from '../../shared/assets/images/trips/kayak-free-960w.webp';
import kayakGalleryImg from '../../shared/assets/images/trips/botanical-garden-960w.webp';
import waterbikeImg from '../../shared/assets/images/trips/waterbike-nile-960w.webp';
import supImg from '../../shared/assets/images/trips/sup-nile-960w.webp';
import nileToursImg from '../../shared/assets/images/trips/slouga-ghazal-960w.webp';
import gharbImg from '../../shared/assets/images/trips/gharb-explorer-960w.webp';

const activitiesData = {
  kayaking: {
    id: 'kayak',
    title: { ar: 'كاياك', en: 'Kayaking' },
    description: {
      ar: 'استكشف النيل على راحتك واستمتع بتجربة كاياك مميزة لا تُنسى.',
      en: 'Explore the Nile at your own pace and enjoy an unforgettable kayaking experience.',
    },
    duration: { ar: '٦٠ دقيقة', en: '60 Minutes' },
    capacity: { ar: 'حتى ٢٠ شخصًا', en: 'Up to 20 people' },
    image: kayakImg,
    gallery: [kayakGalleryImg, nileToursImg],
  },
  'water-bike': {
    id: 'water-bike',
    title: { ar: 'دراجة مائية', en: 'Water Bike' },
    description: {
      ar: 'استمتع برحلة ممتعة وهادئة فوق المياه مع مغامرة الدراجة المائية.',
      en: 'Enjoy a fun and relaxing ride across the water with a unique water-bike adventure.',
    },
    duration: { ar: '٤٥ دقيقة', en: '45 Minutes' },
    capacity: { ar: 'شخصان', en: '2 people' },
    image: waterbikeImg,
    gallery: [kayakGalleryImg, gharbImg],
  },
  sup: {
    id: 'sup',
    title: { ar: 'ستاند أب بادل', en: 'Stand Up Paddle' },
    description: {
      ar: 'حافظ على توازنك واستمتع بهدوء المياه واكتشف طريقة جديدة للتجديف.',
      en: 'Find your balance, enjoy the peaceful water, and discover a new way to paddle.',
    },
    duration: { ar: '٦٠ دقيقة', en: '60 Minutes' },
    capacity: { ar: 'شخص واحد', en: '1 person' },
    image: supImg,
    gallery: [kayakGalleryImg, nileToursImg],
  },
  'nile-tours': {
    id: 'nile-trips',
    title: { ar: 'رحلات نيلية', en: 'Nile Trips' },
    description: {
      ar: 'استمتع بجمال النيل في رحلة هادئة وتأمل المناظر الساحرة على ضفافه.',
      en: 'Enjoy the beauty of the Nile on a relaxing trip and take in the river views.',
    },
    duration: { ar: 'حسب برنامج الرحلة', en: 'Varies by trip' },
    capacity: { ar: 'حسب نوع الرحلة', en: 'Varies by trip' },
    image: nileToursImg,
    gallery: [gharbImg, kayakGalleryImg],
  },
};

const pageContent = {
  ar: {
    back: 'العودة إلى الأنشطة',
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
  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;
  const BackArrowIcon = isArabic ? faArrowRight : faArrowLeft;

  const activity = activitiesData[slug];
  const t = pageContent[language];

  const [selectedImage, setSelectedImage] = useState(null);
  const activeImage =
    selectedImage?.slug === slug ? selectedImage.src : activity?.image || '';

  const galleryImages = activity
    ? [activity.image, ...(activity.gallery || [])].filter(
        (image, index, arr) => image && arr.indexOf(image) === index
      )
    : [];

  if (!activity) {
    return (
      <main
        dir={isArabic ? 'rtl' : 'ltr'}
        className="flex min-h-[60vh] flex-col items-center justify-center bg-surface-mist px-5 text-center"
      >
        <h1 className="font-heading text-3xl font-extrabold text-brand-navy">
          {isArabic ? 'النشاط غير موجود' : 'Activity Not Found'}
        </h1>

        <button
          type="button"
          onClick={() => navigate(ROUTES.ACTIVITIES)}
          className="mt-6 rounded-full bg-brand-yellow px-6 py-3 font-bold text-brand-navy cursor-pointer"
        >
          {t.back}
        </button>
      </main>
    );
  }

  const relatedActivities = Object.entries(activitiesData)
    .filter(([activitySlug]) => activitySlug !== slug)
    .slice(0, 3);

  const whatsappUrl = buildWhatsAppUrl(
    isArabic
      ? `مرحباً DUCK! أود الاستفسار عن حجز نشاط ${activity.title.ar} في أسوان.`
      : `Hello DUCK! I would like to inquire about booking ${activity.title.en} in Aswan.`
  );

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface-mist text-brand-navy"
    >
      {/* Activity Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat pb-14 pt-12 text-white md:pb-20 md:pt-16"
        style={{
          backgroundImage: `url('${nileToursImg}')`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-brand-navy/75" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ACTIVITIES)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-yellow transition hover:opacity-80 cursor-pointer"
          >
            <FontAwesomeIcon icon={BackArrowIcon} />
            <span>{t.back}</span>
          </button>

          <div className="max-w-3xl">
            <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow">
              {isArabic ? 'تفاصيل النشاط • أسوان' : 'ACTIVITY SHOWCASE • ASWAN'}
            </span>

            <h1 className="mb-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              {activity.title[language]}
            </h1>

            <p className="max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              {activity.description[language]}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery, overview & Booking Card */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Gallery and overview */}
          <div className="space-y-6 lg:col-span-7">
            <div className="relative h-[300px] overflow-hidden rounded-3xl border-4 border-surface-white bg-brand-navy shadow-ocean sm:h-[420px] md:h-[460px]">
              <img
                src={activeImage || activity.image}
                alt={activity.title[language]}
                className="h-full w-full object-cover transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-4 rounded-xl bg-brand-navy/85 px-3 py-2 text-xs font-bold text-brand-yellow backdrop-blur-xs">
                {isArabic ? 'تجربة DUCK المميزة' : 'DUCK EXPERIENCE'}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage({ slug, src: image })}
                    aria-label={
                      isArabic
                        ? `عرض الصورة ${index + 1}`
                        : `Show image ${index + 1}`
                    }
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition cursor-pointer sm:h-24 sm:w-24 ${
                      activeImage === image
                        ? 'scale-105 border-brand-yellow shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-5 rounded-3xl border border-brand-blue/15 bg-surface-white p-6 shadow-card sm:p-8">
              <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
                {t.overview}
              </h2>
              <p className="text-sm sm:text-base leading-7 text-brand-navy/75">
                {t.overviewDescription}
              </p>

              <div className="border-t border-brand-navy/10 pt-5">
                <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-brand-blue">
                  {t.safety}
                </h3>
                <p className="text-xs sm:text-sm leading-7 text-brand-navy/70">
                  {t.safetyDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Card and highlights */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border-2 border-brand-yellow/35 bg-brand-navy p-7 text-white shadow-ocean sm:p-8">
              <div className="relative z-10">
                <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-brand-yellow">
                  {isArabic ? 'متاح في أسوان' : 'AVAILABLE IN ASWAN'}
                </span>

                <h2 className="mb-2 font-heading text-2xl font-extrabold sm:text-3xl">
                  {activity.title[language]}
                </h2>

                <p className="mb-6 text-sm leading-7 text-white/75">
                  {isArabic
                    ? 'احجز تجربتك واستمتع بمغامرة مميزة على مياه النيل.'
                    : 'Book your experience and enjoy a memorable adventure on the Nile.'}
                </p>

                <div className="mb-6 space-y-4 text-sm text-white/85">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faClock} className="text-brand-yellow text-base" />
                    <div>
                      <p className="text-xs text-white/60">{t.duration}</p>
                      <p className="font-bold">{activity.duration[language]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faUsers} className="text-brand-yellow text-base" />
                    <div>
                      <p className="text-xs text-white/60">{t.capacity}</p>
                      <p className="font-bold">{activity.capacity[language]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-brand-yellow text-base" />
                    <span>
                      {isArabic
                        ? 'معدات السلامة متوفرة'
                        : 'Safety equipment provided'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`${ROUTES.BOOKING}?activity=${activity.id}`}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-yellow px-5 py-3.5 text-sm font-extrabold text-brand-navy shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-yellow-hover"
                >
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  <span>{t.book}</span>
                  <FontAwesomeIcon icon={ArrowIcon} />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-brand-whatsapp/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-whatsapp/40"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>
                    {isArabic ? 'استفسر عبر واتساب' : 'Inquire via WhatsApp'}
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-blue/15 bg-surface-white p-6 shadow-card sm:p-7">
              <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-extrabold text-brand-navy">
                <FontAwesomeIcon icon={faWater} className="text-brand-blue" />
                <span>{t.highlights}</span>
              </h3>

              <ul className="space-y-3">
                {[t.highlight1, t.highlight2, t.highlight3].map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm leading-6 text-brand-navy/75"
                  >
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="mt-1 shrink-0 text-brand-blue"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Related Activities */}
        <div className="mt-16 border-t border-brand-navy/10 pt-12">
          <div className="mb-8">
            <span className="mb-1.5 block font-mono text-xs font-bold tracking-widest text-brand-blue">
              {isArabic ? 'مغامرات أخرى' : 'MORE ADVENTURES'}
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
              {isArabic ? 'اكتشف أنشطة أخرى' : 'Discover More Activities'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedActivities.map(([relatedSlug, related]) => (
              <button
                key={related.id}
                type="button"
                onClick={() => navigate(`/activities/${relatedSlug}`)}
                className="group overflow-hidden rounded-3xl border border-brand-blue/15 bg-surface-white text-start shadow-card transition hover:-translate-y-1 hover:shadow-soft cursor-pointer"
              >
                <div className="h-44 overflow-hidden bg-brand-navy">
                  <img
                    src={related.image}
                    alt={related.title[language]}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-extrabold text-brand-navy">
                    {related.title[language]}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-6 text-brand-navy/70">
                    {related.description[language]}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-brand-blue">
                    <span>{isArabic ? 'اكتشف النشاط' : 'Explore Activity'}</span>
                    <FontAwesomeIcon icon={ArrowIcon} />
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
