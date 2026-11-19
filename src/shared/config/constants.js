/**
 * DUCK Entertainment — Platform Constants
 * Source: DUCK____Answers___Strategic_Direction.pdf
 * IEEE 29148 SRS v3.1 — All Business Rules (BR-001 → BR-010)
 * @module constants
 */

// ══════════════════════════════════════════════════════════════
// BRAND IDENTITY (BR-CON-02 — Zero hallucination zone)
// ══════════════════════════════════════════════════════════════
/** Official brand colors — from Client Strategic Direction PDF */
export const BRAND_COLORS = Object.freeze({
  /** Primary accent: Sunburst Yellow */
  YELLOW: '#FDFB45',
  /** Dark base: Deep Navy */
  NAVY: '#0C1226',
  /** Water theme: Nile Teal-Blue */
  BLUE: '#147D9F',
});

// ══════════════════════════════════════════════════════════════
// OFFICIAL CONTACT INFO (SI-02 — Approved, never invent)
// ══════════════════════════════════════════════════════════════
export const CONTACT = Object.freeze({
  PHONE: '+201550061006',
  WHATSAPP_URL: 'https://wa.me/201550061006',
  EMAIL: 'duck.asw@gmail.com',
  WEBSITE: 'https://www.duckegy.com/',
  ADDRESS_EN: 'Aswan, Egypt',
  ADDRESS_AR: 'أسوان، جمهورية مصر العربية',
  INSTAGRAM: 'https://www.instagram.com/duckegy/',
  FACEBOOK: 'https://www.facebook.com/duckegy/',
  TIKTOK: 'https://www.tiktok.com/@duckegy',
});

// ══════════════════════════════════════════════════════════════
// EQUIPMENT INVENTORY (BR-003 — Kayak: 20 | Water Bike: 2)
// ══════════════════════════════════════════════════════════════
/** Known fleet capacities — from Client Strategic Direction §06 */
export const EQUIPMENT_CAPACITY = Object.freeze({
  KAYAK: 20,         // 20 kayak units
  WATER_BIKE: 2,     // 2 water bikes — strictly capped, show scarcity badge
  SUP: null,         // configurable pre-launch; set via Admin Dashboard
});

// ══════════════════════════════════════════════════════════════
// BOOKING BUSINESS RULES
// ══════════════════════════════════════════════════════════════
/** Minimum group size to trigger B2B/Group flow (BR-008) */
export const B2B_MIN_GROUP_SIZE = 20;

/** Free cancellation window in hours (BR-007) */
export const FREE_CANCELLATION_HOURS = 24;

/** Max participant weight in kg (BR-004) */
export const MAX_PARTICIPANT_WEIGHT_KG = 130;

/** All 6 booking lifecycle statuses (BR-007 / BR-010) */
export const BOOKING_STATUS = Object.freeze({
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  PAID:      'Paid',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED:  'Refunded',
});

/** Operating hours rule (BR-001) */
export const OPERATING_HOURS = 'Sunrise to Sunset';

// ══════════════════════════════════════════════════════════════
// CURRENCIES (BR-006 — EGP is accounting/payment base)
// ══════════════════════════════════════════════════════════════
/** Supported display currencies — EGP is the ONLY settlement currency */
export const CURRENCIES = Object.freeze({
  EGP: { code: 'EGP', symbol: 'ج.م', isBase: true,  isIndicative: false },
  USD: { code: 'USD', symbol: '$',    isBase: false, isIndicative: true  },
  EUR: { code: 'EUR', symbol: '€',    isBase: false, isIndicative: true  },
});

/** Default currency — always EGP for payments */
export const DEFAULT_CURRENCY = 'EGP';

// ══════════════════════════════════════════════════════════════
// LANGUAGES & LOCALES (FR-009)
// ══════════════════════════════════════════════════════════════
/** Supported locales at launch; architecture is extensible to DE/FR/RU */
export const LOCALES = Object.freeze({
  AR: { code: 'ar', dir: 'rtl', label: 'العربية' },
  EN: { code: 'en', dir: 'ltr', label: 'English' },
  // Future expansion (not at launch):
  // DE: { code: 'de', dir: 'ltr', label: 'Deutsch' },
  // FR: { code: 'fr', dir: 'ltr', label: 'Français' },
  // RU: { code: 'ru', dir: 'ltr', label: 'Русский' },
});

export const DEFAULT_LOCALE = 'ar';

// ══════════════════════════════════════════════════════════════
// PERFORMANCE BUDGETS (NFR-001)
// ══════════════════════════════════════════════════════════════
/** First Contentful Paint target on 4G mobile (ms) */
export const FCP_BUDGET_MS = 2500;

/** Debounce delay for search/filter inputs (ms) */
export const SEARCH_DEBOUNCE_MS = 250;

/** Minimum touch target size (px) — WCAG + mobile ergonomics */
export const MIN_TOUCH_TARGET_PX = 44;

/** Minimum form input font size to prevent iOS Safari zoom */
export const MIN_INPUT_FONT_SIZE_PX = 16;

// ══════════════════════════════════════════════════════════════
// B2B PARTNER SEGMENTS (BR-008)
// ══════════════════════════════════════════════════════════════
export const B2B_PARTNER_TYPES = Object.freeze([
  { id: 'company',       labelAr: 'الشركات',              labelEn: 'Companies' },
  { id: 'school',        labelAr: 'المدارس والجامعات',    labelEn: 'Schools & Universities' },
  { id: 'hotel',         labelAr: 'الفنادق',              labelEn: 'Hotels' },
  { id: 'tour_guide',    labelAr: 'المرشدون السياحيون',  labelEn: 'Tour Guides' },
  { id: 'tour_operator', labelAr: 'منظمو الرحلات',       labelEn: 'Tour Operators' },
  { id: 'event',         labelAr: 'الفعاليات والمناسبات', labelEn: 'Events & Occasions' },
]);

// ══════════════════════════════════════════════════════════════
// BOOKING REFERENCE FORMAT (BR-010)
// ══════════════════════════════════════════════════════════════
/** Generate a booking reference in the approved format */
export const BOOKING_REF_PREFIX = 'DUCK';

export function generateBookingRef() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${BOOKING_REF_PREFIX}-${year}-${rand}`;
}

/** Generate a quote reference for B2B RFQ */
export const QUOTE_REF_PREFIX = 'QUO';

export function generateQuoteRef() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  return `${QUOTE_REF_PREFIX}-${year}-${rand}`;
}
