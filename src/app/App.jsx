import Navbar from '../widgets/navbar/Navbar.jsx';
import Footer from '../widgets/footer/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main id="main" className="flex-1 pt-[98px] min-[901px]:pt-[100px]">
        {/* Placeholder for Hero and middle landing page sections */}
      </main>
      <Footer />
    </div>
  );
}
