import { useState, useEffect } from 'react';
import Navbar from '../widgets/navbar/Navbar.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import DestinationsSection from '../widgets/destinations/index.js';
import TripsSection from '../widgets/trips/index.js';
import GroupsPage from '../widgets/groups-page/index.js';
import Footer from '../widgets/footer/Footer.jsx';

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '');
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('all');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      setCurrentHash(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isGroupsPage = currentHash === '#/groups';

  useEffect(() => {
    if (isGroupsPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentHash && currentHash.startsWith('#') && currentHash !== '#/') {
      const targetId = currentHash.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentHash, isGroupsPage]);

  const handleSelectDestination = (filterKey) => {
    setSelectedDestinationFilter(filterKey);
    const tripsEl = document.getElementById('trips');
    if (tripsEl) {
      tripsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar />
      <main id="main" className="flex-1 pt-[52px] min-[901px]:pt-[100px]">
        {isGroupsPage ? (
          <GroupsPage onNavigateHome={handleNavigateHome} />
        ) : (
          <>
            <HeroSection />
            <DestinationsSection onSelectDestination={handleSelectDestination} />
            <TripsSection
              externalFilter={selectedDestinationFilter}
              onFilterChange={setSelectedDestinationFilter}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
