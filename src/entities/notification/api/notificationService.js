import { ROUTES } from '../../../shared/config/routes.js';
import { ROLES } from '../../../shared/config/rbac.js';
import { getUserBookings } from '../../booking/api/bookingService.js';

export const PENDING_BOOKING_KEY = 'duck_pending_booking';
export const PENDING_DISMISSED_KEY = 'duck_pending_dismissed';
export const NOTIFICATIONS_READ_KEY = 'duck_notifications_read';
export const NOTIFICATIONS_UPDATED_EVENT = 'duck:notifications-updated';
export const AUTH_UPDATED_EVENT = 'duck:auth-updated';

export function notifyNotificationsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
  }
}

export function notifyAuthUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_UPDATED_EVENT));
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
  }
}

export function getPendingBookingRaw() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_BOOKING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredPendingBooking({ ignoreDismissed = false } = {}) {
  if (typeof window === 'undefined') return null;
  if (!ignoreDismissed && sessionStorage.getItem(PENDING_DISMISSED_KEY) === 'true') {
    return null;
  }
  const parsed = getPendingBookingRaw();
  if (
    parsed &&
    parsed.status === 'pending_confirmation' &&
    !parsed.receiptSent &&
    parsed.ref
  ) {
    return parsed;
  }
  return null;
}

export function savePendingBooking(ticket) {
  if (typeof window === 'undefined' || !ticket?.ref) return;
  try {
    localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(ticket));
    sessionStorage.removeItem(PENDING_DISMISSED_KEY);
    notifyNotificationsUpdated();
  } catch {
    // ignore storage quota / privacy mode errors
  }
}

export function markPendingReceiptSent() {
  if (typeof window === 'undefined') return;
  try {
    const parsed = getPendingBookingRaw();
    if (parsed) {
      const updated = { ...parsed, receiptSent: true, status: 'receipt_sent' };
      localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(updated));
      notifyNotificationsUpdated();
    }
  } catch {
    // ignore
  }
}

export function dismissPendingBooking() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(PENDING_DISMISSED_KEY, 'true');
    notifyNotificationsUpdated();
  } catch {
    // ignore
  }
}

export function getNotificationScopeKey(currentUser) {
  return currentUser?.id || 'guest';
}

function getReadMap() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_READ_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function getReadNotificationIds(scopeKey) {
  const map = getReadMap();
  const list = map[scopeKey];
  return new Set(Array.isArray(list) ? list : []);
}

export function markNotificationRead(id, scopeKey = 'guest') {
  if (typeof window === 'undefined' || !id) return;
  try {
    const map = getReadMap();
    const current = new Set(Array.isArray(map[scopeKey]) ? map[scopeKey] : []);
    if (current.has(id)) return;
    current.add(id);
    map[scopeKey] = Array.from(current).slice(-100);
    localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(map));
    notifyNotificationsUpdated();
  } catch {
    // ignore
  }
}

export function markAllNotificationsRead(ids = [], scopeKey = 'guest') {
  if (typeof window === 'undefined' || !ids.length) return;
  try {
    const map = getReadMap();
    const current = new Set(Array.isArray(map[scopeKey]) ? map[scopeKey] : []);
    let changed = false;
    ids.forEach((id) => {
      if (id && !current.has(id)) {
        current.add(id);
        changed = true;
      }
    });
    if (!changed) return;
    map[scopeKey] = Array.from(current).slice(-100);
    localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(map));
    notifyNotificationsUpdated();
  } catch {
    // ignore
  }
}

function formatStatusLabel(status, isArabic) {
  const normalized = String(status || 'pending').toLowerCase();
  const labels = {
    pending: isArabic ? 'قيد المراجعة' : 'Pending Review',
    confirmed: isArabic ? 'مؤكد' : 'Confirmed',
    paid: isArabic ? 'مدفوع' : 'Paid',
    completed: isArabic ? 'مكتمل' : 'Completed',
    cancelled: isArabic ? 'ملغي' : 'Cancelled',
    refunded: isArabic ? 'مسترد' : 'Refunded',
  };
  return labels[normalized] || normalized;
}

