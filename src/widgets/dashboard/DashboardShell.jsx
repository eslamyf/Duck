import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faXmark,
  faRightFromBracket,
  faHouse,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import duckLogo from '../../shared/assets/icons/duck-mark-192w.webp';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { DEMO_ACCOUNTS } from '../../shared/config/demoAccounts.js';
import { getPortalPathForRole } from '../../shared/config/rbac.js';
import {
  getCurrentUser,
  logoutUser,
  loginUser,
} from '../../entities/user/api/authService.js';
import { NotificationBell } from '../notifications/index.js';
import { KayakLanguageSwitch } from '../../features/currency-language-switcher/index.js';

/**
 * Unified Dashboard Shell aligned with Final_4.html (.pm / .pm-side / .pm-top / .pm-main).
 * Single source of truth for all 5 role portals. Zero role switcher.
 */
export default function DashboardShell({
  portalTitle,
  portalSubtitle,
  navItems = [],
  activeTab,
  onTabChange,
  children,
  headerActions,
}) {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = getCurrentUser();
  const displayName =
    (isArabic ? currentUser?.fullName : currentUser?.fullNameEn || currentUser?.fullName) ||
    t('common.brandName');

  const handleLogout = () => {
    logoutUser();
    setSidebarOpen(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface-mist text-brand-navy font-body print:bg-white"
    >
      <div className="flex min-h-screen">
        {/* Mobile Scrim */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-brand-navy/55 backdrop-blur-xs lg:hidden print:hidden"
          />
        )}

        {/* Classic Sidebar (.pm-side) */}
        <aside
          className={`fixed inset-y-0 start-0 z-50 flex w-[264px] flex-col border-white/10 bg-brand-navy px-3.5 py-4 text-white shadow-soft transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:border-e lg:translate-x-0 print:hidden ${
            sidebarOpen
              ? 'translate-x-0'
              : isArabic
                ? 'translate-x-full'
                : '-translate-x-full'
          }`}
        >
          {/* .pm-brand */}
          <div className="flex shrink-0 items-center justify-between gap-2.5 border-b border-white/10 px-1 pb-3.5">
            <Link
              to={ROUTES.HOME}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5"
            >
              <span className="inline-flex items-center rounded-xl bg-surface-white px-2.5 py-1 shadow-xs">
                <img
                  src={duckLogo}
                  alt={t('common.brandName')}
                  className="h-7 w-auto object-contain"
                />
              </span>
              <span className="rounded-full bg-brand-yellow/15 px-2.5 py-0.5 text-[11px] font-bold text-brand-yellow">
                {currentUser?.role || 'Portal'}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* .pm-user */}
          <div className="my-3 shrink-0 rounded-[14px] border border-white/10 bg-white/6 px-3 py-2.5">
            <b className="block truncate text-sm font-bold text-brand-yellow">
              {displayName}
            </b>
            <small className="mt-0.5 block truncate text-xs text-white/75">
              {currentUser?.email || portalTitle}
            </small>

            {/* In-Dashboard Demo Role Switcher */}
            <div className="mt-2.5 pt-2 border-t border-white/10">
              <label
                htmlFor="sidebarRoleSwitcher"
                className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1"
              >
                {isArabic ? 'مبدّل الأدوار التجريبي:' : 'Switch Demo Role:'}
              </label>
              <select
                id="sidebarRoleSwitcher"
                value={currentUser?.role || ''}
                onChange={async (e) => {
                  const targetRole = e.target.value;
                  const acc = DEMO_ACCOUNTS.find((a) => a.role === targetRole);
                  if (acc) {
                    await loginUser({
                      email: acc.email,
                      password: acc.password,
                      rememberMe: true,
                    });
                    setSidebarOpen(false);
                    navigate(getPortalPathForRole(acc.role), { replace: true });
                  }
                }}
                className="w-full rounded-lg border border-white/20 bg-brand-navy text-xs font-bold text-brand-yellow px-2 py-1.5 outline-none cursor-pointer focus:border-brand-yellow"
              >
                {DEMO_ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.role} className="bg-brand-navy text-white">
                    {isArabic ? a.labelAr : a.labelEn} ({a.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* .pm-nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onTabChange?.(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`flex min-h-[42px] w-full items-center gap-2.5 rounded-[11px] border-s-[3px] px-3 py-2 text-start text-[13.5px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'border-brand-yellow bg-brand-yellow/15 text-brand-yellow font-bold'
                      : 'border-transparent text-white/80 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {item.icon && (
                    <FontAwesomeIcon icon={item.icon} className="w-4 text-center" />
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* .pm-foot */}
          <div className="mt-3 shrink-0 space-y-1.5 border-t border-white/10 pt-3">
            <Link
              to={ROUTES.HOME}
              onClick={() => setSidebarOpen(false)}
              className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/6 px-2.5 text-xs font-semibold text-white transition hover:bg-white/14"
            >
              <FontAwesomeIcon icon={faHouse} className="text-brand-yellow" />
              <span>{isArabic ? 'العودة للموقع' : 'Back to Website'}</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[10px] border border-red-400/45 bg-red-500/15 px-2.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/25 hover:text-white cursor-pointer"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>{isArabic ? 'تسجيل الخروج' : 'Log Out'}</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace (.pm-main) */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* .pm-top */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand-blue/15 bg-surface-white px-4 py-3 shadow-card sm:px-6 print:hidden">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex min-h-[38px] items-center justify-center rounded-[10px] border border-brand-blue/20 bg-surface-white px-2.5 text-brand-navy transition hover:bg-surface-mist lg:hidden"
                aria-label="Open menu"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                  {portalSubtitle || portalTitle}
                </p>
                <h1 className="truncate font-heading text-base font-extrabold text-brand-navy sm:text-[17px]">
                  {portalTitle}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {headerActions}

              <NotificationBell compact />

              <KayakLanguageSwitch />

              <Link
                to={ROUTES.HOME}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-brand-blue/20 bg-surface-white px-3 py-1.5 text-xs font-bold text-brand-navy transition hover:bg-surface-mist"
              >
                <FontAwesomeIcon icon={faHouse} className="text-brand-blue" />
                <span>{isArabic ? 'الموقع' : 'Site'}</span>
              </Link>

              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-3 py-1.5 text-xs font-bold text-brand-yellow">
                <FontAwesomeIcon icon={faUser} className="text-[11px]" />
                <span className="max-w-[120px] truncate">{displayName.split(' ')[0]}</span>
              </div>
            </div>
          </header>

          {/* .pm-bd */}
          <main className="flex-1 p-4 sm:p-6 lg:px-7 lg:py-6 print:p-0">
            <div className="mx-auto w-full max-w-[1440px] space-y-5 print:max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
