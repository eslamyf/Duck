import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faLifeRing,
  faCompass,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';
import { ROUTES } from '../../../shared/config/routes.js';
import kayakImage from '../../../shared/assets/images/trips/botanical-garden-960w.webp';
import duckLogo from '../../../shared/assets/icons/Artboard 14.png';

export default function AuthVisualSide({ mode = 'login' }) {
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  return (
    <section
      className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-brand-navy text-white select-none"
      aria-hidden="true"
    >
      {/* Background Hero Image */}
      <img
        src={kayakImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 hover:scale-110 transition-transform duration-[2000ms] pointer-events-none"
      />

      {/* Atmospheric Overlays using Brand Tokens */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-navy/20 to-brand-navy/40 pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-xl"
        >
          <img
            src={duckLogo}
            alt={t('common.brandName')}
            className="h-10 w-auto object-contain brightness-0 invert drop-shadow-sm"
          />
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-wider text-brand-yellow">
          <FontAwesomeIcon icon={faCompass} className="text-xs" />
          <span>{t('auth.common.brandTagline')}</span>
        </span>
      </div>

      {/* Center / Bottom Editorial Storytelling */}
      <div className="relative z-10 my-auto py-12 max-w-lg">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-8 h-1 bg-brand-yellow rounded-full" />
          <span className="text-brand-yellow uppercase tracking-widest text-xs font-bold">
            {mode === 'login' ? t('auth.login.welcomeBack') : t('auth.signup.joinTitle')}
          </span>
        </div>

        <h1 className="text-3xl xl:text-5xl font-black leading-[1.2] mb-5 tracking-tight text-white">
          {mode === 'login' ? (
            <>
              {isArabic ? 'مستعد لمغامرتك' : 'THE ADVENTURE'}
              <span className="text-brand-yellow block mt-1">
                {isArabic ? 'القادمة على النيل؟' : 'NEVER STOPS.'}
              </span>
            </>
          ) : (
            <>
              {isArabic ? 'انضم إلى عائلة' : 'JOIN THE DUCK'}
              <span className="text-brand-yellow block mt-1">
                {isArabic ? 'DUCK للمغامرات' : 'COMMUNITY.'}
              </span>
            </>
          )}
        </h1>

        <p className="text-white/80 text-sm xl:text-base leading-relaxed mb-8 max-w-md">
          {t('auth.common.exploreWorld')}
        </p>

        {/* Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
            <span className="w-8 h-8 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faLifeRing} />
            </span>
            <span>{t('auth.common.badge1')}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold">
            <span className="w-8 h-8 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} />
            </span>
            <span>{t('auth.common.badge2')}</span>
          </div>
        </div>

        {/* Social Proof / Community */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/15">
          <div className="flex -space-x-2.5 rtl:space-x-reverse">
            {['ن', 'م', 'D', 'K'].map((char, idx) => (
              <div
                key={idx}
                className="w-9 h-9 rounded-full border-2 border-brand-navy bg-brand-yellow text-brand-navy flex items-center justify-center font-bold text-xs shadow-sm"
              >
                {char}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs xl:text-sm font-bold text-white leading-tight">
              {t('auth.common.quote')}
            </p>
            <p className="text-[11px] text-brand-yellow/85 mt-0.5">
              {t('auth.common.quoteSub')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/50 pt-4 border-t border-white/10">
        <span>© {new Date().getFullYear()} DUCK Entertainment</span>
        <span>{t('auth.common.demoNotice')}</span>
      </div>
    </section>
  );
}