/**
 * Derive role-aware & guest-aware notifications from live bookings, quotes,
 * fleet inventory, and any active pending booking ticket.
 */
export function buildNotifications({
  currentUser,
  bookings = [],
  quotes = [],
  inventory = [],
  isArabic = true,
}) {
  const items = [];
  const locale = isArabic ? 'ar-EG' : 'en-US';
  const pendingBooking = getStoredPendingBooking({ ignoreDismissed: true });

  if (pendingBooking) {
    const formattedAmount = pendingBooking.amount
      ? `${Number(pendingBooking.amount).toLocaleString(locale)} ${isArabic ? 'ج.م' : 'EGP'}`
      : '';
    items.push({
      id: `pending-${pendingBooking.ref}`,
      kind: 'ticket',
      title: isArabic ? 'تذكرة حجز بانتظار التأكيد' : 'Unconfirmed Booking Ticket',
      message: `${pendingBooking.ref} • ${pendingBooking.tripTitle || ''}`.trim(),
      meta: formattedAmount
        ? isArabic
          ? `${formattedAmount} • اضغط لإكمال الدفع`
          : `${formattedAmount} • Tap to view invoice`
        : null,
      to: `${ROUTES.BOOKING}?ref=${encodeURIComponent(pendingBooking.ref)}&step=4`,
      isPriority: true,
    });
  }

  const role = currentUser?.role;

  if (role === ROLES.ADMIN) {
    bookings
      .filter((b) => String(b.status).toLowerCase() === 'pending')
      .slice(0, 3)
      .forEach((b) => {
        items.push({
          id: `admin-bk-${b.reference || b.id}`,
          kind: 'booking',
          title: isArabic ? 'حجز جديد بانتظار المراجعة' : 'Booking Awaiting Review',
          message: `${b.reference} • ${b.fullName || ''} — ${b.tripTitle || b.tripKey}`,
          meta: `${b.date || ''} ${b.time || ''}`.trim(),
          to: `${ROUTES.ADMIN}?tab=bookings`,
        });
      });

    quotes.slice(0, 2).forEach((q) => {
      items.push({
        id: `admin-quo-${q.ref}`,
        kind: 'group',
        title: isArabic ? 'طلب عرض أسعار مجموعات' : 'B2B Group Quote Request',
        message: `${q.organization || q.ref} (${q.groupSize} ${isArabic ? 'فرد' : 'guests'})`,
        meta: q.date || '',
        to: `${ROUTES.ADMIN}?tab=b2b`,
      });
    });
  } else if (role === ROLES.OPERATIONS) {
    bookings
      .filter((b) => ['pending', 'confirmed', 'paid'].includes(String(b.status).toLowerCase()))
      .slice(0, 4)
      .forEach((b) => {
        items.push({
          id: `ops-dep-${b.reference || b.id}-${b.status}`,
          kind: 'booking',
          title: isArabic ? `تشغيل رحلة (${formatStatusLabel(b.status, true)})` : `Departure (${formatStatusLabel(b.status, false)})`,
          message: `${b.reference} • ${b.tripTitle || b.tripKey}`,
          meta: `${b.date || ''} · ${b.time || ''} · ${b.guests || 1} ${isArabic ? 'ضيف' : 'guests'}`,
          to: `${ROUTES.OPERATIONS}?tab=departures`,
        });
      });
  } else if (role === ROLES.PARTNER) {
    inventory
      .filter((item) => item.remainingUnits <= 2)
      .forEach((item) => {
        items.push({
          id: `partner-inv-${item.id}-${item.remainingUnits}`,
          kind: 'alert',
          title: isArabic ? 'تنبيه سعة الأسطول' : 'Fleet Capacity Alert',
          message: isArabic
            ? `${item.nameAr}: متبقي ${item.remainingUnits} وحدة فقط`
            : `${item.nameEn}: Only ${item.remainingUnits} units remaining`,
          to: `${ROUTES.PARTNER}?tab=inventory`,
        });
      });

    bookings.slice(0, 2).forEach((b) => {
      items.push({
        id: `partner-bk-${b.reference || b.id}`,
        kind: 'booking',
        title: isArabic ? 'حجز نشط على الأسطول' : 'Active Fleet Booking',
        message: `${b.reference} • ${b.tripTitle || b.tripKey}`,
        meta: formatStatusLabel(b.status, isArabic),
        to: `${ROUTES.PARTNER}?tab=bookings`,
      });
    });
  } else if (role === ROLES.TOUR_GUIDE) {
    bookings.slice(0, 4).forEach((b) => {
      items.push({
        id: `agent-bk-${b.reference || b.id}-${b.status}`,
        kind: 'booking',
        title: isArabic ? 'طلب / حجز متاح للمتابعة' : 'Booking Update',
        message: `${b.reference} • ${b.fullName || ''} — ${b.tripTitle || b.tripKey}`,
        meta: `${b.date || ''} · ${formatStatusLabel(b.status, isArabic)}`,
        to: `${ROUTES.TOUR_GUIDE}?tab=requests`,
      });
    });
  } else if (role === ROLES.CUSTOMER) {
    const myBookings = getUserBookings(currentUser).slice(0, 4);
    myBookings.forEach((b) => {
      const st = String(b.status).toLowerCase();
      if (pendingBooking && b.reference === pendingBooking.ref) return;
      items.push({
        id: `cust-bk-${b.reference || b.id}-${st}`,
        kind: st === 'pending' ? 'ticket' : 'booking',
        title: isArabic
          ? `تحديث حجزك: ${formatStatusLabel(st, true)}`
          : `Booking Update: ${formatStatusLabel(st, false)}`,
        message: `${b.reference} • ${b.tripTitle || b.tripKey}`,
        meta: `${b.date || ''} · ${b.time || ''}`.trim(),
        to:
          st === 'pending'
            ? `${ROUTES.BOOKING}?ref=${encodeURIComponent(b.reference)}&step=4`
            : `${ROUTES.CUSTOMER_DASHBOARD}?tab=bookings`,
      });
    });
  }

  // Helpful platform/availability alerts for guests (and customers with no booking notifications yet)
  if (!role || (role === ROLES.CUSTOMER && items.length === 0)) {
    const scarceEquipment = inventory.find((item) => item.remainingUnits > 0 && item.remainingUnits <= 2);
    if (scarceEquipment) {
      items.push({
        id: `guest-inv-${scarceEquipment.id}`,
        kind: 'alert',
        title: isArabic
          ? `أماكن محدودة: ${scarceEquipment.nameAr}`
          : `Limited Availability: ${scarceEquipment.nameEn}`,
        message: isArabic
          ? `متبقي ${scarceEquipment.remainingUnits} وحدات فقط اليوم — احجز قبل نفاد الأماكن.`
          : `Only ${scarceEquipment.remainingUnits} units remaining today — book before slots fill.`,
        to: `${ROUTES.BOOKING}?activity=${scarceEquipment.id}`,
      });
    }

    items.push({
      id: 'guest-groups-offer',
      kind: 'group',
      title: isArabic ? 'تنظيم رحلات المجموعات (+20 فرد)' : 'Group & Corporate Trips (20+)',
      message: isArabic
        ? 'باقات مخصصة للشركات والجامعات مع مرشدين معتمدين.'
        : 'Custom packages for corporates & universities with certified guides.',
      to: ROUTES.GROUPS,
    });
  }

  const scopeKey = getNotificationScopeKey(currentUser);
  const readSet = getReadNotificationIds(scopeKey);

  return items.map((item) => ({
    ...item,
    isRead: readSet.has(item.id),
  }));
}
