import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';


// Importations de tes composants publics
import IntroAnimation from './components/IntroAnimation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';

// ==========================================
// 1. LE SITE PUBLIC (Ton Portfolio)
// ==========================================
const PublicPortfolio = () => {
  const [showIntro, setShowIntro] = useState(true);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-primary min-h-screen text-textMain font-sans overflow-x-hidden selection:bg-accent/30 relative">
      
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col relative"
        >
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(#E9F0F7 1px, transparent 1px), linear-gradient(90deg, #E9F0F7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* BARRE DE NAVIGATION */}
            <nav className="fixed top-0 left-0 w-full py-4 px-6 lg:px-16 flex justify-between items-center z-50 bg-primary/90 backdrop-blur-md border-b border-metallic/10">              
              {/* --- NOUVEAU LOGO IMAGE --- */}
              <div onClick={() => scrollToSection('accueil')} className="cursor-pointer">
                <img 
                  src="/images/logo.png" 
                  alt="Logo Moutawakil Imrane" 
                  className="h-12 w-auto hover:scale-105 transition-transform duration-300" 
                />
              </div>

              {/* --- MENUS --- */}
              <ul className="hidden lg:flex space-x-10 text-sm font-mono tracking-widest uppercase text-textMuted">
                <li onClick={() => scrollToSection('accueil')} className="hover:text-accent transition-colors cursor-pointer">Accueil</li>
                <li onClick={() => scrollToSection('a-propos')} className="hover:text-accent transition-colors cursor-pointer">À propos</li>
                <li onClick={() => scrollToSection('competences')} className="hover:text-accent transition-colors cursor-pointer">Compétences</li>
                <li onClick={() => scrollToSection('projets')} className="hover:text-accent transition-colors cursor-pointer">Projets</li>
              </ul>

              {/* --- BOUTON CONTACT --- */}
              <button onClick={() => scrollToSection('contact')} className="hidden lg:block bg-transparent border border-accent text-accent px-6 py-2 font-mono text-sm tracking-widest uppercase hover:bg-accent hover:text-primary transition-all duration-300">
                Contact
              </button>
            </nav>

          {/* SECTIONS */}
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </motion.div>
      )}
    </div>
  );
};

// ==========================================
// 3. LE ROUTEUR PRINCIPAL
// ==========================================
function App() {
  return (
    <Router>
      <Routes>
        {/* Route par défaut : Le site web */}
        <Route path="/" element={<PublicPortfolio />} />
        
        {/* Route Admin : L'espace de gestion */}
        {/* L'ESPACE ADMIN */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;