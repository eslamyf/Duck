import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../widgets/navbar/Navbar.jsx';
import Footer from '../widgets/footer/Footer.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import DestinationsSection from '../widgets/destinations/DestinationsSection.jsx';
import TripsSection from '../widgets/trips/TripsSection.jsx';
import GroupsBanner from '../widgets/groups-banner/GroupsBanner.jsx';
import { TRIPS } from '../entities/trip/index.js';
import { useTranslation } from '../shared/i18n/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../shared/config/routes.js';
import { ErrorBoundary, ScrollProgress } from '../shared/ui/index.js';

const MapSection = lazy(() => import('../widgets/map/index.js'));
const ReviewsSection = lazy(() => import('../widgets/reviews/index.js'));
const FAQSection = lazy(() => import('../widgets/faq/index.js'));
const GroupsPage = lazy(() => import('../widgets/groups-page/index.js'));
const AboutPage = lazy(() => import('../pages/about/index.js'));
const TripDetailsPage = lazy(() => import('../pages/trip-details/index.js'));
const BookingPage = lazy(() =>
  import('../pages/booking/index.js').then((m) => ({ default: m.BookingPage }))
);
const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const CreateAccountPage = lazy(() => import('../pages/auth/CreateAccountPage.jsx'));

function SectionSpinner({
  className = 'text-white/50',
  borderClass = 'border-brand-yellow/30 border-t-brand-yellow',
}) {
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      aria-busy="true"
    >
      <div className={`w-10 h-10 border-4 rounded-full animate-spin ${borderClass}`} />
    </div>
  );
}

function GroupsFallback() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-16">
      <SectionSpinner className="min-h-[400px]" />
    </div>
  );
}

function AboutFallback() {
  return (
    <div className="min-h-screen bg-surface-mist pt-24 pb-16">
      <SectionSpinner
        className="min-h-[400px] text-brand-navy/30"
        borderClass="border-brand-blue/30 border-t-brand-blue"
      />
    </div>
  );
}

function TripDetailsFallback() {
  return (
    <div className="min-h-screen bg-surface-mist pt-24 pb-16">
      <SectionSpinner
        className="min-h-[400px] text-brand-navy/30"
        borderClass="border-brand-blue/30 border-t-brand-blue"
      />
    </div>
  );
}

function AuthFallback() {
  return (
    <div className="min-h-screen w-full bg-brand-navy flex items-center justify-center text-white/50" aria-busy="true">
      <div className="w-10 h-10 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
    </div>
  );
}

function MapFallback() {
  return (
    <section
      id="map"
      className="relative w-full min-h-[560px] bg-brand-navy flex items-center justify-center text-white/50"
      aria-label="Loading Map"
    >
      <div className="w-10 h-10 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
    </section>
  );
}

function ReviewsFallback() {
  return (
    <section
      id="reviews"
      className="relative w-full min-h-[420px] bg-surface-sand flex items-center justify-center text-brand-navy/30"
      aria-label="Loading Reviews"
    >
      <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
    </section>
  );
}

function FAQFallback() {
  return (
    <section
      id="faq"
      className="relative w-full min-h-[420px] bg-surface-white flex items-center justify-center text-brand-navy/30"
      aria-label="Loading FAQ"
    >
      <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
    </section>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      if (targetId.startsWith('/')) return;

      let retries = 0;

      const scrollToTarget = () => {
        const el = document.getElementById(targetId);

        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (retries < 30) {
          retries++;
          setTimeout(scrollToTarget, 80);
        }
      };

      const timer = setTimeout(scrollToTarget, 50);

      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
}

function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;

      if (h === '#/groups' || h === '#//groups' || h.startsWith('#/groups')) {
        navigate(ROUTES.GROUPS, { replace: true });
      } else if (h === '#/about' || h === '#//about' || h.startsWith('#/about')) {
        navigate(ROUTES.ABOUT, { replace: true });
      }
    };

    handleHash();

    window.addEventListener('hashchange', handleHash);

    return () => window.removeEventListener('hashchange', handleHash);
  }, [navigate]);

  return null;
}

