/**
 * Single Source of Truth for Routing and Internal Section Anchors
 * DUCK Entertainment Platform
 */

export const ROUTES = Object.freeze({
  HOME: '/',
  GROUPS: '/groups',
  ABOUT: '/about',
  BOOKING: '/book',
  booking: (slug) => (slug ? `/book?trip=${slug}` : '/book'),
  TRIP_DETAILS: '/trips/:slug',
  tripDetails: (slug) => `/trips/${slug}`,
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_ACCOUNT: '/create-account',
  AUTH: '/auth',
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
 * Returns canonical path with section hash, e.g. sectionLink('trips') -> '/#trips'
 * @param {string} sectionId - Target section ID
 * @returns {string}
 */
export function sectionLink(sectionId) {
  if (!sectionId || sectionId === SECTIONS.TOP) return `${ROUTES.HOME}#${SECTIONS.TOP}`;
  return `${ROUTES.HOME}#${sectionId}`;
}
