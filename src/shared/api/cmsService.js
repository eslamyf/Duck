/**
 * DUCK Entertainment — Unified Dynamic CMS & Inventory Store Service
 * Single Source of Truth for Dynamic Destinations, Trips, Pricing & Overbooking Guard
 */

import { DESTINATIONS as INITIAL_DESTINATIONS } from '../../widgets/destinations/destinationsData.js';
import { TRIPS as INITIAL_TRIPS } from '../../widgets/trips/tripsData.js';
import { getAllBookings, BOOKINGS_UPDATED_EVENT } from '../../entities/booking/api/bookingService.js';
import { clearAnalyticsLog } from '../utils/analytics.js';

export const CMS_UPDATED_EVENT = 'duck:cms-updated';
const CMS_DESTINATIONS_KEY = 'duck_cms_destinations';
const CMS_TRIPS_KEY = 'duck_cms_trips';
const EQUIPMENT_CAPACITY_KEY = 'duck_equipment_capacity';

// Client-Approved Baseline Equipment Capacities (IEEE 29148 §5.1 / BR-003)
export const DEFAULT_EQUIPMENT_CAPACITY = Object.freeze({
  kayak: 20,
  waterbike: 2, // Strictly 2 per BR-003
  sup: 10,
});

/**
 * Dispatch CustomEvent to notify all components across the app
 */
export function notifyCMSUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CMS_UPDATED_EVENT));
  }
}

/* ─────────────────────────────────────────────────────────────
   1. DYNAMIC DESTINATIONS (CRUD)
   ───────────────────────────────────────────────────────────── */

export function getDynamicDestinations() {
  if (typeof window === 'undefined') return [...INITIAL_DESTINATIONS];
  try {
    const raw = localStorage.getItem(CMS_DESTINATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CMS_DESTINATIONS_KEY, JSON.stringify(INITIAL_DESTINATIONS));
      return [...INITIAL_DESTINATIONS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_DESTINATIONS];
  } catch {
    return [...INITIAL_DESTINATIONS];
  }
}

export function saveDynamicDestinations(destinations) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CMS_DESTINATIONS_KEY, JSON.stringify(destinations));
    notifyCMSUpdated();
  } catch {
    // Ignore quota errors
  }
}

export function addDynamicDestination(destData) {
  const list = getDynamicDestinations();
  const newId = Date.now();
  const slugKey = (destData.key || destData.nameEn || `dest-${newId}`)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const newDest = {
    id: newId,
    key: slugKey,
    num: String(list.length + 1).padStart(2, '0'),
    soon: Boolean(destData.soon),
    tripCount: Number(destData.tripCount) || 0,
    filterKey: slugKey,
    nameAr: destData.nameAr || '',
    nameEn: destData.nameEn || '',
    descAr: destData.descAr || '',
    descEn: destData.descEn || '',
    locationAr: destData.locationAr || '',
    locationEn: destData.locationEn || '',
    lat: Number(destData.lat) || 24.0889,
    lng: Number(destData.lng) || 32.8998,
    images: destData.images || {
      stripSrc: destData.imageUrl || INITIAL_DESTINATIONS[0].images.stripSrc,
      defaultSrc: destData.imageUrl || INITIAL_DESTINATIONS[0].images.defaultSrc,
      srcSet: '',
    },
    ...destData,
  };

  const updated = [...list, newDest];
  saveDynamicDestinations(updated);
  return newDest;
}

export function updateDynamicDestination(idOrKey, updates) {
  const list = getDynamicDestinations();
  const idx = list.findIndex(
    (d) => String(d.id) === String(idOrKey) || String(d.key) === String(idOrKey)
  );
  if (idx === -1) return null;

  list[idx] = {
    ...list[idx],
    ...updates,
    id: list[idx].id,
  };

  saveDynamicDestinations(list);
  return list[idx];
}

export function deleteDynamicDestination(idOrKey) {
  const list = getDynamicDestinations();
  const updated = list.filter(
    (d) => String(d.id) !== String(idOrKey) && String(d.key) !== String(idOrKey)
  );
  saveDynamicDestinations(updated);
  return updated.length !== list.length;
}

