/**
 * DUCK Entertainment — Unified Analytics & Conversion Event Layer
 * Single Source of Truth for GA4, GTM, Meta Pixel & Live In-App Funnel Tracking
 */

const ANALYTICS_STORAGE_KEY = 'duck_analytics_events';
export const ANALYTICS_UPDATED_EVENT = 'duck:analytics-updated';

/**
 * Standard 8 Funnel Event Names
 */
export const ANALYTICS_EVENTS = Object.freeze({
  PAGE_VIEW: 'page_view',
  VIEW_ACTIVITY: 'view_activity',
  SEARCH: 'search',
  INITIATE_BOOKING: 'initiate_booking',
  ADD_BOOKING_DETAILS: 'add_booking_details',
  INITIATE_CHECKOUT: 'initiate_checkout',
  PURCHASE: 'purchase',
  LEAD_SUBMISSION: 'lead_submission',
});

/**
 * Dispatch CustomEvent to notify active in-app dashboard listeners
 */
function notifyAnalyticsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ANALYTICS_UPDATED_EVENT));
  }
}

/**
 * Retrieve raw list of persisted events from localStorage
 */
export function getAnalyticsEvents() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save raw list of events to localStorage (capped at 250 items)
 */
function saveAnalyticsEvents(events) {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = events.slice(0, 250);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(trimmed));
    notifyAnalyticsUpdated();
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Core event dispatcher: pushes to dataLayer (GA4/GTM), fbq (Meta Pixel), and local storage
 */
export function trackEvent(eventName, params = {}) {
  const timestamp = new Date().toISOString();
  const eventRecord = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: eventName,
    params,
    timestamp,
    path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
  };

  // 1. GA4 / Google Tag Manager integration via window.dataLayer
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
      eventTimestamp: timestamp,
    });
  }

  // 2. Meta Pixel integration via window.fbq
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      const fbEventMap = {
        [ANALYTICS_EVENTS.PAGE_VIEW]: 'PageView',
        [ANALYTICS_EVENTS.VIEW_ACTIVITY]: 'ViewContent',
        [ANALYTICS_EVENTS.SEARCH]: 'Search',
        [ANALYTICS_EVENTS.INITIATE_BOOKING]: 'InitiateCheckout',
        [ANALYTICS_EVENTS.ADD_BOOKING_DETAILS]: 'CustomizeProduct',
        [ANALYTICS_EVENTS.INITIATE_CHECKOUT]: 'AddPaymentInfo',
        [ANALYTICS_EVENTS.PURCHASE]: 'Purchase',
        [ANALYTICS_EVENTS.LEAD_SUBMISSION]: 'Lead',
      };
      const standardFbName = fbEventMap[eventName];
      if (standardFbName) {
        window.fbq('track', standardFbName, params);
      } else {
        window.fbq('trackCustom', eventName, params);
      }
    } catch {
      // Ignore Meta Pixel dispatch failure
    }
  }

  // 3. Local Funnel Log persistence for Admin live monitoring
  const current = getAnalyticsEvents();
  saveAnalyticsEvents([eventRecord, ...current]);

  return eventRecord;
}

/* ─────────────────────────────────────────────────────────────
   Dedicated Tracking Methods for the 8 Required Events
   ───────────────────────────────────────────────────────────── */

export function trackPageView(path, title) {
  return trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    page_path: path,
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
  });
}

export function trackViewActivity(trip) {
  if (!trip) return;
  return trackEvent(ANALYTICS_EVENTS.VIEW_ACTIVITY, {
    trip_id: trip.id,
    trip_slug: trip.slug,
    trip_key: trip.key,
    activity_type: trip.act,
    destination: trip.destKey,
    price_egp: trip.priceEg || trip.price,
    price_foreign: trip.price,
    currency: 'EGP',
  });
}

export function trackSearch(query, filterType) {
  return trackEvent(ANALYTICS_EVENTS.SEARCH, {
    search_term: query,
    filter_type: filterType,
  });
}

export function trackInitiateBooking(trip, source = 'web') {
  return trackEvent(ANALYTICS_EVENTS.INITIATE_BOOKING, {
    trip_slug: trip?.slug,
    trip_key: trip?.key,
    activity_type: trip?.act,
    source,
  });
}

export function trackAddBookingDetails(details = {}) {
  return trackEvent(ANALYTICS_EVENTS.ADD_BOOKING_DETAILS, {
    trip_slug: details.tripSlug,
    date: details.date,
    time: details.time,
    guests_total: details.totalGuests || details.guests,
    egyptian_count: details.egyptianCount,
    foreign_count: details.foreignCount,
    equipment: details.equipment,
  });
}

export function trackInitiateCheckout(bookingData = {}) {
  return trackEvent(ANALYTICS_EVENTS.INITIATE_CHECKOUT, {
    trip_slug: bookingData.tripSlug,
    date: bookingData.date,
    time: bookingData.time,
    total_amount_egp: bookingData.totalAmount || bookingData.amountToPay,
    currency: 'EGP',
    payment_method: bookingData.paymentMethod,
  });
}

export function trackPurchase(booking = {}) {
  return trackEvent(ANALYTICS_EVENTS.PURCHASE, {
    transaction_id: booking.reference || booking.id,
    value: Number(booking.totalAmount || booking.amountToPay) || 0,
    currency: 'EGP',
    trip_key: booking.tripKey,
    trip_title: booking.tripTitle,
    equipment: booking.equipment,
    guests: booking.guests || booking.units || 1,
    payment_status: booking.status || 'paid',
  });
}

export function trackLeadSubmission(leadData = {}) {
  return trackEvent(ANALYTICS_EVENTS.LEAD_SUBMISSION, {
    lead_type: leadData.partnerType || leadData.type || 'group_rfq',
    organization: leadData.organization,
    group_size: leadData.groupSize,
    target_date: leadData.date,
  });
}

/**
 * Funnel calculation utility for live Admin Dashboard analytics
 */
export function getFunnelMetrics() {
  const events = getAnalyticsEvents();
  const counts = {
    [ANALYTICS_EVENTS.PAGE_VIEW]: 0,
    [ANALYTICS_EVENTS.VIEW_ACTIVITY]: 0,
    [ANALYTICS_EVENTS.SEARCH]: 0,
    [ANALYTICS_EVENTS.INITIATE_BOOKING]: 0,
    [ANALYTICS_EVENTS.ADD_BOOKING_DETAILS]: 0,
    [ANALYTICS_EVENTS.INITIATE_CHECKOUT]: 0,
    [ANALYTICS_EVENTS.PURCHASE]: 0,
    [ANALYTICS_EVENTS.LEAD_SUBMISSION]: 0,
  };

  let totalSalesEgp = 0;

  events.forEach((ev) => {
    if (counts[ev.name] !== undefined) {
      counts[ev.name]++;
    }
    if (ev.name === ANALYTICS_EVENTS.PURCHASE) {
      totalSalesEgp += Number(ev.params?.value) || 0;
    }
  });

  const initiateCount = counts[ANALYTICS_EVENTS.INITIATE_BOOKING] || 0;
  const purchaseCount = counts[ANALYTICS_EVENTS.PURCHASE] || 0;
  const conversionRate = initiateCount > 0 ? ((purchaseCount / initiateCount) * 100).toFixed(1) : '0.0';

  return {
    counts,
    totalSalesEgp,
    conversionRate,
    totalEvents: events.length,
    recentEvents: events.slice(0, 20),
  };
}

/**
 * Clear the analytics event log (for demo resets)
 */
export function clearAnalyticsLog() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    notifyAnalyticsUpdated();
  }
}
