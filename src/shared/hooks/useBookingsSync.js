import { useEffect, useState } from 'react';
import {
  BOOKINGS_UPDATED_EVENT,
  getAllBookings,
  getEquipmentInventory,
  getB2BQuotes,
} from '../../entities/booking/api/bookingService.js';

export function useBookingsSync() {
  const [bookings, setBookings] = useState(() => getAllBookings());
  const [inventory, setInventory] = useState(() => getEquipmentInventory());
  const [quotes, setQuotes] = useState(() => getB2BQuotes());

  useEffect(() => {
    const sync = () => {
      setBookings(getAllBookings());
      setInventory(getEquipmentInventory());
      setQuotes(getB2BQuotes());
    };

    window.addEventListener(BOOKINGS_UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(BOOKINGS_UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { bookings, inventory, quotes };
}

