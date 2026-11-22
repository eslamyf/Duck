import { useEffect } from 'react';
import { useTranslation } from '../../shared/i18n/index.js';
import { AuthVisualSide, CreateAccountForm } from '../../features/auth/index.js';
import kayakImage from '../../shared/assets/images/trips/botanical-garden-960w.webp';

export default function CreateAccountPage() {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${t('auth.signup.metaTitle')} | ${t('common.brandName')}`;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.title = prevTitle;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [t]);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative h-screen max-h-screen w-full flex items-center justify-center p-2 sm:p-4 lg:p-5 overflow-hidden font-body selection:bg-brand-yellow selection:text-brand-navy"
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
      <div className="relative z-10 w-full max-w-[1240px] h-full max-h-[min(780px,calc(100vh-2rem))] bg-white rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] border border-brand-navy/15">
        {/* Left Side: Branded Adventure Storytelling */}
        <AuthVisualSide mode="signup" />

        {/* Right Side: Interactive Form */}
        <section className="relative flex flex-col justify-between p-4 sm:p-6 lg:p-6 xl:p-7 overflow-y-auto bg-surface-white">
          <CreateAccountForm />
        </section>
      </div>
    </div>
  );
}
