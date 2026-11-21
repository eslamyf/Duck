import {
  faChampagneGlasses,
  faBriefcase,
  faGraduationCap,
  faHotel,
  faPersonSwimming,
  faWater,
  faBicycle,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';

export const GP_VIBES = [
  { id: 'friends', key: 'groupsPage.vibes.friends', icon: faChampagneGlasses },
  { id: 'corporate', key: 'groupsPage.vibes.corporate', icon: faBriefcase },
  { id: 'education', key: 'groupsPage.vibes.education', icon: faGraduationCap },
  { id: 'tours', key: 'groupsPage.vibes.tours', icon: faHotel },
];

export const GP_ACTS = [
  { id: 'kayak', key: 'groupsPage.activities.kayak', icon: faPersonSwimming },
  { id: 'sup', key: 'groupsPage.activities.sup', icon: faWater },
  { id: 'waterbike', key: 'groupsPage.activities.waterbike', icon: faBicycle },
  { id: 'mixed', key: 'groupsPage.activities.mixed', icon: faTrophy },
];

export const GP_TIMES = [
  { id: 'sunrise', key: 'groupsPage.times.sunrise' },
  { id: 'morning', key: 'groupsPage.times.morning' },
  { id: 'afternoon', key: 'groupsPage.times.afternoon' },
  { id: 'sunset', key: 'groupsPage.times.sunset' },
];

export const GP_LOCATIONS = [
  { id: 0, key: 'aswan', labelKey: 'destinations.aswan.name' },
  { id: 1, key: 'gharb', labelKey: 'destinations.gharbSoheil.name' },
  { id: 2, key: 'matrouh', labelKey: 'destinations.marsaMatrouh.name' },
  { id: 3, key: 'giza', labelKey: 'destinations.giza.name' },
  { id: 4, key: 'siwa', labelKey: 'destinations.siwa.name' },
];

export const GP_PRESETS = [20, 30, 50, 75, 100];
