import Navbar from '../widgets/navbar/Navbar.jsx';
import HeroSection from '../widgets/hero/HeroSection.jsx';
import DestinationsSection from '../widgets/destinations/index.js';
import Footer from '../widgets/footer/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar />
      <main id="main" className="flex-1 pt-[52px] min-[901px]:pt-[100px]">
        <HeroSection />
        <DestinationsSection />
      </main>
      <Footer />
    </div>
  );
}
