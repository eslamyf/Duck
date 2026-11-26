/**
 * Single Source of Truth for Routing
 * DUCK Entertainment Platform
 */

export const ROUTES = Object.freeze({
  // Public Website
  HOME: '/',
  ACTIVITIES: '/activities',
  GROUPS: '/groups',
  ABOUT: '/about',
  BOOKING: '/book',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-and-conditions',
  CANCELLATION: '/cancellation-policy',

  booking: (slug) => (slug ? `/book?trip=${slug}` : '/book'),

  TRIP_DETAILS: '/trips/:slug',
  tripDetails: (slug) => `/trips/${slug}`,

  // Public Authentication
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_ACCOUNT: '/create-account',
  AUTH: '/auth',

  // 6-Role Dashboards (RBAC Protected)
  CUSTOMER_DASHBOARD: '/dashboard',
  ADMIN: '/portal/admin',
  PARTNER: '/portal/partner',
  PARTNER_B2B: '/portal/b2b',
  OPERATIONS: '/portal/ops',
  TOUR_GUIDE: '/portal/agent',
  TOUR_GUIDE_PORTAL: '/portal/guide',
  CONTENT_MANAGER: '/portal/content',
});

export const SECTIONS = Object.freeze({
  TOP: 'top',
  LOCATIONS: 'locations',
  DESTINATIONS: 'locations',
  TRIPS: 'trips',
  GROUPS_BANNER: 'groups-banner',
  MAP: 'map',
  REVIEWS: 'reviews',
  FAQ: 'faq',
  ABOUT: 'about',
  BOOK: 'trips',
});

export const VALID_SECTIONS = Object.freeze(
  new Set([
    '',
    SECTIONS.TOP,
    SECTIONS.LOCATIONS,
    'destinations',
    SECTIONS.TRIPS,
    SECTIONS.GROUPS_BANNER,
    'groups',
    SECTIONS.MAP,
    SECTIONS.REVIEWS,
    SECTIONS.FAQ,
    SECTIONS.ABOUT,
    'why-duck',
    'brand-intro',
    'final-cta',
  ])
);

/**
 * Validates whether a section anchor exists on the Home page.
 */
export function isValidSection(sectionId) {
  if (!sectionId) return true;
  const cleanId = sectionId
    .replace(/^#/, '')
    .split('?')[0]
    .split('&')[0]
    .trim()
    .toLowerCase();
  return VALID_SECTIONS.has(cleanId);
}

/**
 * Returns canonical path with section hash.
 */
export function sectionLink(sectionId) {
  if (!sectionId || sectionId === SECTIONS.TOP) {
    return `${ROUTES.HOME}#${SECTIONS.TOP}`;
  }

  return `${ROUTES.HOME}#${sectionId}`;
}
