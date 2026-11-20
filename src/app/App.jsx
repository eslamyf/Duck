import Navbar from '../widgets/navbar/Navbar.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main id="main" className="flex-1 pt-[100px]">
        {/* Sections will be mounted here */}
      </main>
    </div>
  );
}
