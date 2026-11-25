import { useEffect, useState } from 'react';
import {
  BOOKINGS_UPDATED_EVENT,
  getAllBookings,
  getEquipmentInventory,
} from '../../entities/booking/api/bookingService.js';

export function useBookingsSync() {
  const [bookings, setBookings] = useState(() => getAllBookings());
  const [inventory, setInventory] = useState(() => getEquipmentInventory());

  useEffect(() => {
    const sync = () => {
      setBookings(getAllBookings());
      setInventory(getEquipmentInventory());
    };

    window.addEventListener(BOOKINGS_UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(BOOKINGS_UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { bookings, inventory };
}

