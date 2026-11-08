import { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2, Loader2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const SkillsTab = () => {
  // L'état 'categories' sert maintenant de BROUILLON local
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [newCatTitle, setNewCatTitle] = useState('');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 50 });

  // Récupérer les données initiales au chargement
  useEffect(() => {
    fetch(`${API_BASE_URL}/skills`)
      .then(res => res.json())
      .then(data => { setCategories(data); setIsLoading(false); })
      .catch(err => { console.error(err); setIsLoading(false); });
  }, []);

  // --- ACTIONS LOCALES (Brouillon en mémoire) ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;
    
    // On ajoute localement (Date.now() sert d'ID temporaire)
    setCategories([...categories, { id: Date.now(), title: newCatTitle, skills: [] }]);
    setNewCatTitle('');
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Supprimer cette catégorie ? (Attention, n'oubliez pas d'enregistrer après)")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleOpenAddSkill = (categoryId) => {
    setActiveCategoryId(categoryId);
    setNewSkill({ name: '', percentage: 50 });
    setIsSkillModalOpen(true);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    // On ajoute la compétence localement dans la bonne catégorie
    setCategories(categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { 
          ...cat, 
          skills: [...cat.skills, { id: Date.now(), name: newSkill.name, percentage: newSkill.percentage }] 
        };
      }
      return cat;
    }));
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = (categoryId, skillId) => {
    // On supprime la compétence localement
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, skills: cat.skills.filter(s => s.id !== skillId) };
      }
      return cat;
    }));
  };

  // --- SAUVEGARDE VERS LA BASE DE DONNÉES ---
  const handleGlobalSave = () => {
    setIsSaving(true);
    // On envoie tout notre "brouillon" au serveur d'un seul coup
    fetch(`${API_BASE_URL}/skills/bulk`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories })
    })
    .then(res => res.json())
    .then(data => {
      setIsSaving(false);
      alert("✅ Les modifications ont été publiées sur votre site !");
    })
    .catch(err => {
      console.error(err);
      setIsSaving(false);
      alert("❌ Une erreur est survenue lors de la sauvegarde.");
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      <header className="mb-10 flex justify-between items-center border-b border-metallic/20 pb-6">
        <h1 className="text-3xl font-heading font-bold flex items-center">
          <Wrench className="mr-4 text-accent" size={32} /> Matrice de Compétences
        </h1>
      </header>

      {/* Formulaire d'ajout de catégorie */}
      <form onSubmit={handleAddCategory} className="mb-8 flex space-x-4 bg-secondary/20 p-4 border border-metallic/20">
        <input 
          type="text" required
          value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)}
          placeholder="Nouvelle Catégorie (ex: Logiciels de Simulation...)" 
          className="flex-grow bg-primary border border-metallic/30 px-4 py-2 text-textMain focus:border-accent outline-none"
        />
        <button type="submit" className="bg-accent text-primary px-6 py-2 font-bold flex items-center space-x-2 hover:bg-accent/90 transition-colors">
          <Plus size={18} /> <span>Ajouter Catégorie</span>
        </button>
      </form>

      {/* Affichage des Catégories */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="border border-metallic/20 bg-secondary/10 flex flex-col h-full">
              
              <div className="p-4 border-b border-metallic/20 bg-secondary/30 flex justify-between items-center">
                <h3 className="font-heading font-bold text-accent">{category.title}</h3>
                <button type="button" onClick={() => handleDeleteCategory(category.id)} className="text-textMuted hover:text-red-400 p-1">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 flex-grow space-y-4">
                {category.skills.length === 0 ? (
                  <p className="text-xs text-textMuted font-mono italic">Aucune compétence</p>
                ) : (
                  category.skills.map((skill) => (
                    <div key={skill.id} className="group relative">
                      <div className="flex justify-between text-xs font-mono uppercase mb-1">
                        <span>{skill.name}</span>
                        <span className="text-accent">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-primary h-1">
                        <div className="bg-accent h-1" style={{ width: `${skill.percentage}%` }}></div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleDeleteSkill(category.id, skill.id)}
                        className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity bg-primary rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-metallic/10">
                <button 
                  type="button"
                  onClick={() => handleOpenAddSkill(category.id)}
                  className="w-full py-2 border border-dashed border-metallic/30 text-textMuted font-mono text-xs uppercase hover:border-accent hover:text-accent flex justify-center items-center space-x-2 transition-colors"
                >
                  <Plus size={14} /> <span>Ajouter Compétence</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOUTON ENREGISTRER (Envoie les données au serveur) */}
      <div className="mt-12 flex justify-end">
        <button 
          type="button"
          onClick={handleGlobalSave} 
          disabled={isSaving} 
          className="flex items-center space-x-2 bg-accent text-primary px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isSaving ? 'Sauvegarde en cours...' : 'Enregistrer et Publier'}</span>
        </button>
      </div>

      {/* MODALE POUR AJOUTER UNE COMPÉTENCE */}
      <AnimatePresence>
        {isSkillModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-primary border border-metallic/30 w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-metallic/20 bg-secondary/30">
                <h3 className="font-heading font-bold text-textMain">Nouvelle Compétence</h3>
                <button type="button" onClick={() => setIsSkillModalOpen(false)} className="text-textMuted hover:text-accent transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleAddSkill} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Nom de la compétence</label>
                  <input type="text" required value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="Ex: Python, AutoCAD..." className="w-full bg-secondary/20 border border-metallic/30 text-textMain px-4 py-2 focus:border-accent outline-none uppercase font-mono text-sm" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-textMuted font-mono text-xs uppercase tracking-widest flex justify-between">
                    <span>Niveau de maîtrise</span>
                    <span className="text-accent font-bold">{newSkill.percentage}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={newSkill.percentage} onChange={(e) => setNewSkill({...newSkill, percentage: e.target.value})} className="w-full accent-accent cursor-pointer" />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-metallic/20">
                  <button type="button" onClick={() => setIsSkillModalOpen(false)} className="px-4 py-2 font-mono text-sm uppercase text-textMuted hover:text-textMain transition-colors">Annuler</button>
                  <button type="submit" className="bg-accent text-primary px-6 py-2 font-mono text-sm font-bold uppercase hover:bg-accent/90 transition-colors">Ajouter au brouillon</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SkillsTab;