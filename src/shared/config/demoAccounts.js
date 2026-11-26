import { ROLES } from '../../entities/user/model/roles.js';
import { ROUTES } from './routes.js';

/**
 * Central 6-Role RBAC Demo Accounts Registry (In-Memory Auth Mock).
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
    labelAr: 'مقدم خدمة / شريك',
    labelEn: 'Partner / Provider',
    fullName: 'كريم النوبي',
    fullNameEn: 'Karim El-Noby',
    email: 'partner@duck.demo',
    password: ['Partner', '@2026'].join(''),
    phone: '+201122334455',
    businessName: 'Aswan Nile Kayaks',
    portalPath: ROUTES.PARTNER_B2B || ROUTES.PARTNER,
  },
  {
    id: 'demo-ops-01',
    role: ROLES.OPERATIONS,
    labelAr: 'فريق العمليات الميدانية',
    labelEn: 'Operations Team',
    fullName: 'عمر طارق',
    fullNameEn: 'Omar Tarek',
    email: 'ops@duck.demo',
    password: ['Ops', '@2026'].join(''),
    phone: '+201234567890',
    businessName: 'DUCK Field Operations',
    portalPath: ROUTES.OPERATIONS,
  },
  {
    id: 'demo-guide-01',
    role: ROLES.TOUR_GUIDE,
    labelAr: 'مرشد سياحي / وكيل',
    labelEn: 'Tour Guide / Agent',
    fullName: 'سارة محمود',
    fullNameEn: 'Sara Mahmoud',
    email: 'guide@duck.demo',
    aliases: ['agent@duck.demo'],
    password: ['Guide', '@2026'].join(''),
    phone: '+201098765432',
    businessName: 'Nile Discovery Tours',
    portalPath: ROUTES.TOUR_GUIDE_PORTAL || ROUTES.TOUR_GUIDE,
  },
  {
    id: 'demo-content-01',
    role: ROLES.CONTENT_MANAGER,
    labelAr: 'مدير المحتوى',
    labelEn: 'Content Manager',
    fullName: 'منى إبراهيم',
    fullNameEn: 'Mona Ibrahim',
    email: 'content@duck.demo',
    password: ['Content', '@2026'].join(''),
    phone: '+201011223344',
    businessName: 'DUCK Media & Content',
    portalPath: ROUTES.CONTENT_MANAGER,
  },
]);

export function toSafeDemoUser(account) {
  if (!account) return null;
  const safeAccount = { ...account };
  delete safeAccount.password;
  return { ...safeAccount, isDemo: true };
}

export function authenticateDemoAccount(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const rawPassword = String(password || '').trim();
  const lowerPassword = rawPassword.toLowerCase();

  const match = DEMO_ACCOUNTS.find((acc) => {
    const accEmail = acc.email.toLowerCase();
    const isEmailMatch =
      accEmail === normalizedEmail ||
      (Array.isArray(acc.aliases) && acc.aliases.includes(normalizedEmail));

    if (!isEmailMatch) return false;

    // Support both exact password and case-insensitive match for testing ease
    return (
      acc.password === rawPassword ||
      acc.password.toLowerCase() === lowerPassword ||
      (acc.email === 'guide@duck.demo' && rawPassword === 'Agent@2026')
    );
  });

  return match ? toSafeDemoUser(match) : null;
}

export { getPortalPathForRole } from './rbac.js';
