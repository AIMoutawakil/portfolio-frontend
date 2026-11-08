import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Enregistre un "jeton" temporaire dans le navigateur
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || "Identifiants incorrects !");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(#E9F0F7 1px, transparent 1px), linear-gradient(90deg, #E9F0F7 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-secondary/50 border border-metallic/30 p-8 relative z-10 shadow-2xl backdrop-blur-sm"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-textMain tracking-wider">
            ACCÈS <span className="text-accent">SÉCURISÉ</span>
          </h2>
          <p className="text-textMuted font-mono text-sm mt-2 uppercase tracking-widest">Panneau d'administration</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-textMuted font-mono text-xs tracking-widest uppercase">Identifiant</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-metallic/50">
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-primary border border-metallic/30 text-textMain pl-12 pr-4 py-3 focus:outline-none focus:border-accent transition-colors font-sans"
                placeholder="Nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-textMuted font-mono text-xs tracking-widest uppercase">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-metallic/50">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-primary border border-metallic/30 text-textMain pl-12 pr-4 py-3 focus:outline-none focus:border-accent transition-colors font-sans"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Affichage des erreurs avec animation */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 text-sm font-mono"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isLoading}
            className="group w-full flex items-center justify-center space-x-3 bg-accent text-primary px-8 py-4 font-bold tracking-wide hover:bg-accent/90 transition-all duration-300 mt-8 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <span>Déverrouiller l'accès</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;