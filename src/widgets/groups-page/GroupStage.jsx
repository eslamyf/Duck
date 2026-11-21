import { useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import {
  GROUP_TYPES,
  TIMES_OF_DAY,
  ROWS,
  SLOTS,
  SCALES,
  disc,
  LANDSCAPES,
} from './sceneData.js';

export default function GroupStage({
  state,
  onCycleTime,
  t,
  lang,
}) {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const landscapeRef = useRef(null);

  const currentTime = TIMES_OF_DAY[state.time];
  const currentPalette = GROUP_TYPES[state.type].palette;

  // Precompute 150 boat slots once
  const boatSlots = useMemo(() => {
    const slots = [];
    for (let r = 0; r < ROWS; r++) {
      for (let k = 0; k < SLOTS; k++) {
        const x = 44 + 812 * disc(k, r);
        const y = 274 + r * 28 + ((k * 7 + r * 3) % 5);
        const delay = ((k * 0.37 + r * 0.21) % 2.6).toFixed(2);
        // Only animate up to 16 boats to preserve 60fps budget
        const isAnimated = (k * ROWS + r) % 9 === 0;
        slots.push({ r, k, x, y, delay, scale: SCALES[r], isAnimated });
      }
    }
    return slots;
  }, []);

  // Update dynamic scene properties (colors, water, landscape)
  useEffect(() => {
    const sc = sceneRef.current;
    if (!sc) return;

    sc.style.setProperty('--sk1', currentTime.sk1);
    sc.style.setProperty('--sk2', currentTime.sk2);
    sc.style.setProperty('--sunc', currentTime.sunc);
    sc.style.setProperty('--land', currentTime.land);
    sc.style.setProperty('--palm', currentTime.palm);

    let w1 = currentTime.w1;
    let w2 = currentTime.w2;
    if ((state.loc === 2 || state.loc === 4) && state.time > 0 && state.time < 3) {
      w1 = '#5fe0d0';
      w2 = '#147D9F';
    }
    sc.style.setProperty('--w1', w1);
    sc.style.setProperty('--w2', w2);

    if (landscapeRef.current) {
      landscapeRef.current.innerHTML = LANDSCAPES[state.loc]();
    }
  }, [state.time, state.loc, currentTime]);

  // Pause animations when offscreen or tab hidden
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    let isIntersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (el) {
          el.style.animationPlayState = isIntersecting && !document.hidden ? 'running' : 'paused';
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      if (el) {
        el.style.animationPlayState = isIntersecting && !document.hidden ? 'running' : 'paused';
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const formattedCount = Number(state.size).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <section
      ref={stageRef}
      className="relative min-h-[520px] h-[min(80vh,660px)] overflow-hidden bg-brand-navy select-none"
      aria-label={t('groupsPage.stageAria')}
    >
      <svg
        ref={sceneRef}
        id="scene"
        viewBox="0 0 900 440"
        preserveAspectRatio="xMidYMax slice"
        role="img"
        aria-label={t('groupsPage.sceneAria')}
        className="absolute inset-0 w-full h-full ltr:dir-ltr [direction:ltr]"
        style={{
          transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <defs>
          <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sk1, #147D9F)" />
            <stop offset="1" stopColor="var(--sk2, #eaf8ff)" />
          </linearGradient>
          <linearGradient id="gwat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--w1, #147D9F)" />
            <stop offset="1" stopColor="var(--w2, #0C1226)" />
          </linearGradient>
          <radialGradient id="gsun">
            <stop offset="0" stopColor="var(--sunc, #FDFB45)" stopOpacity="0.75" />
            <stop offset="1" stopColor="var(--sunc, #FDFB45)" stopOpacity="0" />
          </radialGradient>
          <clipPath id="wclip">
            <rect y="248" width="900" height="192" />
          </clipPath>

          {/* Boat Symbols */}
          <symbol id="b-kayak" overflow="visible">
            <path d="M-27 4.5q27 6 54 0" stroke="#fff" strokeOpacity="0.6" fill="none" strokeWidth="1.6" />
            <path d="M-24 0Q0 -8 24 0Q0 7 -24 0Z" fill="currentColor" stroke="#0C1226" strokeWidth="1.3" />
            <circle cx="0" cy="-5.5" r="3.4" fill="#0C1226" />
            <path d="M-13 -9L13 -1" stroke="#0C1226" strokeWidth="1.5" strokeLinecap="round" />
          </symbol>
          <symbol id="b-sup" overflow="visible">
            <path d="M-27 4.5q27 6 54 0" stroke="#fff" strokeOpacity="0.6" fill="none" strokeWidth="1.6" />
            <rect x="-25" y="-2" width="50" height="4.5" rx="2.2" fill="currentColor" stroke="#0C1226" strokeWidth="1.2" />
            <path d="M0 -2V-15" stroke="#0C1226" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="0" cy="-18.5" r="3.3" fill="#0C1226" />
            <path d="M-11 -23L11 3" stroke="#0C1226" strokeWidth="1.5" strokeLinecap="round" />
          </symbol>
          <symbol id="b-waterbike" overflow="visible">
            <path d="M-22 5q22 6 44 0" stroke="#fff" strokeOpacity="0.6" fill="none" strokeWidth="1.6" />
            <rect x="-17" y="0" width="34" height="4.5" rx="2.2" fill="currentColor" stroke="#0C1226" strokeWidth="1.2" />
            <path d="M-11 0L-5 -10H8L12 0" fill="none" stroke="#0C1226" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="9" cy="-6" r="5" fill="none" stroke="#0C1226" strokeWidth="1.5" />
            <circle cx="-3" cy="-17" r="3.2" fill="#0C1226" />
            <path d="M-3 -14L-4 -10" stroke="#0C1226" strokeWidth="2.4" strokeLinecap="round" />
          </symbol>
        </defs>

        {/* Sky Background */}
        <rect width="900" height="440" fill="url(#gsky)" />

        {/* Sun and Glow */}
        <g
          id="sun"
          style={{
            transform: `translate(${currentTime.sun[0]}px, ${currentTime.sun[1]}px)`,
            transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <circle r="150" fill="url(#gsun)" />
          <circle r={currentTime.r} style={{ fill: 'var(--sunc)' }} />
        </g>

        {/* Gentle Background Clouds */}
        <g opacity="0.7" className="animate-[pulse_8s_ease-in-out_infinite]">
          <ellipse cx="140" cy="110" rx="64" ry="13" fill="#fff" />
          <ellipse cx="174" cy="100" rx="38" ry="13" fill="#fff" />
        </g>
        <g opacity="0.45" className="animate-[pulse_10s_ease-in-out_infinite]">
          <ellipse cx="680" cy="155" rx="80" ry="11" fill="#fff" />
        </g>

        {/* Destination Landscape Graphic */}
        <g id="landscape" ref={landscapeRef} />

        {/* Water Surface */}
        <rect y="248" width="900" height="192" fill="url(#gwat)" />

        {/* Water Clip for Reflections & Waves */}
        <g clipPath="url(#wclip)">
          <g
            id="refl"
            opacity="0.5"
            style={{
              transform: `translateX(${currentTime.sun[0]}px)`,
              transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <ellipse cy="258" rx="26" ry="3.5" style={{ fill: 'var(--sunc)' }} />
            <ellipse cy="274" rx="38" ry="3" style={{ fill: 'var(--sunc)' }} />
            <ellipse cy="294" rx="22" ry="3" style={{ fill: 'var(--sunc)' }} />
            <ellipse cy="318" rx="34" ry="2.5" style={{ fill: 'var(--sunc)' }} />
          </g>

          {/* Animated Water Waves */}
          <path
            d="M-120 268q30-9 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.32"
          />
          <path
            d="M-120 310q30-9 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />
        </g>

        {/* Boats Fleet */}
        <g id="fleet">
          {boatSlots.map((slot) => {
            const countForThisRow = Math.max(0, Math.ceil((Math.min(state.size, 150) - slot.r) / ROWS));
            const isVisible = slot.k < countForThisRow;
            const color = currentPalette[(slot.k + slot.r) % currentPalette.length];
            const kind =
              state.act === 'mixed'
                ? ['kayak', 'sup', 'waterbike'][(slot.k + slot.r) % 3]
                : state.act;

            return (
              <g
                key={`${slot.r}-${slot.k}`}
                transform={`translate(${slot.x.toFixed(1)} ${slot.y}) scale(${slot.scale})`}
                opacity={isVisible ? 1 : 0}
                style={{ transition: 'opacity 0.4s ease' }}
              >
                <g
                  className={slot.isAnimated ? 'animate-[pulse_2.6s_ease-in-out_infinite]' : ''}
                  style={slot.isAnimated ? { animationDelay: `-${slot.delay}s` } : undefined}
                >
                  <use href={`#b-${kind}`} style={{ color }} />
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Atmospheric Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,18,38,0.72) 0%, rgba(12,18,38,0.15) 45%, rgba(12,18,38,0) 60%, rgba(12,18,38,0.6) 100%)',
        }}
      />

      {/* Decorative Bunting String */}
      <div className="absolute z-10 top-0 inset-x-0 flex h-10 pointer-events-none border-t border-white/40" aria-hidden="true">
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
      <div className="absolute z-20 top-8 min-[901px]:top-12 inset-x-[5vw] max-w-[640px] text-white pointer-events-none">
        <h1 className="text-3xl min-[901px]:text-5xl font-black leading-tight drop-shadow-md">
          {t('groupsPage.stageHeroTitle')}{' '}
          <span className="text-brand-yellow">{t('groupsPage.stageHeroHighlight')}</span>
        </h1>
        <p className="text-sm min-[901px]:text-lg mt-2 text-white/90 drop-shadow-sm font-medium">
          {t('groupsPage.stageHeroDesc')}
        </p>
      </div>

      {/* Big Group Count */}
      <div
        className="absolute z-20 bottom-16 inset-s-[5vw] flex items-baseline gap-2 text-white pointer-events-none"
        aria-live="polite"
      >
        <b className="text-5xl min-[901px]:text-8xl font-black tabular-nums text-brand-yellow drop-shadow-lg leading-none">
          {formattedCount}
        </b>
        <span className="text-base min-[901px]:text-xl font-bold text-white/90 drop-shadow-md">
          {t('groupsPage.individuals')}
        </span>
      </div>

      {/* Name Tag Pill */}
      <div
        className={`absolute z-20 bottom-6 inset-s-[5vw] inline-flex items-center gap-2 max-w-[70vw] px-4 py-1.5 rounded-full font-bold text-sm min-[901px]:text-base select-none truncate transition-all duration-300 ${
          state.org.trim()
            ? 'bg-brand-yellow text-brand-navy shadow-md font-black'
            : 'bg-white/20 text-white backdrop-blur-sm'
        }`}
      >
        <FontAwesomeIcon icon={faFlag} className="text-xs" />
        <span className="truncate">{state.org.trim() || t('groupsPage.yourGroupNameHere')}</span>
      </div>

      {/* Time of Day Cycle Button */}
      <button
        type="button"
        onClick={onCycleTime}
        aria-label={t('groupsPage.changeTimeAria')}
        className="absolute z-20 bottom-6 inset-e-[5vw] inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-white text-brand-navy font-extrabold text-xs min-[901px]:text-sm shadow-md hover:bg-brand-yellow hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <FontAwesomeIcon icon={currentTime.icon} className="text-sm text-brand-blue" />
        <span className="hidden sm:inline">{t(`groupsPage.times.${currentTime.i18nKey}`)}</span>
      </button>
    </section>
  );
}
