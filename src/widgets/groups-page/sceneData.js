/**
 * Scene data, color palettes, and SVG graphic generators for GroupStage
 * Source: INDEX.HTML reference design
 */
import {
  faChampagneGlasses,
  faBriefcase,
  faGraduationCap,
  faHotel,
  faCloudSun,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';

export const GROUP_TYPES = [
  {
    id: 'friends',
    i18nKey: 'friends',
    icon: faChampagneGlasses,
    palette: ['#FDFB45', '#ffffff', '#ff7a59', '#2ec4b6', '#f6b8d1'],
  },
  {
    id: 'corporate',
    i18nKey: 'corporate',
    icon: faBriefcase,
    palette: ['#FDFB45', '#0C1226', '#147D9F', '#ffffff'],
  },
  {
    id: 'schools',
    i18nKey: 'schools',
    icon: faGraduationCap,
    palette: ['#ff7a59', '#FDFB45', '#ffffff', '#2ec4b6'],
  },
  {
    id: 'hospitality',
    i18nKey: 'hospitality',
    icon: faHotel,
    palette: ['#ffffff', '#FDFB45', '#e8cf91', '#147D9F'],
  },
];

export const GROUP_ACTIVITIES = [
  { id: 'kayak', i18nKey: 'kayak' },
  { id: 'sup', i18nKey: 'sup' },
  { id: 'waterbike', i18nKey: 'waterbike' },
  { id: 'mixed', i18nKey: 'mixed' },
];

export const TIMES_OF_DAY = [
  {
    id: 'sunrise',
    i18nKey: 'sunrise',
    icon: faCloudSun,
    sk1: '#ff9e7a',
    sk2: '#ffe2b0',
    sun: [170, 240],
    r: 40,
    sunc: '#FDFB45',
    w1: '#f0a58a',
    w2: '#2d4a78',
    land: '#7a5656',
    palm: '#4a3b44',
  },
  {
    id: 'morning',
    i18nKey: 'morning',
    icon: faSun,
    sk1: '#147D9F',
    sk2: '#d9f3fb',
    sun: [330, 95],
    r: 34,
    sunc: '#FDFB45',
    w1: '#3fb1d3',
    w2: '#147D9F',
    land: '#b08a55',
    palm: '#2f6b45',
  },
  {
    id: 'afternoon',
    i18nKey: 'afternoon',
    icon: faSun,
    sk1: '#3fa9e6',
    sk2: '#d4f0ff',
    sun: [700, 75],
    r: 36,
    sunc: '#FDFB45',
    w1: '#3da5d3',
    w2: '#0e6f8f',
    land: '#a47c48',
    palm: '#2a6040',
  },
  {
    id: 'sunset',
    i18nKey: 'sunset',
    icon: faMoon,
    sk1: '#0C1226',
    sk2: '#ff7b57',
    sun: [760, 228],
    r: 54,
    sunc: '#FDFB45',
    w1: '#ff8a5c',
    w2: '#0C1226',
    land: '#3a2a3a',
    palm: '#1d1a2e',
  },
];

export const ROWS = 6;
export const SLOTS = 25;
export const SCALES = [0.42, 0.5, 0.6, 0.7, 0.82, 0.95];

export const disc = (k, r) => (k * 0.6180339887 + r * 0.37 + 0.11) % 1;

export const palmSvg = (x, y, h, f = 1) => `
  <g transform="translate(${x} ${y}) scale(${f} 1)">
    <path d="M0 0Q${h * 0.12} ${-h * 0.5} ${h * 0.06} ${-h}" stroke="#3a2a1e" stroke-width="${Math.max(3, h / 14)}" fill="none" stroke-linecap="round"/>
    <g style="fill:var(--palm)" transform="translate(${h * 0.06} ${-h})">
      <path d="M0 0Q-${h * 0.5} -${h * 0.1} -${h * 0.6} ${h * 0.3}Q-${h * 0.3} -${h * 0.02} 0 0Z"/>
      <path d="M0 0Q${h * 0.5} -${h * 0.1} ${h * 0.6} ${h * 0.3}Q${h * 0.3} -${h * 0.02} 0 0Z"/>
      <path d="M0 0Q-${h * 0.2} -${h * 0.45} -${h * 0.5} -${h * 0.25}Q-${h * 0.2} -${h * 0.2} 0 0Z"/>
      <path d="M0 0Q${h * 0.2} -${h * 0.45} ${h * 0.5} -${h * 0.25}Q${h * 0.2} -${h * 0.2} 0 0Z"/>
    </g>
  </g>
`;

export const rockSvg = (x, y, w, h) => `
  <ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" style="fill:var(--land)"/>
  <ellipse cx="${x - w * 0.25}" cy="${y - h * 0.35}" rx="${w * 0.55}" ry="${h * 0.45}" fill="#fff" opacity=".14"/>
`;

export const LANDSCAPES = [
  // 0: Aswan Island
  () => `<path d="M0 248V210Q80 180 160 215Q260 160 360 218Q520 180 640 222Q760 178 900 210V248Z" style="fill:var(--land)" opacity=".5"/>
    ${rockSvg(70, 242, 70, 26)}
    ${rockSvg(140, 246, 46, 18)}
    ${rockSvg(790, 240, 86, 34)}
    ${rockSvg(860, 248, 50, 20)}
    ${palmSvg(215, 248, 70)}
    ${palmSvg(250, 248, 52, -1)}
    ${palmSvg(640, 248, 64)}
    <path d="M470 242l0-42 34 42z" fill="#fff" opacity=".9"/>`,

  // 1: Gharb Soheil (Nubian houses)
  () => {
    const cs = ['#e8a33d', '#d9534f', '#147D9F', '#FDFB45', '#c97b4a', '#7bc4a6'];
    let h = '<rect y="232" width="900" height="20" style="fill:var(--land)" opacity=".6"/>';
    for (let i = 0; i < 9; i++) {
      const x = 40 + i * 95;
      const w = 62;
      const hh = 34 + (i % 3) * 10;
      h += `<rect x="${x}" y="${242 - hh}" width="${w}" height="${hh}" fill="${cs[i % 6]}"/>
        <path d="M${x + 6} ${242 - hh}a${w / 2 - 6} ${w / 2 - 6} 0 0 1 ${w - 12} 0z" fill="${cs[(i + 2) % 6]}"/>
        <rect x="${x + w / 2 - 5}" y="228" width="10" height="14" rx="5" fill="#0C1226" opacity=".7"/>`;
    }
    return h + palmSvg(24, 248, 60) + palmSvg(880, 248, 70, -1);
  },

  // 2: Marsa Matrouh (White sands and turquoise shores)
  () => `<path d="M0 248V224Q140 200 300 226T620 220T900 216V248Z" fill="#f1dfb0"/>
    <path d="M0 248V236Q200 222 420 238T900 232V248Z" fill="#e6cf95"/>
    <path d="M560 234q40-34 90-8z" fill="#fff" opacity=".85"/>`,

  // 3: Giza (Pyramids over the Nile)
  () => `<path d="M0 248V232H900V248Z" style="fill:var(--land)" opacity=".55"/>
    <path d="M180 242L262 160L344 242Z" style="fill:var(--land)"/>
    <path d="M262 160L344 242H300Z" fill="#000" opacity=".16"/>
    <path d="M330 242L392 182L454 242Z" style="fill:var(--land)"/>
    <path d="M392 182L454 242H420Z" fill="#000" opacity=".16"/>
    ${palmSvg(70, 248, 64)}
    ${palmSvg(840, 248, 76, -1)}`,

  // 4: Siwa Oasis
  () => `<path d="M0 248V220Q120 180 260 224T520 214T780 222T900 206V248Z" style="fill:var(--land)" opacity=".7"/>
    <path d="M0 248V234Q160 210 330 236T660 230T900 232V248Z" fill="#e8cf91"/>
    ${palmSvg(110, 248, 66)}
    ${palmSvg(150, 248, 50, -1)}
    ${palmSvg(760, 248, 60)}`,
];
