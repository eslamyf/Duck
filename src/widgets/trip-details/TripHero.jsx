import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faSailboat,
  faWater,
  faBicycle,
  faCompass,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Badge } from '../../shared/ui/index.js';
import { SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripHero({ trip }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  const destination = t(`destinations.items.${trip.destKey}.name`);
  const tripTitle = t(`trips.items.${trip.key}.title`);
  const tripDescription = t(`trips.items.${trip.key}.desc`);
  const tripAlt = t(`trips.items.${trip.key}.alt`);

  const activityIcons = {
    kayak: faSailboat,
    sup: faWater,
    waterbike: faBicycle,
  };
  const ActivityIcon = activityIcons[trip.act] || faCompass;
  const BackIcon = isArabic ? faArrowRight : faArrowLeft;

  return (
    <section className="relative min-h-[460px] md:min-h-[540px] flex items-end overflow-hidden font-body bg-brand-navy">
      <img
        src={trip.images.large}
        srcSet={trip.images.srcSet}
        sizes="100vw"
        alt={tripAlt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/65 to-brand-navy/20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-10 pb-12 md:pb-16 pt-16">
        <div className="mb-6">
          <Button
            as={Link}
            to={sectionLink(SECTIONS.TRIPS)}
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={BackIcon} className="text-sm" />}
            className="hover:text-brand-yellow hover:border-brand-yellow/40 backdrop-blur-sm"
          >
            {t('tripDetails.backToTrips')}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Badge variant="accent" size="md" className="font-bold">
            {destination}
          </Badge>
          <Badge
            variant="weather"
            size="md"
            icon={<FontAwesomeIcon icon={ActivityIcon} className="text-brand-yellow text-xs" />}
            className="bg-white/10 backdrop-blur-md border-white/20 text-white font-medium"
          >
            {t(`trips.activities.${trip.act}`)}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white max-w-4xl tracking-tight">
          {tripTitle}
        </h1>

        <p className="text-white/85 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
          {tripDescription}
        </p>
      </div>
    </section>
  );
}
