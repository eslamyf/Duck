import { useState } from 'react';
import Navbar from '../widgets/navbar/Navbar.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import DestinationsSection from '../widgets/destinations/index.js';
import TripsSection from '../widgets/trips/index.js';
import Footer from '../widgets/footer/Footer.jsx';

export default function App() {
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState('all');

  const handleSelectDestination = (filterKey) => {
    setSelectedDestinationFilter(filterKey);
    const tripsEl = document.getElementById('trips');
    if (tripsEl) {
      tripsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar />
      <main id="main" className="flex-1 pt-[52px] min-[901px]:pt-[100px]">
        <HeroSection />
        <DestinationsSection onSelectDestination={handleSelectDestination} />
        <TripsSection
          externalFilter={selectedDestinationFilter}
          onFilterChange={setSelectedDestinationFilter}
        />
      </main>
      <Footer />
    </div>
  );
}
