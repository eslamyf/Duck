import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCompass,
  faHouse,
  faCalendarCheck,
  faWater,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES } from '../../shared/config/routes.js';

export default function NotFoundPage() {
  const { lang } = useTranslation();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-[calc(100svh-100px)] bg-surface-mist flex items-center justify-center px-5 py-16 text-brand-navy"
    >
      <div className="max-w-xl w-full rounded-[28px] border border-brand-blue/16 bg-surface-white p-8 sm:p-12 text-center shadow-card space-y-6">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy text-brand-yellow text-3xl shadow-sm">
          <FontAwesomeIcon icon={faCompass} />
        </div>

        <div className="space-y-2">
          <span className="inline-block rounded-full bg-brand-yellow/35 px-4 py-1 font-mono text-xs font-black tracking-widest text-brand-navy">
            ERROR 404
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy">
            {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h1>
          <p className="text-sm sm:text-base text-brand-navy/70 leading-relaxed max-w-md mx-auto">
            {isArabic
              ? 'يبدو أن المسار الذي تبحث عنه قد تغيّر أو غير موجود. يمكنك الرجوع أو استكشاف رحلات النيل والأنشطة.'
              : 'The page you are looking for might have been moved or does not exist. Head back home or book your next water adventure.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(ROUTES.HOME))}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-navy/20 bg-surface-mist px-5 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-brand-navy hover:text-brand-yellow cursor-pointer"
          >
            <FontAwesomeIcon icon={isArabic ? faArrowRight : faArrowLeft} />
            <span>{isArabic ? 'الرجوع' : 'Go Back'}</span>
          </button>

          <Link
            to={ROUTES.HOME}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue"
          >
            <FontAwesomeIcon icon={faHouse} />
            <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
          </Link>

          <Link
            to={ROUTES.BOOKING}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-brand-navy shadow-sm transition hover:bg-brand-yellow-hover"
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>{isArabic ? 'احجز الآن' : 'Book Now'}</span>
          </Link>

          <Link
            to={ROUTES.ACTIVITIES}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-blue/25 bg-surface-white px-5 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-surface-mist"
          >
            <FontAwesomeIcon icon={faWater} />
            <span>{isArabic ? 'الأنشطة' : 'Activities'}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
