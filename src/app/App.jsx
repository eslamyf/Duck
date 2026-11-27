import { useState, useEffect, lazy, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import Navbar from '../widgets/navbar/Navbar.jsx';
import { MobileBottomNav } from '../widgets/header/index.js';
import Footer from '../widgets/footer/Footer.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import { StoryGallerySection } from '../widgets/story-gallery/index.js';
import LazyViewportSection from './LazyViewportSection.jsx';

import { useTranslation } from '../shared/i18n/index.js';
import {
  ROUTES,
  SECTIONS,
  sectionLink,
  isValidSection,
} from '../shared/config/routes.js';


import ErrorBoundary from '../shared/ui/ErrorBoundary/index.js';
import ScrollProgress from '../shared/ui/ScrollProgress/index.js';

import { trackPageView } from '../shared/utils/analytics.js';
import { applyRouteSeo } from '../shared/utils/seo.js';
const PendingBookingPopup = lazy(
  () => import('../widgets/booking/PendingBookingPopup.jsx')
);

function DeferredPendingBookingPopup() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const check = () => {
      if (localStorage.getItem('duck_pending_booking') || localStorage.getItem('duck_user')) {
        setShouldRender(true);
      }
    };
    check();
    window.addEventListener('storage', check);
    window.addEventListener('duck:bookings-updated', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('duck:bookings-updated', check);
    };
  }, []);

  if (!shouldRender) return null;
  return (
    <Suspense fallback={null}>
      <PendingBookingPopup />
    </Suspense>
  );
}

// Lazy-loaded public sections
const DestinationsSection = lazy(() => import('../widgets/destinations/DestinationsSection.jsx'));
const TripsSection = lazy(() => import('../widgets/trips/TripsSection.jsx'));
const WhyDuckSection = lazy(() => import('../widgets/why-duck/WhyDuckSection.jsx'));
const GroupsBanner = lazy(() => import('../widgets/groups-banner/GroupsBanner.jsx'));
const FinalCtaSection = lazy(() => import('../widgets/final-cta/FinalCtaSection.jsx'));
const MapSection = lazy(() => import('../widgets/map/index.js'));
const ReviewsSection = lazy(() => import('../widgets/reviews/index.js'));
const FAQSection = lazy(() => import('../widgets/faq/index.js'));
const GroupsPage = lazy(() => import('../widgets/groups-page/GroupsPage.jsx'));
const AboutPage = lazy(() => import('../pages/about/AboutPage.jsx'));
const TripDetailsPage = lazy(() => import('../pages/trip-details/TripDetailsPage.jsx'));

const PublicActivitiesPage = lazy(
  () => import('../pages/activities/ActivitiesPage.jsx')
);

const ActivityDetailsPage = lazy(
  () => import('../pages/activities/ActivityDetailsPage.jsx')
);

const BookingPage = lazy(() =>
  import('../pages/booking/index.js').then((m) => ({
    default: m.BookingPage,
  }))
);

// Authentication Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const CreateAccountPage = lazy(
  () => import('../pages/auth/CreateAccountPage.jsx')
);

// Dashboard Portals
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { ROLES } from '../shared/config/rbac.js';

const CustomerDashboardPage = lazy(
  () => import('../pages/dashboard/CustomerDashboardPage.jsx')
);
const AdminDashboardPage = lazy(
  () => import('../pages/dashboard/AdminDashboardPage.jsx')
);
const PartnerDashboardPage = lazy(
  () => import('../pages/dashboard/PartnerDashboardPage.jsx')
);
const OperationsDashboardPage = lazy(
  () => import('../pages/dashboard/OperationsDashboardPage.jsx')
);
const AgentDashboardPage = lazy(
  () => import('../pages/dashboard/AgentDashboardPage.jsx')
);
const ContentDashboardPage = lazy(
  () => import('../pages/dashboard/ContentDashboardPage.jsx')
);
const NotFoundPage = lazy(
  () => import('../pages/not-found/NotFoundPage.jsx')
);
const StaticInfoPage = lazy(
  () => import('../pages/static/StaticInfoPage.jsx')
);

