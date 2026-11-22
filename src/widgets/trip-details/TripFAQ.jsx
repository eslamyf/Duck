import { useTranslation } from '../../shared/i18n/index.js';
import { Accordion } from '../../shared/ui/index.js';

export default function TripFAQ() {
  const { t } = useTranslation();

  const faqItems = [
    {
      id: 'faq-1',
      title: t('faq.items.isSafe.q'),
      content: t('faq.items.isSafe.a'),
    },
    {
      id: 'faq-2',
      title: t('faq.items.needSwim.q'),
      content: t('faq.items.needSwim.a'),
    },
    {
      id: 'faq-3',
      title: t('faq.items.cancellation.q'),
      content: t('faq.items.cancellation.a'),
    },
    {
      id: 'faq-4',
      title: t('faq.items.whatToWear.q'),
      content: t('faq.items.whatToWear.a'),
    },
  ];

  return (
    <div className="ds">
      <h2>{t('tripDetails.faqTitle')}</h2>
      <Accordion items={faqItems} allowMultiple={false} />
    </div>
  );
}
