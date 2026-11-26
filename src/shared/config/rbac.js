import { ROLES, PERMISSIONS, can } from '../../entities/user/model/roles.js';
import { ROUTES } from './routes.js';

export const DASHBOARD_ROLES = Object.freeze([
  ROLES.CUSTOMER,
  ROLES.ADMIN,
  ROLES.PARTNER,
  ROLES.OPERATIONS,
  ROLES.TOUR_GUIDE,
  ROLES.CONTENT_MANAGER,
]);

export const ROLE_PORTAL_MAP = Object.freeze({
  [ROLES.CUSTOMER]: ROUTES.CUSTOMER_DASHBOARD,
  [ROLES.ADMIN]: ROUTES.ADMIN,
  [ROLES.PARTNER]: ROUTES.PARTNER,
  [ROLES.OPERATIONS]: ROUTES.OPERATIONS,
  [ROLES.TOUR_GUIDE]: ROUTES.TOUR_GUIDE,
  [ROLES.CONTENT_MANAGER]: ROUTES.CONTENT_MANAGER,
});

export function getPortalPathForRole(role) {
  return ROLE_PORTAL_MAP[role] || ROUTES.CUSTOMER_DASHBOARD;
}

export function hasPermission(user, permission) {
  if (!user?.role) return false;
  return can(user.role, permission, user.permissions || []);
}

export { ROLES, PERMISSIONS };
