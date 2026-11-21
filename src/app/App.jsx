import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../widgets/navbar/Navbar.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import DestinationsSection from '../widgets/destinations/index.js';
import TripsSection from '../widgets/trips/index.js';
import ReviewsSection from '../widgets/reviews/index.js';
import FAQSection from '../widgets/faq/index.js';
import Footer from '../widgets/footer/Footer.jsx';
import { ROUTES, sectionLink, SECTIONS } from '../shared/config/routes.js';
import { useTranslation } from '../shared/i18n/index.js';

const GroupsPage = lazy(() => import('../widgets/groups-page/index.js'));

function GroupsFallback() {
  return (
    <div
      className="w-full bg-brand-navy min-h-[520px] h-[min(80vh,660px)] flex items-center justify-center text-white/50"
      aria-busy="true"
    >
      <div className="w-10 h-10 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
    </div>
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

      const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // Slight delay to allow DOM render if switching pages
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
    if (pathname === ROUTES.GROUPS) {
      document.title = `${t('groups.metaTitle')} | ${t('common.brandName')}`;
    } else {
      document.title = `${t('common.brandName')} - ${t('nav.home')}`;
    }
  }, [pathname, t]);

  return null;
}

export default function App() {
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('all');
  const navigate = useNavigate();

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
      <div className="print:hidden">
        <Navbar />
      </div>
      <main id="main" className="flex-1 pt-[52px] min-[901px]:pt-[100px] print:pt-0 print:m-0 print:p-0">
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <>
                <HeroSection />
                <DestinationsSection onSelectDestination={handleSelectDestination} />
                <TripsSection
                  externalFilter={selectedDestinationFilter}
                  onFilterChange={setSelectedDestinationFilter}
                />
                <ReviewsSection />
                <FAQSection />
              </>
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
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
