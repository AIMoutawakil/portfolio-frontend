import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const HeroSection = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Si les données ne sont pas encore chargées, on peut afficher un état de chargement ou rien
  if (!settings) return <div className="min-h-screen"></div>;

  return (
    <main
      id="accueil"
      className="flex-grow flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 relative z-10 max-w-[1400px] mx-auto w-full"
    >
      {/* COLONNE GAUCHE : TEXTES */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 pt-10 lg:pt-0 z-20">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-textMuted text-xl md:text-2xl font-heading"
        >
          {settings.hero_greeting} {' '}
          <span className="text-accent font-bold">
            {settings.hero_name}
          </span>
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-textMain"
        >
          {settings.hero_title.split('&')[0]} <br />
          {settings.hero_title.includes('&') && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-metallic">
              & {settings.hero_title.split('&')[1]}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-textMuted text-lg max-w-lg leading-relaxed pt-2"
        >
          {settings.hero_description}
        </motion.p>

        {/* BOUTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          <button
            onClick={() => scrollToSection('projets')}
            className="bg-accent text-primary px-8 py-4 font-bold font-sans tracking-wide hover:bg-accent/90 transition-colors"
          >
            Explorer mes projets
          </button>

          {/* Bouton de téléchargement du CV lié à la BDD */}
          <a
            href={settings.cv_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-secondary border border-metallic/30 text-textMain px-8 py-4 font-bold font-sans tracking-wide hover:bg-secondary/50 hover:border-metallic transition-colors"
          >
            Télécharger mon CV
          </a>
        </motion.div>
      </div>

      {/* COLONNE DROITE : PHOTO DE PROFIL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full lg:w-1/2 h-[450px] lg:h-[650px] relative flex justify-center items-center mt-12 lg:mt-0"
      >
        <div className="relative w-[320px] h-[320px] lg:w-[480px] lg:h-[480px] bg-secondary/40 rounded-full border border-metallic/20 flex items-center justify-center overflow-hidden z-10">
          <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-accent/30 animate-[spin_40s_linear_infinite] z-0" />
          <img
            src="/images/profilee.png"
            alt={settings.hero_name}
            className="relative z-10 w-[105%] lg:w-[100%] h-auto object-contain translate-y-[20px]"
          />
        </div>
      </motion.div>
    </main>
  );
};

export default HeroSection;