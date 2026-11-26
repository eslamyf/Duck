import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faArrowsUpDown,
  faArrowsLeftRight,
  faCrosshairs,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Parse CSS object-position string into { x: number, y: number }
 */
function parsePosition(posStr) {
  if (!posStr || typeof posStr !== 'string') return { x: 50, y: 50 };
  const normalized = posStr.trim().toLowerCase();

  // Keyword mappings
  if (normalized === 'top' || normalized === 'center top') return { x: 50, y: 15 };
  if (normalized === 'bottom' || normalized === 'center bottom') return { x: 50, y: 85 };
  if (normalized === 'left' || normalized === 'left center') return { x: 15, y: 50 };
  if (normalized === 'right' || normalized === 'right center') return { x: 85, y: 50 };
  if (normalized === 'center' || normalized === 'center center') return { x: 50, y: 50 };

  // Percentage pattern: "50% 20%"
  const parts = normalized.split(/\s+/);
  if (parts.length >= 2) {
    const xVal = parseFloat(parts[0]);
    const yVal = parseFloat(parts[1]);
    return {
      x: Number.isNaN(xVal) ? 50 : Math.max(0, Math.min(100, Math.round(xVal))),
      y: Number.isNaN(yVal) ? 50 : Math.max(0, Math.min(100, Math.round(yVal))),
    };
  }
  return { x: 50, y: 50 };
}

