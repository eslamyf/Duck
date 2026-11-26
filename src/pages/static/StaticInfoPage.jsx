import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faShieldHalved,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { SectionHeader, Card, Badge, Button } from '../../shared/ui/index.js';

export default function StaticInfoPage({ policyKey = 'privacy' }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const BackIcon = isArabic ? faArrowRight : faArrowLeft;

  const sections = t(`legal.${policyKey}.sections`);
  const items = Array.isArray(sections) ? sections : [];

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-surface-mist text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body"
    >
      <div className="max-w-[920px] mx-auto space-y-6">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-surface-white px-4 py-2 text-xs font-bold text-brand-navy shadow-card transition hover:bg-brand-navy hover:text-brand-yellow"
        >
          <FontAwesomeIcon icon={BackIcon} />
          <span>{t('legal.backHome')}</span>
        </Link>

        <Card variant="default" padding="lg" className="space-y-6">
          <SectionHeader
            theme="light"
            align="start"
            tag={
              <Badge
                variant="tagLight"
                size="sm"
                icon={<FontAwesomeIcon icon={faShieldHalved} className="text-brand-blue" />}
              >
                <span lang="en" dir="ltr">{t(`legal.${policyKey}.eyebrow`)}</span>
              </Badge>
            }
            title={t(`legal.${policyKey}.title`)}
            subtitle={t(`legal.${policyKey}.subtitle`)}
            className="mb-2"
          />

          <div className="space-y-4">
            {items.map((sec, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-brand-blue/12 bg-surface-light p-5"
              >
                <h2 className="text-base sm:text-lg font-extrabold text-brand-navy mb-2">
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-brand-navy/80 m-0">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-brand-blue/12">
            <span
              className="text-xs font-extrabold tracking-widest text-brand-blue uppercase"
              lang="en"
              dir="ltr"
            >
              {t('footer.closingPromise')}
            </span>

            <Button
              as={Link}
              to={ROUTES.BOOKING}
              variant="primary"
              size="md"
              icon={<FontAwesomeIcon icon={faCalendarCheck} />}
              className="font-bold"
            >
              {t('legal.bookNow')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
