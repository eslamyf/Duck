import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faWater,
  faCalendarCheck,
  faMapLocationDot,
  faBars,
  faXmark,
  faUsersLine,
  faCompass,
  faStar,
  faCircleQuestion,
  faUsers,
  faLanguage,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';

export default function MobileBottomNav() {
  const { lang, setLanguage, t } = useTranslation();
  const location = useLocation();
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;

  const routeKey = `${location.pathname}${location.hash}`;
  const [moreRouteKey, setMoreRouteKey] = useState(null);
  const isMoreOpen = moreRouteKey === routeKey;

  const [activeSection, setActiveSection] = useState(SECTIONS.TOP);

  useEffect(() => {
    if (location.pathname !== ROUTES.HOME) return undefined;

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection(SECTIONS.TOP);
        return;
      }

      const sectionIds = [
        SECTIONS.LOCATIONS,
        SECTIONS.TRIPS,
        SECTIONS.MAP,
        SECTIONS.REVIEWS,
        SECTIONS.FAQ,
      ];

      let current = SECTIONS.TOP;
      const offset = 220;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMoreOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMoreRouteKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreOpen]);

  const isHomeActive =
    location.pathname === ROUTES.HOME &&
    activeSection !== SECTIONS.TRIPS &&
    activeSection !== SECTIONS.LOCATIONS;

  const isExperiencesActive =
    (location.pathname === ROUTES.HOME && activeSection === SECTIONS.TRIPS) ||
    location.pathname === ROUTES.ACTIVITIES ||
    location.pathname.startsWith(`${ROUTES.ACTIVITIES}/`) ||
    location.pathname.startsWith('/trips/');

  const isDestinationsActive =
    location.pathname === ROUTES.HOME && activeSection === SECTIONS.LOCATIONS;

  const isBookingActive = location.pathname === ROUTES.BOOKING;

  const moreLinks = [
    {
      to: ROUTES.GROUPS,
      label: t('nav.groups'),
      icon: faUsersLine,
    },
    {
      to: ROUTES.ACTIVITIES,
      label: t('nav.activities'),
      icon: faCompass,
    },
    {
      to: sectionLink(SECTIONS.MAP),
      label: t('nav.exploreMapAria'),
      icon: faMapLocationDot,
    },
    {
      to: sectionLink(SECTIONS.REVIEWS),
      label: t('nav.reviews'),
      icon: faStar,
    },
    {
      to: sectionLink(SECTIONS.FAQ),
      label: t('nav.faq'),
      icon: faCircleQuestion,
    },
    {
      to: ROUTES.ABOUT,
      label: t('nav.about'),
      icon: faUsers,
    },
  ];

  const tabClass = (active) =>
    `flex flex-col items-center justify-center gap-1 h-full pt-1.5 pb-1 text-[11px] transition-colors ${
      active
        ? 'text-brand-blue font-extrabold'
        : 'text-brand-navy/65 hover:text-brand-navy font-semibold'
    }`;

  return (
    <>
      {/* Fixed App-Style Mobile Bottom Tab Bar (< 768px only) */}
      <nav
        dir={isArabic ? 'rtl' : 'ltr'}
        aria-label={t('nav.bottomNavAria')}
        data-mobile-bottom-nav="true"
        className="md:hidden fixed bottom-0 inset-x-0 z-[9995] bg-surface-white/95 backdrop-blur-md border-t border-brand-blue/15 shadow-header font-body print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-5 items-end h-[66px] max-w-lg mx-auto px-1">
          {/* 1. Home */}
          <Link
            to={sectionLink(SECTIONS.TOP)}
            aria-current={isHomeActive ? 'page' : undefined}
            className={tabClass(isHomeActive)}
          >
            <FontAwesomeIcon icon={faHouse} className="text-[17px]" aria-hidden="true" />
            <span className="truncate max-w-full px-0.5">{t('nav.home')}</span>
          </Link>

          {/* 2. Experiences */}
          <Link
            to={sectionLink(SECTIONS.TRIPS)}
            aria-current={isExperiencesActive ? 'page' : undefined}
            className={tabClass(isExperiencesActive)}
          >
            <FontAwesomeIcon icon={faWater} className="text-[17px]" aria-hidden="true" />
            <span className="truncate max-w-full px-0.5">{t('nav.trips')}</span>
          </Link>

          {/* 3. Center Elevated Book Now FAB */}
          <Link
            to={ROUTES.BOOKING}
            aria-current={isBookingActive ? 'page' : undefined}
            className="flex flex-col items-center justify-end pb-1 group focus-visible:outline-none"
          >
            <span
              className={`flex h-[58px] w-[58px] -translate-y-3.5 items-center justify-center rounded-full border-4 border-surface-white bg-brand-yellow text-brand-navy shadow-soft transition-transform group-active:scale-95 ${
                isBookingActive ? 'ring-2 ring-brand-navy' : ''
              }`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="text-xl" aria-hidden="true" />
            </span>
            <span className="-mt-3 text-[11px] font-extrabold text-brand-navy whitespace-nowrap">
              {t('nav.bookNowShort')}
            </span>
          </Link>

          {/* 4. Destinations */}
          <Link
            to={sectionLink(SECTIONS.DESTINATIONS)}
            aria-current={isDestinationsActive ? 'page' : undefined}
            className={tabClass(isDestinationsActive)}
          >
            <FontAwesomeIcon icon={faMapLocationDot} className="text-[17px]" aria-hidden="true" />
            <span className="truncate max-w-full px-0.5">{t('nav.destinations')}</span>
          </Link>

          {/* 5. More Bottom Sheet Trigger */}
          <button
            type="button"
            onClick={() => setMoreRouteKey((prev) => (prev === routeKey ? null : routeKey))}
            aria-expanded={isMoreOpen}
            aria-haspopup="dialog"
            className={`${tabClass(isMoreOpen)} cursor-pointer`}
          >
            <FontAwesomeIcon icon={isMoreOpen ? faXmark : faBars} className="text-[17px]" aria-hidden="true" />
            <span className="truncate max-w-full px-0.5">{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      {/* Slide-up "More" Bottom Sheet (< 768px only) */}
      {isMoreOpen && (
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.moreMenuTitle')}
          className="md:hidden fixed inset-0 z-[10010] flex flex-col justify-end font-body print:hidden"
        >
          {/* Scrim */}
          <div
            onClick={() => setMoreRouteKey(null)}
            className="absolute inset-0 bg-brand-navy/55 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Sheet Panel */}
          <div
            className="relative z-10 w-full rounded-t-[28px] bg-surface-white text-brand-navy p-5 shadow-ocean border-t border-brand-blue/15 animate-in slide-in-from-bottom-4 duration-200 max-h-[82vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}
          >
            <div className="w-10 h-1 rounded-full bg-brand-navy/20 mx-auto mb-4" aria-hidden="true" />

            <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-brand-blue/12">
              <h2 className="text-base font-extrabold text-brand-navy m-0">
                {t('nav.moreMenuTitle')}
              </h2>
              <button
                type="button"
                onClick={() => setMoreRouteKey(null)}
                aria-label={t('nav.closeMenu')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-mist text-brand-navy hover:bg-brand-navy hover:text-brand-yellow transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {moreLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreRouteKey(null)}
                  className="flex items-center justify-between min-h-[46px] px-3.5 py-2.5 rounded-xl border border-brand-blue/10 bg-surface-mist/70 hover:bg-surface-mist2 text-sm font-bold text-brand-navy transition-colors"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-brand-yellow text-xs">
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    <span>{item.label}</span>
                  </span>

                  <FontAwesomeIcon icon={ArrowIcon} className="text-xs text-brand-navy/45" />
                </Link>
              ))}
            </div>

            {/* Bottom Controls: Language Toggle & WhatsApp */}
            <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-brand-blue/12">
              <button
                type="button"
                onClick={() => {
                  setLanguage(lang === 'ar' ? 'en' : 'ar');
                  setMoreRouteKey(null);
                }}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-brand-blue/25 bg-surface-white px-3 py-2 text-xs font-extrabold text-brand-navy hover:bg-brand-navy hover:text-brand-yellow transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faLanguage} className="text-brand-blue" />
                <span>{t('common.languageSwitch')}</span>
              </button>

              <a
                href={buildWhatsAppUrl(t('footer.whatsappPrefill'))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMoreRouteKey(null)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand-whatsapp px-3 py-2 text-xs font-extrabold text-white shadow-card hover:opacity-95 transition-opacity"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                <span>{t('common.whatsapp')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