export default function ImageFocusCropper({
  imageUrl,
  position = '50% 50%',
  onChange,
  onRemove,
  aspectRatio = '16/9',
  label,
  isArabic = true,
}) {
  const { x: posX, y: posY } = parsePosition(position);

  const updateCoord = (newX, newY) => {
    const clampedX = Math.max(0, Math.min(100, Math.round(newX)));
    const clampedY = Math.max(0, Math.min(100, Math.round(newY)));
    if (onChange) {
      onChange(`${clampedX}% ${clampedY}%`);
    }
  };

  const PRESETS = [
    {
      key: 'top',
      labelAr: 'أعلى (الرأس/الوجوه)',
      labelEn: 'Top (Face/Head)',
      x: 50,
      y: 15,
      icon: '🔝',
    },
    {
      key: 'center',
      labelAr: 'المنتصف (تلقائي)',
      labelEn: 'Center (Default)',
      x: 50,
      y: 50,
      icon: '🎯',
    },
    {
      key: 'bottom',
      labelAr: 'أسفل (المنظر/الماء)',
      labelEn: 'Bottom (Ground)',
      x: 50,
      y: 85,
      icon: '🔻',
    },
    {
      key: 'left',
      labelAr: 'يسار',
      labelEn: 'Left',
      x: 15,
      y: 50,
      icon: '◀️',
    },
    {
      key: 'right',
      labelAr: 'يمين',
      labelEn: 'Right',
      x: 85,
      y: 50,
      icon: '▶️',
    },
  ];

  if (!imageUrl) return null;

  return (
    <div className="w-full rounded-2xl border border-brand-blue/20 bg-surface-mist/40 p-3.5 space-y-3 font-body">
      {/* Header with Title and Delete Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-brand-navy font-bold text-xs">
          <FontAwesomeIcon icon={faCrosshairs} className="text-brand-blue" />
          <span>
            {label || (isArabic ? 'معاينة وضبط موضع ظهور الصورة' : 'Crop & Focus Position')}
          </span>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title={isArabic ? 'حذف الصورة' : 'Remove Image'}
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>{isArabic ? 'حذف' : 'Remove'}</span>
          </button>
        )}
      </div>

      {/* Live Framed Preview Box */}
      <div
        className="relative w-full rounded-xl overflow-hidden border-2 border-brand-blue/30 shadow-inner bg-brand-navy group"
        style={{ aspectRatio }}
      >
        <img
          src={imageUrl}
          alt="Cropped Preview"
          style={{
            objectPosition: `${posX}% ${posY}%`,
          }}
          className="w-full h-full object-cover transition-[object-position] duration-75 select-none"
        />

        {/* Live Coordinate Badge Overlay */}
        <div className="absolute top-2 start-2 pointer-events-none rounded-md bg-brand-navy/80 backdrop-blur-xs px-2 py-1 text-[10px] font-mono font-bold text-brand-yellow shadow-xs border border-white/10">
          <span>{isArabic ? 'التركيز:' : 'Focus:'} </span>
          <bdi dir="ltr">{posX}% X • {posY}% Y</bdi>
        </div>

        {/* Framing Grid Lines Overlay (Subtle) */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20 opacity-30">
          <div className="border-e border-b border-white/30" />
          <div className="border-e border-b border-white/30" />
          <div className="border-b border-white/30" />
          <div className="border-e border-b border-white/30" />
          <div className="border-e border-b border-white/30" />
          <div className="border-b border-white/30" />
          <div className="border-e border-white/30" />
          <div className="border-e border-white/30" />
          <div />
        </div>

        {/* Visual Focus Target Crosshair */}
        <div
          style={{
            top: `${posY}%`,
            left: `${posX}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute pointer-events-none w-6 h-6 rounded-full border-2 border-brand-yellow bg-brand-yellow/20 shadow-[0_0_8px_rgba(253,251,69,0.8)] transition-all duration-75 flex items-center justify-center text-[10px] text-brand-navy font-black"
        >
          •
        </div>
      </div>

      {/* Quick 1-Click Focus Presets */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-brand-navy/80">
          {isArabic ? 'أوضاع تركيز سريعة بنقرة واحدة:' : 'Quick Focus Presets:'}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {PRESETS.map((pst) => {
            const isSelected = posX === pst.x && posY === pst.y;
            return (
              <button
                key={pst.key}
                type="button"
                onClick={() => updateCoord(pst.x, pst.y)}
                className={`flex items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10.5px] font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-xs ring-1 ring-brand-yellow'
                    : 'bg-white text-brand-navy border-black/10 hover:border-brand-blue hover:bg-white/90'
                }`}
              >
                <span>{pst.icon}</span>
                <span className="truncate">{isArabic ? pst.labelAr : pst.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Range Sliders */}
      <div className="space-y-2 pt-1 border-t border-black/8">
        {/* Vertical Position Slider (أعلى / أسفل) */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-brand-navy mb-1">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faArrowsUpDown} className="text-brand-blue text-[10px]" />
              <span>{isArabic ? 'التحكم الرأسي (أعلى ↔ أسفل):' : 'Vertical Focus (Top ↔ Bottom):'}</span>
            </span>
            <span className="font-mono text-brand-blue text-xs font-black">{posY}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={posY}
            onChange={(e) => updateCoord(posX, Number(e.target.value))}
            className="w-full accent-brand-blue cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-brand-navy/55 font-bold pt-0.5">
            <span>{isArabic ? 'أعلى (0% - الرأس والوجه)' : 'Top (0%)'}</span>
            <span>{isArabic ? 'المنتصف (50%)' : 'Center (50%)'}</span>
            <span>{isArabic ? 'أسفل (100% - الأرضي)' : 'Bottom (100%)'}</span>
          </div>
        </div>

        {/* Horizontal Position Slider (يمين / يسار) */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-brand-navy mb-1">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faArrowsLeftRight} className="text-brand-blue text-[10px]" />
              <span>{isArabic ? 'التحكم الأفقي (يمين ↔ يسار):' : 'Horizontal Focus (Left ↔ Right):'}</span>
            </span>
            <span className="font-mono text-brand-blue text-xs font-black">{posX}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={posX}
            onChange={(e) => updateCoord(Number(e.target.value), posY)}
            className="w-full accent-brand-blue cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-brand-navy/55 font-bold pt-0.5">
            <span>{isArabic ? 'يسار (0%)' : 'Left (0%)'}</span>
            <span>{isArabic ? 'المنتصف (50%)' : 'Center (50%)'}</span>
            <span>{isArabic ? 'يمين (100%)' : 'Right (100%)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

