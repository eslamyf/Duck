import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import duckLogo from '../../shared/assets/icons/Artboard 14.png';
import { useTranslation } from '../../shared/i18n/index.js';
import { Button, Badge } from '../../shared/ui/index.js';
import {
  faInstagram,
  faFacebookF,
  faTiktok,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
  faLocationDot,
  faCompass,
  faBuilding,
  faMapLocationDot,
  faStar,
  faCircleQuestion,
  faCircleInfo,
  faWater,
  faSailboat,
  faUmbrellaBeach,
  faCity,
  faSun,
  faEnvelope,
  faShieldHalved,
  faVest,
} from '@fortawesome/free-solid-svg-icons';

export default function Footer({ onDestinationClick }) {
  const { t } = useTranslation();

  const destinationItems = [
    { id: 0, label: t('footer.destAswan'), icon: faWater },
    { id: 1, label: t('footer.destGharb'), icon: faSailboat },
    { id: 2, label: t('footer.destMatrouh'), icon: faUmbrellaBeach },
    { id: 3, label: t('footer.destGiza'), icon: faCity },
    { id: 4, label: t('footer.destSiwa'), icon: faSun },
  ];

  return (
    <footer className="bg-brand-navy text-white p-0 text-start border-t border-white/8 font-body">
      {/* Top Grid */}
      <div className="grid grid-cols-1 min-[901px]:grid-cols-[1.35fr_1fr_1fr_1.25fr] gap-7 min-[901px]:gap-9 px-[5vw] min-[901px]:px-[6vw] pt-9 min-[901px]:pt-14 pb-6 min-[901px]:pb-10 max-w-[1360px] mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col gap-3.5 items-start">
          <a href="#top" className="inline-block focus:outline-none" aria-label={t('common.brandName')}>
            <img
              src={duckLogo}
              alt={t('common.brandName')}
              width={188}
              height={40}
              className="h-10 min-[901px]:h-11 w-auto brightness-0 invert opacity-95 hover:opacity-100 transition-opacity object-contain"
            />
          </a>
          <p className="text-sm text-white/78 leading-[1.65] max-w-[38ch] m-0">
            {t('footer.bio')}
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <a
              href="https://www.instagram.com/duck.asw?igsh=d2Nwa2Nqb2t1bXVj&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.facebook.com/share/1AyX9yr91p/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.tiktok.com/@duckegy?_t=ZS-8yXR9sJsezl&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a
              href="https://wa.me/201550061006"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[17px] font-bold text-white mb-3 min-[901px]:mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            {t('footer.quickLinksTitle')}
          </h4>
          <ul className="grid gap-2.5 list-none p-0 m-0">
            <li>
              <a href="#locations" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faLocationDot} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.destinations')}
              </a>
            </li>
            <li>
              <a href="#trips" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCompass} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.trips')}
              </a>
            </li>
            <li>
              <a href="#/groups" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faBuilding} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.groups')}
              </a>
            </li>
            <li>
              <a href="#map" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faMapLocationDot} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.exploreMapAria')}
              </a>
            </li>
            <li>
              <a href="#reviews" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faStar} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.reviews')}
              </a>
            </li>
            <li>
              <a href="#faq" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCircleQuestion} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.faq')}
              </a>
            </li>
            <li>
              <a href="#/about" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCircleInfo} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.about')}
              </a>
            </li>
          </ul>
        </div>

        {/* Destinations in Egypt */}
        <div>
          <h4 className="text-[17px] font-bold text-white mb-3 min-[901px]:mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            {t('footer.destinationsTitle')}
          </h4>
          <ul className="grid gap-2.5 list-none p-0 m-0">
            {destinationItems.map((loc) => (
              <li key={loc.id}>
                <a
                  href="#map"
                  onClick={() => onDestinationClick && onDestinationClick(loc.id)}
                  className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={loc.icon} className="text-xs text-brand-yellow opacity-85" />
                  {loc.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Safety */}
        <div>
          <h4 className="text-[17px] font-bold text-white mb-3 min-[901px]:mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            {t('footer.contactSafetyTitle')}
          </h4>
          <div className="grid gap-3">
            <a
              href="https://wa.me/201550061006"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-white/85 no-underline hover:text-brand-yellow transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs text-brand-yellow flex-shrink-0 mt-0.5 group-hover:bg-brand-yellow group-hover:text-brand-navy transition-colors">
                <FontAwesomeIcon icon={faWhatsapp} />
              </span>
              <div>
                <small className="text-[11px] text-white/60 font-medium block">{t('footer.csTitle')}</small>
                <span dir="ltr" className="text-[13.5px] font-semibold block">{t('footer.csPhone')}</span>
              </div>
            </a>

            <a
              href="mailto:duck.asw@gmail.com"
              className="flex items-start gap-3 text-white/85 no-underline hover:text-brand-yellow transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs text-brand-yellow flex-shrink-0 mt-0.5 group-hover:bg-brand-yellow group-hover:text-brand-navy transition-colors">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <div>
                <small className="text-[11px] text-white/60 font-medium block">{t('footer.emailTitle')}</small>
                <span className="text-[13.5px] font-semibold block">{t('footer.emailAddress')}</span>
              </div>
            </a>

            <div className="flex items-start gap-3 text-white/85">
              <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs text-brand-yellow flex-shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <div>
                <small className="text-[11px] text-white/60 font-medium block">{t('footer.hqTitle')}</small>
                <span className="text-[13.5px] font-semibold block">{t('footer.hqAddress')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-3.5">
            <Badge variant="safety" size="sm" icon={<FontAwesomeIcon icon={faShieldHalved} />}>
              {t('common.freeCancellation')}
            </Badge>
            <Badge variant="safety" size="sm" icon={<FontAwesomeIcon icon={faVest} />}>
              {t('common.lifeJackets')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-white/8 bg-black/15 px-[5vw] min-[901px]:px-[6vw] min-[901px]:ps-36 py-4 min-[901px]:py-4.5 pb-[calc(76px+env(safe-area-inset-bottom))] min-[901px]:pb-[calc(18px+env(safe-area-inset-bottom))] flex flex-col min-[901px]:flex-row items-center justify-between gap-2.5 min-[901px]:gap-4 text-xs text-white/60 text-center min-[901px]:text-start">
        <div>
          © 2026 <strong className="text-white font-bold">{t('common.brandName')}</strong>. {t('footer.copyright')} · <em className="italic">{t('common.slogan')}</em> 🦆
        </div>
        <div className="flex items-center justify-center gap-2.5 text-white/75">
          <a href="https://www.duckegy.com/faq#safety" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
            {t('footer.safetyInfo')}
          </a>
          <span>·</span>
          <a href="https://www.duckegy.com/faq#booking" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
            {t('footer.bookingPolicy')}
          </a>
          <span>·</span>
          <a href="https://alefmenu.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
            {t('footer.poweredBy')}
          </a>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <Button
        as="a"
        href={`https://wa.me/201550061006?text=${encodeURIComponent(t('footer.whatsappPrefill'))}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('footer.whatsappAction')}
        variant="whatsapp"
        size="sm"
        icon={<FontAwesomeIcon icon={faWhatsapp} className="text-lg" />}
        className="fixed bottom-6 start-6 z-[90] text-sm px-4.5 py-2.5 min-h-[44px]"
      >
        <span>{t('common.whatsapp')}</span>
      </Button>
    </footer>
  );
}
