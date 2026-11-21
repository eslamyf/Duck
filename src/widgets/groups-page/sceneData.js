/**
 * Scene data, color palettes, icons, and activity images for GroupStudio
 */
import {
  faPeopleGroup,
  faBriefcase,
  faGraduationCap,
  faHotel,
  faCloudSun,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';

import kayakImg from '../../shared/assets/images/trips/kayak-free-640w.webp';
import supImg from '../../shared/assets/images/trips/sup-nile-640w.webp';
import waterbikeImg from '../../shared/assets/images/trips/waterbike-nile-640w.webp';
import mixedImg from '../../shared/assets/images/trips/botanical-garden-640w.webp';

export const GROUP_TYPES = [
  {
    id: 'friends',
    i18nKey: 'friends',
    icon: faPeopleGroup,
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
  { id: 'kayak', i18nKey: 'kayak', image: kayakImg },
  { id: 'sup', i18nKey: 'sup', image: supImg },
  { id: 'waterbike', i18nKey: 'waterbike', image: waterbikeImg },
  { id: 'mixed', i18nKey: 'mixed', image: mixedImg },
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
