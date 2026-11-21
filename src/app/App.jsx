import { useEffect, useState } from 'react';
import Navbar from '../widgets/navbar/Navbar.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import DestinationsSection from '../widgets/destinations/index.js';
import Footer from '../widgets/footer/Footer.jsx';
import AboutPage from '../pages/static/about';

const getPath = () => {
  if (window.location.hash === '#/about') return '/about';
  return window.location.pathname.replace(/\/$/, '') || '/';
};

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash === '#/about') {
        window.history.replaceState(null, '', '/about');
      }
      setPath(getPath());
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAboutPage = path === '/about';

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar />
      <main id="main" className="flex-1 pt-[52px] min-[901px]:pt-[100px]">
        {isAboutPage ? (
          <AboutPage />
        ) : (
          <>
            <HeroSection />
            <DestinationsSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
