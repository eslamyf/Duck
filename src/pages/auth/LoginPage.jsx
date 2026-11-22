import { useEffect } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { AuthVisualSide, LoginForm } from '../../features/auth/index.js';
import kayakImage from '../../shared/assets/images/trips/botanical-garden-960w.webp';

export default function LoginPage() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${t('auth.login.metaTitle')} | ${t('common.brandName')}`;
    return () => {
      document.title = prevTitle;
    };
  }, [t]);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden font-body selection:bg-brand-yellow selection:text-brand-navy"
    >
      {/* Full-bleed Atmospheric Nile Background (Teammate's Original Aesthetic) */}
      <img
        src={kayakImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-brand-navy/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-brand-navy/55 to-brand-blue/30 pointer-events-none" />

      {/* Main Floating Split-Screen Card */}
      <div className="relative z-10 w-full max-w-[1340px] min-h-[640px] my-4 sm:my-8 bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] border border-brand-navy/15">
        {/* Left Side: Branded Adventure Storytelling */}
        <AuthVisualSide mode="login" />

        {/* Right Side: Interactive Form */}
        <section className="relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto bg-surface-white">
          <LoginForm />
        </section>
      </div>
    </div>
  );
}
