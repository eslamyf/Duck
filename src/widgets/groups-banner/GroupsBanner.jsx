import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHandshake, faShieldHalved, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { Button } from '../../shared/ui/index.js';
import bannerImg640 from '../../shared/assets/images/groups-banner-640w.webp';
import bannerImg1200 from '../../shared/assets/images/groups-banner-1200w.webp';

export default function GroupsBanner() {
  const { t } = useTranslation();

  return (
    <section
      id="groups"
      className="relative my-10 min-[901px]:my-12 font-body scroll-mt-[52px] min-[901px]:scroll-mt-[100px]"
      aria-label={t('groupsBanner.title')}
    >
      <div className="relative min-h-[540px] min-[901px]:min-h-[580px] bg-brand-navy flex items-start justify-center text-center pt-[75px] pb-10 min-[901px]:pt-[90px] min-[901px]:pb-[60px] px-6 text-white overflow-hidden">
        {/* Responsive Background Photo */}
        <picture className="absolute inset-0 z-0">
          <source media="(max-width: 900px)" srcSet={bannerImg640} />
          <img
            src={bannerImg1200}
            alt={t('groupsBanner.imgAlt')}
            loading="lazy"
            decoding="async"
            width={1200}
            height={745}
            className="w-full h-full object-cover object-[center_65%]"
          />
        </picture>

        {/* Cinematic Gradient Overlay */}
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-[#121528]/85 via-[#121528]/58 to-[#121528]/40 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Wave SVG */}
        <div
          className="absolute -top-[1px] inset-x-0 w-full h-[46px] min-[901px]:h-[65px] z-[3] pointer-events-none"
          aria-hidden="true"
        >
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-full block">
            <path
              className="fill-white"
              d="M 0,0 L 0,50 C 320,85 700,20 1050,18 C 1220,16 1350,42 1440,55 L 1440,0 Z"
            />
            <path
              className="fill-none stroke-[#121528] stroke-[3.5px] stroke-linecap-round"
              d="M 0,50 C 320,85 700,20 1050,18 C 1220,16 1350,42 1440,55"
            />
          </svg>
        </div>

        {/* Foreground Content */}
        <div className="relative z-[2] max-w-[880px] mx-auto flex flex-col items-center gap-4">
          {/* Badge */}
          <span
            className="inline-block bg-brand-yellow text-brand-navy px-4 py-1.5 rounded-full font-extrabold text-xs tracking-wider uppercase shadow-[0_4px_14px_rgba(245,232,71,0.35)]"
            lang="en"
            dir="ltr"
          >
            {t('groupsBanner.badge')}
          </span>

          {/* Heading */}
          <h2
            id="grpTitle"
            className="text-[clamp(24px,3.8vw,42px)] font-black leading-tight text-white m-0 drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]"
          >
            {t('groupsBanner.title')}
          </h2>

          {/* Subtitle */}
          <p
            id="grpSub"
            className="text-[clamp(13.5px,1.6vw,17.5px)] leading-relaxed text-white/95 max-w-[740px] m-0 drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
          >
            {t('groupsBanner.subtitle')}
          </p>

          {/* Perks Row */}
          <div className="flex flex-wrap justify-center gap-2 min-[901px]:gap-3 my-2 min-[901px]:my-3">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3.5 py-1.5 text-xs min-[901px]:text-sm font-bold text-white shadow-sm">
              <FontAwesomeIcon icon={faUsers} className="text-brand-yellow text-sm" aria-hidden="true" />
              <span>{t('groupsBanner.perk1')}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3.5 py-1.5 text-xs min-[901px]:text-sm font-bold text-white shadow-sm">
              <FontAwesomeIcon icon={faHandshake} className="text-brand-yellow text-sm" aria-hidden="true" />
              <span>{t('groupsBanner.perk2')}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3.5 py-1.5 text-xs min-[901px]:text-sm font-bold text-white shadow-sm">
              <FontAwesomeIcon icon={faShieldHalved} className="text-brand-yellow text-sm" aria-hidden="true" />
              <span>{t('groupsBanner.perk3')}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            as={Link}
            to={ROUTES.GROUPS}
            id="planGroupBtn"
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2.5 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-[0_10px_28px_rgba(245,232,71,0.45)] hover:scale-102 transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faCalendarCheck} aria-hidden="true" />
            <span>{t('groupsBanner.cta')}</span>
          </Button>
        </div>

        {/* Bottom Wave SVG */}
        <div
          className="absolute -bottom-[1px] inset-x-0 w-full h-[46px] min-[901px]:h-[65px] z-[3] pointer-events-none"
          aria-hidden="true"
        >
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-full block">
            <path
              className="fill-white"
              d="M 0,90 L 0,55 C 180,82 360,25 550,22 C 780,18 950,80 1150,75 C 1280,72 1380,56 1440,48 L 1440,90 Z"
            />
            <path
              className="fill-none stroke-[#121528] stroke-[3.5px] stroke-linecap-round"
              d="M 0,55 C 180,82 360,25 550,22 C 780,18 950,80 1150,75 C 1280,72 1380,56 1440,48"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
