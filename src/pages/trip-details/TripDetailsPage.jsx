import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TRIPS } from '../../widgets/trips/tripsData.js';
import { DESTINATIONS } from '../../widgets/destinations/destinationsData.js';
import { useTranslation } from '../../shared/i18n/index.js';
import { useCMS } from '../../shared/hooks/index.js';
import { trackViewActivity } from '../../shared/utils/analytics.js';
import {
  TripTopBar,
  TripHeader,
  TripGallery,
  TripLightbox,
  TripQuickFacts,
  TripAbout,
  TripWhyBookWithUs,
  TripInclusions,
  TripAdditionalInfo,
  TripMeetingPoint,
  TripFAQ,
  TripRelatedTrips,
  TripBookingCard,
  TripMobileBottomBar,
  TripToast,
} from '../../widgets/trip-details/index.js';
import NotFoundPage from '../not-found/NotFoundPage.jsx';

export default function TripDetailsPage() {
  const { slug } = useParams();
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const { trips: dynamicTrips } = useCMS();
  const tripsList = dynamicTrips?.length ? dynamicTrips : TRIPS;

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const trip = useMemo(() => {
    const base = tripsList.find((item) => item.slug === slug);
    if (!base) return null;
    try {
      const overrides = JSON.parse(localStorage.getItem('duck_content_overrides') || '{}');
      const tripOverride = overrides[base.key];
      if (tripOverride?.customImage) {
        return {
          ...base,
          images: {
            ...base.images,
            large: tripOverride.customImage,
            medium: tripOverride.customImage,
          },
        };
      }
    } catch {
      // ignore
    }
    return base;
  }, [slug, tripsList]);

  // Track View Activity for Analytics Funnel
  useEffect(() => {
    if (trip) {
      trackViewActivity(trip);
    }
  }, [trip]);

  // Gallery image pool for Lightbox
  const galleryImages = useMemo(() => {
    if (!trip) return [];
    const dest = DESTINATIONS.find((d) => d.key === trip.destKey);
    const destImage = dest?.images.defaultSrc;
    const sameDestTrips = TRIPS.filter(
      (item) => item.id !== trip.id && item.destKey === trip.destKey
    );
    const otherTrips = TRIPS.filter((item) => item.id !== trip.id);

    return [
      trip.images.large,
      destImage || trip.images.medium,
      sameDestTrips[0]?.images.large || otherTrips[0]?.images.large || trip.images.large,
      sameDestTrips[1]?.images.large || otherTrips[1]?.images.large || trip.images.medium,
      otherTrips[2]?.images.large || trip.images.thumb,
    ];
  }, [trip]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2400);
  }, []);

  const handleShare = useCallback(() => {
    if (!trip) return;
    const tripTitle = t(`trips.items.${trip.key}.title`);
    const shareData = {
      title: `${tripTitle} | Duck Entertainment`,
      text: `${tripTitle} | Duck Entertainment`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => showToast(t('tripDetails.linkCopied')))
        .catch(() => showToast(t('tripDetails.copyFromAddressBar')));
    } else {
      showToast(t('tripDetails.copyFromAddressBar'));
    }
  }, [trip, t, showToast]);

  const handleOpenLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (!trip) {
    return <NotFoundPage />;
  }

  const tripTitle = t(`trips.items.${trip.key}.title`);

  return (
    <article
      dir={isArabic ? 'rtl' : 'ltr'}
      className="dp-page min-h-screen bg-white"
    >
      {/* Top sticky bar */}
      <TripTopBar trip={trip} onShare={handleShare} />

      <div className="dw">
        {/* Header (Title & Subtitle) */}
        <TripHeader trip={trip} />

        {/* 5-Image Gallery Grid with Google Rating Pill */}
        <TripGallery trip={trip} onOpenLightbox={handleOpenLightbox} />

        {/* Main Content & Sticky Booking Card */}
        <div className="dbd">
          <div className="dm">
            <TripQuickFacts trip={trip} />
            <TripAbout trip={trip} />
            <TripWhyBookWithUs />
            <TripInclusions inclusionsKeys={trip.inclusionsKeys} />
            <TripAdditionalInfo trip={trip} />
            <TripMeetingPoint trip={trip} />
            <TripFAQ />
            <TripRelatedTrips currentTrip={trip} />
          </div>

          <TripBookingCard trip={trip} />
        </div>
      </div>

      {/* Mobile Bottom Fixed Bar */}
      <TripMobileBottomBar trip={trip} />

      {/* Lightbox Modal */}
      <TripLightbox
        isOpen={lightboxIndex !== null}
        images={galleryImages}
        currentIndex={lightboxIndex || 0}
        onClose={handleCloseLightbox}
        onChangeIndex={setLightboxIndex}
        tripTitle={tripTitle}
      />

      {/* Toast Notification */}
      <TripToast message={toastMessage} />
    </article>
  );
}
