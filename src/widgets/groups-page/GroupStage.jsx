import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { GROUP_TYPES } from './sceneData.js';
import groupsMainDesktop from '../../shared/assets/images/groups/groups-main-960w.webp';
import groupsMainMobile from '../../shared/assets/images/groups/groups-main-640w.webp';

export default function GroupStage({ state, t, lang }) {
  const currentPalette = GROUP_TYPES[state.type]?.palette || GROUP_TYPES[0].palette;
  const formattedCount = Number(state.size).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <section
      className="relative min-h-[500px] h-[min(72vh,620px)] overflow-hidden bg-brand-navy select-none"
      aria-label={t('groupsPage.stageAria')}
    >
      {/* Real High-Resolution Group Photo */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-width: 640px)" srcSet={groupsMainMobile} type="image/webp" />
        <img
          src={groupsMainDesktop}
          alt={t('groupsPage.stageHeroTitle')}
          className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-1000"
        />
      </picture>

      {/* Cinematic Vignette & Gradient Overlays for Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,18,38,0.78) 0%, rgba(12,18,38,0.38) 42%, rgba(12,18,38,0.55) 70%, rgba(12,18,38,0.92) 100%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-brand-navy/20 mix-blend-multiply" />

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

      {/* Hero Text */}
      <div className="absolute z-20 top-10 min-[901px]:top-16 inset-x-[5vw] max-w-[680px] text-white pointer-events-none">
        <h1 className="text-3xl min-[901px]:text-5xl font-black leading-tight drop-shadow-lg">
          {t('groupsPage.stageHeroTitle')}{' '}
          <span className="text-brand-yellow drop-shadow-md">{t('groupsPage.stageHeroHighlight')}</span>
        </h1>
        <p className="text-sm min-[901px]:text-lg mt-3 text-white/95 drop-shadow-md font-medium leading-relaxed">
          {t('groupsPage.stageHeroDesc')}
        </p>
      </div>

      {/* Big Group Count Connected to Slider */}
      <div
        className="absolute z-20 bottom-16 inset-s-[5vw] flex items-baseline gap-2.5 text-white pointer-events-none"
        aria-live="polite"
      >
        <b className="text-6xl min-[901px]:text-8xl font-black tabular-nums text-brand-yellow drop-shadow-[0_4px_14px_rgba(0,0,0,0.65)] leading-none">
          {formattedCount}
        </b>
        <span className="text-lg min-[901px]:text-2xl font-bold text-white drop-shadow-md">
          {t('groupsPage.individuals')}
        </span>
      </div>

      {/* Dynamic Name Tag Pill */}
      <div
        className={`absolute z-20 bottom-6 inset-s-[5vw] inline-flex items-center gap-2 max-w-[70vw] px-4 py-2 rounded-full font-bold text-sm min-[901px]:text-base select-none truncate transition-all duration-300 shadow-lg ${
          state.org.trim()
            ? 'bg-brand-yellow text-brand-navy font-black ring-2 ring-brand-yellow/60'
            : 'bg-white/20 text-white backdrop-blur-md border border-white/30'
        }`}
      >
        <FontAwesomeIcon icon={faFlag} className="text-xs" />
        <span className="truncate">{state.org.trim() || t('groupsPage.yourGroupNameHere')}</span>
      </div>
    </section>
  );
}
