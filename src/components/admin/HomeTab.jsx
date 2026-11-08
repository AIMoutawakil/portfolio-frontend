import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const HomeTab = () => {
  const [settings, setSettings] = useState({
    hero_greeting: '', hero_name: '', hero_title: '', hero_description: '',
    about_text_1: '', about_text_2: '', contact_email: '', contact_location: '', cv_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  // FONCTION POUR UPLOADER LE FICHIER VERS NODE.JS
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv_file', file);

    setIsUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/upload-cv`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.cv_url) {
        // Met à jour l'URL dans l'état
        setSettings({ ...settings, cv_url: data.cv_url });
        alert("✅ Fichier téléchargé ! N'oublie pas de cliquer sur 'Enregistrer les Paramètres' en bas.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'envoi du fichier.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    .then(() => {
      setIsSaving(false);
      alert("Paramètres mis à jour avec succès !");
    })
    .catch(err => { console.error(err); setIsSaving(false); });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mb-10 flex justify-between items-center border-b border-metallic/20 pb-6">
        <h1 className="text-3xl font-heading font-bold flex items-center">
          <Settings className="mr-4 text-accent" size={32} /> Configuration du Site
        </h1>
      </header>

      <form onSubmit={handleSettingsSubmit} className="space-y-10">
        
        {/* Section Accueil */}
        <div className="bg-secondary/20 border border-metallic/20 p-8 space-y-6">
          <h3 className="text-xl font-heading font-bold text-textMain border-b border-metallic/20 pb-4">Section Accueil (Hero)</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Salutation</label>
              <input type="text" value={settings.hero_greeting || ''} onChange={(e) => setSettings({...settings, hero_greeting: e.target.value})} className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Nom affiché</label>
              <input type="text" value={settings.hero_name || ''} onChange={(e) => setSettings({...settings, hero_name: e.target.value})} className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Titre principal (Gros texte)</label>
            <input type="text" value={settings.hero_title || ''} onChange={(e) => setSettings({...settings, hero_title: e.target.value})} className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Description Courte</label>
            <textarea rows="3" value={settings.hero_description || ''} onChange={(e) => setSettings({...settings, hero_description: e.target.value})} className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none resize-none"></textarea>
          </div>

          {/* NOUVEAU BOUTON D'UPLOAD DU CV */}
          <div className="space-y-2 pt-4 border-t border-metallic/20">
            <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Fichier CV (PDF)</label>
            
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center space-x-2 bg-secondary border border-metallic/30 px-6 py-3 hover:border-accent hover:text-accent transition-colors font-mono text-sm">
                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                <span>{isUploading ? "Envoi en cours..." : "Parcourir mon PC..."}</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {/* Affiche le lien actuel du CV s'il existe */}
              {settings.cv_url && (
                <a href={settings.cv_url} target="_blank" rel="noreferrer" className="text-xs text-accent font-mono hover:underline truncate max-w-xs">
                  Fichier actuel : {settings.cv_url.split('/').pop()}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center space-x-2 bg-accent text-primary px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isSaving ? 'Sauvegarde...' : 'Enregistrer les Paramètres'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HomeTab;