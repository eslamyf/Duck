import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faClock,
  faLocationDot,
  faArrowLeft,
  faArrowRight,
  faSailboat,
  faShip,
} from '@fortawesome/free-solid-svg-icons';
import { TRIPS } from '../trips/tripsData.js';
import { Badge, Button } from '../../shared/ui/index.js';

export default function StepTripSelect({
  selectedTrip,
  onSelectTrip,
  initialActivity = 'all',
  t,
  lang,
}) {
  const [filterAct, setFilterAct] = useState(
    ['kayak', 'sup', 'waterbike'].includes(initialActivity)
      ? initialActivity
      : 'all'
  );
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;

  const activities = [
    { id: 'all', label: t('booking.tripSelect.allActivities') },
    { id: 'kayak', label: t('booking.tripSelect.kayak'), icon: faSailboat },
    { id: 'sup', label: t('booking.tripSelect.sup'), icon: faSailboat },
    { id: 'waterbike', label: t('booking.tripSelect.waterbike'), icon: faShip },
  ];

  const filteredTrips = TRIPS.filter((item) => {
    if (filterAct === 'all') return true;
    return item.act === filterAct;
  });

  const formatPrice = (p) =>
    Number(p).toLocaleString(isArabic ? 'ar-EG' : 'en-US');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
          {t('booking.tripSelect.title')}
        </h2>
        <p className="text-sm sm:text-base text-brand-navy/70 max-w-xl mx-auto font-medium">
          {t('booking.tripSelect.subtitle')}
        </p>
      </div>

      {/* Activity Filter Chips */}
      <div
        className="flex items-center justify-center gap-2 flex-wrap"
        role="group"
        aria-label={t('booking.tripSelect.filterAria')}
      >
        {activities.map((act) => {
          const isActive = filterAct === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => setFilterAct(act.id)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer outline-none ${
                isActive
                  ? 'bg-brand-navy text-brand-yellow shadow-md scale-105'
                  : 'bg-white text-brand-navy/75 hover:bg-surface-mist hover:text-brand-navy border border-black/10'
              }`}
            >
              {act.label}
            </button>
          );
        })}
      </div>

      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrips.map((trip) => {
          const isSelected = selectedTrip?.id === trip.id;
          const tripTitle = t(`trips.items.${trip.key}.title`, trip.slug);
          const durationText = t(`trips.durations.${trip.durKey}`, '1-2 Hours');
          const destName = t(`destinations.items.${trip.destKey}.name`, trip.destKey);
          const displayPrice = trip.priceEg || trip.price;

          return (
            <article
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className={`group relative flex flex-col rounded-3xl overflow-hidden bg-white border-2 transition-all duration-200 cursor-pointer text-start shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                isSelected
                  ? 'border-brand-yellow ring-4 ring-brand-yellow/30'
                  : 'border-black/10 hover:border-brand-navy/30'
              }`}
            >
              {/* Image banner */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-surface-mist">
                <img
                  src={trip.images?.medium || trip.images?.thumb}
                  alt={tripTitle}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Location badge */}
                <div className="absolute top-3 start-3">
                  <Badge variant="navy" size="sm" className="font-bold gap-1 shadow-sm">
                    <FontAwesomeIcon icon={faLocationDot} className="text-brand-yellow text-xs" />
                    <span>{destName}</span>
                  </Badge>
                </div>

                {/* Selected Checkmark pill */}
                {isSelected && (
                  <div className="absolute top-3 end-3 bg-brand-yellow text-brand-navy font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>{t('booking.tripSelect.selected')}</span>
                  </div>
                )}

                {/* Starting Price Pill */}
                <div className="absolute bottom-3 start-3 bg-white/95 backdrop-blur-xs text-brand-navy px-3 py-1 rounded-xl shadow-md border border-black/10">
                  <span className="text-[11px] font-medium text-brand-navy/70 block">
                    {t('booking.tripSelect.startingFrom')}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-brand-navy">
                    {formatPrice(displayPrice)}{' '}
                    <span className="text-xs font-bold text-brand-blue">{t('trips.currency')}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="font-heading font-black text-base sm:text-lg text-brand-navy line-clamp-1 group-hover:text-brand-blue transition-colors">
                    {tripTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-brand-navy/70 font-semibold">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} className="text-brand-blue" />
                      <span>{durationText}</span>
                    </span>
                    <span className="text-brand-navy/30">•</span>
                    <span className="uppercase tracking-wider font-bold text-brand-blue">
                      {trip.act}
                    </span>
                  </div>
                </div>

                {/* Select button */}
                <Button
                  type="button"
                  variant={isSelected ? 'primary' : 'subtle'}
                  size="sm"
                  className={`w-full justify-center font-bold text-xs sm:text-sm shadow-xs ${
                    isSelected
                      ? 'bg-brand-yellow text-brand-navy'
                      : 'hover:bg-brand-navy hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrip(trip);
                  }}
                >
                  <span>{isSelected ? t('booking.tripSelect.chosenProceed') : t('booking.tripSelect.selectTrip')}</span>
                  <FontAwesomeIcon icon={ArrowIcon} className="text-xs" />
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
