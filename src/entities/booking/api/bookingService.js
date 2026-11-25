const BOOKINGS_KEY = 'duck_bookings';
export const BOOKINGS_UPDATED_EVENT = 'duck:bookings-updated';

const BASE_EQUIPMENT = [
  { id: 'kayak', nameAr: 'كاياك النيل', nameEn: 'Nile Kayak', maxUnits: 20, priceEgp: 350 },
  { id: 'waterbike', nameAr: 'دراجة مائية', nameEn: 'Water Bike', maxUnits: 2, priceEgp: 600 },
  { id: 'sup', nameAr: 'ستاند أب بادل (SUP)', nameEn: 'Stand Up Paddle (SUP)', maxUnits: 10, priceEgp: 400 },
];

const INITIAL_SEED_BOOKINGS = [
  {
    id: 'seed-bk-101',
    reference: 'DUCK-2026-101',
    userId: 'demo-customer-01',
    fullName: 'أحمد حسن',
    email: 'customer@duck.demo',
    phone: '+201012345678',
    tripKey: 'botanicalGarden',
    tripTitle: 'جولة حول الحديقة النباتية',
    equipment: 'kayak',
    date: '2026-11-28',
    time: '09:30',
    adults: 2,
    kids1to6: 0,
    kids7to12: 0,
    guests: 2,
    units: 2,
    nationality: 'all_egyptian',
    totalAmount: 700,
    amountToPay: 700,
    remainingBalance: 0,
    status: 'confirmed',
    source: 'web',
    channel: 'B2C',
    createdAt: '2026-11-25T10:00:00.000Z',
  },
  {
    id: 'seed-bk-102',
    reference: 'DUCK-2026-102',
    userId: 'guest',
    fullName: 'Khaled Omar',
    email: 'khaled@example.com',
    phone: '+201022334455',
    tripKey: 'waterbikeNile',
    tripTitle: 'دراجة مائية على النيل',
    equipment: 'waterbike',
    date: '2026-11-27',
    time: '13:30',
    adults: 2,
    kids1to6: 0,
    kids7to12: 0,
    guests: 2,
    units: 2,
    nationality: 'all_egyptian',
    totalAmount: 1200,
    amountToPay: 1200,
    remainingBalance: 0,
    status: 'paid',
    source: 'web',
    channel: 'B2C',
    createdAt: '2026-11-25T11:30:00.000Z',
  },
  {
    id: 'seed-bk-103',
    reference: 'DUCK-2026-103',
    userId: 'guest',
    fullName: 'Aswan University Club',
    email: 'club@aswan.edu.eg',
    phone: '+201099887766',
    tripKey: 'gharbExplorer',
    tripTitle: 'غرب سهيل — جولة المستكشف',
    equipment: 'kayak',
    date: '2026-12-01',
    time: '06:30',
    adults: 10,
    kids1to6: 0,
    kids7to12: 0,
    guests: 10,
    units: 10,
    nationality: 'all_egyptian',
    totalAmount: 5000,
    amountToPay: 2500,
    remainingBalance: 2500,
    status: 'pending',
    source: 'agent',
    channel: 'B2B',
    createdAt: '2026-11-25T12:15:00.000Z',
  },
  {
    id: 'seed-bk-104',
    reference: 'DUCK-2026-104',
    userId: 'guest',
    fullName: 'Nourhan Ali',
    email: 'nourhan@example.com',
    phone: '+201144556677',
    tripKey: 'supNile',
    tripTitle: 'تجربة ستاند أب بادل على النيل',
    equipment: 'sup',
    date: '2026-11-29',
    time: '16:00',
    adults: 4,
    kids1to6: 0,
    kids7to12: 0,
    guests: 4,
    units: 4,
    nationality: 'all_egyptian',
    totalAmount: 1400,
    amountToPay: 1400,
    remainingBalance: 0,
    status: 'completed',
    source: 'web',
    channel: 'B2C',
    createdAt: '2026-11-24T15:00:00.000Z',
  },
];

function notifyBookingsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(BOOKINGS_UPDATED_EVENT));
  }
}

export const getAllBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return [...INITIAL_SEED_BOOKINGS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveAllBookings = (bookings) => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  notifyBookingsUpdated();
};

/**
 * Match bookings belonging to a user (by userId, email, or phone).
 */