/* ─────────────────────────────────────────────────────────────
   2. DYNAMIC TRIPS & DUAL PRICING (CRUD)
   ───────────────────────────────────────────────────────────── */

export function getDynamicTrips() {
  if (typeof window === 'undefined') return [...INITIAL_TRIPS];
  try {
    const raw = localStorage.getItem(CMS_TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(CMS_TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
      return [...INITIAL_TRIPS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_TRIPS];
  } catch {
    return [...INITIAL_TRIPS];
  }
}

export function saveDynamicTrips(trips) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CMS_TRIPS_KEY, JSON.stringify(trips));
    notifyCMSUpdated();
  } catch {
    // Ignore quota errors
  }
}

export function addDynamicTrip(tripData) {
  const list = getDynamicTrips();
  const newId = Date.now();
  const slugKey = (tripData.slug || tripData.titleEn || `trip-${newId}`)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const defaultImg = INITIAL_TRIPS[0].images;

  const newTrip = {
    id: newId,
    key: tripData.key || `custom_${newId}`,
    loc: Number(tripData.loc) || 0,
    destKey: tripData.destKey || 'aswan',
    act: (tripData.act || 'kayak').toLowerCase(),
    price: Number(tripData.price) || 500, // Foreigner Price EGP
    priceEg: tripData.priceEg !== undefined && tripData.priceEg !== null && tripData.priceEg !== ''
      ? Number(tripData.priceEg)
      : null, // Egyptian Price EGP
    durKey: tripData.durKey || 'oneHour',
    slug: slugKey,
    op: tripData.op || 'Duck Fleet',
    titleAr: tripData.titleAr || '',
    titleEn: tripData.titleEn || '',
    descAr: tripData.descAr || '',
    descEn: tripData.descEn || '',
    durAr: tripData.durAr || '',
    durEn: tripData.durEn || '',
    inclusionsKeys: Array.isArray(tripData.inclusionsKeys)
      ? tripData.inclusionsKeys
      : ['kayakEquipped', 'lifeJacket'],
    inclusionsAr: tripData.inclusionsAr || '',
    inclusionsEn: tripData.inclusionsEn || '',
    images: tripData.images || {
      thumb: tripData.imageUrl || defaultImg.thumb,
      medium: tripData.imageUrl || defaultImg.medium,
      large: tripData.imageUrl || defaultImg.large,
      srcSet: '',
    },
    max: (tripData.act || '').toLowerCase() === 'waterbike' ? 2 : (Number(tripData.max) || 20),
    ...tripData,
  };

  const updated = [newTrip, ...list];
  saveDynamicTrips(updated);
  return newTrip;
}

export function updateDynamicTrip(idOrSlugOrKey, updates) {
  const list = getDynamicTrips();
  const idx = list.findIndex(
    (t) =>
      String(t.id) === String(idOrSlugOrKey) ||
      String(t.slug) === String(idOrSlugOrKey) ||
      String(t.key) === String(idOrSlugOrKey)
  );
  if (idx === -1) return null;

  list[idx] = {
    ...list[idx],
    ...updates,
    id: list[idx].id,
  };

  saveDynamicTrips(list);
  return list[idx];
}

export function deleteDynamicTrip(idOrSlugOrKey) {
  const list = getDynamicTrips();
  const updated = list.filter(
    (t) =>
      String(t.id) !== String(idOrSlugOrKey) &&
      String(t.slug) !== String(idOrSlugOrKey) &&
      String(t.key) !== String(idOrSlugOrKey)
  );
  saveDynamicTrips(updated);
  return updated.length !== list.length;
}

/* ─────────────────────────────────────────────────────────────
   3. REAL-TIME EQUIPMENT CAPACITY & OVERBOOKING GUARD
   ───────────────────────────────────────────────────────────── */

