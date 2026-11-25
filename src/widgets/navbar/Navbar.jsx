import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import duckLogo from '../../shared/assets/icons/Artboard 14.png';

import { useTranslation } from '../../shared/i18n/index.js';
import { Button, Badge } from '../../shared/ui/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { getPortalPathForRole } from '../../shared/config/rbac.js';

import { getCurrentUser } from '../../entities/user/api/authService.js';

import {
  faHouse,
  faLocationDot,
  faCompass,
  faUsersLine,
  faStar,
  faCircleQuestion,
  faUsers,
  faLanguage,
  faSun,
  faBars,
  faXmark,
  faArrowRightToBracket,
  faCalendarCheck,
  faArrowLeft,
  faArrowRight,
  faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ onBookClick }) {
  const { lang, setLanguage, t } = useTranslation();
  const location = useLocation();

  const [currency, setCurrency] = useState('EGP');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS.TOP);
  const [temp, setTemp] = useState('');

  // Current Logged-in User (refreshed on navigation)
  const currentUser = getCurrentUser();

  // Fetch weather data for Aswan
  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=24.09&longitude=32.9&current=temperature_2m'
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current?.temperature_2m !== undefined) {
          const val = Math.round(data.current.temperature_2m);
          setTemp(String(val));
        }
      })
      .catch(() => { });
  }, []);

  // Update active section based on scroll (only when on home page)
  useEffect(() => {
    if (location.pathname !== ROUTES.HOME) return;

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection(SECTIONS.TOP);
        return;
      }

      const sectionIds = [
        SECTIONS.LOCATIONS,
        SECTIONS.TRIPS,
        SECTIONS.REVIEWS,
        SECTIONS.FAQ,
        SECTIONS.MAP,
      ];

      let current = SECTIONS.TOP;
      const headerOffset = 220;

      for (const id of sectionIds) {
        const el = document.getElementById(id);

        if (el) {
          const rect = el.getBoundingClientRect();

          if (rect.top <= headerOffset) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const navLinks = [
    {
      to: sectionLink(SECTIONS.TOP),
      label: t('nav.home'),
      icon: faHouse,
      sectionId: SECTIONS.TOP,
    },
    {
      to: sectionLink(SECTIONS.DESTINATIONS),
      label: t('nav.destinations'),
      icon: faLocationDot,
      sectionId: SECTIONS.DESTINATIONS,
    },
    {
      to: sectionLink(SECTIONS.TRIPS),
      label: t('nav.trips'),
      icon: faCompass,
      sectionId: SECTIONS.TRIPS,
    },
    {
      to: ROUTES.ACTIVITIES,
      label: lang === 'ar' ? 'الأنشطة' : 'Activities',
      icon: faCalendarCheck,
      isActivities: true,
    },
    {
      to: ROUTES.GROUPS,
      label: t('nav.groups'),
      icon: faUsersLine,
      isGroups: true,
    },
    {
      to: sectionLink(SECTIONS.REVIEWS),
      label: t('nav.reviews'),
      icon: faStar,
      sectionId: SECTIONS.REVIEWS,
    },
    {
      to: sectionLink(SECTIONS.FAQ),
      label: t('nav.faq'),
      icon: faCircleQuestion,
      sectionId: SECTIONS.FAQ,
    },
    {
      to: ROUTES.ABOUT,
      label: t('nav.about'),
      icon: faUsers,
      isAbout: true,
    },
  ];

  const isRtl = lang === 'ar';

  // Account Information
  const accountName =
    currentUser?.fullName ||
    currentUser?.name ||
    (isRtl ? 'لوحة التحكم' : 'Dashboard');
  const dashboardLabel = isRtl ? 'لوحة التحكم' : 'Dashboard';
  const dashboardPath = currentUser ? getPortalPathForRole(currentUser.role) : ROUTES.LOGIN;

  const checkIsActive = (link) => {
    // Activities page and its details
    if (link.isActivities) {
      return (
        location.pathname === ROUTES.ACTIVITIES ||
        location.pathname.startsWith(`${ROUTES.ACTIVITIES}/`)
      );
    }

    // About page
    if (location.pathname === ROUTES.ABOUT) {
      return Boolean(link.isAbout);
    }

    // Groups page
    if (location.pathname === ROUTES.GROUPS) {
      return Boolean(link.isGroups);
    }

    // Don't keep Home section links active on other pages
    if (location.pathname !== ROUTES.HOME) {
      return false;
    }

    // Active section on Home page only
    return activeSection === link.sectionId;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-[9999] bg-white border-b border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] font-body">
      {/* Top Bar (Hidden on Mobile < 900px) */}
      <div className="hidden min-[901px]:flex items-center justify-between h-10 px-[4vw] bg-brand-navy text-white text-[13px]">
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            type="button"
            variant="chip"
            size="xs"
            onClick={() => setLanguage(lang === 'ar' ? 'en' : 'ar')}
          >
            {t('common.languageSwitch')}
          </Button>

          {/* Currency Group */}
          <div
            className="inline-flex items-center gap-1"
            role="group"
            aria-label="Currency"
          >
            {['EGP', 'USD', 'EUR'].map((cur) => (
              <Button
                key={cur}
                type="button"
                variant={currency === cur ? 'chipActive' : 'chip'}
                size="xs"
                onClick={() => setCurrency(cur)}
              >
                {cur === 'EGP'
                  ? t('common.currencyEGP')
                  : cur === 'USD'
                    ? t('common.currencyUSD')
                    : t('common.currencyEUR')}
              </Button>
            ))}
          </div>
        </div>

        {/* Weather Indicator */}
        <span
          className="text-white/85 text-xs font-semibold flex items-center gap-1.5"
          id="tmpDesk"
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

          <FontAwesomeIcon
            icon={faSun}
            className="text-brand-yellow text-sm ms-0.5"
          />
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        aria-label="Main Navigation"
        className="flex items-center justify-between h-[52px] min-[901px]:h-[60px] px-[4vw] max-w-[1400px] mx-auto"
      >
        {/* Brand Logo */}
        <Link
          to={ROUTES.HOME}
          className="block focus:outline-none"
          aria-label={t('common.brandName')}
        >
          <img
            src={duckLogo}
            alt={t('common.brandName')}
            width="140"
            height="38"
            className="h-[34px] min-[901px]:h-[38px] w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-102"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden min-[901px]:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = checkIsActive(link);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 text-[14.5px] font-semibold transition-colors duration-200 ${isActive
                    ? 'text-brand-blue font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-3 after:h-0.5 after:bg-brand-yellow'
                    : 'text-brand-navy/78 hover:text-brand-blue'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden min-[901px]:flex items-center gap-3">
          {/* Login / Dashboard Button */}
          {currentUser ? (
            <Link
              to={dashboardPath}
              aria-label={isRtl ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
              title={accountName}
              className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-full border border-brand-navy/15 bg-brand-navy px-4 py-1.5 text-xs font-bold text-brand-yellow shadow-sm transition hover:bg-brand-blue hover:text-white"
            >
              <FontAwesomeIcon icon={faGaugeHigh} />
              <span>{dashboardLabel}</span>
            </Link>
          ) : (
            <Button
              as={Link}
              to={ROUTES.LOGIN}
              variant="ghost"
              size="sm"
              className="text-brand-navy border border-brand-navy/20 hover:border-brand-blue hover:text-brand-blue"
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
            className="font-bold shadow-sm"
          >
            {t('nav.bookTripNow')}
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 min-[901px]:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={t('nav.menuAria')}
            className="p-2 text-brand-navy text-xl focus:outline-none"
          >
            <FontAwesomeIcon icon={isMobileOpen ? faXmark : faBars} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div
          id="mobile-nav"
          className="min-[901px]:hidden fixed inset-x-0 top-[52px] bottom-0 z-[10000] bg-brand-navy text-white px-[6vw] py-4 pb-[calc(88px+env(safe-area-inset-bottom))] flex flex-col gap-1 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Mobile Top Controls */}
          <div className="flex items-center justify-between gap-2 p-2 bg-white/8 border border-white/14 rounded-[14px] mb-2">
            <Button
              type="button"
              variant="chip"
              size="xs"
              icon={<FontAwesomeIcon icon={faLanguage} />}
              onClick={() => setLanguage(lang === 'ar' ? 'en' : 'ar')}
            >
              {t('common.languageSwitch')}
            </Button>

            <div className="inline-flex items-center gap-1">
              {['EGP', 'USD', 'EUR'].map((cur) => (
                <Button
                  key={cur}
                  type="button"
                  variant={currency === cur ? 'chipActive' : 'chip'}
                  size="xs"
                  onClick={() => setCurrency(cur)}
                  className="px-2"
                >
                  {cur === 'EGP'
                    ? t('common.currencyEGP')
                    : cur === 'USD'
                      ? t('common.currencyUSD')
                      : t('common.currencyEUR')}
                </Button>
              ))}
            </div>

            <Badge
              as="span"
              variant="weather"
              size="sm"
              id="tmpMob"
              icon={
                <FontAwesomeIcon
                  icon={faSun}
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
                <FontAwesomeIcon
                  icon={link.icon}
                  className="w-5 text-center opacity-90"
                />
                {link.label}
              </span>

              <FontAwesomeIcon
                icon={isRtl ? faArrowLeft : faArrowRight}
                className="text-xs opacity-60"
              />
            </Link>
          ))}



          {/* Mobile Login / Dashboard Link */}
          {currentUser ? (
            <Link
              to={dashboardPath}
              onClick={() => setIsMobileOpen(false)}
              className="mt-2 flex min-h-[48px] w-full items-center justify-between rounded-xl border border-brand-yellow/40 bg-brand-yellow/15 px-3.5 text-[15px] font-bold text-brand-yellow transition hover:bg-brand-yellow hover:text-brand-navy"
              aria-label={isRtl ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
              title={accountName}
            >
              <span className="inline-flex items-center gap-2.5">
                <FontAwesomeIcon
                  icon={faGaugeHigh}
                  className="w-5 text-center"
                />
                <span>{dashboardLabel}</span>
              </span>

              <FontAwesomeIcon
                icon={isRtl ? faArrowLeft : faArrowRight}
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
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="w-5 text-center opacity-90"
                />
                {t('common.login')}
              </span>

              <FontAwesomeIcon
                icon={isRtl ? faArrowLeft : faArrowRight}
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
            icon={<FontAwesomeIcon icon={faCalendarCheck} />}
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
  );
}