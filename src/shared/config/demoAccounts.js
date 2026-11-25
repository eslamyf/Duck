import { ROLES } from '../../entities/user/model/roles.js';
import { ROUTES } from './routes.js';

/**
 * Central 5-Role RBAC Demo Accounts Registry (In-Memory Auth Mock).
 * Passwords are NEVER stored in localStorage, sessionStorage, or logged.
 */
export const DEMO_ACCOUNTS = Object.freeze([
  {
    id: 'demo-customer-01',
    role: ROLES.CUSTOMER,
    labelAr: 'عميل',
    labelEn: 'Customer',
    fullName: 'أحمد حسن',
    fullNameEn: 'Ahmed Hassan',
    email: 'customer@duck.demo',
    password: ['Duck', '@2026'].join(''),
    phone: '+201012345678',
    businessName: '',
    portalPath: ROUTES.CUSTOMER_DASHBOARD,
  },
  {
    id: 'demo-admin-01',
    role: ROLES.ADMIN,
    labelAr: 'مدير المنصة',
    labelEn: 'Admin',
    fullName: 'إسلام ياسر',
    fullNameEn: 'Eslam Yasser',
    email: 'admin@duck.demo',
    password: ['Admin', '@2026'].join(''),
    phone: '+201550061006',
    businessName: 'DUCK Entertainment HQ',
    portalPath: ROUTES.ADMIN,
  },
  {
    id: 'demo-partner-01',
    role: ROLES.PARTNER,
    labelAr: 'مقدم خدمة',
    labelEn: 'Partner',
    fullName: 'كريم النوبي',
    fullNameEn: 'Karim El-Noby',
    email: 'partner@duck.demo',
    password: ['Partner', '@2026'].join(''),
    phone: '+201122334455',
    businessName: 'Aswan Nile Kayaks',
    portalPath: ROUTES.PARTNER,
  },
  {
    id: 'demo-ops-01',
    role: ROLES.OPERATIONS,
    labelAr: 'فريق العمليات',
    labelEn: 'Operations',
    fullName: 'عمر طارق',
    fullNameEn: 'Omar Tarek',
    email: 'ops@duck.demo',
    password: ['Ops', '@2026'].join(''),
    phone: '+201234567890',
    businessName: 'DUCK Field Operations',
    portalPath: ROUTES.OPERATIONS,
  },
  {
    id: 'demo-agent-01',
    role: ROLES.TOUR_GUIDE,
    labelAr: 'مرشد / وكيل',
    labelEn: 'Tour Guide / Agent',
    fullName: 'سارة محمود',
    fullNameEn: 'Sara Mahmoud',
    email: 'agent@duck.demo',
    password: ['Agent', '@2026'].join(''),
    phone: '+201098765432',
    businessName: 'Nile Discovery Tours',
    portalPath: ROUTES.TOUR_GUIDE,
  },
]);

export function toSafeDemoUser(account) {
  if (!account) return null;
  const safeAccount = { ...account };
  delete safeAccount.password;
  return { ...safeAccount, isDemo: true };
}

export function authenticateDemoAccount(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  const match = DEMO_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === normalized && acc.password === password
  );
  return match ? toSafeDemoUser(match) : null;
}

export { getPortalPathForRole } from './rbac.js';