function TitleManager() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (pathname === ROUTES.LOGIN || pathname === '/login') {
      document.title = `${t('auth.login.metaTitle')} | ${t('common.brandName')}`;
    } else if (pathname === ROUTES.SIGNUP || pathname === '/create-account') {
      document.title = `${t('auth.signup.metaTitle')} | ${t('common.brandName')}`;
    } else if (pathname === ROUTES.GROUPS) {
      document.title = `${t('groups.metaTitle')} | ${t('common.brandName')}`;
    } else if (pathname === ROUTES.ABOUT) {
      document.title = `${t('about.metaTitle')} | ${t('common.brandName')}`;
    } else if (pathname === ROUTES.BOOKING) {
      document.title = `${t('tripDetails.bookNow')} | ${t('common.brandName')}`;
    } else if (pathname.startsWith('/trips/')) {
      const slug = pathname.split('/')[2];
      const trip = TRIPS.find((item) => item.slug === slug);

      if (trip) {
        const tripTitle = t(`trips.items.${trip.key}.title`);
        document.title = `${tripTitle} | ${t('common.brandName')}`;
      } else {
        document.title = `${t('tripDetails.notFoundTitle')} | ${t('common.brandName')}`;
      }
    } else {
      document.title = `${t('common.brandName')} - ${t('nav.home')}`;
    }
  }, [pathname, t]);

  return null;
}

export default function App() {
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('all');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthPage = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.CREATE_ACCOUNT, ROUTES.AUTH].includes(pathname);

  // Idle prewarm for below-the-fold dynamic chunks
  useEffect(() => {
    const prewarm = () => {
      import('../widgets/map/index.js');
      import('../widgets/reviews/index.js');
      import('../widgets/faq/index.js');
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prewarm, { timeout: 2500 });

      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(id);
        }
      };
    } else {
      const id = setTimeout(prewarm, 2000);
      return () => clearTimeout(id);
    }
  }, []);

  const handleSelectDestination = (filterKey) => {
    setSelectedDestinationFilter(filterKey);

    const tripsEl = document.getElementById('trips');

    if (tripsEl) {
      tripsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(sectionLink(SECTIONS.TRIPS));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <ScrollManager />
      <LegacyHashRedirect />
      <TitleManager />

      {!isAuthPage && <ScrollProgress />}

      {!isAuthPage && (
        <div className="print:hidden">
          <Navbar />
        </div>
      )}

      <main
        id="main"
        className={`flex-1 ${
          isAuthPage ? '' : 'pt-[52px] min-[901px]:pt-[100px]'
        } print:pt-0 print:m-0 print:p-0`}
      >
        <ErrorBoundary>
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={
                <>
                  <HeroSection />

                  <DestinationsSection
                    onSelectDestination={handleSelectDestination}
                  />

                  <TripsSection
                    externalFilter={selectedDestinationFilter}
                    onFilterChange={setSelectedDestinationFilter}
                  />

                  <GroupsBanner />

                  <Suspense fallback={<MapFallback />}>
                    <MapSection onSelectDestination={handleSelectDestination} />
                  </Suspense>

                  <Suspense fallback={<ReviewsFallback />}>
                    <ReviewsSection />
                  </Suspense>

                  <Suspense fallback={<FAQFallback />}>
                    <FAQSection />
                  </Suspense>
                </>
              }
            />

            <Route
              path={ROUTES.TRIP_DETAILS}
              element={
                <Suspense fallback={<TripDetailsFallback />}>
                  <TripDetailsPage />
                </Suspense>
              }
            />

            <Route
              path={ROUTES.GROUPS}
              element={
                <Suspense fallback={<GroupsFallback />}>
                  <GroupsPage />
                </Suspense>
              }
            />

            <Route
              path={ROUTES.ABOUT}
              element={
                <Suspense fallback={<AboutFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />

            <Route
              path={ROUTES.BOOKING}
              element={
                <Suspense fallback={<TripDetailsFallback />}>
                  <BookingPage />
                </Suspense>
              }
            />

            {/* Public Auth Routes */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <Suspense fallback={<AuthFallback />}>
                  <LoginPage />
                </Suspense>
              }
            />

            <Route
              path={ROUTES.SIGNUP}
              element={
                <Suspense fallback={<AuthFallback />}>
                  <CreateAccountPage />
                </Suspense>
              }
            />

            {/* Aliases for backward compatibility */}
            <Route
              path={ROUTES.CREATE_ACCOUNT}
              element={<Navigate to={ROUTES.SIGNUP} replace />}
            />
            <Route
              path={ROUTES.AUTH}
              element={<Navigate to={ROUTES.LOGIN} replace />}
            />

            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {!isAuthPage && (
        <div className="print:hidden">
          <Footer />
        </div>
      )}
    </div>
  );
}
