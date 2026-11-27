import { useEffect, useMemo, useState } from 'react';
import { useBookingsSync } from './useBookingsSync.js';
import { getCurrentUser } from '../../entities/user/api/authSession.js';
import { useTranslation } from '../i18n/index.js';
import {
  AUTH_UPDATED_EVENT,
  NOTIFICATIONS_UPDATED_EVENT,
  buildNotifications,
  getNotificationScopeKey,
  getStoredPendingBooking,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../entities/notification/index.js';

export function useNotificationsSync() {
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const { bookings, inventory, quotes } = useBookingsSync();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1);

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    window.addEventListener(AUTH_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
      window.removeEventListener(AUTH_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const currentUser = useMemo(() => {
    void tick;
    return getCurrentUser();
  }, [tick]);

  const pendingBooking = useMemo(() => {
    void tick;
    return getStoredPendingBooking();
  }, [tick]);

  const notifications = useMemo(() => {
    void tick;
    return buildNotifications({
      currentUser,
      bookings,
      quotes,
      inventory,
      isArabic,
    });
  }, [tick, currentUser, bookings, quotes, inventory, isArabic]);

  const scopeKey = getNotificationScopeKey(currentUser);
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const markAsRead = (id) => markNotificationRead(id, scopeKey);
  const markAllAsRead = () =>
    markAllNotificationsRead(
      notifications.map((n) => n.id),
      scopeKey
    );

  return {
    currentUser,
    pendingBooking,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
