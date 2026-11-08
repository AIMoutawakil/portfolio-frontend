import { useEffect } from 'react';
import { motion } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
  useEffect(() => {
    // L'intro dure 3 secondes avant d'appeler onComplete pour afficher le site
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.2 }} // Le fondu de sortie commence à 2.2s
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-[0.15em] text-textMain mb-2 uppercase">
          Moutawakil <span className="text-accent">Imrane</span>
        </h1>
        
        {/* Ligne métallique animée (effet d'usinage/chargement) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          className="h-[2px] bg-metallic/50 my-4 max-w-md w-full"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-textMuted text-sm md:text-lg font-mono tracking-[0.2em] uppercase"
        >
          Génie Mécanique & Productique
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default IntroAnimation;