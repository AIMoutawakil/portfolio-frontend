import { useState, useEffect } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const AboutTab = () => {
  const [aboutData, setAboutData] = useState({
    about_text_1: '', about_text_2: '', tools_list: '', 
    skill_1_title: '', skill_1_desc: '', skill_2_title: '', skill_2_desc: '', skill_3_title: '', skill_3_desc: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/about`)
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(err => console.error(err));
  }, []);

  const handleAboutSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    fetch(`${API_BASE_URL}/about`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aboutData)
    })
    .then(() => {
      setIsSaving(false);
      alert("Profil Technique mis à jour avec succès !");
    })
    .catch(err => { console.error(err); setIsSaving(false); });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="mb-10 flex justify-between items-center border-b border-metallic/20 pb-6">
        <h1 className="text-3xl font-heading font-bold flex items-center">
          <User className="mr-4 text-accent" size={32} /> Profil Technique
        </h1>
      </header>

      <form onSubmit={handleAboutSubmit} className="space-y-10">
        
        {/* Textes d'introduction et Outils */}
        <div className="bg-secondary/20 border border-metallic/20 p-8 space-y-6">
          <h3 className="text-xl font-heading font-bold text-textMain border-b border-metallic/20 pb-4">Présentation & Outils</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-textMuted font-mono text-xs uppercase tracking-widest underline decoration-yellow-400 underline-offset-4">Paragraphe 1 (Introduction)</label>
              <textarea rows="3" value={aboutData.about_text_1 || ''} onChange={(e) => setAboutData({...aboutData, about_text_1: e.target.value})} className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none resize-none"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Paragraphe 2 (Approche)</label>
              <textarea rows="2" value={aboutData.about_text_2 || ''} onChange={(e) => setAboutData({...aboutData, about_text_2: e.target.value})} className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none resize-none"></textarea>
            </div>
            <div className="space-y-2 pt-4 border-t border-metallic/10">
              <label className="text-textMuted font-mono text-xs uppercase tracking-widest text-accent underline decoration-yellow-400 underline-offset-4">Outils & Logiciels (séparés par des virgules)</label>
              <input type="text" value={aboutData.tools_list || ''} onChange={(e) => setAboutData({...aboutData, tools_list: e.target.value})} placeholder="Ex: Solidworks, Mastercam, Python, AutoCAD" className="w-full bg-primary border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none font-mono text-sm" />
            </div>
          </div>
        </div>

        {/* Les 3 Blocs de Compétences */}
        <div className="bg-secondary/20 border border-metallic/20 p-8 space-y-6">
          <h3 className="text-xl font-heading font-bold text-textMain border-b border-metallic/20 pb-4">Domaines d'Expertise</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bloc Compétence 1 */}
            <div className="space-y-4 p-5 border border-metallic/30 bg-primary/50">
              <h4 className="text-accent font-mono text-sm tracking-widest uppercase">Bloc 1</h4>
              <div className="space-y-2">
                <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Titre</label>
                <input type="text" value={aboutData.skill_1_title || ''} onChange={(e) => setAboutData({...aboutData, skill_1_title: e.target.value})} className="w-full bg-secondary/50 border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Description</label>
                <textarea rows="4" value={aboutData.skill_1_desc || ''} onChange={(e) => setAboutData({...aboutData, skill_1_desc: e.target.value})} className="w-full bg-secondary/50 border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none resize-none"></textarea>
              </div>
            </div>

            {/* Bloc Compétence 2 */}
            <div className="space-y-4 p-5 border border-metallic/30 bg-primary/50">
              <h4 className="text-accent font-mono text-sm tracking-widest uppercase">Bloc 2</h4>
              <div className="space-y-2">
                <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Titre</label>
                <input type="text" value={aboutData.skill_2_title || ''} onChange={(e) => setAboutData({...aboutData, skill_2_title: e.target.value})} className="w-full bg-secondary/50 border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Description</label>
                <textarea rows="4" value={aboutData.skill_2_desc || ''} onChange={(e) => setAboutData({...aboutData, skill_2_desc: e.target.value})} className="w-full bg-secondary/50 border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none resize-none"></textarea>
              </div>
            </div>

            {/* Bloc Compétence 3 */}
            <div className="space-y-4 p-5 border border-metallic/30 bg-primary/50">
              <h4 className="text-accent font-mono text-sm tracking-widest uppercase">Bloc 3</h4>
              <div className="space-y-2">
                <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Titre</label>
                <input type="text" value={aboutData.skill_3_title || ''} onChange={(e) => setAboutData({...aboutData, skill_3_title: e.target.value})} className="w-full bg-secondary/50 border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-textMuted font-mono text-xs uppercase tracking-widest">Description</label>
                <textarea rows="4" value={aboutData.skill_3_desc || ''} onChange={(e) => setAboutData({...aboutData, skill_3_desc: e.target.value})} className="w-full bg-secondary/50 border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center space-x-2 bg-accent text-primary px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isSaving ? 'Sauvegarde...' : 'Enregistrer le Profil'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AboutTab;