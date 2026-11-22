import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../shared/i18n/index.js';

export default function AuthRoleSelector({ role, onChange }) {
  const { t } = useTranslation();

  const roles = [
    {
      id: 'customer',
      label: t('auth.roles.customer'),
      badge: t('auth.roles.customerBadge'),
      icon: faUser,
    },
    {
      id: 'partner',
      label: t('auth.roles.partner'),
      badge: t('auth.roles.partnerBadge'),
      icon: faHandshake,
    },
  ];

  return (
    <div className="w-full mb-6">
      <label className="block text-xs font-bold text-brand-navy/60 uppercase tracking-wider mb-2">
        {t('auth.roles.accountType')}
      </label>

      <div
        className="grid grid-cols-2 gap-2 p-1 bg-surface-mist rounded-2xl border border-brand-navy/10"
        role="radiogroup"
        aria-label={t('auth.roles.accountType')}
      >
        {roles.map((item) => {
          const isActive = role === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 text-center select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                isActive
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-transparent text-brand-navy/80 hover:bg-white hover:text-brand-navy'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-xs ${isActive ? 'text-brand-yellow' : 'text-brand-blue'}`}
                />
                <span className="text-xs sm:text-sm font-bold">
                  {item.id === 'customer' ? t('auth.roles.customerBadge') : t('auth.roles.partnerBadge')}
                </span>
              </div>
              <span
                className={`text-[10px] ${
                  isActive ? 'text-white/70' : 'text-brand-navy/50'
                }`}
              >
                {item.id === 'customer' ? 'Individuals' : 'B2B'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
