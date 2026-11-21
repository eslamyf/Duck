import { faShieldHalved, faPersonHiking, faTicket } from '@fortawesome/free-solid-svg-icons';

export const FAQ_CATEGORIES = [
  {
    id: 'safety',
    key: 'safety',
    icon: faShieldHalved,
  },
  {
    id: 'beforeTrip',
    key: 'beforeTrip',
    icon: faPersonHiking,
  },
  {
    id: 'booking',
    key: 'booking',
    icon: faTicket,
  },
];

export const FAQ_ITEMS = [
  // Safety Category
  {
    id: 'safety-safe',
    category: 'safety',
    qKey: 'faq.items.isSafe.q',
    aKey: 'faq.items.isSafe.a',
  },
  {
    id: 'safety-swim',
    category: 'safety',
    qKey: 'faq.items.needSwim.q',
    aKey: 'faq.items.needSwim.a',
  },
  {
    id: 'safety-weight',
    category: 'safety',
    qKey: 'faq.items.maxWeight.q',
    aKey: 'faq.items.maxWeight.a',
  },
  {
    id: 'safety-age',
    category: 'safety',
    qKey: 'faq.items.minAge.q',
    aKey: 'faq.items.minAge.a',
  },

  // Before the Trip Category
  {
    id: 'prep-duration',
    category: 'beforeTrip',
    qKey: 'faq.items.duration.q',
    aKey: 'faq.items.duration.a',
  },
  {
    id: 'prep-suitable',
    category: 'beforeTrip',
    qKey: 'faq.items.suitableFor.q',
    aKey: 'faq.items.suitableFor.a',
  },
  {
    id: 'prep-wear',
    category: 'beforeTrip',
    qKey: 'faq.items.whatToWear.q',
    aKey: 'faq.items.whatToWear.a',
  },
  {
    id: 'prep-phone',
    category: 'beforeTrip',
    qKey: 'faq.items.phoneAllowed.q',
    aKey: 'faq.items.phoneAllowed.a',
  },
  {
    id: 'prep-photo',
    category: 'beforeTrip',
    qKey: 'faq.items.photography.q',
    aKey: 'faq.items.photography.a',
  },
  {
    id: 'prep-hours',
    category: 'beforeTrip',
    qKey: 'faq.items.operatingHours.q',
    aKey: 'faq.items.operatingHours.a',
  },

  // Booking Category
  {
    id: 'booking-how',
    category: 'booking',
    qKey: 'faq.items.howToBook.q',
    aKey: 'faq.items.howToBook.a',
  },
  {
    id: 'booking-cancel',
    category: 'booking',
    qKey: 'faq.items.cancellation.q',
    aKey: 'faq.items.cancellation.a',
  },
];
