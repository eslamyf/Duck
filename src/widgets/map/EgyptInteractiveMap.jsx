import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import duckPinLogo from '../../shared/assets/icons/duck-pin-logo.png';
import duckLogo from '../../shared/assets/icons/Artboard 14.png';

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

  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  }, []);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fixed steady map: disable accidental wheel scroll, touch zoom, or double-click zooming while scrolling page
    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      minZoom: 5.85,
      maxZoom: 16,
      attributionControl: false,
      zoomControl: false,
    });

    // Add ArcGIS High-Resolution World Imagery (Seamless Edge-to-Edge Satellite Tiles with NO boundaries)
    L.tileLayer(SATELLITE_TILE_URL, {
      maxZoom: 18,
      noWrap: true,
    }).addTo(map);

    // Create markers for each pin
    const markers = pins.map((p) => {
      const pinTitle = isEn ? (p.titleEn || t(p.titleKey)) : t(p.titleKey);
      const icon = L.divIcon({
        className: 'duck-marker',
        html: `
          <div class="duck-pin" data-loc="${p.destId}" role="button" tabindex="0" aria-label="${pinTitle}">
            <span class="dava"><img src="${duckPinLogo}" onerror="this.onerror=null;this.src='/icon-192.png'" alt="Duck" /></span>
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
    map.fitBounds(group.getBounds(), { padding: [56, 56] });

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
      map.flyToBounds(group.getBounds(), { padding: [56, 56], duration: 0.85 });
    } else {
      const activePin = pins.find((p) => p.destId === activeIdx);
      if (activePin) {
        // Fly directly to the real pinpoint location (flyLat, flyLng)
        const targetLat = activePin.flyLat ?? activePin.lat;
        const targetLng = activePin.flyLng ?? activePin.lng;
        map.flyTo([targetLat, targetLng], 13, { duration: 1 });
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
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {/* Leaflet Satellite Map Container */}
      <div
        ref={mapContainerRef}
        id="duckmap"
        className="absolute inset-0 w-full h-full z-0"
        aria-label={t('map.mapAriaLabel', 'خريطة مصر التفاعلية لنقاط انطلاق Duck')}
      />

      {/* Official Duck Logo Badge */}
      <div
        className="absolute top-4 inset-inline-end-4 z-[400] pointer-events-none flex items-center gap-2 bg-brand-navy/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-md"
        aria-hidden="true"
      >
        <img
          src={duckLogo}
          alt="Duck Entertainment"
          className="h-5 min-[901px]:h-6 w-auto object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Manual Zoom Controls (+ / -) */}
      <div
        className="absolute bottom-4 inset-inline-start-4 z-[400] flex flex-col gap-2"
        role="group"
        aria-label={t('map.mapAriaLabel', 'التحكم في تكبير وتصغير الخريطة')}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-xl bg-brand-navy/90 hover:bg-brand-navy active:scale-95 text-brand-yellow hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base transition-all cursor-pointer shadow-md select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
          aria-label={t('map.zoomIn', 'تكبير الخريطة')}
          title={t('map.zoomIn', 'تكبير')}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-xl bg-brand-navy/90 hover:bg-brand-navy active:scale-95 text-brand-yellow hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base transition-all cursor-pointer shadow-md select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
          aria-label={t('map.zoomOut', 'تصغير الخريطة')}
          title={t('map.zoomOut', 'تصغير')}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
      </div>
    </div>
  );
}
