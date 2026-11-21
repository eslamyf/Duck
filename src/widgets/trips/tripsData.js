import bot160 from '../../shared/assets/images/trips/botanical-garden-160w.webp';
import bot640 from '../../shared/assets/images/trips/botanical-garden-640w.webp';
import bot960 from '../../shared/assets/images/trips/botanical-garden-960w.webp';

import sup160 from '../../shared/assets/images/trips/sup-nile-160w.webp';
import sup640 from '../../shared/assets/images/trips/sup-nile-640w.webp';
import sup960 from '../../shared/assets/images/trips/sup-nile-960w.webp';

import slouga160 from '../../shared/assets/images/trips/slouga-ghazal-160w.webp';
import slouga640 from '../../shared/assets/images/trips/slouga-ghazal-640w.webp';
import slouga960 from '../../shared/assets/images/trips/slouga-ghazal-960w.webp';

import priv160 from '../../shared/assets/images/trips/kayak-private-160w.webp';
import priv640 from '../../shared/assets/images/trips/kayak-private-640w.webp';
import priv960 from '../../shared/assets/images/trips/kayak-private-960w.webp';

import free160 from '../../shared/assets/images/trips/kayak-free-160w.webp';
import free640 from '../../shared/assets/images/trips/kayak-free-640w.webp';
import free960 from '../../shared/assets/images/trips/kayak-free-960w.webp';

import exp160 from '../../shared/assets/images/trips/gharb-explorer-160w.webp';
import exp640 from '../../shared/assets/images/trips/gharb-explorer-640w.webp';
import exp960 from '../../shared/assets/images/trips/gharb-explorer-960w.webp';

import adv160 from '../../shared/assets/images/trips/gharb-adventure-160w.webp';
import adv640 from '../../shared/assets/images/trips/gharb-adventure-640w.webp';
import adv960 from '../../shared/assets/images/trips/gharb-adventure-960w.webp';

import om160 from '../../shared/assets/images/trips/om-elrakham-160w.webp';
import om640 from '../../shared/assets/images/trips/om-elrakham-640w.webp';
import om960 from '../../shared/assets/images/trips/om-elrakham-960w.webp';

import ageeba160 from '../../shared/assets/images/trips/ageeba-beach-160w.webp';
import ageeba640 from '../../shared/assets/images/trips/ageeba-beach-640w.webp';
import ageeba960 from '../../shared/assets/images/trips/ageeba-beach-960w.webp';

import wb160 from '../../shared/assets/images/trips/waterbike-nile-160w.webp';
import wb640 from '../../shared/assets/images/trips/waterbike-nile-640w.webp';
import wb960 from '../../shared/assets/images/trips/waterbike-nile-960w.webp';

import giza160 from '../../shared/assets/images/trips/giza-abbas-bridge-160w.webp';
import giza640 from '../../shared/assets/images/trips/giza-abbas-bridge-640w.webp';
import giza960 from '../../shared/assets/images/trips/giza-abbas-bridge-960w.webp';

export const ACTIVITIES = {
  kayak: { id: 'kayak', icon: '🛶' },
  sup: { id: 'sup', icon: '🏄' },
  waterbike: { id: 'waterbike', icon: '🚲' },
};

export const DESTINATIONS_FILTER = [
  { id: 'all', key: 'all' },
  { id: 0, key: 'aswan' },
  { id: 1, key: 'gharb' },
  { id: 2, key: 'matrouh' },
  { id: 3, key: 'giza' },
];

