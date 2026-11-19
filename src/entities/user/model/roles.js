/**
 * DUCK Entertainment — User Roles & RBAC Permissions
 * Source: DUCK____Answers___Strategic_Direction.pdf §01 (User Roles & Permissions)
 * IEEE 29148 SRS v3.1 — BR-009
 * @module roles
 */

/**
 * All 6 client-mandated RBAC roles.
 * @readonly
 * @enum {string}
 */
export const ROLES = Object.freeze({
  /** Guest/unauthenticated — can browse and guest-checkout */
  GUEST: 'Guest',
  /** Authenticated individual buyer — booking, payment, My Bookings */
  CUSTOMER: 'Customer',
  /** Full platform governance — all permissions */
  ADMIN: 'Admin',
  /** Scoped to own services, prices, slots, and own bookings */
  PARTNER: 'Partner',
  /** Booking execution, confirmed→completed, slot/fleet control */
  OPERATIONS: 'Operations',
  /** Create/track customer & group booking requests within granted permissions */
  TOUR_GUIDE: 'TourGuide',
  /** Manage copy, photos, descriptions — no financial/admin permissions */
  CONTENT_MANAGER: 'ContentManager',
});

/**
 * Granular permission keys used throughout the platform.
 * @readonly
 * @enum {string}
 */
export const PERMISSIONS = Object.freeze({
  // ── Public / Guest ──────────────────────────────────────────────────
  BROWSE_ACTIVITIES:        'browse_activities',
  VIEW_PRICING:             'view_pricing',
  SUBMIT_B2B_RFQ:           'submit_b2b',

  // ── Customer ────────────────────────────────────────────────────────
  BOOK_ACTIVITY:            'book',
  MAKE_PAYMENT:             'payment',
  VIEW_OWN_BOOKINGS:        'view_own_bookings',
  CANCEL_OWN_BOOKING:       'cancel_own_booking',
  MANAGE_OWN_ACCOUNT:       'manage_account',

  // ── Admin ────────────────────────────────────────────────────────────
  VIEW_ALL_BOOKINGS:        'view_all_bookings',
  EDIT_ALL_BOOKINGS:        'edit_all_bookings',
  MANAGE_ACTIVITIES:        'manage_activities',
  MANAGE_PRICING:           'manage_pricing',
  MANAGE_PROVIDERS:         'manage_providers',
  MANAGE_DESTINATIONS:      'manage_destinations',
  MANAGE_INVENTORY:         'manage_inventory',
  MANAGE_USERS:             'manage_users',
  CUSTOMIZE_PERMISSIONS:    'customize_permissions',
  VIEW_B2B_QUOTES:          'view_b2b_quotes',
  MANAGE_B2B_QUOTES:        'manage_b2b_quotes',
  VIEW_ANALYTICS:           'view_analytics',

  // ── Partner / Service Provider ───────────────────────────────────────
  MANAGE_OWN_SERVICES:      'manage_own_services',
  MANAGE_OWN_PRICING:       'manage_own_pricing',
  MANAGE_OWN_SLOTS:         'manage_own_slots',
  MANAGE_OWN_CAPACITY:      'manage_own_capacity',
  VIEW_OWN_PARTNER_BOOKINGS: 'view_own_partner_bookings',

  // ── Operations ───────────────────────────────────────────────────────
  TRACK_BOOKINGS:           'track_bookings',
  CONFIRM_EXECUTION:        'confirm_execution',
  MANAGE_SLOT_AVAILABILITY: 'manage_slot_availability',

  // ── Tour Guide / Agent ───────────────────────────────────────────────
  CREATE_BOOKING_REQUESTS:  'create_booking_requests',
  TRACK_BOOKING_REQUESTS:   'track_booking_requests',

  // ── Content Manager ──────────────────────────────────────────────────
  EDIT_CONTENT:             'edit_content',
  MANAGE_PHOTOS:            'manage_photos',
  MANAGE_DESCRIPTIONS:      'manage_descriptions',
  MANAGE_OFFERS:            'manage_offers',
});

/**
 * Default permission sets for each role.
 * Admin can override per-user via CUSTOMIZE_PERMISSIONS.
 * @type {Record<string, string[]>}
 */
export const DEFAULT_ROLE_PERMISSIONS = Object.freeze({
  [ROLES.GUEST]: [
    PERMISSIONS.BROWSE_ACTIVITIES,
    PERMISSIONS.VIEW_PRICING,
    PERMISSIONS.SUBMIT_B2B_RFQ,
  ],

  [ROLES.CUSTOMER]: [
    PERMISSIONS.BROWSE_ACTIVITIES,
    PERMISSIONS.VIEW_PRICING,
    PERMISSIONS.SUBMIT_B2B_RFQ,
    PERMISSIONS.BOOK_ACTIVITY,
    PERMISSIONS.MAKE_PAYMENT,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CANCEL_OWN_BOOKING,
    PERMISSIONS.MANAGE_OWN_ACCOUNT,
  ],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),  // ALL permissions

  [ROLES.PARTNER]: [
    PERMISSIONS.BROWSE_ACTIVITIES,
    PERMISSIONS.VIEW_PRICING,
    PERMISSIONS.MANAGE_OWN_SERVICES,
    PERMISSIONS.MANAGE_OWN_PRICING,
    PERMISSIONS.MANAGE_OWN_SLOTS,
    PERMISSIONS.MANAGE_OWN_CAPACITY,
    PERMISSIONS.VIEW_OWN_PARTNER_BOOKINGS,
  ],

  [ROLES.OPERATIONS]: [
    PERMISSIONS.BROWSE_ACTIVITIES,
    PERMISSIONS.TRACK_BOOKINGS,
    PERMISSIONS.CONFIRM_EXECUTION,
    PERMISSIONS.MANAGE_SLOT_AVAILABILITY,
    PERMISSIONS.VIEW_ALL_BOOKINGS,
  ],

  [ROLES.TOUR_GUIDE]: [
    PERMISSIONS.BROWSE_ACTIVITIES,
    PERMISSIONS.VIEW_PRICING,
    PERMISSIONS.SUBMIT_B2B_RFQ,
    PERMISSIONS.CREATE_BOOKING_REQUESTS,
    PERMISSIONS.TRACK_BOOKING_REQUESTS,
    PERMISSIONS.BOOK_ACTIVITY,
  ],

  [ROLES.CONTENT_MANAGER]: [
    PERMISSIONS.BROWSE_ACTIVITIES,
    PERMISSIONS.VIEW_PRICING,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.MANAGE_PHOTOS,
    PERMISSIONS.MANAGE_DESCRIPTIONS,
    PERMISSIONS.MANAGE_OFFERS,
  ],
});

/**
 * Check if a role has a given permission (considering optional overrides).
 * @param {string} role - One of ROLES values
 * @param {string} permission - One of PERMISSIONS values
 * @param {string[]} [overrides] - Custom per-user permission additions
 * @returns {boolean}
 */
export function can(role, permission, overrides = []) {
  const base = DEFAULT_ROLE_PERMISSIONS[role] ?? [];
  return base.includes(permission) || overrides.includes(permission);
}

/**
 * Direct staff portal URL mapping (never exposed publicly).
 * @readonly
 */
export const STAFF_PORTAL_PATHS = Object.freeze({
  [ROLES.ADMIN]:           '/portal/admin',
  [ROLES.OPERATIONS]:      '/portal/ops',
  [ROLES.TOUR_GUIDE]:      '/portal/guide',
  [ROLES.CONTENT_MANAGER]: '/portal/content',
  [ROLES.PARTNER]:         '/portal/b2b',
});