// Loading Components
function SectionSpinner({
  className = 'text-white/50',
  borderClass = 'border-brand-yellow/30 border-t-brand-yellow',
}) {
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      aria-busy="true"
    >
      <div
        className={`w-10 h-10 border-4 rounded-full animate-spin ${borderClass}`}
      />
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

function BookingFallback() {
  return (
    <div className="min-h-screen bg-surface-sand pt-28 pb-16">
      <SectionSpinner
        className="min-h-[400px] text-brand-navy/30"
        borderClass="border-brand-yellow/30 border-t-brand-yellow"
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
    <div
      className="min-h-screen w-full bg-brand-navy flex items-center justify-center text-white/50"
      aria-busy="true"
    >
      <div className="w-10 h-10 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
    </div>
  );
}

function DestinationsFallback() {
  return (
    <div
      id={SECTIONS.DESTINATIONS}
      aria-hidden="true"
      className="bg-brand-navy min-h-[600px] min-[901px]:min-h-[680px] border-t border-white/8"
    />
  );
}

function TripsFallback() {
  return (
    <div
      id={SECTIONS.TRIPS}
      aria-hidden="true"
      className="bg-gradient-to-b from-[#f3fafc] to-white min-h-[780px] min-[901px]:min-h-[820px]"
    />
  );
}

function WhyDuckFallback() {
  return (
    <div
      id="why-duck"
      aria-hidden="true"
      className="bg-surface-sand min-h-[420px] border-t border-brand-blue/12"
    />
  );
}

function GroupsBannerFallback() {
  return (
    <div
      id={SECTIONS.GROUPS}
      aria-hidden="true"
      className="my-10 min-[901px]:my-12 min-h-[540px] min-[901px]:min-h-[580px] bg-brand-navy"
    />
  );
}

function FinalCtaFallback() {
  return (
    <div
      id="final-cta"
      aria-hidden="true"
      className="bg-surface-white min-h-[380px] border-t border-brand-blue/12"
    />
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
      className="relative w-full min-h-[600px] bg-surface-sand flex items-center justify-center text-brand-navy/30"
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
      className="relative w-full min-h-[500px] bg-surface-white flex items-center justify-center text-brand-navy/30"
      aria-label="Loading FAQ"
    >
      <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
    </section>
  );
}

// Scroll Manager
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    trackPageView(pathname + (hash || ''));
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, hash]);

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '').split('?')[0].split('&')[0].trim();

      if (targetId.startsWith('/')) return;

      // On home page, only attempt scroll if it is a recognized valid section
      if (pathname === ROUTES.HOME && !isValidSection(targetId)) {
        return;
      }

      let retries = 0;

      const scrollToTarget = () => {
        const el =
          document.getElementById(targetId) ||
          document.getElementById(targetId.toLowerCase());

        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
          });
        } else if (retries < 15) {
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

// Legacy Hash Redirect
function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;

      if (!h || !h.startsWith('#/')) return;

      const cleanPath = h.replace(/^#\/?/, '/');
      navigate(cleanPath, { replace: true });
    };

    handleHash();

    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, [navigate]);

  return null;
}

const ACTIVITY_SLUG_TO_I18N = {
  kayaking: 'kayak',
  'water-bike': 'water-bike',
  sup: 'sup',
  'nile-tours': 'nile-trips',
};

const HOME_ALIAS_PATHS = new Set([
  ROUTES.HOME,
  '/destinations',
  '/locations',
  '/trips',
  '/reviews',
  '/faq',
  '/map',
  '/contact',
  '/experiences',
]);