export const TRIPS = [
  {
    id: 0,
    key: 'botanicalGarden',
    loc: 0,
    destKey: 'aswan',
    act: 'kayak',
    price: 850,
    priceEg: null,
    durKey: 'oneToTwoHours',
    slug: 'a-tour-around-the-botanical-garden',
    op: 'Duck Aswan',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'proGuide', 'scenicStops'],
    images: {
      thumb: bot160,
      medium: bot640,
      large: bot960,
      srcSet: `${bot640} 640w, ${bot960} 960w`,
    },
  },
  {
    id: 1,
    key: 'supNile',
    loc: 0,
    destKey: 'aswan',
    act: 'sup',
    price: 650,
    priceEg: 350,
    durKey: 'asPackage',
    slug: 'sup-nile-experience',
    op: 'Duck Aswan',
    inclusionsKeys: ['supBoard', 'lifeJacket', 'briefing', 'proSupervision'],
    images: {
      thumb: sup160,
      medium: sup640,
      large: sup960,
      srcSet: `${sup640} 640w, ${sup960} 960w`,
    },
  },
  {
    id: 2,
    key: 'slougaGhazal',
    loc: 0,
    destKey: 'aswan',
    act: 'kayak',
    price: 1700,
    priceEg: 600,
    durKey: 'twoToThreeHours',
    slug: 'slouga-ghazal-escape',
    op: 'Duck Aswan',
    min: 2,
    max: 15,
    off: [5],
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'proGuide', 'photoStops'],
    images: {
      thumb: slouga160,
      medium: slouga640,
      large: slouga960,
      srcSet: `${slouga640} 640w, ${slouga960} 960w`,
    },
  },
  {
    id: 3,
    key: 'kayakPrivate',
    loc: 0,
    destKey: 'aswan',
    act: 'kayak',
    price: 850,
    priceEg: 275,
    durKey: 'asPackage',
    slug: 'kayak-private-tour',
    op: 'Duck Aswan',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'privateCaptain'],
    images: {
      thumb: priv160,
      medium: priv640,
      large: priv960,
      srcSet: `${priv640} 640w, ${priv960} 960w`,
    },
  },
  {
    id: 4,
    key: 'kayakFree',
    loc: 0,
    destKey: 'aswan',
    act: 'kayak',
    price: 500,
    priceEg: 180,
    durKey: 'asPackage',
    slug: 'kayak-free-tour',
    op: 'Duck Aswan',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'safetyBriefing'],
    images: {
      thumb: free160,
      medium: free640,
      large: free960,
      srcSet: `${free640} 640w, ${free960} 960w`,
    },
  },
  {
    id: 5,
    key: 'gharbExplorer',
    loc: 1,
    destKey: 'gharb',
    act: 'kayak',
    price: 1000,
    priceEg: 380,
    durKey: 'asPackage',
    slug: 'gharb-soheil-explorer',
    op: 'Duck Aswan',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'proCaptain', 'nubianTour'],
    images: {
      thumb: exp160,
      medium: exp640,
      large: exp960,
      srcSet: `${exp640} 640w, ${exp960} 960w`,
    },
  },
  {
    id: 6,
    key: 'gharbAdventure',
    loc: 1,
    destKey: 'gharb',
    act: 'kayak',
    price: 650,
    priceEg: 300,
    durKey: 'asPackage',
    slug: 'gharb-soheil-adventure',
    op: 'Duck Aswan',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'safetyGear'],
    images: {
      thumb: adv160,
      medium: adv640,
      large: adv960,
      srcSet: `${adv640} 640w, ${adv960} 960w`,
    },
  },
  {
    id: 7,
    key: 'omElrakham',
    loc: 2,
    destKey: 'matrouh',
    act: 'kayak',
    price: 400,
    priceEg: null,
    durKey: 'oneHour',
    slug: 'om-el-rakham-tour',
    op: 'Duck Matrouh',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'coastalSafety'],
    images: {
      thumb: om160,
      medium: om640,
      large: om960,
      srcSet: `${om640} 640w, ${om960} 960w`,
    },
  },
  {
    id: 8,
    key: 'ageebaBeach',
    loc: 2,
    destKey: 'matrouh',
    act: 'kayak',
    price: 400,
    priceEg: null,
    durKey: 'oneHour',
    slug: 'ageeba-beach-tour',
    op: 'Duck Matrouh',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'coastalSafety'],
    images: {
      thumb: ageeba160,
      medium: ageeba640,
      large: ageeba960,
      srcSet: `${ageeba640} 640w, ${ageeba960} 960w`,
    },
  },
  {
    id: 9,
    key: 'waterbikeNile',
    loc: 0,
    destKey: 'aswan',
    act: 'waterbike',
    price: 700,
    priceEg: 400,
    durKey: 'oneHour',
    slug: 'water-bike-on-the-nile',
    op: 'Duck Aswan',
    max: 2,
    inclusionsKeys: ['waterbikeUnit', 'lifeJacket', 'noSwimmingNeeded'],
    images: {
      thumb: wb160,
      medium: wb640,
      large: wb960,
      srcSet: `${wb640} 640w, ${wb960} 960w`,
    },
  },
  {
    id: 10,
    key: 'gizaAbbasBridge',
    loc: 3,
    destKey: 'giza',
    act: 'kayak',
    price: 150,
    priceEg: null,
    isHourly: true,
    durKey: 'oneHour',
    slug: 'giza-abbas-bridge-tour',
    op: 'EgyRow',
    inclusionsKeys: ['kayakEquipped', 'lifeJacket', 'nileScoutsSupport'],
    images: {
      thumb: giza160,
      medium: giza640,
      large: giza960,
      srcSet: `${giza640} 640w, ${giza960} 960w`,
    },
  },
];
