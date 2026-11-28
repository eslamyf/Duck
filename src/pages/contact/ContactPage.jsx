import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { buildWhatsAppUrl } from '../../shared/config/constants.js';
import Button from '../../shared/ui/Button/index.js';
import DuckIcon from '../../shared/ui/Icon/DuckIcon.jsx';

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  topic: 'general',
  message: '',
};

export default function ContactPage() {
  const { lang, t } = useTranslation();
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? 'faArrowLeft' : 'faArrowRight';

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
    if (submitted) setSubmitted(false);
  };

  const buildContactMessage = () => {
    const topicLabel = t(`contactPage.form.topics.${form.topic}`);
    if (isArabic) {
      return `مرحباً فريق DUCK،\nالاسم: ${form.name}\nالهاتف: ${form.phone}${form.email ? `\nالبريد: ${form.email}` : ''}\nالموضوع: ${topicLabel}\nالرسالة: ${form.message}`;
    }
    return `Hello DUCK Team,\nName: ${form.name}\nPhone: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ''}\nTopic: ${topicLabel}\nMessage: ${form.message}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError(t('contactPage.form.errors.nameRequired'));
      return;
    }
    if (form.phone.trim().length < 8) {
      setError(t('contactPage.form.errors.phoneRequired'));
      return;
    }
    if (form.message.trim().length < 5) {
      setError(t('contactPage.form.errors.messageRequired'));
      return;
    }

    setSubmitted(true);
    setError('');
  };

  const handleSendWhatsApp = () => {
    const msg =
      form.name.trim() && form.message.trim()
        ? buildContactMessage()
        : t('footer.whatsappPrefill');
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  const contactChannels = [
    {
      icon: 'faWhatsapp',
      title: t('contactPage.channels.whatsappTitle'),
      value: '+20 155 006 1006',
      hint: t('contactPage.channels.whatsappHint'),
      href: buildWhatsAppUrl(),
      external: true,
      accent: 'bg-brand-whatsapp/15 text-emerald-700',
    },
    {
      icon: 'faWhatsapp',
      title: t('contactPage.channels.phoneTitle'),
      value: '+20 155 006 1006',
      hint: t('contactPage.channels.phoneHint'),
      href: 'tel:+201550061006',
      external: false,
      accent: 'bg-brand-blue/12 text-brand-blue',
    },
    {
      icon: 'faEnvelope',
      title: t('contactPage.channels.emailTitle'),
      value: 'duck.asw@gmail.com',
      hint: t('contactPage.channels.emailHint'),
      href: 'mailto:duck.asw@gmail.com',
      external: false,
      accent: 'bg-brand-navy/10 text-brand-navy',
    },
    {
      icon: 'faLocationDot',
      title: t('contactPage.channels.locationTitle'),
      value: t('contactPage.channels.locationValue'),
      hint: t('contactPage.channels.locationHint'),
      to: sectionLink(SECTIONS.MAP),
      accent: 'bg-brand-yellow/35 text-brand-navy',
    },
  ];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="bg-surface-mist bg-pattern-duck min-h-screen font-body text-brand-navy">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-brand-navy bg-pattern-waves-dark text-white py-14 sm:py-20 px-[5vw]">
        <div
          className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full bg-brand-blue/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-brand-yellow/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/35 bg-brand-yellow/12 px-4 py-1.5 text-xs font-extrabold tracking-wide text-brand-yellow mb-4">
            <DuckIcon icon="faEnvelope" />
            <span>{t('contactPage.eyebrow')}</span>
          </span>

          <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight text-white mb-4">
            {t('contactPage.title')}
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
            {t('contactPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-[5vw] py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Channels Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactChannels.map((item) => {
                const content = (
                  <div className="flex items-start gap-4 rounded-2xl border border-brand-blue/15 bg-surface-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-blue/35 hover:shadow-card">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${item.accent}`}
                    >
                      <DuckIcon icon={item.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-extrabold text-brand-navy mb-1">
                        {item.title}
                      </h2>
                      <p
                        dir={item.icon === 'faLocationDot' ? undefined : 'ltr'}
                        className="text-sm font-bold text-brand-blue truncate text-start"
                      >
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs text-brand-navy/65">
                        {item.hint}
                      </p>
                    </div>
                  </div>
                );

                if (item.to) {
                  return (
                    <Link key={item.title} to={item.to} className="block">
                      {content}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                );
              })}
            </div>

            {/* Quick Links Card */}
            <div className="rounded-2xl border border-brand-blue/15 bg-brand-navy p-6 text-white shadow-soft">
              <h3 className="text-base font-extrabold text-brand-yellow mb-2">
                {t('contactPage.quickHelpTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                {t('contactPage.quickHelpDesc')}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button
                  as={Link}
                  to={ROUTES.BOOKING}
                  variant="primary"
                  size="sm"
                  icon={<DuckIcon icon="faCalendarCheck" />}
                >
                  {t('nav.bookNowShort')}
                </Button>
                <Button
                  as={Link}
                  to={sectionLink(SECTIONS.FAQ)}
                  variant="ghost"
                  size="sm"
                  className="border border-white/25 text-white hover:bg-white/10 hover:text-brand-yellow"
                  icon={<DuckIcon icon="faCircleQuestion" />}
                >
                  {t('nav.faq')}
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 rounded-3xl border border-brand-blue/15 bg-surface-white p-6 sm:p-8 shadow-card">
            <div className="mb-6">
              <h2 className="font-heading text-xl sm:text-2xl font-black text-brand-navy mb-1.5">
                {t('contactPage.form.heading')}
              </h2>
              <p className="text-sm text-brand-navy/70">
                {t('contactPage.form.subheading')}
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white text-xl">
                  <DuckIcon icon="faCheck" />
                </span>
                <h3 className="text-lg font-extrabold text-brand-navy mb-2">
                  {t('contactPage.form.successTitle')}
                </h3>
                <p className="text-sm text-brand-navy/75 mb-5">
                  {t('contactPage.form.successDesc')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    icon={<DuckIcon icon="faWhatsapp" />}
                    onClick={handleSendWhatsApp}
                  >
                    {t('contactPage.form.sendWhatsAppBtn')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setSubmitted(false);
                    }}
                  >
                    {t('contactPage.form.sendAnotherBtn')}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                      {t('contactPage.form.nameLabel')} *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder={t('contactPage.form.namePlaceholder')}
                      className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/60 px-4 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-blue focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                      {t('contactPage.form.phoneLabel')} *
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="+20 1XX XXX XXXX"
                      className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/60 px-4 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-blue focus:bg-white text-start"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                      {t('contactPage.form.emailLabel')}
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/60 px-4 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-blue focus:bg-white text-start"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                      {t('contactPage.form.topicLabel')}
                    </label>
                    <select
                      value={form.topic}
                      onChange={handleChange('topic')}
                      className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/60 px-4 py-3 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-blue focus:bg-white"
                    >
                      <option value="general">{t('contactPage.form.topics.general')}</option>
                      <option value="booking">{t('contactPage.form.topics.booking')}</option>
                      <option value="groups">{t('contactPage.form.topics.groups')}</option>
                      <option value="partners">{t('contactPage.form.topics.partners')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1.5">
                    {t('contactPage.form.messageLabel')} *
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder={t('contactPage.form.messagePlaceholder')}
                    className="w-full rounded-xl border border-brand-blue/20 bg-surface-mist/60 px-4 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-blue focus:bg-white resize-y"
                    required
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-brand-error/10 px-4 py-2.5 text-xs font-bold text-brand-error">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<DuckIcon icon={ArrowIcon} />}
                    iconPosition="end"
                  >
                    {t('contactPage.form.submitBtn')}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    icon={<DuckIcon icon="faWhatsapp" />}
                    onClick={handleSendWhatsApp}
                  >
                    {t('contactPage.form.sendWhatsAppBtn')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
