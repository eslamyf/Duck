import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChevronLeft, faChevronRight, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { Button } from '../../shared/ui/index.js';
import { ROUTES } from '../../shared/config/routes.js';

export default function DestinationMapCard({
  activeIdx = -1,
  pins = [],
  destinations = [],
  onSelectPin,
  onSelectDestination,
}) {
  const { t, lang } = useTranslation();
  const isEn = lang === 'en';
  const isRtl = lang === 'ar';

  const ChevronIcon = isRtl ? faChevronLeft : faChevronRight;

  // View 1: All Hubs Preview List
  if (activeIdx < 0) {
    return (
      <aside
        id="mpcard"
        className="rounded-[26px] bg-brand-navy/95 backdrop-blur-xl border border-white/16 shadow-card p-5 min-[901px]:p-6 flex flex-col justify-between gap-4 text-white"
        aria-live="polite"
      >
        <div>
          <h3 className="text-xl min-[901px]:text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
            <span>{t('map.allHubsTitle', '٥ وجهات من البحر للنيل ✨')}</span>
          </h3>
          <p className="text-xs min-[901px]:text-sm text-white/80 leading-relaxed mb-4">
            {t('map.allHubsDesc', 'اختار أي علامة على الخريطة أو اضغط على أي كارد لرؤية تفاصيل نقطة اللقاء والرحلات:')}
          </p>
        </div>

        {/* Mini Cards Grid / List */}
        <div className="flex flex-col gap-2.5">
          {pins.map((pin) => {
            const dest = destinations.find((d) => d.id === pin.destId) || {};
            const isSoon = dest.soon;
            const title = isEn ? (pin.titleEn || t(pin.titleKey)) : t(pin.titleKey);
            const subtitle = isEn ? pin.subEn : pin.subAr;

            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => onSelectPin(pin.destId)}
                className="group flex items-center gap-3.5 w-full p-2.5 min-[901px]:p-3 rounded-2xl border border-white/14 bg-gradient-to-br from-white/7 to-white/2 hover:bg-white/12 hover:border-brand-yellow/80 transition-all duration-200 cursor-pointer text-start select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                {/* Thumbnail Image */}
                <div className="relative w-16 h-14 min-[901px]:w-18 min-[901px]:h-15 rounded-xl overflow-hidden flex-none bg-brand-navy border border-white/15">
                  <img
                    src={
                      dest.images?.stripSrc ||
                      dest.images?.defaultSrc ||
                      dest.images?.cover ||
                      dest.imageUrl ||
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition: dest.imagePosition || dest.objectPosition || 'center center',
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute bottom-1 inset-x-1 py-0.5 text-[9.5px] font-bold text-center rounded-md ${
                      isSoon
                        ? 'bg-brand-navy/90 text-brand-yellow border border-brand-yellow/30'
                        : 'bg-brand-blue/90 text-white'
                    }`}
                  >
                    {isSoon
                      ? t('destinations.badgeSoon', 'قريباً')
                      : `${dest.tripCount} ${isEn ? 'Trips' : 'رحلات'}`}
                  </span>
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-1">
                  <b className="block text-sm min-[901px]:text-base font-bold text-white group-hover:text-brand-yellow transition-colors truncate">
                    {title}
                  </b>
                  <small className="flex items-center gap-1.5 text-xs text-white/70 truncate mt-0.5">
                    <FontAwesomeIcon icon={faLocationDot} className="text-brand-yellow text-[11px]" />
                    <span>{subtitle}</span>
                  </small>
                </div>

                {/* Arrow */}
                <FontAwesomeIcon
                  icon={ChevronIcon}
                  className="text-white/40 group-hover:text-brand-yellow text-sm group-hover:translate-x-[-2px] ltr:group-hover:translate-x-[2px] transition-all flex-none ms-1"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  // View 2: Specific Destination Active Card
  const activePin = pins.find((p) => p.destId === activeIdx) || pins[0];
  const activeDest = destinations.find((d) => d.id === activeIdx) || destinations[0];

  const title = isEn ? (activePin.titleEn || t(activePin.titleKey)) : t(activePin.titleKey);
  const description = t(`destinations.items.${activeDest.key}.description`);
  const meetingText = isEn ? activePin.meetingPointEn : activePin.meetingPointAr;
  const isSoon = activeDest.soon;

  return (
    <aside
      id="mpcard"
      className="rounded-[26px] bg-brand-navy/95 backdrop-blur-xl border border-white/16 shadow-card p-5 min-[901px]:p-6 flex flex-col justify-between gap-4 text-white"
      aria-live="polite"
    >
      <div>
        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-brand-navy border border-white/15 shadow-sm mb-4">
          <img
            src={
              activeDest.images?.defaultSrc ||
              activeDest.images?.cover ||
              activeDest.images?.stripSrc ||
              activeDest.imageUrl ||
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
            }
            srcSet={activeDest.images?.srcSet}
            sizes="(max-width: 900px) 90vw, 500px"
            alt={title}
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: activeDest.imagePosition || activeDest.objectPosition || 'center center',
            }}
            className="w-full h-full object-cover"
          />
          {/* Status Badge */}
          <span className="absolute top-3 inset-inline-start-3 bg-brand-yellow text-brand-navy font-bold text-xs min-[901px]:text-sm px-3 py-1 rounded-full shadow-md">
            {isSoon
              ? t('map.soonBadge', 'قريباً جداً ✨')
              : activeDest.tripCount === 1
              ? t('map.availableBadgeSingle', 'رحلة واحدة متاحة')
              : t('map.availableBadge', { count: activeDest.tripCount }, `${activeDest.tripCount} رحلات متاحة`)}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-xs min-[901px]:text-sm text-white/85 leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* Meeting Point Box (.mp-meet) */}
        <div className="bg-white/8 border border-white/14 rounded-2xl p-3 min-[901px]:p-3.5 text-xs min-[901px]:text-sm flex flex-col gap-1 mb-4">
          <b className="text-brand-yellow font-bold flex items-center gap-1.5 text-xs">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{t('map.meetingPointTitle', 'نقطة الانطلاق والتجمع')}</span>
          </b>
          <span className="text-white/90 leading-relaxed">{meetingText}</span>
        </div>
      </div>

      {/* Action Buttons (.mp-acts) */}
      <div className="flex gap-2.5 flex-wrap pt-2">
        {/* Explore Trips Button (if has trips) */}
        {activeDest.tripCount > 0 ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="flex-1 min-w-[150px] font-bold"
            onClick={() => onSelectDestination?.(activeDest.filterKey)}
          >
            {t('map.btnExploreTrips', { name: title }, `شوف رحلات ${title}`)}
          </Button>
        ) : (
          <Button
            as={Link}
            to={ROUTES.GROUPS}
            variant="primary"
            size="md"
            className="flex-1 min-w-[150px] font-bold"
          >
            {t('map.btnGroupBooking', 'حجز المجموعات والشركات')}
          </Button>
        )}

        {/* Open in Google Maps */}
        <Button
          as="a"
          href={activePin.googleMapsUrl}
          target="_blank"
          rel="noopener"
          variant="outline"
          size="md"
          icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />}
          iconPosition="end"
          className="flex-1 min-w-[150px] font-semibold text-white border-white/40 hover:bg-white/15"
        >
          {t('map.btnOpenGoogleMaps', 'افتح في Google Maps ↗')}
        </Button>
      </div>
    </aside>
  );
}
