import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faUsers } from '@fortawesome/free-solid-svg-icons';
import { GROUP_TYPES } from './sceneData.js';
import groupsMainDesktop from '../../shared/assets/images/groups/groups-main-960w.webp';
import groupsMainMobile from '../../shared/assets/images/groups/groups-main-640w.webp';

export default function GroupStage({ state, t, lang }) {
  const currentPalette = GROUP_TYPES[state.type]?.palette || GROUP_TYPES[0].palette;
  const formattedCount = Number(state.size).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <section
      className="relative min-h-[520px] h-[min(78vh,660px)] overflow-hidden bg-brand-navy select-none"
      aria-label={t('groupsPage.stageAria')}
    >
      {/* Real High-Resolution Group Photo with High Clarity and Vibrancy */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-width: 640px)" srcSet={groupsMainMobile} type="image/webp" />
        <img
          src={groupsMainDesktop}
          alt={t('groupsPage.stageHeroTitle')}
          className="w-full h-full object-cover object-center scale-[1.01]"
        />
      </picture>

      {/* Subtle Vignettes focused only on text regions (leaving water & group bright and visible) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,18,38,0.78) 0%, rgba(12,18,38,0.3) 38%, rgba(12,18,38,0) 58%, rgba(12,18,38,0.65) 100%)',
        }}
      />

      {/* Festive Bunting String Colored by Selected Group Type */}
      <div
        className="absolute z-10 top-0 inset-x-0 flex h-10 pointer-events-none border-t border-white/30"
        aria-hidden="true"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <i
            key={i}
            className="flex-1 mx-0.5 h-8 origin-top transition-colors duration-500"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backgroundColor: currentPalette[i % currentPalette.length],
            }}
          />
        ))}
      </div>

      {/* Hero Text & Clear Indicator Pills */}
      <div className="absolute z-20 top-8 min-[901px]:top-14 inset-x-[5vw] max-w-[760px] text-white">
        <h1 className="text-3xl min-[901px]:text-5xl font-black leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
          {t('groupsPage.stageHeroTitle')}{' '}
          <span className="text-brand-yellow drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{t('groupsPage.stageHeroHighlight')}</span>
        </h1>
        <p className="text-sm min-[901px]:text-lg mt-2.5 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] font-medium leading-relaxed">
          {t('groupsPage.stageHeroDesc')}
        </p>

        {/* Dynamic Indicator Pills - placed safely here so they are ALWAYS 100% visible and NEVER covered by the booking card */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Dynamic Size Indicator */}
          <div className="inline-flex items-center gap-2.5 bg-brand-navy/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-xl text-white">
            <FontAwesomeIcon icon={faUsers} className="text-brand-yellow text-sm" />
            <span className="text-xs min-[901px]:text-sm font-bold text-white/90">
              {t('groupsPage.stageCountPrompt')}
            </span>
            <b className="text-base min-[901px]:text-xl font-black text-brand-yellow tabular-nums">
              {formattedCount} {t('groupsPage.individuals')}
            </b>
          </div>

          {/* Dynamic Name Tag */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs min-[901px]:text-sm select-none truncate transition-all duration-300 shadow-xl ${
              state.org.trim()
                ? 'bg-brand-yellow text-brand-navy font-black ring-2 ring-brand-yellow/60'
                : 'bg-brand-navy/90 text-white/80 backdrop-blur-md border border-white/20'
            }`}
          >
            <FontAwesomeIcon icon={faFlag} className="text-xs text-brand-yellow" />
            <span className="truncate">{state.org.trim() || t('groupsPage.yourGroupNameHere')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
