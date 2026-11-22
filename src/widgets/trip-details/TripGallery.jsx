import { useState, useRef } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { reviewsData } from '../../entities/review/index.js';
import { DESTINATIONS } from '../destinations/destinationsData.js';
import { TRIPS } from '../trips/tripsData.js';

export default function TripGallery({ trip, onOpenLightbox }) {
  const { t } = useTranslation();
  const galleryRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(1);

  // Build authentic 5-image pool
  const dest = DESTINATIONS.find((d) => d.key === trip.destKey);
  const destImage = dest?.images.defaultSrc;
  const sameDestTrips = TRIPS.filter(
    (item) => item.id !== trip.id && item.destKey === trip.destKey
  );
  const otherTrips = TRIPS.filter((item) => item.id !== trip.id);

  const images = [
    trip.images.large,
    destImage || trip.images.medium,
    sameDestTrips[0]?.images.large || otherTrips[0]?.images.large || trip.images.large,
    sameDestTrips[1]?.images.large || otherTrips[1]?.images.large || trip.images.medium,
    otherTrips[2]?.images.large || trip.images.thumb,
  ];

  const handleScroll = () => {
    if (!galleryRef.current) return;
    const { scrollLeft, clientWidth } = galleryRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(Math.abs(scrollLeft) / clientWidth) + 1;
      setActiveSlide(Math.min(5, Math.max(1, idx)));
    }
  };

  const totalReviews = reviewsData.length || 12;
  const avgRating = reviewsData.length
    ? (reviewsData.reduce((s, x) => s + x.r, 0) / reviewsData.length).toFixed(1)
    : '5.0';

  return (
    <div className="galw">
      <div
        className="gal"
        id="gal"
        ref={galleryRef}
        onScroll={handleScroll}
      >
        {/* Image 0 (spans 2 rows on desktop) */}
        <button
          type="button"
          className="gm"
          onClick={() => onOpenLightbox(0)}
          aria-label={`${t('tripDetails.viewAllPhotos')} - 1`}
        >
          <img
            src={images[0]}
            alt={t(`trips.items.${trip.key}.title`)}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </button>

        {/* Image 1 */}
        <button
          type="button"
          onClick={() => onOpenLightbox(1)}
          aria-label={`${t('tripDetails.viewAllPhotos')} - 2`}
        >
          <img
            src={images[1]}
            alt={t(`trips.items.${trip.key}.title`)}
            loading="lazy"
            decoding="async"
          />
        </button>

        {/* Image 2 */}
        <button
          type="button"
          onClick={() => onOpenLightbox(2)}
          aria-label={`${t('tripDetails.viewAllPhotos')} - 3`}
        >
          <img
            src={images[2]}
            alt={t(`trips.items.${trip.key}.title`)}
            loading="lazy"
            decoding="async"
          />
        </button>

        {/* Image 3 */}
        <button
          type="button"
          onClick={() => onOpenLightbox(3)}
          aria-label={`${t('tripDetails.viewAllPhotos')} - 4`}
        >
          <img
            src={images[3]}
            alt={t(`trips.items.${trip.key}.title`)}
            loading="lazy"
            decoding="async"
          />
        </button>

        {/* Image 4 with overlay */}
        <button
          type="button"
          onClick={() => onOpenLightbox(4)}
          aria-label={`${t('tripDetails.viewAllPhotos')} - 5`}
        >
          <img
            src={images[4]}
            alt={t(`trips.items.${trip.key}.title`)}
            loading="lazy"
            decoding="async"
          />
          <span className="gall">{t('tripDetails.viewAllPhotos')}</span>
        </button>
      </div>

      {/* Mobile Counter Pill */}
      <span className="gcn" id="gcn" aria-hidden="true">
        {activeSlide} / 5
      </span>

      {/* Floating Google Rating */}
      <div className="grt">
        <b>{avgRating}</b>
        <div>
          <span className="stars" aria-hidden="true">
            ★★★★★
          </span>
          <small>{totalReviews} {t('tripDetails.reviewsOnGoogle')}</small>
        </div>
      </div>
    </div>
  );
}
