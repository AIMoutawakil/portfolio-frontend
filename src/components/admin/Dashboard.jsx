import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Wrench, Home, LogOut, User, MapPin } from 'lucide-react';

import HomeTab from './HomeTab';
import AboutTab from './AboutTab';
import SkillsTab from './SkillsTab';
import ProjectsTab from './ProjectsTab';
import ContactTab from './ContactTab'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accueil');

  const handleLogout = () => navigate('/admin');

  return (
    <div className="min-h-screen bg-primary flex text-textMain font-sans selection:bg-accent/30">
      
      {/* MENU LATÉRAL */}
      <aside className="w-64 bg-secondary/30 border-r border-metallic/20 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-metallic/20">
          <h2 className="text-xl font-heading font-bold tracking-wider">
            M<span className="text-accent">.</span>I <span className="text-textMuted text-sm font-mono ml-2 uppercase">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 font-mono text-sm tracking-widest uppercase">
          
          <button onClick={() => setActiveTab('accueil')} className={`w-full flex items-center space-x-3 p-3 transition-colors text-left ${activeTab === 'accueil' ? 'bg-accent/10 text-accent border border-accent/30' : 'text-textMuted hover:bg-secondary hover:text-textMain border border-transparent'}`}>
            <Home size={18} /> <span>Accueil</span>
          </button>
          
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center space-x-3 p-3 transition-colors text-left ${activeTab === 'about' ? 'bg-accent/10 text-accent border border-accent/30' : 'text-textMuted hover:bg-secondary hover:text-textMain border border-transparent'}`}>
            <User size={18} /> <span>À propos</span>
          </button>
          
          <button onClick={() => setActiveTab('skills')} className={`w-full flex items-center space-x-3 p-3 transition-colors text-left ${activeTab === 'skills' ? 'bg-accent/10 text-accent border border-accent/30' : 'text-textMuted hover:bg-secondary hover:text-textMain border border-transparent'}`}>
            <Wrench size={18} /> <span>Compétences</span>
          </button>
          
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center space-x-3 p-3 transition-colors text-left ${activeTab === 'projects' ? 'bg-accent/10 text-accent border border-accent/30' : 'text-textMuted hover:bg-secondary hover:text-textMain border border-transparent'}`}>
            <FolderKanban size={18} /> <span>Projets</span>
          </button>

          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center space-x-3 p-3 transition-colors text-left ${activeTab === 'contact' ? 'bg-accent/10 text-accent border border-accent/30' : 'text-textMuted hover:bg-secondary hover:text-textMain border border-transparent'}`}>
            <MapPin size={18} /> <span>Contact</span>
          </button>

        </nav>
        
        <div className="p-4 border-t border-metallic/20">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-mono text-sm tracking-widest uppercase text-left">
            <LogOut size={18} /> <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow p-10 ml-64">
        {activeTab === 'accueil' && <HomeTab />}
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'contact' && <ContactTab />}
      </main>

    </div>
  );
};

export default Dashboard;