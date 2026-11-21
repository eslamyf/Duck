import { useTranslation } from '../../shared/i18n/index.js';
import duckIcon from '../../shared/assets/icons/Artboard_8-removebg-preview.png';

export default function EgyptInteractiveMap({
  pins = [],
  destinations = [],
  activeIdx = -1,
  onSelectPin,
}) {
  const { t, lang } = useTranslation();
  const isEn = lang === 'en';

  return (
    <div
      className="relative w-full h-full min-h-[460px] min-[901px]:min-h-[540px] flex items-center justify-center select-none overflow-hidden"
      role="region"
      aria-label={t('map.mapAriaLabel', 'خريطة مصر التفاعلية لنقاط انطلاق Duck')}
    >
      <svg
        viewBox="0 0 1000 850"
        className="w-full h-full max-h-[620px] object-contain drop-shadow-xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Land Gradient */}
          <linearGradient id="egyptLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(20, 125, 159, 0.22)" />
            <stop offset="50%" stopColor="rgba(12, 18, 38, 0.95)" />
            <stop offset="100%" stopColor="var(--color-navy)" />
          </linearGradient>

          {/* Water Gradient */}
          <linearGradient id="nileWaterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-blue)" />
            <stop offset="60%" stopColor="var(--color-blue)" />
            <stop offset="100%" stopColor="rgba(253, 251, 69, 0.6)" />
          </linearGradient>

          {/* Pin Glow Filter */}
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
          </filter>

          <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="var(--color-yellow)" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* ================= BACKGROUND MARITIME GRID ================= */}
        <g opacity="0.08" stroke="var(--color-blue)" strokeWidth="1">
          <line x1="100" y1="0" x2="100" y2="850" strokeDasharray="6 6" />
          <line x1="300" y1="0" x2="300" y2="850" strokeDasharray="6 6" />
          <line x1="500" y1="0" x2="500" y2="850" strokeDasharray="6 6" />
          <line x1="700" y1="0" x2="700" y2="850" strokeDasharray="6 6" />
          <line x1="900" y1="0" x2="900" y2="850" strokeDasharray="6 6" />

          <line x1="0" y1="150" x2="1000" y2="150" strokeDasharray="6 6" />
          <line x1="0" y1="350" x2="1000" y2="350" strokeDasharray="6 6" />
          <line x1="0" y1="550" x2="1000" y2="550" strokeDasharray="6 6" />
          <line x1="0" y1="750" x2="1000" y2="750" strokeDasharray="6 6" />
        </g>

        {/* ================= EGYPT MAINLAND OUTLINE ================= */}
        <path
          d="M 50,110 
             L 160,110 
             L 250,115 
             L 360,125 
             L 460,135 
             L 510,130 
             L 560,120 
             L 620,115 
             L 660,125 
             L 760,135 
             L 810,140 
             L 835,280 
             L 800,410 
             L 740,325 
             L 680,240 
             L 710,310 
             L 750,390 
             L 780,490 
             L 830,580 
             L 890,690 
             L 960,790 
             L 50,790 Z"
          fill="url(#egyptLandGrad)"
          stroke="var(--color-blue)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* ================= WATER BODIES ================= */}
        {/* Lake Nasser (South Reservoir) */}
        <ellipse cx="715" cy="775" rx="36" ry="18" fill="url(#nileWaterGrad)" opacity="0.8" />

        {/* River Nile Main Stem */}
        <path
          d="M 715,775 
             Q 710,730 686,720
             Q 700,705 712,690 
             Q 715,640 710,580 
             Q 745,550 735,530 
             Q 700,505 680,480 
             Q 660,450 640,415 
             Q 625,380 610,345 
             Q 600,310 595,275 
             Q 590,245 578,220"
          fill="none"
          stroke="url(#nileWaterGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nile Outer Glow for Visibility */}
        <path
          d="M 715,775 
             Q 710,730 686,720
             Q 700,705 712,690 
             Q 715,640 710,580 
             Q 745,550 735,530 
             Q 700,505 680,480 
             Q 660,450 640,415 
             Q 625,380 610,345 
             Q 600,310 595,275 
             Q 590,245 578,220"
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth="12"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />

        {/* Nile Delta Branches (Rosetta & Damietta) */}
        {/* Rosetta Branch (West) */}
        <path
          d="M 578,220 Q 545,175 510,130"
          fill="none"
          stroke="url(#nileWaterGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Damietta Branch (East) */}
        <path
          d="M 578,220 Q 600,165 620,115"
          fill="none"
          stroke="url(#nileWaterGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Lake Qarun (Fayoum) */}
        <ellipse cx="550" cy="265" rx="18" ry="7" fill="url(#nileWaterGrad)" opacity="0.75" />

        {/* ================= GEOGRAPHIC LABELS ================= */}
        {/* Mediterranean Sea */}
        <text
          x="320"
          y="70"
          fill="var(--color-blue)"
          fontSize="15"
          fontWeight="bold"
          letterSpacing="3"
          opacity="0.65"
        >
          {isEn ? 'MEDITERRANEAN SEA' : 'البحر الأبيض المتوسط'}
        </text>

        {/* Red Sea */}
        <text
          x="870"
          y="460"
          fill="var(--color-blue)"
          fontSize="15"
          fontWeight="bold"
          letterSpacing="3"
          opacity="0.65"
          transform="rotate(45, 870, 460)"
        >
          {isEn ? 'RED SEA' : 'البحر الأحمر'}
        </text>

        {/* River Nile Label */}
        <text
          x="620"
          y="490"
          fill="var(--color-blue)"
          fontSize="13"
          fontWeight="600"
          letterSpacing="2"
          opacity="0.55"
        >
          {isEn ? 'RIVER NILE' : 'نهر النيل'}
        </text>

        {/* ================= INTERACTIVE DESTINATION PINS ================= */}
        {pins.map((pin) => {
          const dest = destinations.find((d) => d.id === pin.destId) || {};
          const isSelected = activeIdx === pin.destId;
          const isDimmed = activeIdx !== -1 && !isSelected;
          const isSoon = dest.soon;
          const title = isEn ? (pin.titleEn || t(pin.titleKey)) : t(pin.titleKey);

          return (
            <g
              key={pin.id}
              transform={`translate(${pin.x}, ${pin.y})`}
              className={`cursor-pointer transition-all duration-300 outline-none ${
                isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'
              }`}
              onClick={() => onSelectPin(pin.destId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPin(pin.destId);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={t('map.pinAriaLabel', {
                name: title,
                status: isSoon ? t('map.soonBadge') : t('map.availableBadge', { count: dest.tripCount }),
              })}
            >
              {/* Active Pulse Ring */}
              {isSelected && (
                <circle
                  r="34"
                  fill="none"
                  stroke="var(--color-yellow)"
                  strokeWidth="2.5"
                  className="animate-ping opacity-60"
                />
              )}

              {/* Pin Base Shadow / Beacon */}
              <circle
                r={isSelected ? '24' : '20'}
                fill="var(--color-navy)"
                stroke={isSelected ? 'var(--color-yellow)' : 'var(--color-blue)'}
                strokeWidth={isSelected ? '3.5' : '2.5'}
                filter={isSelected ? 'url(#activeGlow)' : 'url(#pinGlow)'}
                className="transition-all duration-300"
              />

              {/* Yellow Core */}
              <circle
                r={isSelected ? '19' : '16'}
                fill="var(--color-yellow)"
                className="transition-all duration-300"
              />

              {/* Duck Icon / Marker */}
              <image
                href={duckIcon}
                x={isSelected ? -14 : -12}
                y={isSelected ? -14 : -12}
                width={isSelected ? 28 : 24}
                height={isSelected ? 28 : 24}
                className="pointer-events-none select-none"
              />

              {/* Floating Pill Label */}
              <g transform="translate(0, 34)">
                {/* Background Pill */}
                <rect
                  x="-62"
                  y="-12"
                  width="124"
                  height="24"
                  rx="12"
                  fill={isSelected ? 'var(--color-yellow)' : 'rgba(12, 18, 38, 0.92)'}
                  stroke={isSelected ? 'var(--color-navy)' : 'rgba(255, 255, 255, 0.35)'}
                  strokeWidth="1.5"
                  filter="url(#pinGlow)"
                  className="transition-colors duration-200"
                />
                {/* Text Label */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={isSelected ? 'var(--color-navy)' : 'var(--color-surface-white)'}
                  fontSize="11.5"
                  fontWeight="bold"
                  className="select-none pointer-events-none"
                >
                  {title}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


