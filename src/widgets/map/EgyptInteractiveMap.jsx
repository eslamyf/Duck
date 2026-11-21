import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '../../shared/i18n/index.js';
import duckIcon from '../../shared/assets/icons/Artboard_8-removebg-preview.png';

const EGYPT_BOUNDS = L.latLngBounds([21.8, 24.6], [31.9, 36.8]);
const SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

export default function EgyptInteractiveMap({
  pins = [],
  activeIdx = -1,
  onSelectPin,
}) {
  const { t, lang } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const groupRef = useRef(null);
  const isEn = lang === 'en';

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      minZoom: 5.75,
      maxZoom: 17,
      maxBounds: EGYPT_BOUNDS,
      maxBoundsViscosity: 1.0,
      attributionControl: false,
      zoomControl: false,
    });

    // Add ArcGIS High-Resolution World Imagery (Real Satellite Tiles)
    L.tileLayer(SATELLITE_TILE_URL, {
      maxZoom: 18,
      noWrap: true,
      bounds: EGYPT_BOUNDS,
    }).addTo(map);

    // Create markers for each pin
    const markers = pins.map((p) => {
      const pinTitle = isEn ? (p.titleEn || t(p.titleKey)) : t(p.titleKey);
      const icon = L.divIcon({
        className: 'duck-marker',
        html: `
          <div class="duck-pin" data-loc="${p.destId}" role="button" tabindex="0" aria-label="${pinTitle}">
            <span class="dava"><img src="${duckIcon}" alt="Duck" /></span>
            <span class="dlbl">${pinTitle}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.on('click', () => {
        onSelectPin(p.destId);
      });

      return marker;
    });

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [48, 48] });

    mapInstanceRef.current = map;
    markersRef.current = markers;
    groupRef.current = group;

    // Handle ResizeObserver to keep canvas responsive without glitches
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isEn, onSelectPin, pins, t]);

  // 2. React to activeIdx changes (Fly to pin or Fit bounds + update visual marker classes)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = groupRef.current;
    const markers = markersRef.current;
    if (!map) return;

    map.invalidateSize();

    // Fly camera
    if (activeIdx < 0 && group) {
      map.flyToBounds(group.getBounds(), { padding: [48, 48], duration: 0.85 });
    } else {
      const activePin = pins.find((p) => p.destId === activeIdx);
      if (activePin) {
        map.flyTo([activePin.lat, activePin.lng], 13, { duration: 1 });
      }
    }

    // Sync marker element styling (highlight / dim)
    markers.forEach((m, idx) => {
      const pinData = pins[idx];
      const el = m.getElement()?.querySelector('.duck-pin');
      if (!el || !pinData) return;

      const isCurrent = pinData.destId === activeIdx;
      const isDimmed = activeIdx !== -1 && !isCurrent;

      el.classList.toggle('on', isCurrent);
      el.classList.toggle('dim', isDimmed);
      m.setZIndexOffset(isCurrent ? 1000 : 0);
    });
  }, [activeIdx, pins]);

  return (
    <div
      ref={mapContainerRef}
      id="duckmap"
      className="absolute inset-0 w-full h-full z-0"
      aria-label={t('map.mapAriaLabel', 'خريطة مصر التفاعلية لنقاط انطلاق Duck')}
    />
  );
}
