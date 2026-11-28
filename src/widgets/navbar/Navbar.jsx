import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import duckLogo280 from '../../shared/assets/icons/duck-logo-280w.webp';
import duckLogo560 from '../../shared/assets/icons/duck-logo-560w.webp';

import { useTranslation } from '../../shared/i18n/index.js';
import Button from '../../shared/ui/Button/index.js';
import Badge from '../../shared/ui/Badge/index.js';
import DuckIcon from '../../shared/ui/Icon/DuckIcon.jsx';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { getPortalPathForRole, ROLES } from '../../shared/config/rbac.js';
import { KayakLanguageSwitch } from '../../features/currency-language-switcher/index.js';

import { getCurrentUser } from '../../entities/user/api/authSession.js';
import { AUTH_UPDATED_EVENT } from '../../entities/notification/index.js';
import { NotificationBell } from '../notifications/index.js';

export default function Navbar({ onBookClick }) {
  const { lang, t } = useTranslation();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS.TOP);
  const [temp, setTemp] = useState('');
  const [authTick, setAuthTick] = useState(0);

  useEffect(() => {
    const syncAuth = () => setAuthTick((n) => n + 1);
    window.addEventListener(AUTH_UPDATED_EVENT, syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener(AUTH_UPDATED_EVENT, syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  // Current Logged-in User (refreshed on auth event or navigation)
  const currentUser = (() => {
    void authTick;
    return getCurrentUser();
  })();

  // Defer non-critical weather fetch until idle so initial LCP/TBT stays zero-overhead
  useEffect(() => {
    let cancelled = false;
    const fetchWeather = () => {
      fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=24.09&longitude=32.9&current=temperature_2m'
      )
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled && data?.current?.temperature_2m !== undefined) {
            const val = Math.round(data.current.temperature_2m);
            setTemp(String(val));
          }
        })
        .catch(() => { });
    };

    const scheduleIdleFetch = () => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(fetchWeather, { timeout: 3500 });
        cleanupIdle = () => {
          if ('cancelIdleCallback' in window) window.cancelIdleCallback(id);
        };
      } else {
        fetchWeather();
      }
    };

    let cleanupIdle = null;
    const timer = setTimeout(scheduleIdleFetch, 2500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (cleanupIdle) cleanupIdle();
    };
  }, []);

  // Update active section based on scroll & hash (only when on home page)
  useEffect(() => {
    if (location.pathname !== ROUTES.HOME) return;

    const sectionIds = [
      SECTIONS.TRIPS,
      SECTIONS.LOCATIONS,
      SECTIONS.REVIEWS,
      SECTIONS.MAP,
      SECTIONS.FAQ,
    ];

    const handleScroll = () => {
      // Top of page
      if (window.scrollY < 120) {
        setActiveSection(SECTIONS.TOP);
        return;
      }

      // Bottom of page: highlight FAQ
      const scrollBottom = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= totalHeight - 150) {
        setActiveSection(SECTIONS.FAQ);
        return;
      }

      let current = SECTIONS.TOP;
      const headerOffset = 220;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active when the section top has scrolled past headerOffset and bottom is still visible
          if (rect.top <= headerOffset && rect.bottom > 80) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    // Listen to hash changes (e.g. #reviews or #faq)
    const handleHashChange = () => {
      const h = window.location.hash?.replace(/^#/, '').toLowerCase();
      if (h && [SECTIONS.TOP, ...sectionIds].includes(h)) {
        setActiveSection(h);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const tripsTarget = currentUser
    ? currentUser.role === ROLES.CUSTOMER
      ? `${ROUTES.CUSTOMER_DASHBOARD}?tab=services`
      : currentUser.role === ROLES.ADMIN
        ? `${ROUTES.ADMIN}?tab=trips`
        : currentUser.role === ROLES.PARTNER
          ? `${ROUTES.PARTNER}?tab=inventory`
          : currentUser.role === ROLES.TOUR_GUIDE
            ? `${ROUTES.TOUR_GUIDE}?tab=create`
            : `${ROUTES.OPERATIONS}?tab=departures`
    : sectionLink(SECTIONS.TRIPS);

  const navLinks = [
    {
      to: sectionLink(SECTIONS.TOP),
      label: t('nav.home'),
      icon: 'faHouse',
      sectionId: SECTIONS.TOP,
    },
    {
      to: tripsTarget,
      label: t('nav.trips'),
      icon: 'faCompass',
      sectionId: SECTIONS.TRIPS,
    },
    {
      to: sectionLink(SECTIONS.DESTINATIONS),
      label: t('nav.destinations'),
      icon: 'faLocationDot',
      sectionId: SECTIONS.DESTINATIONS,
    },
    {
      to: ROUTES.ACTIVITIES,
      label: t('nav.activities'),
      icon: 'faWater',
      isActivities: true,
    },
    {
      to: sectionLink(SECTIONS.REVIEWS),
      label: t('nav.reviews'),
      icon: 'faStar',
      sectionId: SECTIONS.REVIEWS,
    },
    {
      to: sectionLink(SECTIONS.MAP),
      label: t('nav.exploreMapAria'),
      icon: 'faMapLocationDot',
      sectionId: SECTIONS.MAP,
    },
    {
      to: ROUTES.GROUPS,
      label: t('nav.groups'),
      icon: 'faUsersLine',
      isGroups: true,
    },
    {
      to: sectionLink(SECTIONS.FAQ),
      label: t('nav.faq'),
      icon: 'faCircleQuestion',
      sectionId: SECTIONS.FAQ,
    },
    {
      to: ROUTES.ABOUT,
      label: t('nav.about'),
      icon: 'faUsers',
      isAbout: true,
    },
    {
      to: ROUTES.CONTACT,
      label: t('nav.contact'),
      icon: 'faEnvelope',
      isContact: true,
    },
  ];

  const isRtl = lang === 'ar';

  // Account Information
  const userInitial = (
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.email ||
    ''
  ).trim().charAt(0).toUpperCase();

  const accountName =
    currentUser?.fullName ||
    currentUser?.name ||
    (isRtl ? 'لوحة التحكم' : 'Dashboard');
  const dashboardLabel = isRtl ? 'لوحة التحكم' : 'Dashboard';
  const dashboardPath = currentUser ? getPortalPathForRole(currentUser.role) : ROUTES.LOGIN;

  const checkIsActive = (link) => {
    // About page
    if (location.pathname === ROUTES.ABOUT) {
      return Boolean(link.isAbout);
    }

    // Activities page
    if (
      location.pathname === ROUTES.ACTIVITIES ||
      location.pathname.startsWith(`${ROUTES.ACTIVITIES}/`)
    ) {
      return Boolean(link.isActivities);
    }

    // Groups page
    if (location.pathname === ROUTES.GROUPS) {
      return Boolean(link.isGroups);
    }

    // Contact page
    if (location.pathname === ROUTES.CONTACT) {
      return Boolean(link.isContact);
    }

    // Don't keep Home section links active on other pages
    if (location.pathname !== ROUTES.HOME) {
      return false;
    }

    // Active section on Home page only
    return activeSection === link.sectionId;
  };

  return (
    <>
      {/* App-Style Mobile Top Header (< 768px only: Clean White matching Desktop) */}
      <header
        dir={isRtl ? 'rtl' : 'ltr'}
        className="md:hidden fixed top-0 inset-x-0 z-[9999] bg-white text-brand-navy h-[60px] px-4 flex items-center justify-between border-b border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] font-body print:hidden"
      >
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          aria-label={t('common.brandName')}
        >
          <img
            src={duckLogo280}
            srcSet={`${duckLogo280} 280w, ${duckLogo560} 560w`}
            sizes="124px"
            alt={t('common.brandName')}
            width="124"
            height="32"
            className="h-[32px] w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          <NotificationBell compact tone="light" />

          {currentUser ? (
            <Link
              to={dashboardPath}
              aria-label={t('nav.dashboard')}
              title={accountName}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-yellow/90 bg-brand-navy text-brand-yellow shadow-xs transition-transform hover:scale-105 active:scale-95 overflow-hidden font-heading font-black text-sm select-none"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={accountName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{userInitial || (currentUser.role === 'admin' ? 'A' : 'D')}</span>
              )}
              <span className="absolute bottom-0 end-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
            </Link>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              aria-label={t('common.login')}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-brand-navy/20 bg-surface-mist px-2.5 text-xs font-bold text-brand-navy transition hover:bg-brand-navy hover:text-brand-yellow"
            >
              <DuckIcon icon="faArrowRightToBracket" className="text-brand-blue text-xs" />
              <span>{t('common.login')}</span>
            </Link>
          )}
        </div>
      </header>

      {/* Tablet (>= 768px) & Full Desktop (>= 901px) Single-Row Header */}
      <header className="hidden md:block fixed top-0 inset-x-0 z-[9999] w-full max-w-full overflow-x-clip bg-white border-b border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] font-body">
        {/* Main Navbar */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center justify-between gap-2 min-[1480px]:gap-3 h-[52px] min-[901px]:h-[68px] w-full max-w-[1520px] mx-auto px-3 min-[1440px]:px-6"
        >
          {/* Start: Brand Logo + Aswan Weather Pill */}
          <div className="flex items-center gap-2 min-[1480px]:gap-3 shrink-0">
            <Link
              to={ROUTES.HOME}
              className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue shrink-0"
              aria-label={t('common.brandName')}
            >
              <img
                src={duckLogo280}
                srcSet={`${duckLogo280} 280w, ${duckLogo560} 560w`}
                sizes="140px"
                alt={t('common.brandName')}
                width="140"
                height="38"
                className="h-[30px] min-[1440px]:h-[34px] w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-102"
              />
            </Link>

            {/* Compact Aswan Weather Badge */}
            <span
              id="tmpDesk"
              className="hidden min-[1500px]:inline-flex items-center gap-1.5 rounded-full bg-surface-mist border border-brand-blue/15 px-2.5 py-1 text-xs font-bold text-brand-navy whitespace-nowrap shrink-0"
            >
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-navy text-brand-yellow text-[9px]"
                aria-hidden="true"
              >
                <DuckIcon icon="faSun" />
              </span>
              <span>{t('common.aswan')}</span>
              {temp && (
                <span className="text-brand-blue font-extrabold">
                  {temp}
                  {t('common.tempSuffix')}
                </span>
              )}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden min-[1280px]:flex items-center justify-center gap-0.5 min-[1400px]:gap-1 min-[1500px]:gap-1.5 shrink-0">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative whitespace-nowrap px-1.5 min-[1480px]:px-2 py-2 text-[11.5px] min-[1400px]:text-[12.5px] min-[1500px]:text-[13px] font-bold transition-colors duration-200 ${isActive
                    ? 'text-brand-blue font-extrabold after:content-[""] after:absolute after:bottom-0 after:inset-x-1 after:h-[2.5px] after:rounded-full after:bg-brand-blue'
                    : 'text-brand-navy hover:text-brand-blue'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden min-[1280px]:flex items-center gap-1.5 min-[1480px]:gap-2 shrink-0">
            {/* Language Switcher */}
            <KayakLanguageSwitch />

            {/* Notifications Bell */}
            <NotificationBell />

            {/* Login / Dashboard Button (Approved Brand Navy #0C1226) */}
            {currentUser ? (
              <Link
                to={dashboardPath}
                aria-label={isRtl ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                title={accountName}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-brand-navy bg-brand-navy px-2.5 min-[1480px]:px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#161F3D] whitespace-nowrap"
              >
                <DuckIcon icon="faGaugeHigh" className="text-brand-yellow shrink-0" aria-hidden="true" />
                <span>{dashboardLabel}</span>
              </Link>
            ) : (
              <Button
                as={Link}
                to={ROUTES.LOGIN}
                variant="ghost"
                size="sm"
                className="shrink-0 text-brand-navy border border-brand-navy/20 hover:border-brand-blue hover:text-brand-blue whitespace-nowrap"
              >
                {t('common.login')}
              </Button>
            )}

            {/* Book Now Button */}
            <Button
              as={Link}
              to={ROUTES.BOOKING}
              variant="primary"
              size="sm"
              onClick={(e) => {
                if (onBookClick) {
                  e.preventDefault();
                  onBookClick();
                }
              }}
              className="shrink-0 px-3 min-[1500px]:px-4 font-bold shadow-sm whitespace-nowrap"
            >
              <span className="min-[1500px]:hidden">{t('nav.bookNowShort')}</span>
              <span className="hidden min-[1500px]:inline">{t('nav.bookTripNow')}</span>
            </Button>
          </div>

          {/* Tablet / Compact Laptop Actions + Hamburger Button (< 1280px) */}
          <div className="flex items-center gap-2 min-[1280px]:hidden shrink-0">
            <div className="hidden min-[901px]:block">
              <KayakLanguageSwitch />
            </div>

            <NotificationBell />

            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              aria-label={t('nav.menuAria')}
              className="p-2 text-brand-navy text-xl rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <DuckIcon icon={isMobileOpen ? 'faXmark' : 'faBars'} />
            </button>
          </div>
        </nav>

        {/* Mobile & Tablet Drawer Menu */}
        {isMobileOpen && (
          <div
            id="mobile-nav"
            className="min-[1280px]:hidden fixed inset-x-0 top-[53px] min-[901px]:top-[69px] bottom-0 z-[10000] bg-brand-navy text-white px-[6vw] py-4 pb-[calc(88px+env(safe-area-inset-bottom))] flex flex-col gap-1 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Mobile Top Controls */}
            <div className="flex items-center justify-between gap-2 p-2 bg-white/8 border border-white/14 rounded-[14px] mb-2">
              <KayakLanguageSwitch />

              <Badge
                as="span"
                variant="weather"
                size="sm"
                id="tmpMob"
                icon={
                  <DuckIcon
                    icon="faSun"
                    className="text-brand-yellow"
                  />
                }
                className="bg-transparent border-0 p-0 text-white gap-1"
              >
                <b className="text-brand-yellow font-bold">
                  {t('common.aswan')}
                </b>

                {temp && (
                  <span>
                    {temp}
                    {t('common.tempSuffix')}
                  </span>
                )}
              </Badge>
            </div>

            {/* Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between min-h-[50px] px-3 text-[16px] font-semibold border-b border-white/10 rounded-xl hover:bg-brand-yellow/12 hover:text-brand-yellow transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  <DuckIcon
                    icon={link.icon}
                    className="w-5 text-center opacity-90"
                  />
                  {link.label}
                </span>

                <DuckIcon
                  icon={isRtl ? 'faArrowLeft' : 'faArrowRight'}
                  className="text-xs opacity-60"
                />
              </Link>
            ))}



            {/* Mobile Login / Dashboard Link */}
            {currentUser ? (
              <Link
                to={dashboardPath}
                onClick={() => setIsMobileOpen(false)}
                className="mt-2 flex min-h-[48px] w-full items-center justify-between rounded-xl border border-brand-navy bg-brand-navy px-3.5 text-[15px] font-bold text-white transition hover:bg-[#161F3D]"
                aria-label={isRtl ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                title={accountName}
              >
                <span className="inline-flex items-center gap-2.5">
                  <DuckIcon
                    icon="faGaugeHigh"
                    className="w-5 text-center text-brand-yellow"
                  />
                  <span>{dashboardLabel}</span>
                </span>

                <DuckIcon
                  icon={isRtl ? 'faArrowLeft' : 'faArrowRight'}
                  className="text-xs opacity-75"
                />
              </Link>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileOpen(false)}
                className="mt-2 flex min-h-[48px] w-full items-center justify-between rounded-xl border border-white/16 bg-white/8 px-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-yellow/12 hover:text-brand-yellow"
              >
                <span className="inline-flex items-center gap-2.5">
                  <DuckIcon
                    icon="faArrowRightToBracket"
                    className="w-5 text-center opacity-90"
                  />
                  {t('common.login')}
                </span>

                <DuckIcon
                  icon={isRtl ? 'faArrowLeft' : 'faArrowRight'}
                  className="text-xs opacity-60"
                />
              </Link>
            )}

            {/* Mobile Primary CTA */}
            <Button
              as={Link}
              to={ROUTES.BOOKING}
              variant="primary"
              size="md"
              fullWidth
              icon={<DuckIcon icon="faCalendarCheck" />}
              onClick={(e) => {
                setIsMobileOpen(false);

                if (onBookClick) {
                  e.preventDefault();
                  onBookClick();
                }
              }}
              className="mt-4 font-extrabold shadow-lg"
            >
              {t('nav.bookTripNow')}
            </Button>
          </div>
        )}
      </header>
    </>
  );
}