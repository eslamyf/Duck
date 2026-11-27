import { Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import Button from '../../shared/ui/Button/index.js';
import DuckManifesto from '../../shared/ui/DuckManifesto.jsx';
import DuckIcon from '../../shared/ui/Icon/DuckIcon.jsx';
import introImg480 from '../../shared/assets/images/image1-480w.webp';
import introImg540 from '../../shared/assets/images/image1-540w.webp';
import introImg720 from '../../shared/assets/images/image1-720w.webp';

export default function BrandIntroSection() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? 'faArrowLeft' : 'faArrowRight';

  return (
    <section
      id="brand-intro"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="brand-intro-heading"
      className="bg-surface-white text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body border-b border-brand-blue/12"
    >
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 min-[901px]:grid-cols-[1.15fr_1fr] gap-8 min-[901px]:gap-14 items-center">
        {/* Story Copy */}
        <div className="flex flex-col items-start">
          <DuckManifesto
            text={t('brandIntro.badge')}
            theme="light"
            align="start"
            className="mb-4"
          />

          <h2
            id="brand-intro-heading"
            className="text-2xl min-[901px]:text-4xl font-extrabold leading-tight text-brand-navy mb-4"
          >
            {t('brandIntro.title')}
          </h2>

          <p className="text-sm min-[901px]:text-base leading-relaxed text-brand-navy/80 max-w-[60ch] mb-6">
            {t('brandIntro.description')}
          </p>

          <Button
            as={Link}
            to={ROUTES.ABOUT}
            variant="secondary"
            size="md"
            icon={<DuckIcon icon={ArrowIcon} className="text-sm" />}
            iconPosition="end"
            className="font-bold shadow-card"
          >
            {t('brandIntro.cta')}
          </Button>
        </div>

        {/* Visual Showcase */}
        <div className="relative rounded-[26px] overflow-hidden border border-brand-blue/15 bg-brand-navy shadow-ocean aspect-[16/10] min-[901px]:aspect-[4/3]">
          <img
            src={introImg540}
            srcSet={`${introImg480} 480w, ${introImg540} 540w, ${introImg720} 720w`}
            sizes="(max-width: 639px) 480px, (max-width: 900px) 540px, 525px"
            alt={t('brandIntro.imageAlt')}
            width={720}
            height={540}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-cover object-[center_45%] transition-transform duration-700 hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-navy/55 via-transparent to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-4 start-4 rounded-full bg-brand-navy/85 px-4 py-1.5 text-xs font-extrabold tracking-wider text-brand-yellow backdrop-blur-xs border border-white/15"
            lang="en"
            dir="ltr"
          >
            {t('brandIntro.eyebrow')}
          </span>
        </div>
      </div>
    </section>
  );
}
