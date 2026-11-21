import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSailboat } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { SectionHeader, Accordion, Button } from '../../shared/ui/index.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';
import { FAQ_CATEGORIES, FAQ_ITEMS } from './faqData.js';

export default function FAQSection() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].id);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Track currently expanded item ID (default: first item in the active category)
  const [openId, setOpenId] = useState(() => FAQ_ITEMS.filter((item) => item.category === FAQ_CATEGORIES[0].id)[0]?.id);

  // When switching categories, automatically open the first question of that category
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const itemsInCat = FAQ_ITEMS.filter((item) => item.category === catId);
    setOpenId(itemsInCat[0]?.id || null);
  };

  // Prepare items for Accordion
  const accordionItems = useMemo(() => {
    return filteredItems.map((item, index) => ({
      id: item.id,
      number: String(index + 1).padStart(2, '0'),
      title: t(item.qKey),
      content: t(item.aKey),
    }));
  }, [filteredItems, t]);

  const whatsappUrl = useMemo(() => {
    const prefill = t('faq.sideCard.prefill', 'أهلاً، عندي سؤال عن Duck: ');
    return buildWhatsAppUrl(prefill);
  }, [t]);

  return (
    <section
      id="faq"
      className="bg-surface-mist text-brand-navy py-12 min-[901px]:py-20 px-[5vw] min-[901px]:px-[6vw] font-body relative overflow-hidden border-t border-[rgba(20,125,159,0.12)] scroll-mt-[calc(var(--header-height-mobile)+16px)] min-[901px]:scroll-mt-[calc(var(--header-height-desktop)+20px)]"
      aria-label={t('faq.title', 'كل ما تحتاج معرفته عن Duck')}
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header */}
        <SectionHeader
          title={t('faq.title', 'كل ما تحتاج معرفته عن Duck')}
          subtitle={t('faq.subtitle', 'اختار القسم اللي يهمّك، وإجابات أسئلته هتظهر تحته.')}
          align="start"
        />

        {/* Main Grid: Left Questions Accordion, Right Sticky Aside Card */}
        <div className="grid grid-cols-1 min-[901px]:grid-cols-[1fr_320px] gap-8 min-[901px]:gap-14 items-start">
          {/* Main Content Column */}
          <div className="w-full min-w-0">
            {/* Category Selector Buttons */}
            <div
              className="grid grid-cols-3 gap-2.5 min-[901px]:gap-3.5 mb-6 min-[901px]:mb-8"
              role="group"
              aria-label={t('faq.categoriesLabel', 'أقسام الأسئلة')}
            >
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategory;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 min-h-[82px] min-[901px]:min-h-[96px] p-2.5 min-[901px]:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-blue select-none ${
                      isActive
                        ? 'bg-brand-navy text-white border-brand-navy shadow-card -translate-y-0.5'
                        : 'bg-white text-brand-navy border-[rgba(20,125,159,0.18)] hover:bg-white/80 hover:border-brand-blue hover:-translate-y-0.5'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={cat.icon}
                      className={`text-xl min-[901px]:text-2xl mb-0.5 transition-colors ${
                        isActive ? 'text-brand-yellow' : 'text-brand-blue'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-bold text-xs min-[901px]:text-[14px] text-center leading-snug">
                      {t(`faq.categories.${cat.key}`)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Accordion Component */}
            <div className="bg-white rounded-2xl min-[901px]:rounded-[24px] p-4 min-[901px]:p-6 border border-[rgba(20,125,159,0.16)] shadow-sm">
              <Accordion
                items={accordionItems}
                openId={openId}
                onChange={(id) => setOpenId((prev) => (prev === id ? null : id))}
              />
            </div>
          </div>

          {/* Sticky Aside CTA Card (.fqs2) */}
          <aside className="static min-[901px]:sticky min-[901px]:top-[120px] bg-white/85 backdrop-blur-md rounded-[24px] p-6 min-[901px]:p-7 border border-[rgba(20,125,159,0.18)] shadow-card flex flex-col items-center text-center">
            {/* Sailboat Icon */}
            <span
              className="w-15 h-15 min-[901px]:w-16 min-[901px]:h-16 rounded-full bg-surface-mist text-brand-blue grid place-items-center text-3xl mb-3 shadow-inner"
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faSailboat} />
            </span>

            {/* Heading */}
            <h3 className="text-xl min-[901px]:text-2xl font-bold text-brand-navy mb-2">
              {t('faq.sideCard.title', 'ما لقيتش إجابتك؟')}
            </h3>

            {/* Description */}
            <p className="text-xs min-[901px]:text-sm text-brand-navy/75 mb-6 leading-relaxed max-w-[28ch]">
              {t('faq.sideCard.desc', 'فريقنا بيرد عليك على واتساب، وللمجموعات وعروض الشركات كمان.')}
            </p>

            {/* WhatsApp CTA Button */}
            <Button
              as="a"
              href={whatsappUrl}
              target="_blank"
              rel="noopener"
              variant="whatsapp"
              fullWidth
              size="md"
              icon={<FontAwesomeIcon icon={faWhatsapp} className="text-xl" />}
              className="shadow-sm font-bold"
            >
              {t('faq.sideCard.btn', 'اسألنا على واتساب')}
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
