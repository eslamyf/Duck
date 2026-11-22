import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, MapPin, Compass, CheckCircle2, Users } from 'lucide-react';

import { TRIPS, ACTIVITIES } from './tripsData.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { SECTIONS, sectionLink } from '../../shared/config/routes.js';

function TripDetails() {
  const { slug } = useParams();
  const { t, lang } = useTranslation();

  const isArabic = lang === 'ar';
  const trip = TRIPS.find((item) => item.slug === slug);

  if (!trip) {
    return (
      <main
        dir={isArabic ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#121528] flex items-center justify-center px-6"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#F5E847] mb-4">
            404
          </h1>

          <p className="text-white text-lg mb-8">
            {isArabic ? 'الرحلة غير موجودة' : 'Trip not found'}
          </p>

          <Link
            to={sectionLink(SECTIONS.TRIPS)}
            className="inline-flex items-center gap-2 bg-[#F5E847] text-[#121528] px-6 py-3 rounded-full font-bold"
          >
            {isArabic ? 'العودة إلى الرحلات' : 'Back to Trips'}
          </Link>
        </div>
      </main>
    );
  }

  const tripTitle = t(`trips.items.${trip.key}.title`);
  const tripDescription = t(`trips.items.${trip.key}.desc`);
  const tripAlt = t(`trips.items.${trip.key}.alt`);

  const activity = ACTIVITIES[trip.act];

  const destination = t(`trips.destinations.${trip.destKey}`);
  const duration = t(`trips.durations.${trip.durKey}`);

  const inclusions = trip.inclusionsKeys.map((key) =>
    t(`trips.inclusions.${key}`)
  );

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const formatPrice = (price) =>
    new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US').format(price);

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121528] text-white"
    >
      {/* Hero Section */}
      <section className="relative min-h-[580px] flex items-end overflow-hidden">
        <img
          src={trip.images.large}
          srcSet={trip.images.srcSet}
          sizes="100vw"
          alt={tripAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#121528] via-[#121528]/50 to-black/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-16 pt-36">
          <Link
            to={sectionLink(SECTIONS.TRIPS)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#F5E847] transition-colors mb-10"
          >
            <BackIcon size={20} />
            <span>
              {isArabic ? 'العودة إلى الرحلات' : 'Back to Trips'}
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-[#F5E847] text-[#121528] px-4 py-2 rounded-full text-sm font-bold">
              {destination}
            </span>

            <span className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm">
              {activity?.icon} {t(`trips.activities.${trip.act}`)}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black max-w-4xl leading-tight mb-6">
            {tripTitle}
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
            {tripDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Trip Information */}
          <div className="lg:col-span-2 space-y-12">

            {/* Overview */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-9 bg-[#F5E847] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  {isArabic ? 'عن الرحلة' : 'About This Trip'}
                </h2>
              </div>

              <p className="text-white/70 text-lg leading-9">
                {tripDescription}
              </p>
            </div>

            {/* Trip Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-9 bg-[#F5E847] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  {isArabic ? 'معلومات الرحلة' : 'Trip Information'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InfoCard
                  icon={<MapPin />}
                  label={isArabic ? 'الوجهة' : 'Destination'}
                  value={destination}
                />

                <InfoCard
                  icon={<Compass />}
                  label={isArabic ? 'النشاط' : 'Activity'}
                  value={t(`trips.activities.${trip.act}`)}
                />

                <InfoCard
                  icon={<Clock />}
                  label={isArabic ? 'المدة' : 'Duration'}
                  value={duration}
                />

                <InfoCard
                  icon={<Users />}
                  label={isArabic ? 'الجهة المنظمة' : 'Operator'}
                  value={trip.op}
                />

                {trip.min && (
                  <InfoCard
                    icon={<Users />}
                    label={isArabic ? 'الحد الأدنى للأفراد' : 'Minimum Participants'}
                    value={formatPrice(trip.min)}
                  />
                )}

                {trip.max && (
                  <InfoCard
                    icon={<Users />}
                    label={isArabic ? 'الحد الأقصى للأفراد' : 'Maximum Participants'}
                    value={formatPrice(trip.max)}
                  />
                )}

              </div>
            </div>

            {/* What's Included */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-9 bg-[#F5E847] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  {t('trips.includesTitle')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inclusions.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <CheckCircle2
                      className="text-[#F5E847] shrink-0"
                      size={21}
                    />

                    <span className="text-white/80">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Booking Card */}
          <aside>
            <div className="lg:sticky lg:top-28 bg-white rounded-3xl p-7 text-[#121528] shadow-xl">

              <span className="text-sm text-gray-500 font-semibold">
                {isArabic ? 'سعر الرحلة' : 'Trip Price'}
              </span>

              <div className="mt-3 mb-7">
                <p className="text-4xl font-black">
                  {formatPrice(trip.price)}
                  <span className="text-base font-semibold ms-2">
                    {t('trips.currency')}
                  </span>
                </p>

                {trip.priceEg !== null && (
                  <p className="text-gray-500 mt-2">
                    {isArabic ? 'للمصريين:' : 'Egyptian price:'}
                    <span className="font-bold ms-2 text-[#067BA1]">
                      {formatPrice(trip.priceEg)} {t('trips.currency')}
                    </span>
                  </p>
                )}

                {trip.isHourly && (
                  <p className="text-sm text-gray-500 mt-2">
                    {isArabic ? 'السعر للساعة' : 'Price per hour'}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mb-7">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">
                    {isArabic ? 'المدة' : 'Duration'}
                  </span>

                  <span className="font-bold">
                    {duration}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    {isArabic ? 'الموقع' : 'Location'}
                  </span>

                  <span className="font-bold">
                    {destination}
                  </span>
                </div>
              </div>

              <Link
                to={sectionLink(SECTIONS.BOOK)}
                className="flex items-center justify-center gap-3 w-full bg-[#F5E847] hover:bg-[#e9dc35] text-[#121528] font-black py-4 rounded-xl transition-colors"
              >
                {isArabic ? 'احجز رحلتك الآن' : 'Book Your Trip'}

                {isArabic ? (
                  <ArrowLeft size={20} />
                ) : (
                  <ArrowRight size={20} />
                )}
              </Link>

              <p className="text-center text-xs text-gray-400 mt-4">
                {isArabic
                  ? 'استعد لمغامرتك القادمة مع DUCK'
                  : 'Get ready for your next adventure with DUCK'}
              </p>

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="text-[#F5E847]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-white/50 mb-1">
          {label}
        </p>

        <p className="font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default TripDetails;