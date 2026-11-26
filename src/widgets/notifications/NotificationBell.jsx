import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCheckDouble,
  faTicket,
  faCalendarCheck,
  faTriangleExclamation,
  faUsers,
  faArrowLeft,
  faArrowRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { useNotificationsSync } from '../../shared/hooks/index.js';
import { ROUTES } from '../../shared/config/routes.js';
import { getPortalPathForRole } from '../../shared/config/rbac.js';

const KIND_STYLES = {
  ticket: {
    icon: faTicket,
    badgeClass: 'bg-brand-yellow/35 text-brand-navy',
  },
  alert: {
    icon: faTriangleExclamation,
    badgeClass: 'bg-brand-error/12 text-brand-error',
  },
  group: {
    icon: faUsers,
    badgeClass: 'bg-brand-blue/15 text-brand-blue',
  },
  booking: {
    icon: faCalendarCheck,
    badgeClass: 'bg-surface-mist2 text-brand-blue',
  },
};

export default function NotificationBell({ compact = false }) {
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const routeKey = `${location.pathname}${location.search}`;
  const [openRouteKey, setOpenRouteKey] = useState(null);
  const isOpen = openRouteKey === routeKey;

  const {
    currentUser,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationsSync();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenRouteKey(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenRouteKey(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    setOpenRouteKey((prev) => (prev === routeKey ? null : routeKey));
  };

  const handleSelectItem = (item) => {
    markAsRead(item.id);
    setOpenRouteKey(null);
    if (item.to) {
      navigate(item.to);
    }
  };

  const hasPriorityUnread = notifications.some((n) => n.isPriority && !n.isRead);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isArabic ? 'التنبيهات والإشعارات' : 'Notifications'}
        title={isArabic ? 'التنبيهات' : 'Notifications'}
        className={`relative inline-flex items-center justify-center rounded-full border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
          compact ? 'h-9 w-9 text-sm' : 'h-9 w-9 xl:h-10 xl:w-10 text-sm'
        } ${
          isOpen
            ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow-sm'
            : 'border-brand-blue/20 bg-surface-mist text-brand-navy hover:border-brand-blue hover:bg-brand-navy hover:text-brand-yellow'
        }`}
      >
        <FontAwesomeIcon icon={faBell} />

        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -end-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full border-2 border-white px-1 text-[10px] font-extrabold leading-none ${
              hasPriorityUnread
                ? 'bg-brand-yellow text-brand-navy'
                : 'bg-brand-error text-white'
            }`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          dir={isArabic ? 'rtl' : 'ltr'}
          role="menu"
          aria-label={isArabic ? 'قائمة التنبيهات' : 'Notifications menu'}
          className="fixed inset-x-3 top-[60px] z-[10001] overflow-hidden rounded-2xl border border-brand-blue/20 bg-surface-white text-brand-navy shadow-ocean animate-in fade-in slide-in-from-top-2 duration-150 sm:absolute sm:inset-x-auto sm:top-full sm:end-0 sm:mt-2.5 sm:w-[360px]"
        >
          {/* Dropdown Header */}
          <div className="flex items-center justify-between gap-2 border-b border-brand-blue/15 bg-brand-navy px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBell} className="text-brand-yellow text-sm" />
              <span className="font-heading text-sm font-extrabold">
                {isArabic ? 'التنبيهات' : 'Notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-[10.5px] font-extrabold text-brand-navy">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-brand-yellow transition hover:bg-white/20 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCheckDouble} className="text-[10px]" />
                  <span>{isArabic ? 'قراءة الكل' : 'Mark all'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpenRouteKey(null)}
                aria-label={isArabic ? 'إغلاق' : 'Close'}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/12 hover:text-white cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[340px] divide-y divide-brand-blue/10 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <FontAwesomeIcon
                  icon={faBell}
                  className="mb-2 text-2xl text-brand-navy/20"
                />
                <p className="text-xs font-bold text-brand-navy/65">
                  {isArabic
                    ? 'لا توجد تنبيهات جديدة حاليًا.'
                    : 'No new notifications right now.'}
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const style = KIND_STYLES[item.kind] || KIND_STYLES.booking;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectItem(item)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-start transition-colors cursor-pointer ${
                      item.isRead
                        ? 'bg-surface-white hover:bg-surface-mist/70 opacity-80'
                        : 'bg-surface-mist/90 hover:bg-surface-mist2/70'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${style.badgeClass}`}
                    >
                      <FontAwesomeIcon icon={style.icon} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-extrabold text-brand-navy">
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                        )}
                      </span>

                      <span className="mt-0.5 block text-[11.5px] font-semibold leading-snug text-brand-navy/80">
                        {item.message}
                      </span>

                      {item.meta && (
                        <span className="mt-1 block text-[10.5px] font-bold text-brand-blue">
                          {item.meta}
                        </span>
                      )}
                    </span>

                    <FontAwesomeIcon
                      icon={isArabic ? faArrowLeft : faArrowRight}
                      className="mt-2 shrink-0 text-[10px] text-brand-navy/35"
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="flex items-center justify-between border-t border-brand-blue/12 bg-surface-mist px-4 py-2.5">
            <button
              type="button"
              onClick={() => {
                setOpenRouteKey(null);
                navigate(
                  currentUser
                    ? getPortalPathForRole(currentUser.role)
                    : ROUTES.BOOKING
                );
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-3 py-2 text-xs font-bold text-brand-yellow transition hover:bg-brand-blue hover:text-white cursor-pointer"
            >
              <span>
                {currentUser
                  ? isArabic
                    ? 'الانتقال إلى لوحة التحكم'
                    : 'Open Dashboard'
                  : isArabic
                    ? 'احجز رحلتك الآن'
                    : 'Book Your Trip Now'}
              </span>
              <FontAwesomeIcon
                icon={isArabic ? faArrowLeft : faArrowRight}
                className="text-[11px]"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
