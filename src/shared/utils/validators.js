/**
 * Shared Form Validators — DUCK Entertainment Platform
 * Single Source of Truth for form validation logic
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EGYPT_PHONE_REGEX = /^(?:\+?20|0)?1[0125]\d{8}$/;

/**
 * Validates email address format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates phone number (Egyptian local or international format)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return EGYPT_PHONE_REGEX.test(cleaned) || cleaned.length >= 10;
}

/**
 * Validates password strength (minimum 8 characters)
 * @param {string} password
 * @param {number} minLength
 * @returns {boolean}
 */
export function isValidPassword(password, minLength = 8) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= minLength;
}

/**
 * Checks if a value is non-empty
 * @param {any} val
 * @returns {boolean}
 */
export function isNonEmpty(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (typeof val === 'boolean') return val;
  return Boolean(val);
}
