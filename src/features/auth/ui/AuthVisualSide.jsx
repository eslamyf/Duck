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
  const { t } = useTranslation();

  return (
    <section
      className="relative hidden lg:flex flex-col justify-between p-6 xl:p-8 overflow-hidden bg-brand-navy text-white select-none"
      aria-hidden="true"
    >
      {/* Background Hero Image with Teammate's smooth zoom effect */}
      <img
        src={kayakImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 hover:scale-110 transition-transform duration-[2000ms] pointer-events-none"
      />

      {/* Atmospheric Overlays using Brand Design Tokens */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/65 to-brand-navy/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/60 via-transparent to-brand-blue/30 pointer-events-none" />

      {/* Decorative Brand Circles from Teammate's Design */}
      <div className="absolute top-1/2 -end-16 w-44 h-44 rounded-full border border-brand-yellow/15 pointer-events-none" />
      <div className="absolute top-1/2 -end-8 w-28 h-28 rounded-full border border-brand-yellow/20 pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-xl"
        >
          <img
            src={duckLogo}
            alt={t('common.brandName')}
            className="h-9 w-auto object-contain brightness-0 invert drop-shadow-sm"
          />
        </Link>

        {/* Final_4.html Tagline Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow text-brand-navy text-xs font-black tracking-wider shadow-sm">
          <FontAwesomeIcon icon={faCompass} className="text-xs" />
          <span>{t('auth.common.inDuckWeTrust')}</span>
        </span>
      </div>

      {/* Center Storytelling (Final_4.html + Teammate Content) */}
      <div className="relative z-10 my-auto py-3 max-w-lg">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-8 h-1 bg-brand-yellow rounded-full" />
          <span className="text-brand-yellow uppercase tracking-widest text-[11px] font-black">
            {mode === 'login' ? t('auth.login.welcomeBack') : t('auth.signup.joinTitle')}
          </span>
        </div>

        <h1 className="text-2xl xl:text-3xl font-black leading-tight mb-2 tracking-tight text-white">
          {t('auth.common.journeyStartsHere')}
        </h1>

        <p className="text-white/85 text-xs xl:text-sm leading-relaxed mb-4 max-w-md">
          {t('auth.common.journeyDesc')}
        </p>

        {/* Safety & Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
            <span className="w-6 h-6 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faLifeRing} className="text-xs" />
            </span>
            <span className="text-[11px] xl:text-xs">{t('auth.common.badge1')}</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
            <span className="w-6 h-6 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
            </span>
            <span className="text-[11px] xl:text-xs">{t('auth.common.badge2')}</span>
          </div>
        </div>

        {/* Community Proof (from Teammate's Design) */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/15">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {['ن', 'م', 'D', 'K'].map((char, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full border-2 border-brand-navy bg-brand-yellow text-brand-navy flex items-center justify-center font-black text-xs shadow-sm"
              >
                {char}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-black text-white leading-tight">
              {t('auth.common.quote')}
            </p>
            <p className="text-[11px] text-brand-yellow/85 mt-0.5">
              {t('auth.common.quoteSub')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Metadata (Final_4.html line 1899) */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/60 pt-3 border-t border-white/10">
        <span>© 2026 Duck Entertainment</span>
        <span dir="ltr" className="font-mono tracking-wider text-brand-yellow/80">
          {t('auth.common.officialPhone')}
        </span>
      </div>
    </section>
  );
}
