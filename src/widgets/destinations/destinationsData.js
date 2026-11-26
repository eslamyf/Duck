import aswan360 from '../../shared/assets/images/destinations/aswan-island-360w.webp';
import aswan480 from '../../shared/assets/images/destinations/aswan-island-480w.webp';
import aswan640 from '../../shared/assets/images/destinations/aswan-island-640w.webp';
import aswan800 from '../../shared/assets/images/destinations/aswan-island-800w.webp';
import aswanDefault from '../../shared/assets/images/destinations/aswan-island.webp';

import gharb360 from '../../shared/assets/images/destinations/gharb-soheil-360w.webp';
import gharb480 from '../../shared/assets/images/destinations/gharb-soheil-480w.webp';
import gharb640 from '../../shared/assets/images/destinations/gharb-soheil-640w.webp';
import gharb800 from '../../shared/assets/images/destinations/gharb-soheil-800w.webp';
import gharb1200 from '../../shared/assets/images/destinations/gharb-soheil-1200w.webp';
import gharbDefault from '../../shared/assets/images/destinations/gharb-soheil.webp';

import matrouh360 from '../../shared/assets/images/destinations/marsa-matrouh-360w.webp';
import matrouh480 from '../../shared/assets/images/destinations/marsa-matrouh-480w.webp';
import matrouh640 from '../../shared/assets/images/destinations/marsa-matrouh-640w.webp';
import matrouhDefault from '../../shared/assets/images/destinations/marsa-matrouh.webp';

import giza360 from '../../shared/assets/images/destinations/giza-360w.webp';
import giza480 from '../../shared/assets/images/destinations/giza-480w.webp';
import giza640 from '../../shared/assets/images/destinations/giza-640w.webp';
import giza800 from '../../shared/assets/images/destinations/giza-800w.webp';
import gizaDefault from '../../shared/assets/images/destinations/giza.webp';

import siwa360 from '../../shared/assets/images/destinations/siwa-oasis-360w.webp';
import siwa480 from '../../shared/assets/images/destinations/siwa-oasis-480w.webp';
import siwa640 from '../../shared/assets/images/destinations/siwa-oasis-640w.webp';
import siwa800 from '../../shared/assets/images/destinations/siwa-oasis-800w.webp';
import siwaDefault from '../../shared/assets/images/destinations/siwa-oasis.webp';

export const DESTINATIONS = [
  {
    id: 0,
    key: 'aswan',
    num: '01',
    soon: false,
    tripCount: 4,
    filterKey: 0,
    aspectRatio: '1080/1440',
    width: 1080,
    height: 1440,
    images: {
      stripSrc: aswan360,
      defaultSrc: aswanDefault,
      srcSet: `${aswan360} 360w, ${aswan480} 480w, ${aswan640} 640w, ${aswan800} 800w, ${aswanDefault} 1080w`,
    },
  },
  {
    id: 1,
    key: 'gharb',
    num: '02',
    soon: true,
    tripCount: 2,
    filterKey: 1,
    aspectRatio: '1200/1500',
    width: 1200,
    height: 1500,
    images: {
      stripSrc: gharb360,
      defaultSrc: gharbDefault,
      srcSet: `${gharb360} 360w, ${gharb480} 480w, ${gharb640} 640w, ${gharb800} 800w, ${gharb1200} 1200w`,
    },
  },
  {
    id: 2,
    key: 'matrouh',
    num: '03',
    soon: false,
    tripCount: 2,
    filterKey: 2,
    aspectRatio: '720/900',
    width: 720,
    height: 900,
    images: {
      stripSrc: matrouh360,
      defaultSrc: matrouhDefault,
      srcSet: `${matrouh360} 360w, ${matrouh480} 480w, ${matrouh640} 640w, ${matrouhDefault} 720w`,
    },
  },
  {
    id: 3,
    key: 'giza',
    num: '04',
    soon: false,
    tripCount: 1,
    filterKey: 3,
    aspectRatio: '1000/612',
    width: 1000,
    height: 612,
    images: {
      stripSrc: giza360,
      defaultSrc: gizaDefault,
      srcSet: `${giza360} 360w, ${giza480} 480w, ${giza640} 640w, ${giza800} 800w, ${gizaDefault} 1000w`,
    },
  },
  {
    id: 4,
    key: 'siwa',
    num: '05',
    soon: true,
    tripCount: 0,
    filterKey: 4,
    aspectRatio: '800/450',
    width: 800,
    height: 450,
    images: {
      stripSrc: siwa360,
      defaultSrc: siwaDefault,
      srcSet: `${siwa360} 360w, ${siwa480} 480w, ${siwa640} 640w, ${siwa800} 800w`,
    },
  },
];

export function getDestinations() {
  if (typeof window === 'undefined') return DESTINATIONS;
  try {
    const raw = localStorage.getItem('duck_cms_destinations');
    return raw ? JSON.parse(raw) : DESTINATIONS;
  } catch {
    return DESTINATIONS;
  }
}
