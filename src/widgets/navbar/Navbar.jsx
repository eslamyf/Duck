import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import duckLogo from '../../shared/assets/icons/Artboard 14.png';
import { useTranslation } from '../../shared/i18n/index.js';
import { Button, Badge } from '../../shared/ui/index.js';
import {
  faHouse,
  faLocationDot,
  faCompass,
  faUsersLine,
  faStar,
  faCircleQuestion,
  faUsers,
  faMap,
  faLanguage,
  faSun,
  faBars,
  faXmark,
  faArrowRightToBracket,
  faCalendarCheck,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ onBookClick, onAuthClick }) {
  const { lang, setLanguage, t } = useTranslation();
  const homePrefix = window.location.pathname === '/about' ? '/' : '';
  const homeHref = (hash) => `${homePrefix}${hash}`;
  const [currency, setCurrency] = useState('EGP');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#top');
  const [temp, setTemp] = useState('');

  // Fetch weather data for Aswan
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=24.09&longitude=32.9&current=temperature_2m')
      .then((res) => res.json())
      .then((data) => {
        if (data?.current?.temperature_2m !== undefined) {
          const val = Math.round(data.current.temperature_2m);
          setTemp(String(val));
        }
      })
      .catch(() => { });
  }, []);

  // Update active hash based on scroll
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#top');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navLinks = [
    { href: homeHref('#top'), label: t('nav.home'), icon: faHouse },
    { href: homeHref('#locations'), label: t('nav.destinations'), icon: faLocationDot },
    { href: homeHref('#trips'), label: t('nav.trips'), icon: faCompass },
    { href: homeHref('#/groups'), label: t('nav.groups'), icon: faUsersLine },
    { href: homeHref('#reviews'), label: t('nav.reviews'), icon: faStar },
    { href: homeHref('#faq'), label: t('nav.faq'), icon: faCircleQuestion },
    { href: '/about', label: t('nav.about'), icon: faUsers },
  ];

  const handleNavClick = (href) => {
    setActiveHash(href);
    setIsMobileOpen(false);
  };

  const isRtl = lang === 'ar';

  return (
    <header className="fixed top-0 inset-x-0 z-[120] bg-white border-b border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] font-body">
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
          <div className="inline-flex items-center gap-1" role="group" aria-label="Currency">
            {['EGP', 'USD', 'EUR'].map((cur) => (
              <Button
                key={cur}
                type="button"
                variant={currency === cur ? 'chipActive' : 'chip'}
                size="xs"
                onClick={() => setCurrency(cur)}
              >
                {cur === 'EGP' ? t('common.currencyEGP') : cur === 'USD' ? t('common.currencyUSD') : t('common.currencyEUR')}
              </Button>
            ))}
          </div>
        </div>

        {/* Weather Indicator */}
        <span className="text-white text-[13px] inline-flex items-center gap-1.5" id="tmp">
          <b className="text-brand-yellow font-bold">{t('common.aswan')}</b>
          {temp && <span>{temp}{t('common.tempSuffix')}</span>}
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="flex items-center justify-between min-[901px]:justify-start gap-3.5 px-[3vw] py-2 text-[13.5px] font-medium min-h-[52px] min-[901px]:min-h-[58px]" aria-label={t('nav.menuAria')}>
        {/* Logo */}
        <a href={homeHref('#top')} className="block focus:outline-none" onClick={() => handleNavClick(homeHref('#top'))}>
          <img
            src={duckLogo}
            alt={t('nav.logoAlt')}
            width="160"
            height="44"
            className="h-9 min-[901px]:h-[42px] w-auto bg-transparent min-[901px]:bg-white rounded-full py-1 px-2.5"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden min-[901px]:flex items-center gap-3.5 me-auto whitespace-nowrap">
          {navLinks.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative py-2.5 px-0.5 whitespace-nowrap transition-colors duration-200 group ${
                  isActive ? 'text-brand-blue font-bold' : 'text-brand-navy hover:text-brand-blue'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-1 start-0 h-[3px] rounded-full bg-brand-yellow transition-all duration-300 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-2 whitespace-nowrap ms-auto min-[901px]:ms-0">
          <a
            href={homeHref('#map')}
            onClick={() => handleNavClick(homeHref('#map'))}
            className="hidden min-[901px]:inline-block py-2.5 px-0.5 relative text-brand-navy hover:text-brand-blue transition-colors group"
          >
            {t('common.map')}
            <span className="absolute bottom-1 start-0 h-[3px] rounded-full bg-brand-yellow w-0 group-hover:w-full transition-all duration-300 ease-out" />
          </a>

          {/* Auth Button */}
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={onAuthClick}
            className="hidden min-[901px]:inline-flex"
          >
            {t('common.login')}
          </Button>

          {/* Book Now Button */}
          <Button
            as="a"
            href={homeHref('#trips')}
            variant="primary"
            size="sm"
            onClick={(e) => {
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              } else {
                handleNavClick('#trips');
              }
            }}
          >
            {t('common.bookNow')}
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="min-[901px]:hidden grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-[rgba(20,125,159,0.16)] bg-white text-brand-navy text-base shadow-[0_2px_8px_rgba(12,18,38,0.06)] cursor-pointer"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={t('nav.menuAria')}
          >
            <FontAwesomeIcon icon={isMobileOpen ? faXmark : faBars} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div
          id="mobile-nav"
          className="min-[901px]:hidden fixed inset-x-0 top-[52px] bottom-0 z-[118] bg-brand-navy text-white px-[6vw] py-4 pb-[calc(88px+env(safe-area-inset-bottom))] flex flex-col gap-1 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
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
                  {cur === 'EGP' ? t('common.currencyEGP') : cur === 'USD' ? t('common.currencyUSD') : t('common.currencyEUR')}
                </Button>
              ))}
            </div>
            <Badge
              as="span"
              variant="weather"
              size="sm"
              id="tmpMob"
              icon={<FontAwesomeIcon icon={faSun} className="text-brand-yellow" />}
              className="bg-transparent border-0 p-0 text-white gap-1"
            >
              <b className="text-brand-yellow font-bold">{t('common.aswan')}</b>
              {temp && <span>{temp}{t('common.tempSuffix')}</span>}
            </Badge>
          </div>

          {/* Links */}
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="flex items-center justify-between min-h-[50px] px-3 text-[16px] font-semibold border-b border-white/10 rounded-xl hover:bg-brand-yellow/12 hover:text-brand-yellow transition-colors"
            >
              <span className="inline-flex items-center gap-2.5">
                <FontAwesomeIcon icon={link.icon} className="w-5 text-center opacity-90" />
                {link.label}
              </span>
              <FontAwesomeIcon icon={isRtl ? faArrowLeft : faArrowRight} className="text-xs opacity-60" />
            </a>
          ))}

          {/* Map Link */}
          <a
            href="#map"
            onClick={() => handleNavClick('#map')}
            className="flex items-center justify-between min-h-[50px] px-3 text-[16px] font-semibold border-b border-white/10 rounded-xl hover:bg-brand-yellow/12 hover:text-brand-yellow transition-colors"
          >
            <span className="inline-flex items-center gap-2.5">
              <FontAwesomeIcon icon={faMap} className="w-5 text-center opacity-90" />
              {t('nav.exploreMapAria')}
            </span>
            <FontAwesomeIcon icon={isRtl ? faArrowLeft : faArrowRight} className="text-xs opacity-60" />
          </a>

          {/* Mobile Login Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileOpen(false);
              if (onAuthClick) onAuthClick();
            }}
            className="flex items-center justify-between w-full min-h-[48px] px-3.5 mt-2 bg-white/8 text-white border border-white/16 rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-brand-yellow/12 hover:text-brand-yellow transition-colors"
          >
            <span className="inline-flex items-center gap-2.5">
              <FontAwesomeIcon icon={faArrowRightToBracket} className="w-5 text-center opacity-90" />
              {t('common.login')}
            </span>
            <FontAwesomeIcon icon={isRtl ? faArrowLeft : faArrowRight} className="text-xs opacity-60" />
          </button>

          {/* Mobile Primary CTA */}
          <Button
            as="a"
            href={homeHref('#trips')}
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
