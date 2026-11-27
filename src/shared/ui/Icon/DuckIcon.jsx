import { ICONS_MAP } from './iconsMap.js';

/**
 * Lightweight inline vector icon matching FontAwesome geometry with zero runtime bundle overhead.
 */
export default function DuckIcon({
  icon,
  className = '',
  'aria-hidden': ariaHidden,
  ...rest
}) {
  const key = typeof icon === 'string' ? icon : icon?.iconName;
  const def = key ? ICONS_MAP[key] : null;
  if (!def) return null;

  const isDecorative = ariaHidden !== undefined ? ariaHidden : !rest['aria-label'];
  const paths = Array.isArray(def.d) ? def.d : [def.d];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${def.w} ${def.h}`}
      fill="currentColor"
      aria-hidden={isDecorative ? 'true' : undefined}
      role={isDecorative ? undefined : 'img'}
      className={`inline-block h-[1em] w-auto overflow-visible align-[-0.125em] shrink-0 ${className}`.trim()}
      {...rest}
    >
      {paths.map((d, idx) => (
        <path key={idx} d={d} />
      ))}
    </svg>
  );
}
