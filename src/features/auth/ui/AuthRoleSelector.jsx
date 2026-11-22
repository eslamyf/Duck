import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';

export default function AuthRoleSelector({ role, onChange }) {
  const { t } = useTranslation();

  const roles = [
    {
      id: 'Customer',
      label: t('auth.roles.customer'),
      badge: t('auth.roles.customerBadge'),
      icon: faUser,
    },
    {
      id: 'Partner',
      label: t('auth.roles.partner'),
      badge: t('auth.roles.partnerBadge'),
      icon: faHandshake,
    },
  ];

  return (
    <div className="w-full mb-5">
      <div
        className="grid grid-cols-2 gap-1.5 p-1 bg-surface-mist rounded-2xl border border-brand-navy/10"
        role="tablist"
        aria-label={t('auth.roles.accountType')}
      >
        {roles.map((item) => {
          const isActive = role === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                isActive
                  ? 'bg-brand-navy text-white shadow-sm font-bold'
                  : 'bg-transparent text-brand-navy/70 hover:bg-white hover:text-brand-navy font-semibold'
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-xs ${isActive ? 'text-brand-yellow' : 'text-brand-blue'}`}
              />
              <span className="text-xs sm:text-sm">
                {item.id === 'Customer' ? t('auth.roles.customer') : t('auth.roles.partner')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
