import { useState, useEffect, useCallback } from 'react';
import {
  CMS_UPDATED_EVENT,
  getDynamicDestinations,
  getDynamicTrips,
  getEquipmentCapacity,
  addDynamicDestination,
  updateDynamicDestination,
  deleteDynamicDestination,
  addDynamicTrip,
  updateDynamicTrip,
  deleteDynamicTrip,
  updateEquipmentCapacity,
  getSlotAvailability,
  checkCanBook,
  resetAllDemoData,
} from '../api/cmsService.js';
import { BOOKINGS_UPDATED_EVENT, getAllBookings } from '../../entities/booking/api/bookingService.js';

/**
 * Reactive Hook to consume and mutate dynamic CMS and Inventory data.
 * Automatically synchronizes across all tabs and widgets.
 */
export function useCMS() {
  const [destinations, setDestinations] = useState(getDynamicDestinations);
  const [trips, setTrips] = useState(getDynamicTrips);
  const [equipmentCapacity, setEquipmentCapacity] = useState(getEquipmentCapacity);
  const [bookings, setBookings] = useState(getAllBookings);

  const refresh = useCallback(() => {
    setDestinations(getDynamicDestinations());
    setTrips(getDynamicTrips());
    setEquipmentCapacity(getEquipmentCapacity());
    setBookings(getAllBookings());
  }, []);

  useEffect(() => {
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    window.addEventListener(BOOKINGS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, refresh);
      window.removeEventListener(BOOKINGS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  return {
    destinations,
    trips,
    equipmentCapacity,
    bookings,
    refresh,
    addDestination: addDynamicDestination,
    updateDestination: updateDynamicDestination,
    deleteDestination: deleteDynamicDestination,
    addTrip: addDynamicTrip,
    updateTrip: updateDynamicTrip,
    deleteTrip: deleteDynamicTrip,
    updateCapacity: updateEquipmentCapacity,
    getSlotAvailability,
    checkCanBook,
    resetAllDemoData,
  };
}
