import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import duckPinLogo from '../../shared/assets/icons/Artboard 19.png';

const GOOGLE_ROADMAP_URL =
  'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl={hl}';
const GOOGLE_SATELLITE_URL =
  'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}&hl={hl}';

export default function EgyptInteractiveMap({
  pins = [],
  activeIdx = -1,
  onSelectPin,
}) {
  const { t, lang } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef([]);
  const groupRef = useRef(null);
  const isEn = lang === 'en';

  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'

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

  const toggleMapType = useCallback(() => {
    setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'));
  }, []);

  // Update tile layer when mapType or language changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapType === 'satellite' ? GOOGLE_SATELLITE_URL : GOOGLE_ROADMAP_URL;

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      hl: isEn ? 'en' : 'ar',
      updateWhenIdle: false,
      updateWhenZooming: true,
      keepBuffer: 6,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapType, isEn]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      minZoom: 5.5,
      maxZoom: 18,
      attributionControl: false,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer(GOOGLE_ROADMAP_URL, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      hl: isEn ? 'en' : 'ar',
      updateWhenIdle: false,
      updateWhenZooming: true,
      keepBuffer: 6,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Create markers for each pin
    const markers = pins.map((p) => {
      const pinTitle = isEn ? (p.titleEn || t(p.titleKey)) : t(p.titleKey);
      const icon = L.divIcon({
        className: 'duck-marker',
        html: `
          <div class="duck-pin" data-loc="${p.destId}" role="button" tabindex="0" aria-label="${pinTitle}">
            <span class="dava" style="background-color: #ffffff; background-image: url('${duckPinLogo}'); background-repeat: no-repeat; background-position: center; background-size: 78% auto;">
              <img src="${duckPinLogo}" alt="" width="38" height="38" decoding="async" style="display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;transform:scale(1.35)!important;pointer-events:none!important;" />
            </span>
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

    const handleZoomEnd = () => {
      const zoom = map.getZoom();
      const isDetailed = zoom >= 9.5;
      markersRef.current.forEach((m, idx) => {
        const pinData = pins[idx];
        if (m && pinData) {
          const lat = isDetailed ? (pinData.flyLat ?? pinData.lat) : pinData.lat;
          const lng = isDetailed ? (pinData.flyLng ?? pinData.lng) : pinData.lng;
          m.setLatLng([lat, lng]);
        }
      });
      map.invalidateSize();
    };
    map.on('zoomend', handleZoomEnd);
    map.on('moveend', () => map.invalidateSize());

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      map.off('zoomend', handleZoomEnd);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isEn, onSelectPin, pins, t]);

  // 2. React to activeIdx changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = groupRef.current;
    const markers = markersRef.current;
    if (!map) return;

    map.invalidateSize();

    if (activeIdx < 0) {
      markers.forEach((m, idx) => {
        const pinData = pins[idx];
        if (m && pinData) {
          m.setLatLng([pinData.lat, pinData.lng]);
        }
      });

      if (group) {
        map.flyToBounds(group.getBounds(), { padding: [56, 56], duration: 0.85 });
      }
    } else {
      const activePin = pins.find((p) => p.destId === activeIdx);
      if (activePin) {
        markers.forEach((m, idx) => {
          const pinData = pins[idx];
          if (m && pinData) {
            m.setLatLng([pinData.flyLat ?? pinData.lat, pinData.flyLng ?? pinData.lng]);
          }
        });

        const targetLat = activePin.flyLat ?? activePin.lat;
        const targetLng = activePin.flyLng ?? activePin.lng;
        map.flyTo([targetLat, targetLng], 13.5, { duration: 1 });
      }
    }

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
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#f2efe9] isolate">
      <div
        ref={mapContainerRef}
        id="duckmap"
        className="absolute inset-0 w-full h-full z-0 bg-[#f2efe9]"
        aria-label={t('map.mapAriaLabel', 'خريطة مصر التفاعلية لنقاط انطلاق Duck')}
      />

      {/* Manual Zoom Controls (+ / -) */}
      <div
        className="absolute bottom-4 inset-inline-end-4 z-[400] flex flex-col gap-1.5 shadow-md rounded-xl overflow-hidden border border-black/10"
        role="group"
        aria-label={t('map.mapAriaLabel', 'التحكم في تكبير وتصغير الخريطة')}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 bg-white/95 hover:bg-white active:bg-slate-100 text-brand-navy flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none outline-none border-b border-black/10"
          aria-label={t('map.zoomIn', 'تكبير الخريطة')}
          title={t('map.zoomIn', 'تكبير')}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 bg-white/95 hover:bg-white active:bg-slate-100 text-brand-navy flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none outline-none"
          aria-label={t('map.zoomOut', 'تصغير الخريطة')}
          title={t('map.zoomOut', 'تصغير')}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
      </div>

      {/* Map Layer Toggle (Roadmap vs Satellite) */}
      <button
        type="button"
        onClick={toggleMapType}
        className="absolute top-3 inset-inline-end-3 z-[400] h-9 px-3 rounded-lg bg-white/95 hover:bg-white active:scale-95 text-brand-navy border border-black/10 backdrop-blur-md flex items-center gap-2 font-bold text-xs transition-all cursor-pointer shadow-sm select-none outline-none"
        aria-label={mapType === 'roadmap' ? 'عرض القمر الصناعي' : 'عرض الخريطة'}
      >
        <FontAwesomeIcon icon={faLayerGroup} className="text-brand-blue text-xs" />
        <span>{mapType === 'roadmap' ? (isEn ? 'Satellite' : 'قمر صناعي') : (isEn ? 'Map' : 'خريطة')}</span>
      </button>

      {/* Google Logo Badge */}
      <div className="absolute bottom-3 inset-inline-start-3 z-[400] pointer-events-none" dir="ltr">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/85 backdrop-blur-sm text-[12px] font-black tracking-tight shadow-sm border border-black/5 select-none">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
      </div>
    </div>
  );
}
