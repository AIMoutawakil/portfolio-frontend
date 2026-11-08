import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const SkillsSection = () => {
  // 1. États pour stocker les catégories depuis la base de données
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Appel à l'API au chargement du composant
  useEffect(() => {
    fetch(`${API_BASE_URL}/skills`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erreur API Skills:", err);
        setIsLoading(false);
      });
  }, []);

  // Composant réutilisable pour une catégorie de compétences
  const SkillCategory = ({ title, skills, delayOffset }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: delayOffset }}
      className="bg-secondary/20 border border-metallic/10 p-6 lg:p-8 h-full"
    >
      <h3 className="text-xl font-heading font-bold text-textMain mb-6 flex items-center">
        <span className="w-8 h-[1px] bg-accent mr-3"></span>
        {title}
      </h3>
      <div className="space-y-6">
        {/* On boucle sur les compétences de la catégorie */}
        {skills.map((skill, index) => (
          <div key={skill.id || index}>
            <div className="flex justify-between text-sm font-mono mb-2">
              <span className="text-textMuted uppercase tracking-wider">{skill.name}</span>
              {/* On utilise skill.percentage venant de MySQL */}
              <span className="text-accent">{skill.percentage}%</span>
            </div>
            {/* Barre de progression avec effet "Néon/Industriel" */}
            <div className="w-full h-1 bg-primary/50 relative overflow-hidden rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.percentage}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: delayOffset + (index * 0.1), ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_10px_rgba(56,207,240,0.5)]"
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Écran de chargement stylisé
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-accent font-mono animate-pulse">
        Chargement de la matrice de compétences...
      </div>
    );
  }

  return (
    <section id="competences" className="w-full min-h-screen flex flex-col justify-center py-20 px-6 lg:px-16 relative z-10">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* En-tête de la section */}
        <div className="flex items-center space-x-4 mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-accent font-mono text-xl lg:text-2xl"
          >
            02.
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            className="text-3xl lg:text-5xl font-heading font-bold text-textMain uppercase tracking-wider"
          >
            Matrice de Compétences
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-grow h-[1px] bg-metallic/30 origin-left ml-4"
          ></motion.div>
        </div>

        {/* Grille des compétences (Générée dynamiquement) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <SkillCategory 
              key={category.id} 
              title={category.title} 
              skills={category.skills} 
              delayOffset={0.2 + (index * 0.2)} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;