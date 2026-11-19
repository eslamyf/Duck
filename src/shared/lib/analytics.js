/**
 * DUCK Entertainment — Analytics & Conversion Attribution
 * Source: DUCK____Answers___Strategic_Direction.pdf §03 (Tracking & Analytics)
 * IEEE 29148 SRS v3.1 — All 8 required funnel events
 *
 * Stack: GA4 + Google Tag Manager (GTM) + Meta Pixel + Meta CAPI
 *
 * RULE: Review existing tracking codes before adding new ones (§03 anti-duplication rule).
 * RULE: Measure real bookings, EGP revenue value, and source attribution — not just visits.
 *
 * @module analytics
 */

// ══════════════════════════════════════════════════════════════
// 8 REQUIRED FUNNEL EVENTS (Client Strategic Direction §03)
// ══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} AnalyticsEvent
 * @property {string} event - Canonical event name (GTM dataLayer key)
 * @property {Object} [params] - Event parameters
 */

/**
 * 1. Page View — fired on every route change
 * @param {string} pagePath
 * @param {string} pageTitle
 */
export function trackPageView(pagePath, pageTitle) {
  push({ event: 'page_view', page_path: pagePath, page_title: pageTitle });
}

/**
 * 2. View Activity — when user opens an activity card or detail page
 * @param {{ activityId: string, activityName: string, category: string, priceEgp: number }} activity
 */
export function trackViewActivity({ activityId, activityName, category, priceEgp }) {
  push({
    event: 'view_activity',
    activity_id: activityId,
    activity_name: activityName,
    category,
    value: priceEgp,
    currency: 'EGP',
  });
}

/**
 * 3. Search — when user applies destination/activity filter or search
 * @param {string} searchTerm
 * @param {{ destination?: string, activity?: string, date?: string }} filters
 */
export function trackSearch(searchTerm, filters = {}) {
  push({ event: 'search', search_term: searchTerm, filters });
}

/**
 * 4. Initiate Booking — when user clicks "Book Now" on an activity
 * @param {{ activityId: string, activityName: string, priceEgp: number }} activity
 */
export function trackInitiateBooking({ activityId, activityName, priceEgp }) {
  push({
    event: 'initiate_booking',
    activity_id: activityId,
    activity_name: activityName,
    value: priceEgp,
    currency: 'EGP',
  });
}

/**
 * 5. Add Booking Details — when user completes Step 1 (date/slot/tickets)
 * @param {{ activityId: string, date: string, timeSlot: string, egyptianCount: number, foreignerCount: number, totalEgp: number }} details
 */
export function trackAddBookingDetails({ activityId, date, timeSlot, egyptianCount, foreignerCount, totalEgp }) {
  push({
    event: 'add_booking_details',
    activity_id: activityId,
    date,
    time_slot: timeSlot,
    egyptian_count: egyptianCount,
    foreigner_count: foreignerCount,
    value: totalEgp,
    currency: 'EGP',
  });
}

/**
 * 6. Initiate Checkout — when user proceeds to payment (Step 3)
 * @param {{ bookingRef: string, totalEgp: number, activityId: string }} checkout
 */
export function trackInitiateCheckout({ bookingRef, totalEgp, activityId }) {
  push({
    event: 'initiate_checkout',
    booking_ref: bookingRef,
    activity_id: activityId,
    value: totalEgp,
    currency: 'EGP',
  });
}

/**
 * 7. Purchase / Successful Booking — MOST IMPORTANT event (BR-006)
 * Measures real EGP revenue, booking source, and conversion.
 * @param {{ bookingRef: string, totalEgp: number, activityId: string, activityName: string, source?: string }} purchase
 */
export function trackPurchase({ bookingRef, totalEgp, activityId, activityName, source = 'direct' }) {
  push({
    event: 'purchase',
    transaction_id: bookingRef,
    activity_id: activityId,
    activity_name: activityName,
    value: totalEgp,
    currency: 'EGP',
    source,
    // Meta Pixel / CAPI: same value passed for deduplication
    content_type: 'product',
    content_ids: [activityId],
  });
}

/**
 * 8. Lead Submission — B2B RFQ form submitted (BR-008)
 * @param {{ quoteRef: string, leadType: string, groupSize: number }} lead
 */
export function trackLeadSubmission({ quoteRef, leadType = 'B2B_RFQ', groupSize }) {
  push({
    event: 'lead_submission',
    quote_ref: quoteRef,
    lead_type: leadType,
    group_size: groupSize,
  });
}

// ══════════════════════════════════════════════════════════════
// INTERNAL HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Push an event to GTM dataLayer.
 * GTM then distributes to GA4, Meta Pixel, and Meta CAPI.
 * Anti-duplication: GTM deduplication is managed via GTM tags,
 * not by adding GA4 or Pixel snippets manually.
 * @param {AnalyticsEvent} eventObj
 */
function push(eventObj) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventObj);

    if (import.meta.env.DEV) {
      console.debug('[Duck Analytics]', eventObj.event, eventObj);
    }
  } catch (err) {
    // Silently fail — never break UX for analytics errors
    if (import.meta.env.DEV) {
      console.warn('[Duck Analytics] push failed:', err);
    }
  }
}
