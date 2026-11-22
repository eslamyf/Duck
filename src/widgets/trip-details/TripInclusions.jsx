import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';

export default function TripInclusions({ inclusionsKeys }) {
  const { t } = useTranslation();

  if (!inclusionsKeys || inclusionsKeys.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-7 bg-brand-yellow rounded-full shrink-0" />
        <h2 className="text-2xl font-bold text-white">
          {t('tripDetails.includesTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {inclusionsKeys.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 text-white/85 transition-colors hover:border-brand-yellow/25"
          >
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-brand-yellow text-lg shrink-0"
            />
            <span className="text-sm md:text-base font-medium">
              {t(`trips.inclusions.${key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