export const getUserBookings = (userOrId) => {
  if (!userOrId) return [];
  const all = getAllBookings();

  if (typeof userOrId === 'string') {
    return all.filter((b) => b.userId === userOrId);
  }

  const uid = userOrId.id;
  const email = userOrId.email?.trim().toLowerCase();
  const normalizePhone = (p) => String(p || '').replace(/\D/g, '').slice(-10);
  const phone = normalizePhone(userOrId.phone);

  return all.filter((b) => {
    if (uid && b.userId === uid) return true;
    if (email && b.email?.trim().toLowerCase() === email) return true;
    if (phone && normalizePhone(b.phone) === phone) return true;
    return false;
  });
};

export const addBooking = (booking) => {
  const bookings = getAllBookings();

  if (booking.reference) {
    const existing = bookings.find((b) => b.reference === booking.reference);
    if (existing) return existing;
  }

  const guests =
    Number(booking.guests) ||
    Number(booking.adults || 1) +
    Number(booking.kids1to6 || 0) +
    Number(booking.kids7to12 || 0);

  const newBooking = {
    id: crypto.randomUUID(),
    reference: booking.reference || `DUCK-${Date.now()}`,
    status: booking.status || 'pending',
    channel: booking.channel || 'B2C',
    source: booking.source || 'web',
    equipment: (booking.equipment || 'kayak').toLowerCase(),
    guests,
    units: Number(booking.units) || guests,
    totalAmount: Number(booking.totalAmount) || 0,
    amountToPay: Number(booking.amountToPay) || 0,
    remainingBalance: Number(booking.remainingBalance) || 0,
    createdAt: new Date().toISOString(),
    ...booking,
  };

  const updated = [newBooking, ...bookings];
  saveAllBookings(updated);
  return newBooking;
};

export const updateBookingStatus = (bookingId, status) => {
  const bookings = getAllBookings();
  const index = bookings.findIndex(
    (b) => b.id === bookingId || b.reference === bookingId
  );
  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    status: String(status).toLowerCase(),
    updatedAt: new Date().toISOString(),
  };

  saveAllBookings(bookings);
  return bookings[index];
};

export const updateBooking = (bookingId, userId, updates) => {
  const bookings = getAllBookings();
  const index = bookings.findIndex(
    (b) => b.id === bookingId && (!userId || b.userId === userId)
  );
  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    ...updates,
    id: bookings[index].id,
    userId: bookings[index].userId,
    updatedAt: new Date().toISOString(),
  };

  saveAllBookings(bookings);
  return bookings[index];
};

export const deleteBooking = (bookingId, userId) => {
  const bookings = getAllBookings();
  const updatedBookings = bookings.filter(
    (b) => !(b.id === bookingId && (!userId || b.userId === userId))
  );
  saveAllBookings(updatedBookings);
  return updatedBookings.length !== bookings.length;
};

/**
 * Live Inventory calculation from active bookings (prevents overbooking).
 */
export const getEquipmentInventory = () => {
  const bookings = getAllBookings();
  const activeBookings = bookings.filter(
    (b) => !['cancelled', 'refunded'].includes(String(b.status).toLowerCase())
  );

  return BASE_EQUIPMENT.map((item) => {
    const bookedUnits = activeBookings
      .filter((b) => (b.equipment || 'kayak').toLowerCase() === item.id)
      .reduce((sum, b) => sum + (Number(b.units) || Number(b.guests) || 1), 0);

    const remainingUnits = Math.max(0, item.maxUnits - bookedUnits);

    return {
      ...item,
      bookedUnits,
      remainingUnits,
      isFull: remainingUnits === 0,
    };
  });
};

export const getBookingStats = (userOrId) => {
  const bookings = getUserBookings(userOrId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return (
      !Number.isNaN(bookingDate.getTime()) &&
      bookingDate >= today &&
      !['cancelled', 'refunded', 'completed'].includes(
        String(booking.status).toLowerCase()
      )
    );
  });

  return {
    total: bookings.length,
    confirmed: bookings.filter((b) =>
      ['confirmed', 'paid'].includes(String(b.status).toLowerCase())
    ).length,
    upcoming: upcomingBookings.length,
  };
};

export const getGlobalBookingStats = () => {
  const bookings = getAllBookings();
  const revenueEgp = bookings
    .filter((b) => !['cancelled', 'refunded'].includes(String(b.status).toLowerCase()))
    .reduce((sum, b) => sum + (Number(b.amountToPay) || Number(b.totalAmount) || 0), 0);

  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    paid: bookings.filter((b) => b.status === 'paid').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    revenueEgp,
  };
};