// Page Title, Canonical & Meta Manager
function TitleManager() {
  const { pathname, hash } = useLocation();
  const { t, lang } = useTranslation();
  const isArabic = lang === 'ar';

  useEffect(() => {
    const brand = t('common.brandName');
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const isInvalidHomeHash =
      normalizedPath === ROUTES.HOME &&
      hash &&
      !hash.startsWith('#/') &&
      !isValidSection(hash);

    if (isInvalidHomeHash) {
      applyRouteSeo({
        title: `${isArabic ? 'الصفحة غير موجودة (404)' : 'Page Not Found (404)'} | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: '/',
        lang,
        indexable: false,
      });
      return undefined;
    }

    if (normalizedPath === ROUTES.LOGIN || normalizedPath === '/login') {
      applyRouteSeo({
        title: `${t('auth.login.metaTitle')} | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: ROUTES.LOGIN,
        lang,
        indexable: false,
      });
    } else if (
      normalizedPath === ROUTES.SIGNUP ||
      normalizedPath === ROUTES.CREATE_ACCOUNT ||
      normalizedPath === ROUTES.AUTH
    ) {
      applyRouteSeo({
        title: `${t('auth.signup.metaTitle')} | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: normalizedPath,
        lang,
        indexable: false,
      });
    } else if (normalizedPath.startsWith('/dashboard')) {
      applyRouteSeo({
        title: `Customer Dashboard | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: ROUTES.CUSTOMER_DASHBOARD,
        lang,
        indexable: false,
      });
    } else if (normalizedPath.startsWith(ROUTES.ADMIN)) {
      applyRouteSeo({
        title: `Admin Portal | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: ROUTES.ADMIN,
        lang,
        indexable: false,
      });
    } else if (normalizedPath.startsWith(ROUTES.PARTNER) || normalizedPath.startsWith('/portal/b2b')) {
      applyRouteSeo({
        title: `Partner Portal | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: normalizedPath,
        lang,
        indexable: false,
      });
    } else if (normalizedPath.startsWith(ROUTES.OPERATIONS)) {
      applyRouteSeo({
        title: `Operations Portal | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: ROUTES.OPERATIONS,
        lang,
        indexable: false,
      });
    } else if (normalizedPath.startsWith(ROUTES.TOUR_GUIDE) || normalizedPath.startsWith('/portal/guide')) {
      applyRouteSeo({
        title: `Tour Guide Portal | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: normalizedPath,
        lang,
        indexable: false,
      });
    } else if (normalizedPath.startsWith('/portal/content')) {
      applyRouteSeo({
        title: `Content & Media Portal | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: ROUTES.CONTENT_MANAGER,
        lang,
        indexable: false,
      });
    } else if (normalizedPath === ROUTES.BOOKING || normalizedPath === '/booking') {
      applyRouteSeo({
        title: `${t('tripDetails.bookNow')} | ${brand}`,
        description: t('booking.tripSelect.subtitle'),
        canonicalPath: ROUTES.BOOKING,
        lang,
        indexable: false,
      });
    } else if (normalizedPath === ROUTES.ACTIVITIES) {
      applyRouteSeo({
        title: `${t('activitiesPage.metaTitle')} | ${brand}`,
        description: t('activitiesPage.heroDescription'),
        canonicalPath: ROUTES.ACTIVITIES,
        lang,
        indexable: true,
      });
    } else if (normalizedPath.startsWith('/activities/')) {
      const slug = normalizedPath.split('/')[2] || '';
      const actKey = ACTIVITY_SLUG_TO_I18N[slug];
      if (actKey) {
        applyRouteSeo({
          title: `${t(`activitiesPage.items.${actKey}.title`)} | ${brand}`,
          description: t(`activitiesPage.items.${actKey}.description`),
          canonicalPath: `/activities/${slug}`,
          lang,
          indexable: true,
        });
      } else {
        applyRouteSeo({
          title: `${isArabic ? 'الصفحة غير موجودة (404)' : 'Page Not Found (404)'} | ${brand}`,
          description: t('hero.desc'),
          canonicalPath: normalizedPath,
          lang,
          indexable: false,
        });
      }
    } else if (normalizedPath === ROUTES.PRIVACY) {
      applyRouteSeo({
        title: `${t('legal.privacy.metaTitle')} | ${brand}`,
        description: t('legal.privacy.subtitle'),
        canonicalPath: ROUTES.PRIVACY,
        lang,
        indexable: true,
      });
    } else if (normalizedPath === ROUTES.TERMS) {
      applyRouteSeo({
        title: `${t('legal.terms.metaTitle')} | ${brand}`,
        description: t('legal.terms.subtitle'),
        canonicalPath: ROUTES.TERMS,
        lang,
        indexable: true,
      });
    } else if (normalizedPath === ROUTES.CANCELLATION) {
      applyRouteSeo({
        title: `${t('legal.cancellation.metaTitle')} | ${brand}`,
        description: t('legal.cancellation.subtitle'),
        canonicalPath: ROUTES.CANCELLATION,
        lang,
        indexable: true,
      });
    } else if (normalizedPath === ROUTES.GROUPS) {
      applyRouteSeo({
        title: `${t('groups.metaTitle')} | ${brand}`,
        description: t('groups.stageHeroDesc'),
        canonicalPath: ROUTES.GROUPS,
        lang,
        indexable: true,
      });
    } else if (normalizedPath === ROUTES.ABOUT) {
      applyRouteSeo({
        title: `${t('about.metaTitle')} | ${brand}`,
        description: t('about.hero.description'),
        canonicalPath: ROUTES.ABOUT,
        lang,
        indexable: true,
      });
    } else if (normalizedPath.startsWith('/trips/')) {
      let active = true;
      const slug = normalizedPath.split('/')[2] || '';
      import('../widgets/trips/tripsData.js').then(({ TRIPS }) => {
        if (!active) return;
        const trip = TRIPS.find((item) => item.slug === slug);
        if (trip) {
          const tripTitle = t(`trips.items.${trip.key}.title`);
          const tripDesc = t(`trips.items.${trip.key}.desc`);
          applyRouteSeo({
            title: `${tripTitle} | ${brand}`,
            description: tripDesc,
            canonicalPath: `/trips/${slug}`,
            lang,
            indexable: true,
          });
        } else {
          applyRouteSeo({
            title: `${t('tripDetails.notFoundTitle')} | ${brand}`,
            description: t('hero.desc'),
            canonicalPath: normalizedPath,
            lang,
            indexable: false,
          });
        }
      });
      return () => {
        active = false;
      };
    } else if (HOME_ALIAS_PATHS.has(normalizedPath)) {
      applyRouteSeo({
        title: `${brand} - ${t('nav.home')}`,
        description: t('hero.desc'),
        canonicalPath: '/',
        lang,
        indexable: normalizedPath === ROUTES.HOME,
      });
    } else {
      applyRouteSeo({
        title: `${isArabic ? 'الصفحة غير موجودة (404)' : 'Page Not Found (404)'} | ${brand}`,
        description: t('hero.desc'),
        canonicalPath: normalizedPath,
        lang,
        indexable: false,
      });
    }
    return undefined;
  }, [pathname, hash, t, lang, isArabic]);

  return null;
}

// Home Page View with Invalid Hash Validation
function HomePageView({
  onSelectDestination,
  selectedDestinationFilter,
  setSelectedDestinationFilter,
}) {
  const { hash } = useLocation();

  // If hash is present on Home, check if it's invalid (e.g. /#topdksf)
  if (hash) {
    const rawTarget = hash.replace(/^#/, '').split('?')[0].split('&')[0].trim();
    // Hashes starting with '/' are handled by LegacyHashRedirect
    if (!rawTarget.startsWith('/') && !isValidSection(rawTarget)) {
      return (
        <Suspense fallback={<AboutFallback />}>
          <NotFoundPage />
        </Suspense>
      );
    }
  }

  return (
    <>
      <HeroSection />

      <StoryGallerySection />

      <LazyViewportSection id={SECTIONS.DESTINATIONS} fallback={<DestinationsFallback />}>
        <DestinationsSection
          onSelectDestination={onSelectDestination}
        />
      </LazyViewportSection>

      <LazyViewportSection id={SECTIONS.TRIPS} fallback={<TripsFallback />}>
        <TripsSection
          externalFilter={selectedDestinationFilter}
          onFilterChange={setSelectedDestinationFilter}
        />
      </LazyViewportSection>

      <div className="content-visibility-auto">
        <LazyViewportSection id="why-duck" fallback={<WhyDuckFallback />}>
        <WhyDuckSection />
      </LazyViewportSection>
      </div>

      <div className="content-visibility-auto">
        <LazyViewportSection id={SECTIONS.GROUPS} fallback={<GroupsBannerFallback />}>
        <GroupsBanner />
      </LazyViewportSection>
      </div>

      <LazyViewportSection id="map" fallback={<MapFallback />}>
        <MapSection onSelectDestination={onSelectDestination} />
      </LazyViewportSection>

      <LazyViewportSection id="reviews" fallback={<ReviewsFallback />}>
        <ReviewsSection />
      </LazyViewportSection>

      <LazyViewportSection id="faq" fallback={<FAQFallback />}>
        <FAQSection />
      </LazyViewportSection>

      <div className="content-visibility-auto">
        <LazyViewportSection id="final-cta" fallback={<FinalCtaFallback />}>
        <FinalCtaSection />
      </LazyViewportSection>
      </div>
    </>
  );
}

// Main App
export default function App() {
  const [selectedDestinationFilter, setSelectedDestinationFilter] =
    useState('all');

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Authentication Pages
  const isAuthPage = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.CREATE_ACCOUNT,
    ROUTES.AUTH,
    '/login',
    '/signup',
    '/create-account',
    '/auth',
  ].includes(pathname);
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isPortalPage = pathname.startsWith('/portal/');
  const hideMainLayout = isAuthPage || isDashboardPage || isPortalPage;

  const handleSelectDestination = (filterKey) => {
    setSelectedDestinationFilter(filterKey);

    const tripsEl = document.getElementById('trips');

    if (tripsEl) {
      tripsEl.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      navigate(sectionLink(SECTIONS.TRIPS));
    }
  };

  return (
    <div
      className={`font-body selection:bg-brand-yellow selection:text-brand-navy ${isAuthPage
        ? 'h-screen max-h-screen overflow-hidden flex flex-col'
        : 'min-h-screen flex flex-col'
        }`}
    >
      <ScrollManager />
      <LegacyHashRedirect />
      <TitleManager />

      {!hideMainLayout && <ScrollProgress />}

      {!hideMainLayout && (
        <div className="print:hidden">
          <DeferredPendingBookingPopup />
        </div>
      )}

      {!hideMainLayout && (
        <div className="print:hidden">
          <Navbar />
          <MobileBottomNav />
        </div>
      )}

      <main
        id="main"
        role="main"
        className={`flex-1 ${isAuthPage
          ? 'h-full max-h-screen overflow-hidden p-0 m-0'
          : isPortalPage
            ? 'p-0 m-0 min-h-screen'
            : isDashboardPage
              ? 'p-0 m-0'
              : 'pt-[var(--header-offset)]'
          } print:pt-0 print:m-0 print:p-0`}
      >
        <ErrorBoundary>
          <Routes>
            {/* Home Page */}
            <Route
              path={ROUTES.HOME}
              element={
                <HomePageView
                  onSelectDestination={handleSelectDestination}
                  selectedDestinationFilter={selectedDestinationFilter}
                  setSelectedDestinationFilter={setSelectedDestinationFilter}
                />
              }
            />

            {/* Public Activities Page */}
            <Route
              path={ROUTES.ACTIVITIES}
              element={
                <Suspense fallback={<AboutFallback />}>
                  <PublicActivitiesPage />
                </Suspense>
              }
            />

            {/* Activity Details */}
            <Route
              path="/activities/:slug"
              element={
                <Suspense fallback={<AboutFallback />}>
                  <ActivityDetailsPage />
                </Suspense>
              }
            />

            {/* Trip Details */}
            <Route
              path={ROUTES.TRIP_DETAILS}
              element={
                <Suspense fallback={<TripDetailsFallback />}>
                  <TripDetailsPage />
                </Suspense>
              }
            />

            {/* Groups */}
            <Route
              path={ROUTES.GROUPS}
              element={
                <Suspense fallback={<GroupsFallback />}>
                  <GroupsPage />
                </Suspense>
              }
            />

            {/* About */}
            <Route
              path={ROUTES.ABOUT}
              element={
                <Suspense fallback={<AboutFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />

            {/* Booking */}
            <Route
              path={ROUTES.BOOKING}
              element={
                <Suspense fallback={<BookingFallback />}>
                  <BookingPage />
                </Suspense>
              }
            />

            {/* Alias /booking -> /book */}
            <Route
              path="/booking"
              element={<Navigate to={ROUTES.BOOKING} replace />}
            />

            {/* Common Aliases, Slashes & Deep-Link Redirects */}
            <Route
              path="/destinations"
              element={<Navigate to="/#locations" replace />}
            />
            <Route
              path="/locations"
              element={<Navigate to="/#locations" replace />}
            />
            <Route
              path="/trips"
              element={<Navigate to="/#trips" replace />}
            />
            <Route
              path="/reviews"
              element={<Navigate to="/#reviews" replace />}
            />
            <Route
              path="/faq"
              element={<Navigate to="/#faq" replace />}
            />
            <Route
              path="/map"
              element={<Navigate to="/#map" replace />}
            />
            <Route
              path="/contact"
              element={<Navigate to="/#final-cta" replace />}
            />
            <Route
              path="/experiences"
              element={<Navigate to={ROUTES.ACTIVITIES} replace />}
            />

            {/* Public Authentication Routes */}
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

            {/* Authentication Aliases */}
            <Route
              path={ROUTES.CREATE_ACCOUNT}
              element={<Navigate to={ROUTES.SIGNUP} replace />}
            />

            <Route
              path={ROUTES.AUTH}
              element={<Navigate to={ROUTES.LOGIN} replace />}
            />

            {/* Customer Dashboard */}
            <Route
              path={ROUTES.CUSTOMER_DASHBOARD}
              element={
                <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                  <Suspense fallback={<AboutFallback />}>
                    <CustomerDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Admin Portal */}
            <Route
              path={ROUTES.ADMIN}
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <Suspense fallback={<AboutFallback />}>
                    <AdminDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Partner Portal */}
            <Route
              path={ROUTES.PARTNER}
              element={
                <ProtectedRoute allowedRoles={[ROLES.PARTNER]}>
                  <Suspense fallback={<AboutFallback />}>
                    <PartnerDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Operations Portal */}
            <Route
              path={ROUTES.OPERATIONS}
              element={
                <ProtectedRoute allowedRoles={[ROLES.OPERATIONS]}>
                  <Suspense fallback={<AboutFallback />}>
                    <OperationsDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Tour Guide / Agent Portal */}
            <Route
              path={ROUTES.TOUR_GUIDE}
              element={
                <ProtectedRoute allowedRoles={[ROLES.TOUR_GUIDE]}>
                  <Suspense fallback={<AboutFallback />}>
                    <AgentDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Content Manager Portal */}
            <Route
              path="/portal/content"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CONTENT_MANAGER, ROLES.ADMIN]}>
                  <Suspense fallback={<AboutFallback />}>
                    <ContentDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Portal Aliases (/portal/b2b -> Partner, /portal/guide -> Tour Guide) */}
            <Route
              path="/portal/b2b"
              element={
                <ProtectedRoute allowedRoles={[ROLES.PARTNER, ROLES.ADMIN]}>
                  <Suspense fallback={<AboutFallback />}>
                    <PartnerDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/guide"
              element={
                <ProtectedRoute allowedRoles={[ROLES.TOUR_GUIDE, ROLES.ADMIN]}>
                  <Suspense fallback={<AboutFallback />}>
                    <AgentDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Legal / Policy Pages */}
            <Route
              path={ROUTES.PRIVACY}
              element={
                <Suspense fallback={<AboutFallback />}>
                  <StaticInfoPage policyKey="privacy" />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.TERMS}
              element={
                <Suspense fallback={<AboutFallback />}>
                  <StaticInfoPage policyKey="terms" />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CANCELLATION}
              element={
                <Suspense fallback={<AboutFallback />}>
                  <StaticInfoPage policyKey="cancellation" />
                </Suspense>
              }
            />

            {/* 404 / Unknown Routes */}
            <Route
              path="*"
              element={
                <Suspense fallback={<AboutFallback />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Public Website Footer */}
      {!hideMainLayout && (
        <div className="print:hidden">
          <Footer />
        </div>
      )}
    </div>
  );
}