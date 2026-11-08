import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Settings, Cpu } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const AboutSection = () => {
  // 1. État pour stocker les données dynamiques
  const [aboutData, setAboutData] = useState(null);

  // 2. Récupération des données au chargement de la page
  useEffect(() => {
    fetch(`${API_BASE_URL}/about`)
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(err => console.error("Erreur API About:", err));
  }, []);

  // Animation pour l'apparition en cascade des cartes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Affichage d'un loader stylisé le temps que les données arrivent
  if (!aboutData) {
    return <div className="min-h-screen bg-primary flex items-center justify-center text-accent font-mono animate-pulse">Chargement de la section...</div>;
  }

  // Transformation de la liste d'outils (texte avec virgules) en tableau
  const toolsList = aboutData.tools_list 
    ? aboutData.tools_list.split(',').map(tool => tool.trim()).filter(tool => tool !== '')
    : [];

  return (
    <section id="a-propos" className="w-full min-h-screen flex items-center justify-center py-20 px-6 lg:px-16 relative z-10">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* En-tête de la section */}
        <div className="flex items-center space-x-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-accent font-mono text-xl lg:text-2xl"
          >
            01.
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-3xl lg:text-5xl font-heading font-bold text-textMain uppercase tracking-wider"
          >
            Profil Technique
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-grow h-[1px] bg-metallic/30 origin-left ml-4 max-w-[300px]"
          ></motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Colonne Gauche : Texte de présentation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6 text-textMuted text-lg leading-relaxed"
          >
            {/* Les textes utilisent whitespace-pre-wrap pour respecter les sauts de ligne tapés dans l'admin */}
            <p className="whitespace-pre-wrap break-words text-justify">
              {aboutData.about_text_1}
            </p>
            <p className="whitespace-pre-wrap break-words text-justify">
              {aboutData.about_text_2}
            </p>
            
            {/* Liste des logiciels façon interface technique */}
            <div className="pt-6">
              <h3 className="text-textMain font-mono text-sm tracking-widest uppercase mb-4 flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></div>
                Outils & Logiciels maîtrisés
              </h3>
              <ul className="grid grid-cols-2 gap-3 font-mono text-sm">
                {/* Boucle sur les outils récupérés depuis MySQL */}
                {toolsList.map((tool, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-accent mt-1">▹</span> 
                    <span className="break-words">{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Colonne Droite : Cartes dynamiques */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="w-full lg:w-1/2 flex flex-col gap-6"
          >
            {/* Carte 1 */}
            <motion.div variants={itemVariants} className="group relative bg-secondary/30 border border-metallic/20 p-6 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary border border-metallic/20 text-accent group-hover:shadow-[0_0_15px_rgba(56,207,240,0.3)] transition-shadow">
                  <PenTool size={24} />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xl font-heading font-bold text-textMain mb-2 group-hover:text-accent transition-colors truncate">{aboutData.skill_1_title}</h4>
                  <p className="text-sm text-textMuted whitespace-pre-wrap break-words">{aboutData.skill_1_desc}</p>
                </div>
              </div>
            </motion.div>

            {/* Carte 2 */}
            <motion.div variants={itemVariants} className="group relative bg-secondary/30 border border-metallic/20 p-6 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary border border-metallic/20 text-accent group-hover:shadow-[0_0_15px_rgba(56,207,240,0.3)] transition-shadow">
                  <Settings size={24} />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xl font-heading font-bold text-textMain mb-2 group-hover:text-accent transition-colors truncate">{aboutData.skill_2_title}</h4>
                  <p className="text-sm text-textMuted whitespace-pre-wrap break-words">{aboutData.skill_2_desc}</p>
                </div>
              </div>
            </motion.div>

            {/* Carte 3 */}
            <motion.div variants={itemVariants} className="group relative bg-secondary/30 border border-metallic/20 p-6 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary border border-metallic/20 text-accent group-hover:shadow-[0_0_15px_rgba(56,207,240,0.3)] transition-shadow">
                  <Cpu size={24} />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xl font-heading font-bold text-textMain mb-2 group-hover:text-accent transition-colors truncate">{aboutData.skill_3_title}</h4>
                  <p className="text-sm text-textMuted whitespace-pre-wrap break-words">{aboutData.skill_3_desc}</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;