import {
  faCompass,
  faCreditCard,
  faPersonHiking,
  faShieldHalved,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

export const FAQ_CATEGORIES = [
  {
    id: 'aboutExperiences',
    key: 'aboutExperiences',
    icon: faCompass,
  },
  {
    id: 'bookingPayment',
    key: 'bookingPayment',
    icon: faCreditCard,
  },
  {
    id: 'beforeExperience',
    key: 'beforeExperience',
    icon: faPersonHiking,
  },
  {
    id: 'safety',
    key: 'safety',
    icon: faShieldHalved,
  },
  {
    id: 'cancellationChanges',
    key: 'cancellationChanges',
    icon: faRotateLeft,
  },
];

export const FAQ_ITEMS = [
  // 1. About Experiences
  {
    id: 'exp-included',
    category: 'aboutExperiences',
    qKey: 'faq.items.whatIncluded.q',
    aKey: 'faq.items.whatIncluded.a',
  },
  {
    id: 'exp-duration',
    category: 'aboutExperiences',
    qKey: 'faq.items.duration.q',
    aKey: 'faq.items.duration.a',
  },
  {
    id: 'exp-suitable',
    category: 'aboutExperiences',
    qKey: 'faq.items.suitableFor.q',
    aKey: 'faq.items.suitableFor.a',
  },

  // 2. Booking & Payment
  {
    id: 'pay-how',
    category: 'bookingPayment',
    qKey: 'faq.items.howToBook.q',
    aKey: 'faq.items.howToBook.a',
  },
  {
    id: 'pay-methods',
    category: 'bookingPayment',
    qKey: 'faq.items.paymentMethods.q',
    aKey: 'faq.items.paymentMethods.a',
  },

  // 3. Before Experience
  {
    id: 'prep-hours',
    category: 'beforeExperience',
    qKey: 'faq.items.operatingHours.q',
    aKey: 'faq.items.operatingHours.a',
  },
  {
    id: 'prep-arrival',
    category: 'beforeExperience',
    qKey: 'faq.items.arrivalTime.q',
    aKey: 'faq.items.arrivalTime.a',
  },
  {
    id: 'prep-wear',
    category: 'beforeExperience',
    qKey: 'faq.items.whatToWear.q',
    aKey: 'faq.items.whatToWear.a',
  },
  {
    id: 'prep-phone',
    category: 'beforeExperience',
    qKey: 'faq.items.phoneAllowed.q',
    aKey: 'faq.items.phoneAllowed.a',
  },
  {
    id: 'prep-photo',
    category: 'beforeExperience',
    qKey: 'faq.items.photography.q',
    aKey: 'faq.items.photography.a',
  },

  // 4. Safety
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

  // 5. Cancellation & Changes
  {
    id: 'cancel-policy',
    category: 'cancellationChanges',
    qKey: 'faq.items.cancellation.q',
    aKey: 'faq.items.cancellation.a',
  },
  {
    id: 'cancel-reschedule',
    category: 'cancellationChanges',
    qKey: 'faq.items.reschedule.q',
    aKey: 'faq.items.reschedule.a',
  },
];
