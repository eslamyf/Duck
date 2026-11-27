import { notifyAuthUpdated } from '../../notification/index.js';

export const CURRENT_USER_KEY = 'duck_current_user';
export const SESSION_USER_KEY = 'duck_session_user';

/**
 * Lightweight session reader safe for initial header/nav bundle without importing demo credentials.
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const persistentUser = localStorage.getItem(CURRENT_USER_KEY);
    const sessionUser = sessionStorage.getItem(SESSION_USER_KEY);
    const storedUser = persistentUser || sessionUser;
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

/**
 * Clear active client session and broadcast update event.
 */
export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
  notifyAuthUpdated();
}
