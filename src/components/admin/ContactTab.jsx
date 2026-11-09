import { useState, useEffect } from 'react';
import { Trash2, Mail, User, Clock, Loader2, MessageSquare, Save, Plus, Settings, Inbox } from 'lucide-react';

const ContactTab = () => {
  // --- ÉTATS GLOBAUX ---
  const [activeView, setActiveView] = useState('inbox'); // 'inbox' ou 'settings'
  const [isLoading, setIsLoading] = useState(true);

  // --- ÉTATS MESSAGES ---
  const [messages, setMessages] = useState([]);

  // --- ÉTATS PARAMÈTRES ---
  const [settings, setSettings] = useState({
    contact_description: '', contact_email: '', contact_location: '', social_links: []
  });
  const [isSaving, setIsSaving] = useState(false);

  const MESSAGES_API_URL = `${import.meta.env.VITE_API_URL}/api/messages`;
  const SETTINGS_API_URL = `${import.meta.env.VITE_API_URL}/api/settings`;

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les messages
        const msgRes = await fetch(MESSAGES_API_URL);
        if (msgRes.ok) setMessages(await msgRes.json());

        // Charger les paramètres
        const setRes = await fetch(SETTINGS_API_URL);
        if (setRes.ok) {
          const data = await setRes.json();
          setSettings({
            ...data,
            social_links: Array.isArray(data.social_links) ? data.social_links : []
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- GESTION DES MESSAGES ---
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      const res = await fetch(`${MESSAGES_API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      alert("Erreur de suppression");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  // --- GESTION DES PARAMÈTRES ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch(SETTINGS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Paramètres de contact mis à jour avec succès !");
    } catch (error) {
      alert("Erreur de sauvegarde");
    }
    setIsSaving(false);
  };

  const addSocialLink = () => {
    setSettings({ ...settings, social_links: [...settings.social_links, { platform: 'linkedin', url: '' }] });
  };
  const updateSocialLink = (index, field, value) => {
    const newLinks = [...settings.social_links];
    newLinks[index][field] = value;
    setSettings({ ...settings, social_links: newLinks });
  };
  const removeSocialLink = (index) => {
    setSettings({ ...settings, social_links: settings.social_links.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-accent w-10 h-10" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER ET MENU DE NAVIGATION INTERNE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-metallic/20 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-textMain uppercase tracking-wider font-heading">
            Gestion des Contacts
          </h2>
          <p className="text-textMuted mt-1">Consultez vos messages et modifiez les informations de contact.</p>
        </div>

        <div className="flex bg-secondary/50 p-1 border border-metallic/20 rounded-lg">
          <button 
            onClick={() => setActiveView('inbox')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-mono text-sm transition-all ${activeView === 'inbox' ? 'bg-accent text-primary font-bold' : 'text-textMuted hover:text-textMain'}`}
          >
            <Inbox size={16} /> Boîte de réception
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-mono text-sm transition-all ${activeView === 'settings' ? 'bg-accent text-primary font-bold' : 'text-textMuted hover:text-textMain'}`}
          >
            <Settings size={16} /> Paramètres
          </button>
        </div>
      </div>

      {/* VUE 1 : BOÎTE DE RÉCEPTION */}
      {activeView === 'inbox' && (
        <div className="space-y-6">
          <div className="text-right text-accent font-mono text-sm">
            {messages.length} message(s) reçu(s)
          </div>
          
          {messages.length === 0 ? (
            <div className="bg-secondary/20 border border-metallic/20 p-12 text-center rounded-lg">
              <MessageSquare className="mx-auto w-12 h-12 text-textMuted mb-4 opacity-50" />
              <p className="text-textMuted text-lg">Aucun message pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-secondary/20 border border-metallic/20 p-6 rounded-lg relative group transition-all hover:border-metallic/40">
                  <button onClick={() => handleDelete(msg.id)} className="absolute top-6 right-6 text-textMuted hover:text-red-500 transition-colors" title="Supprimer">
                    <Trash2 size={20} />
                  </button>
                  <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-metallic/10 pb-4 pr-10">
                    <div className="flex items-center gap-3 text-textMain"><User size={18} className="text-accent" /><span className="font-bold">{msg.name}</span></div>
                    <a href={`mailto:${msg.email}`} className="flex items-center gap-3 text-textMuted hover:text-accent"><Mail size={18} /><span>{msg.email}</span></a>
                    <div className="flex items-center gap-3 text-textMuted text-sm font-mono md:ml-auto"><Clock size={16} /><span>{formatDate(msg.created_at)}</span></div>
                  </div>
                  <div className="text-textMuted whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                  <div className="mt-6 pt-4">
                    <a href={`mailto:${msg.email}?subject=Réponse de Moutawakil Imrane`} className="inline-block bg-accent/10 text-accent border border-accent/30 px-6 py-2 text-sm font-mono hover:bg-accent hover:text-primary transition-colors">Répondre</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VUE 2 : PARAMÈTRES */}
      {activeView === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
          <div className="bg-secondary/20 border border-metallic/20 p-6 rounded-lg space-y-6">
            <h3 className="text-xl font-bold text-textMain font-heading">Informations de contact</h3>
            
            <div>
              <label className="block text-textMuted font-mono text-sm mb-2">Paragraphe d'introduction</label>
              <textarea rows="3" value={settings.contact_description || ''} onChange={e => setSettings({...settings, contact_description: e.target.value})} className="w-full bg-primary border border-metallic/30 p-4 rounded text-textMain focus:outline-none focus:border-accent" placeholder="Actuellement à la recherche de nouvelles opportunités..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-textMuted font-mono text-sm mb-2">Adresse Email</label>
                <input type="email" value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full bg-primary border border-metallic/30 p-4 rounded text-textMain focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-textMuted font-mono text-sm mb-2">Localisation</label>
                <input type="text" value={settings.contact_location || ''} onChange={e => setSettings({...settings, contact_location: e.target.value})} className="w-full bg-primary border border-metallic/30 p-4 rounded text-textMain focus:outline-none focus:border-accent" />
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 border border-metallic/20 p-6 rounded-lg space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-textMain font-heading">Réseaux Sociaux (Icônes)</h3>
              <button type="button" onClick={addSocialLink} className="flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-2 hover:bg-accent hover:text-primary transition-colors font-mono text-sm">
                <Plus size={16} /> Ajouter une icône
              </button>
            </div>
            
            <div className="space-y-4">
              {settings.social_links.map((link, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-primary p-4 border border-metallic/10 rounded">
                  <select value={link.platform} onChange={e => updateSocialLink(index, 'platform', e.target.value)} className="bg-secondary border border-metallic/30 p-3 text-textMain w-full md:w-1/4 focus:outline-none focus:border-accent">
                    <option value="linkedin">LinkedIn</option><option value="github">GitHub</option><option value="twitter">Twitter / X</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="website">Site Web</option>
                  </select>
                  <input type="url" placeholder="Lien HTTP..." value={link.url} onChange={e => updateSocialLink(index, 'url', e.target.value)} className="w-full bg-secondary border border-metallic/30 p-3 text-textMain focus:outline-none focus:border-accent" />
                  <button type="button" onClick={() => removeSocialLink(index)} className="p-3 text-textMuted hover:text-red-500 hover:bg-red-500/10 transition-colors rounded">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="flex items-center justify-center gap-3 bg-accent text-primary px-8 py-4 font-bold tracking-wide hover:bg-accent/90 transition-all w-full md:w-auto">
            <Save size={20} /> {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactTab;