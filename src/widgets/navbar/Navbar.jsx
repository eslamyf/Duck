import { useState, useEffect } from 'react';

export default function Navbar({ onBookClick, onAuthClick }) {
  const [lang, setLang] = useState('ar');
  const [currency, setCurrency] = useState('EGP');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#top');
  const [temp, setTemp] = useState('أسوان');

  // Fetch weather data for Aswan
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=24.09&longitude=32.9&current=temperature_2m')
      .then(res => res.json())
      .then(data => {
        if (data?.current?.temperature_2m !== undefined) {
          const t = Math.round(data.current.temperature_2m);
          setTemp(`${t}°م أسوان`);
        }
      })
      .catch(() => {});
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
    { href: '#top', label: 'الرئيسية', icon: 'fa-house' },
    { href: '#locations', label: 'الوجهات', icon: 'fa-location-dot' },
    { href: '#trips', label: 'الرحلات', icon: 'fa-compass' },
    { href: '#/groups', label: 'حجز المجموعات', icon: 'fa-users-line' },
    { href: '#reviews', label: 'آراء الضيوف', icon: 'fa-star' },
    { href: '#faq', label: 'الأسئلة الشائعة', icon: 'fa-circle-question' },
    { href: '#/about', label: 'من نحن', icon: 'fa-users' },
  ];

  const handleNavClick = (href) => {
    setActiveHash(href);
    setIsMobileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-[120] bg-white border-b border-[#067BA1]/16 shadow-[0_8px_24px_rgba(18,21,40,0.06)] font-sans">
      {/* Top Bar (Hidden on Mobile < 900px) */}
      <div className="hidden min-[901px]:flex items-center justify-between h-10 px-[4vw] bg-brand-navy text-white text-[13px]">
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(l => (l === 'ar' ? 'en' : 'ar'))}
            className="bg-white/10 text-white border border-white/22 rounded-full px-2.5 py-0.5 text-xs font-semibold hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow transition-all duration-200 min-h-[28px] cursor-pointer"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Currency Group */}
          <div className="inline-flex items-center gap-1" role="group" aria-label="Currency">
            {['EGP', 'USD', 'EUR'].map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-all duration-200 min-h-[28px] cursor-pointer ${
                  currency === cur
                    ? 'bg-brand-yellow text-brand-navy border-brand-yellow'
                    : 'bg-white/10 text-white border-white/22 hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow'
                }`}
              >
                {cur} {cur !== 'EGP' ? '~' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Weather Indicator */}
        <span className="text-white text-[13px]">
          <span className="text-brand-yellow font-bold">{temp}</span>
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="flex items-center justify-between min-[901px]:justify-start gap-3.5 px-[3vw] py-2 text-[13.5px] font-medium min-h-[52px] min-[901px]:min-h-[58px]" aria-label="القائمة الرئيسية">
        {/* Logo */}
        <a href="#top" className="block focus:outline-none" onClick={() => handleNavClick('#top')}>
          <img
            src="https://www.duckegy.com/logo-transparent.png"
            alt="Duck Entertainment"
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
            href="#map"
            onClick={() => handleNavClick('#map')}
            className="hidden min-[901px]:inline-block py-2.5 px-0.5 relative text-brand-navy hover:text-brand-blue transition-colors group"
          >
            الخريطة
            <span className="absolute bottom-1 start-0 h-[3px] rounded-full bg-brand-yellow w-0 group-hover:w-full transition-all duration-300 ease-out" />
          </a>

          {/* Auth Button */}
          <button
            type="button"
            onClick={onAuthClick}
            className="hidden min-[901px]:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-mist text-brand-navy border border-[#067BA1]/16 text-[13px] font-bold min-h-[40px] hover:bg-brand-navy hover:text-brand-yellow transition-all duration-200 cursor-pointer"
          >
            تسجيل الدخول
          </button>

          {/* Book Now Button */}
          <a
            href="#trips"
            onClick={(e) => {
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              } else {
                handleNavClick('#trips');
              }
            }}
            className="inline-flex items-center justify-center rounded-full bg-brand-yellow text-brand-navy font-bold px-3.5 min-[901px]:px-4 py-1.5 text-xs min-[901px]:text-[13.5px] min-h-[36px] min-[901px]:min-h-[40px] hover:bg-[#ffe95a] transition-all duration-200 shadow-sm"
          >
            احجز الآن
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="min-[901px]:hidden grid place-items-center w-[38px] h-[38px] rounded-[10px] border border-[#067BA1]/16 bg-white text-brand-navy text-base shadow-[0_2px_8px_rgba(18,21,40,0.06)] cursor-pointer"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label="القائمة"
          >
            <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
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
            <button
              type="button"
              onClick={() => setLang(l => (l === 'ar' ? 'en' : 'ar'))}
              className="bg-white/10 text-white border border-white/22 rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-language" /> {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <div className="inline-flex items-center gap-1">
              {['EGP', 'USD', 'EUR'].map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold border ${
                    currency === cur
                      ? 'bg-brand-yellow text-brand-navy border-brand-yellow'
                      : 'bg-white/10 text-white border-white/22'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
            <span className="text-xs text-brand-yellow inline-flex items-center gap-1">
              <i className="fa-solid fa-sun" /> <b>أسوان</b>
            </span>
          </div>

          {/* Links */}
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="flex items-center justify-between min-h-[50px] px-3 text-[16px] font-semibold border-b border-white/10 rounded-xl hover:bg-brand-yellow/12 hover:text-brand-yellow transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <i className={`fa-solid ${link.icon} w-5 text-center opacity-90`} />
                {link.label}
              </span>
              <span className="text-xs opacity-60">←</span>
            </a>
          ))}

          {/* Map Link */}
          <a
            href="#map"
            onClick={() => handleNavClick('#map')}
            className="flex items-center justify-between min-h-[50px] px-3 text-[16px] font-semibold border-b border-white/10 rounded-xl hover:bg-brand-yellow/12 hover:text-brand-yellow transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-map w-5 text-center opacity-90" />
              نقاط الانطلاق والخريطة
            </span>
            <span className="text-xs opacity-60">←</span>
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
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-arrow-right-to-bracket w-5 text-center opacity-90" />
              تسجيل الدخول
            </span>
            <span className="text-xs opacity-60">←</span>
          </button>

          {/* Mobile Primary CTA */}
          <a
            href="#trips"
            onClick={(e) => {
              setIsMobileOpen(false);
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              }
            }}
            className="flex items-center justify-center min-h-[50px] mt-4 bg-brand-yellow text-brand-navy font-extrabold rounded-full text-base border-0 shadow-lg"
          >
            <i className="fa-solid fa-calendar-check ms-2" />
            احجز رحلتك الآن
          </a>
        </div>
      )}
    </header>
  );
}
