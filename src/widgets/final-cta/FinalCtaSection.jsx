import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { Button } from '../../shared/ui/index.js';
import ctaBg from '../../shared/assets/images/about/cta-bg.webp';

export default function FinalCtaSection() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? faArrowLeft : faArrowRight;

  return (
    <section
      id="final-cta"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-label={t('finalCta.title')}
      className="relative overflow-hidden bg-brand-navy text-white py-14 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body border-t border-white/10"
    >
      <img
        src={ctaBg}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_62%] opacity-25 pointer-events-none"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/80 to-brand-navy/95 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[820px] mx-auto flex flex-col items-center text-center gap-4">
        <span
          className="inline-block rounded-full bg-brand-yellow/15 px-4 py-1 text-xs font-extrabold tracking-[0.2em] text-brand-yellow uppercase"
          lang="en"
          dir="ltr"
        >
          {t('finalCta.eyebrow')}
        </span>

        <h2 className="text-[clamp(26px,3.8vw,44px)] font-extrabold leading-tight text-white m-0">
          {t('finalCta.title')}
        </h2>

        <p className="text-sm min-[901px]:text-lg leading-relaxed text-white/85 max-w-[54ch] m-0">
          {t('finalCta.subtitle')}
        </p>

        <div className="pt-2">
          <Button
            as={Link}
            to={ROUTES.BOOKING}
            variant="primary"
            size="lg"
            icon={<FontAwesomeIcon icon={faCalendarCheck} className="text-base" />}
            className="font-extrabold px-8 shadow-ocean inline-flex items-center gap-2.5"
          >
            <span>{t('finalCta.button')}</span>
            <FontAwesomeIcon icon={ArrowIcon} className="text-sm" />
          </Button>
        </div>
      </div>
    </section>
  );
}