export function getEquipmentCapacity() {
  if (typeof window === 'undefined') return { ...DEFAULT_EQUIPMENT_CAPACITY };
  try {
    const raw = localStorage.getItem(EQUIPMENT_CAPACITY_KEY);
    if (!raw) {
      localStorage.setItem(EQUIPMENT_CAPACITY_KEY, JSON.stringify(DEFAULT_EQUIPMENT_CAPACITY));
      return { ...DEFAULT_EQUIPMENT_CAPACITY };
    }
    const parsed = JSON.parse(raw);
    return {
      kayak: Number(parsed.kayak) || DEFAULT_EQUIPMENT_CAPACITY.kayak,
      waterbike: Number(parsed.waterbike) || DEFAULT_EQUIPMENT_CAPACITY.waterbike,
      sup: Number(parsed.sup) || DEFAULT_EQUIPMENT_CAPACITY.sup,
    };
  } catch {
    return { ...DEFAULT_EQUIPMENT_CAPACITY };
  }
}

export function updateEquipmentCapacity(equipmentId, maxUnits) {
  const current = getEquipmentCapacity();
  const eq = String(equipmentId).toLowerCase();
  if (current[eq] === undefined) return current;

  current[eq] = Math.max(1, Number(maxUnits) || 1);
  if (typeof window !== 'undefined') {
    localStorage.setItem(EQUIPMENT_CAPACITY_KEY, JSON.stringify(current));
    notifyCMSUpdated();
  }
  return current;
}

/**
 * Calculates slot availability for a specific equipment on a given date and time.
 * Prevents overbooking across concurrent reservations.
 */
export function getSlotAvailability({ equipment, date, time }) {
  const eq = (equipment || 'kayak').toLowerCase();
  const capacitySettings = getEquipmentCapacity();
  const maxUnits = capacitySettings[eq] ?? DEFAULT_EQUIPMENT_CAPACITY[eq] ?? 20;

  if (!date || !time) {
    return {
      equipment: eq,
      maxUnits,
      bookedUnits: 0,
      remainingUnits: maxUnits,
      isAvailable: maxUnits > 0,
      isSoldOut: false,
    };
  }

  const allBookings = getAllBookings();
  const activeBookings = allBookings.filter((b) => {
    if (['cancelled', 'refunded'].includes(String(b.status || '').toLowerCase())) {
      return false;
    }
    const bDate = String(b.date || '').slice(0, 10);
    const bTime = String(b.time || '').trim();
    const bEq = String(b.equipment || 'kayak').toLowerCase();
    return bDate === String(date).slice(0, 10) && bTime === String(time).trim() && bEq === eq;
  });

  const bookedUnits = activeBookings.reduce((sum, b) => {
    return sum + (Number(b.units) || Number(b.guests) || 1);
  }, 0);

  const remainingUnits = Math.max(0, maxUnits - bookedUnits);

  return {
    equipment: eq,
    date,
    time,
    maxUnits,
    bookedUnits,
    remainingUnits,
    isAvailable: remainingUnits > 0,
    isSoldOut: remainingUnits <= 0,
  };
}

/**
 * Overbooking Guard validator: checks if a requested number of seats can be booked
 */
export function checkCanBook({ equipment, date, time, requestedUnits }) {
  const avail = getSlotAvailability({ equipment, date, time });
  const requested = Number(requestedUnits) || 1;
  const allowed = requested <= avail.remainingUnits;

  return {
    allowed,
    remainingUnits: avail.remainingUnits,
    maxUnits: avail.maxUnits,
    bookedUnits: avail.bookedUnits,
    isSoldOut: avail.isSoldOut,
  };
}

/* ─────────────────────────────────────────────────────────────
   4. ONE-CLICK DEMO DATA RESET
   ───────────────────────────────────────────────────────────── */

export function resetAllDemoData() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CMS_DESTINATIONS_KEY);
    localStorage.removeItem(CMS_TRIPS_KEY);
    localStorage.removeItem(EQUIPMENT_CAPACITY_KEY);
    localStorage.setItem('duck_bookings', JSON.stringify([]));
    localStorage.setItem('duck_b2b_quotes', JSON.stringify([]));
    localStorage.removeItem('duck_content_overrides');
    localStorage.removeItem('duck_custom_media');
    clearAnalyticsLog();

    notifyCMSUpdated();
    window.dispatchEvent(new CustomEvent(BOOKINGS_UPDATED_EVENT));
  } catch {
    // Ignore error
  }
}
