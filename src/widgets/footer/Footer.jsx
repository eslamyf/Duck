import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import duckLogo from '../../shared/assets/icons/Artboard 14.png';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';
import {
  faFacebookF,
  faInstagram,
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
  faEnvelope,
  faCheck,
  faCertificate,
} from '@fortawesome/free-solid-svg-icons';

export default function Footer({ onDestinationClick }) {
  const { t } = useTranslation();

  const destinationItems = [
    { id: 'aswan', label: t('footer.destAswan'), icon: faLocationDot },
    { id: 'soheil', label: t('footer.destSoheil'), icon: faLocationDot },
    { id: 'matrouh', label: t('footer.destMatrouh'), icon: faLocationDot },
    { id: 'giza', label: t('footer.destGiza'), icon: faLocationDot },
    { id: 'siwa', label: t('footer.destSiwa'), icon: faLocationDot },
  ];

  const buildWhatsAppUrl = (customText) => {
    const phone = '201550061006';
    const text = customText || t('footer.whatsappPrefill');
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <footer className="bg-brand-navy text-white p-0 text-start border-t border-white/8 font-body">
      {/* Top Grid */}
      <div className="grid grid-cols-1 min-[901px]:grid-cols-[1.35fr_1fr_1fr_1.25fr] gap-7 min-[901px]:gap-9 px-[5vw] min-[901px]:px-[6vw] pt-9 min-[901px]:pt-14 pb-6 min-[901px]:pb-10 max-w-[1360px] mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col gap-3.5 items-start">
          <Link to={ROUTES.HOME} className="inline-block focus:outline-none" aria-label={t('common.brandName')}>
            <img
              src={duckLogo}
              alt={t('common.brandName')}
              width={188}
              height={40}
              className="h-10 min-[901px]:h-11 w-auto brightness-0 invert opacity-95 hover:opacity-100 transition-opacity object-contain"
            />
          </Link>
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
              href={buildWhatsAppUrl()}
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
              <Link to={sectionLink(SECTIONS.DESTINATIONS)} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faLocationDot} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.destinations')}
              </Link>
            </li>
            <li>
              <Link to={sectionLink(SECTIONS.TRIPS)} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCompass} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.trips')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.GROUPS} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faBuilding} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.groups')}
              </Link>
            </li>
            <li>
              <Link to={sectionLink(SECTIONS.MAP)} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faMapLocationDot} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.exploreMapAria')}
              </Link>
            </li>
            <li>
              <Link to={sectionLink(SECTIONS.REVIEWS)} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faStar} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.reviews')}
              </Link>
            </li>
            <li>
              <Link to={sectionLink(SECTIONS.FAQ)} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCircleQuestion} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.faq')}
              </Link>
            </li>
            <li>
              <Link to={ROUTES.ABOUT} className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCircleInfo} className="text-xs text-brand-yellow opacity-85" />
                {t('nav.about')}
              </Link>
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
                <Link
                  to={sectionLink(SECTIONS.MAP)}
                  onClick={() => onDestinationClick && onDestinationClick(loc.id)}
                  className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={loc.icon} className="text-xs text-brand-yellow opacity-85" />
                  {loc.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Safety */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-[17px] font-bold text-white mb-1 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            {t('footer.contactTitle')}
          </h4>
          <p className="text-white/78 text-xs font-semibold m-0">
            {t('footer.supportHours')}
          </p>

          <div className="flex flex-col gap-2.5">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/88 text-sm font-bold inline-flex items-center gap-2.5 hover:text-brand-yellow transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-xs text-brand-yellow">
                <FontAwesomeIcon icon={faWhatsapp} />
              </span>
              <span dir="ltr">+20 155 006 1006</span>
            </a>

            <a
              href="mailto:duck.asw@gmail.com"
              className="text-white/88 text-sm font-semibold inline-flex items-center gap-2.5 hover:text-brand-yellow transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-xs text-brand-yellow">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span>duck.asw@gmail.com</span>
            </a>

            <div className="text-white/78 text-xs font-medium inline-flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-xs text-brand-yellow">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <span>{t('footer.headquarters')}</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-yellow bg-white/5 border border-white/10 rounded-full px-3 py-1.5 w-fit">
              <FontAwesomeIcon icon={faCheck} className="text-brand-yellow" />
              <span>{t('footer.freeCancel')}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-white/90 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 w-fit">
              <FontAwesomeIcon icon={faCertificate} className="text-brand-yellow" />
              <span>{t('footer.certifiedVests')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="border-t border-white/8 px-[5vw] min-[901px]:px-[6vw] py-5">
        <div className="max-w-[1360px] mx-auto flex flex-col min-[901px]:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p className="m-0 text-center min-[901px]:text-start">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            <Link to={sectionLink(SECTIONS.FAQ)} className="hover:text-white transition-colors">
              {t('footer.safetyInfo')}
            </Link>
            <span>•</span>
            <Link to={sectionLink(SECTIONS.FAQ)} className="hover:text-white transition-colors">
              {t('footer.bookingPolicy')}
            </Link>
            <span>•</span>
            <span className="text-white/40">{t('footer.developerCredit')}</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Icon Button */}
      <a
        href={buildWhatsAppUrl(t('footer.whatsappPrefill'))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('footer.whatsappAction')}
        title={t('footer.whatsappAction')}
        className="fixed bottom-5 end-5 z-[90] flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-brand-whatsapp text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" aria-hidden="true" />
      </a>
    </footer>
  );
}
