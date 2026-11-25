/**
 * Single Source of Truth for Routing
 * DUCK Entertainment Platform
 */

export const ROUTES = Object.freeze({
  // Public Website
  HOME: '/',
  GROUPS: '/groups',
  ABOUT: '/about',
  BOOKING: '/book',

  booking: (slug) => (slug ? `/book?trip=${slug}` : '/book'),

  TRIP_DETAILS: '/trips/:slug',
  tripDetails: (slug) => `/trips/${slug}`,

  // Public Authentication
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_ACCOUNT: '/create-account',
  AUTH: '/auth',

  // 5-Role Dashboards (RBAC Protected)
  CUSTOMER_DASHBOARD: '/dashboard',
  ADMIN: '/portal/admin',
  PARTNER: '/portal/partner',
  OPERATIONS: '/portal/ops',
  TOUR_GUIDE: '/portal/agent',
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

/**
 * Returns canonical path with section hash.
 */
export function sectionLink(sectionId) {
  if (!sectionId || sectionId === SECTIONS.TOP) {
    return `${ROUTES.HOME}#${SECTIONS.TOP}`;
  }

  return `${ROUTES.HOME}#${sectionId}`;
}
