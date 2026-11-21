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
      className="relative min-h-[500px] h-[min(72vh,620px)] overflow-hidden bg-brand-navy select-none"
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
            'linear-gradient(180deg, rgba(12,18,38,0.72) 0%, rgba(12,18,38,0.22) 36%, rgba(12,18,38,0) 55%, rgba(12,18,38,0.7) 100%)',
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

      {/* Group Size and Details Indicator (clearly explaining size and dynamic choice) */}
      <div className="absolute z-20 bottom-6 inset-s-[5vw] flex flex-wrap items-center gap-3">
        {/* Dynamic Size Indicator with Clear Explanatory Label */}
        <div className="inline-flex items-center gap-2.5 bg-brand-navy/90 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full shadow-xl text-white">
          <FontAwesomeIcon icon={faUsers} className="text-brand-yellow text-sm" />
          <span className="text-xs min-[901px]:text-sm font-bold text-white/90">
            {t('groupsPage.stageCountPrompt')}
          </span>
          <b className="text-base min-[901px]:text-xl font-black text-brand-yellow tabular-nums">
            {formattedCount} {t('groupsPage.individuals')}
          </b>
          <span className="hidden sm:inline text-[11px] text-white/60 font-medium">
            {t('groupsPage.stageCountHint')}
          </span>
        </div>

        {/* Dynamic Name Tag Pill */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs min-[901px]:text-sm select-none truncate transition-all duration-300 shadow-xl ${
            state.org.trim()
              ? 'bg-brand-yellow text-brand-navy font-black ring-2 ring-brand-yellow/60'
              : 'bg-brand-navy/90 text-white/80 backdrop-blur-md border border-white/20'
          }`}
        >
          <FontAwesomeIcon icon={faFlag} className="text-xs text-brand-yellow" />
          <span className="truncate">{state.org.trim() || t('groupsPage.yourGroupNameHere')}</span>
        </div>
      </div>
    </section>
  );
}
