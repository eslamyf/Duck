import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass,
  faCalendarCheck,
  faMapLocationDot,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader, Card, Badge } from '../../shared/ui/index.js';

const CARD_ICONS = {
  diverse: faCompass,
  easyBooking: faCalendarCheck,
  uniqueDestinations: faMapLocationDot,
  worthRepeating: faHeart,
};

export default function WhyDuckSection() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';
  const rawCards = t('whyDuck.cards');
  const cards = Array.isArray(rawCards) ? rawCards : [];

  return (
    <section
      id="why-duck"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-label={t('whyDuck.title')}
      className="bg-surface-sand text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body border-t border-brand-blue/12"
    >
      <div className="max-w-[1360px] mx-auto">
        <SectionHeader
          theme="light"
          align="center"
          tag={
            <Badge
              variant="accent"
              size="sm"
              className="font-extrabold tracking-widest uppercase"
            >
              <span lang="en" dir="ltr">{t('whyDuck.eyebrow')}</span>
            </Badge>
          }
          title={t('whyDuck.title')}
          subtitle={t('whyDuck.subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-[901px]:gap-6">
          {cards.map((item) => {
            const icon = CARD_ICONS[item.id] || faCompass;
            return (
              <Card
                key={item.id}
                variant="default"
                padding="md"
                className="flex flex-col items-start gap-4 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-ocean"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy text-xl text-brand-yellow shadow-card"
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={icon} />
                </span>

                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-brand-navy/75 m-0">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
