const BOOKINGS_KEY = "duck_bookings";

/**
 * Get all stored bookings
 */
const getAllBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
  } catch {
    return [];
  }
};

/**
 * Save bookings
 */
const saveAllBookings = (bookings) => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

/**
 * Get bookings for a specific user
 */
export const getUserBookings = (userId) => {
  if (!userId) return [];

  return getAllBookings().filter(
    (booking) => booking.userId === userId
  );
};

/**
 * Add a new booking
 */
export const addBooking = (booking) => {
  if (!booking.userId) {
    throw new Error("User ID is required");
  }

  const bookings = getAllBookings();

  const newBooking = {
    id: crypto.randomUUID(),
    reference: `DUCK-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...booking,
  };

  bookings.push(newBooking);
  saveAllBookings(bookings);

  return newBooking;
};

/**
 * Update an existing booking
 */
export const updateBooking = (bookingId, userId, updates) => {
  const bookings = getAllBookings();

  const index = bookings.findIndex(
    (booking) =>
      booking.id === bookingId &&
      booking.userId === userId
  );

  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    ...updates,
    id: bookings[index].id,
    userId: bookings[index].userId,
  };

  saveAllBookings(bookings);

  return bookings[index];
};

/**
 * Delete a booking
 */
export const deleteBooking = (bookingId, userId) => {
  const bookings = getAllBookings();

  const updatedBookings = bookings.filter(
    (booking) =>
      !(
        booking.id === bookingId &&
        booking.userId === userId
      )
  );

  saveAllBookings(updatedBookings);

  return updatedBookings.length !== bookings.length;
};

/**
 * Get booking statistics
 */
export const getBookingStats = (userId) => {
  const bookings = getUserBookings(userId);

  const today = new Date();

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);

    return (
      !Number.isNaN(bookingDate.getTime()) &&
      bookingDate >= today &&
      !["cancelled", "refunded", "completed"].includes(
        booking.status
      )
    );
  });

  return {
    total: bookings.length,
    confirmed: bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length,
    upcoming: upcomingBookings.length,
  };
};
