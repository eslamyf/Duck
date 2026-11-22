import { useParams } from 'react-router-dom';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { useTranslation } from '../../shared/i18n/index.js';
import {
  TripHero,
  TripInfoGrid,
  TripInclusions,
  TripBookingCard,
  TripNotFound,
} from '../../widgets/trip-details/index.js';

export default function TripDetailsPage() {
  const { slug } = useParams();
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';

  const trip = TRIPS.find((item) => item.slug === slug);

  if (!trip) {
    return <TripNotFound />;
  }

  return (
    <article dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-brand-navy text-white font-body">
      <TripHero trip={trip} />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-14">
          <div className="lg:col-span-2 space-y-12">
            <TripInfoGrid trip={trip} />
            <TripInclusions inclusionsKeys={trip.inclusionsKeys} />
          </div>

          <div className="lg:col-span-1">
            <TripBookingCard trip={trip} />
          </div>
        </div>
      </section>
    </article>
  );
}
