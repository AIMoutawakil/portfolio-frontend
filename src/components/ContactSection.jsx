import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Mail,
  MapPin,
  Send,
  Globe,
  Loader2
} from 'lucide-react';

import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter
} from 'react-icons/fa';

// --- CONFIGURATION DYNAMIQUE DES URLs ---
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const API_URL = `${API_BASE_URL}/settings`;
const MESSAGES_API_URL = `${API_BASE_URL}/messages`;

// Compatibilité avec les anciens liens
const detectOldPlatform = (url = '') => {
  const value = url.toLowerCase();
  if (value.includes('github.com')) return 'github';
  if (value.includes('linkedin.com')) return 'linkedin';
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube';
  if (value.includes('facebook.com')) return 'facebook';
  if (value.includes('instagram.com')) return 'instagram';
  if (value.includes('twitter.com') || value.includes('x.com')) return 'twitter';
  return 'website';
};

// Icône selon la plateforme choisie
const getSocialIcon = (platform) => {
  switch (platform) {
    case 'github': return <FaGithub size={24} />;
    case 'linkedin': return <FaLinkedin size={24} />;
    case 'youtube': return <FaYoutube size={24} />;
    case 'facebook': return <FaFacebook size={24} />;
    case 'instagram': return <FaInstagram size={24} />;
    case 'twitter': return <FaTwitter size={24} />;
    default: return <Globe size={24} />;
  }
};

const ContactSection = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- ÉTATS POUR LE FORMULAIRE ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Récupérer les paramètres
  useEffect(() => {
    const controller = new AbortController();

    const fetchSettings = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Erreur lors du chargement des paramètres');
        
        const data = await response.json();
        const socialLinks = Array.isArray(data.social_links)
          ? data.social_links.map(link => {
              if (typeof link === 'string') {
                return { platform: detectOldPlatform(link), url: link };
              }
              return { platform: link.platform || 'website', url: link.url || '' };
            })
          : [];

        setSettingsData({ ...data, social_links: socialLinks });
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Erreur:', err);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchSettings();
    return () => controller.abort();
  }, []);

  // --- GESTION DE L'ENVOI DU MESSAGE ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(MESSAGES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' }); // On vide le formulaire
      
      // On efface le message de succès après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="w-full min-h-screen flex flex-col justify-center py-20 px-6 lg:px-16 relative z-10 bg-primary border-t border-metallic/10">
      <div className="max-w-[1400px] mx-auto w-full flex-grow flex flex-col justify-center">

        {/* Titre */}
        <div className="flex items-center space-x-4 mb-16">
          <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.8 }} className="text-accent font-mono text-xl lg:text-2xl">
            04.
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} className="text-3xl lg:text-5xl font-heading font-bold text-textMain uppercase tracking-wider">
            Contact & Collaboration
          </motion.h2>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1, delay: 0.2 }} className="flex-grow h-[1px] bg-metallic/30 origin-left ml-4" />
        </div>

        {/* Chargement */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-accent w-10 h-10" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Informations de contact */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2 space-y-8">
              <h3 className="text-2xl font-heading font-bold text-textMain">
                Démarrons un projet ensemble.
              </h3>
              <p className="text-textMuted text-lg leading-relaxed">
                Actuellement à la recherche de nouvelles opportunités en bureau d'études, conception CAO ou méthodes d'industrialisation. Que ce soit pour une question, un projet ou une offre, ma boîte de réception est ouverte.
              </p>

              {/* Email et localisation */}
              <div className="space-y-6 pt-4 font-mono">
                <a href={settingsData?.contact_email ? `mailto:${settingsData.contact_email}` : undefined} className="flex items-center space-x-4 text-textMuted hover:text-accent transition-colors">
                  <div className="p-3 bg-secondary/50 border border-metallic/20 text-accent">
                    <Mail size={20} />
                  </div>
                  <span>{settingsData?.contact_email || 'Email non renseigné'}</span>
                </a>

                <div className="flex items-center space-x-4 text-textMuted hover:text-accent transition-colors">
                  <div className="p-3 bg-secondary/50 border border-metallic/20 text-accent">
                    <MapPin size={20} />
                  </div>
                  <span>{settingsData?.contact_location || 'Localisation non renseignée'}</span>
                </div>
              </div>

              {/* Réseaux sociaux avec icônes personnalisées */}
              <div className="flex flex-wrap gap-4 pt-4">
                {settingsData?.social_links?.filter(link => link.url).map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform} title={link.platform} className="p-4 bg-secondary/50 border border-metallic/20 text-textMuted hover:text-accent hover:border-accent hover:-translate-y-1 transition-all duration-300">
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Formulaire de contact Dynamique */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full lg:w-1/2">
              <form onSubmit={handleSendMessage} className="bg-secondary/20 border border-metallic/20 p-8 flex flex-col space-y-6">
                
                <div className="flex flex-col space-y-2">
                  <label className="text-textMuted font-mono text-sm tracking-widest uppercase">Nom complet</label>
                  <input 
                    type="text" required
                    spellCheck={false}
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:outline-none focus:border-accent transition-colors font-sans"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-textMuted font-mono text-sm tracking-widest uppercase">Adresse Email</label>
                  <input 
                    type="email" required
                    spellCheck={false}
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:outline-none focus:border-accent transition-colors font-sans"
                    placeholder="jean.dupont@entreprise.com"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-textMuted font-mono text-sm tracking-widest uppercase">Message</label>
                  <textarea 
                    rows="5" required
                    spellCheck={false}
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:outline-none focus:border-accent transition-colors font-sans resize-none"
                    placeholder="Détaillez votre projet ou votre offre ici..."
                  ></textarea>
                </div>

                <button 
                  type="submit" disabled={isSending}
                  className="group flex items-center justify-center space-x-3 bg-accent text-primary px-8 py-4 font-bold tracking-wide hover:bg-accent/90 transition-all duration-300 w-full lg:w-auto self-start mt-4 disabled:opacity-50"
                >
                  <span>{isSending ? 'Envoi en cours...' : 'Transmettre le message'}</span>
                  {!isSending && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>

                {/* Retours utilisateur */}
                {submitStatus === 'success' && (
                  <p className="text-green-400 font-mono text-sm mt-4">✓ Message envoyé avec succès ! Je vous répondrai très vite.</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 font-mono text-sm mt-4">❌ Une erreur est survenue, veuillez réessayer.</p>
                )}
              </form>
            </motion.div>

          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;