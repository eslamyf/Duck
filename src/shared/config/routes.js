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

  // Admin Portal
  ADMIN: '/portal/admin',
  ADMIN_BOOKINGS: '/portal/admin/bookings',
  ADMIN_CUSTOMERS: '/portal/admin/customers',
  ADMIN_ACTIVITIES: '/portal/admin/activities',
  ADMIN_AVAILABILITY: '/portal/admin/availability',
  ADMIN_PROVIDERS: '/portal/admin/providers',
  ADMIN_PRICING: '/portal/admin/pricing',
  ADMIN_CONTENT: '/portal/admin/content',
  ADMIN_USERS: '/portal/admin/users',
  ADMIN_REPORTS: '/portal/admin/reports',

  // Other Staff Portals
  OPERATIONS: '/portal/ops',
  TOUR_GUIDE: '/portal/guide',
  CONTENT_MANAGER: '/portal/content',
  PARTNER: '/portal/b2b',
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