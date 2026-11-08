import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, X, ExternalLink, FileText, PlaySquare, ChevronLeft, ChevronRight, Presentation, Download, Loader2, Maximize2 } from 'lucide-react';

// --- CONFIGURATION DYNAMIQUE DES URLs ---
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des projets');
        
        const data = await response.json();
        
        const formattedData = data.map(project => {
          let parsedTechs = [];
          if (Array.isArray(project.technologies)) parsedTechs = project.technologies;
          else if (typeof project.technologies === 'string') {
            try { parsedTechs = JSON.parse(project.technologies); } catch (e) { parsedTechs = []; }
          }
          return { ...project, technologies: parsedTechs };
        });

        setProjectsData(formattedData);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filters = ['Tous', 'Conception CAO', 'Usinage CNC', 'Productique'];
  const filteredProjects = activeFilter === 'Tous' ? projectsData : projectsData.filter(project => project.category === activeFilter);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setIsFullscreen(false); 
  };

  const nextImage = () => setCurrentImageIndex((prev) => prev === selectedProject.images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setCurrentImageIndex((prev) => prev === 0 ? selectedProject.images.length - 1 : prev - 1);

  const getResourceIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText size={24} />;
      case 'ppt': return <Presentation size={24} />;
      case 'video': return <PlaySquare size={24} />;
      default: return <ExternalLink size={24} />;
    }
  };

  return (
    <section id="projets" className="w-full min-h-screen flex flex-col justify-center py-20 px-6 lg:px-16 relative z-10">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="flex items-center space-x-4 mb-12">
          <motion.span className="text-accent font-mono text-xl lg:text-2xl">03.</motion.span>
          <motion.h2 className="text-3xl lg:text-5xl font-heading font-bold text-textMain uppercase tracking-wider">Réalisations & Projets</motion.h2>
          <motion.div className="flex-grow h-[1px] bg-metallic/30 ml-4"></motion.div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2 font-mono text-sm tracking-widest uppercase transition-all duration-300 border ${activeFilter === filter ? 'bg-accent text-primary border-accent shadow-[0_0_15px_rgba(56,207,240,0.4)]' : 'bg-transparent text-textMuted border-metallic/30 hover:border-accent hover:text-accent'}`}>
              {filter}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-accent"><Loader2 className="animate-spin w-12 h-12 mb-4" /></div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-center">Erreur de connexion à la base de données.</div>
        ) : projectsData.length === 0 ? (
          <div className="p-6 border border-metallic/30 text-textMuted font-mono text-center">Aucun projet trouvé.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="group bg-secondary/20 border border-metallic/20 h-full hover:border-accent/50 transition-colors flex flex-col">
                  <div onClick={() => handleOpenProject(project)} className="flex flex-col h-full cursor-pointer flex-grow">
                    <div className="w-full h-48 bg-primary/80 border-b border-metallic/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#E9F0F7 1px, transparent 1px), linear-gradient(90deg, #E9F0F7 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                      {project.images && project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Wrench className="text-metallic/30 w-16 h-16 group-hover:scale-110 group-hover:text-accent/30 transition-transform duration-500 z-10" />
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-heading font-bold text-textMain group-hover:text-accent transition-colors">{project.title}</h3>
                      </div>
                      <p className="text-textMuted text-sm mb-6 flex-grow leading-relaxed line-clamp-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-metallic/10">
                        {project.technologies && project.technologies.map((tech, index) => (
                          <span key={index} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* MODALE PRINCIPALE (Détails du projet) */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-[#050505]/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-primary border border-metallic/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col">
                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-50 p-2 bg-secondary/80 text-textMain hover:text-accent hover:bg-secondary border border-metallic/30 transition-colors backdrop-blur-sm"><X size={24} /></button>

                <div className="w-full h-64 lg:h-[400px] bg-secondary/50 border-b border-metallic/20 relative group overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#E9F0F7 1px, transparent 1px), linear-gradient(90deg, #E9F0F7 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                  
                  {selectedProject.images && selectedProject.images.length > 0 ? (
                    <>
                      {/* Image cliquable avec indicateur visuel au survol */}
                      <div 
                        className="w-full h-full relative cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                        title="Cliquer pour agrandir"
                      >
                        <img src={selectedProject.images[currentImageIndex]} alt="Projet" className="w-full h-full object-cover relative z-10 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 transition-opacity bg-black/30 backdrop-blur-[2px]">
                          <div className="bg-primary/90 text-accent p-3 rounded-full border border-metallic/30">
                            <Maximize2 size={28} />
                          </div>
                        </div>
                      </div>

                      {/* Flèches de navigation de la modale */}
                      {selectedProject.images.length > 1 && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 z-20 p-2 bg-primary/80 border border-metallic/30 text-textMuted hover:text-accent hover:border-accent transition-colors backdrop-blur-sm"><ChevronLeft size={28} /></button>
                          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 z-20 p-2 bg-primary/80 border border-metallic/30 text-textMuted hover:text-accent hover:border-accent transition-colors backdrop-blur-sm"><ChevronRight size={28} /></button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                            {selectedProject.images.map((_, idx) => (
                              <div key={idx} className={`h-2 transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-accent' : 'w-2 bg-metallic/40'}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center text-metallic/40">
                      <Wrench className="w-16 h-16 mb-4" />
                      <span className="font-mono tracking-widest text-sm uppercase">Aucune image</span>
                    </div>
                  )}
                </div>

                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-accent font-mono text-sm uppercase tracking-widest">{selectedProject.category}</span>
                    <span className="w-12 h-[1px] bg-metallic/30"></span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-heading font-bold text-textMain mb-6">{selectedProject.title}</h3>
                  <p className="text-textMuted text-lg leading-relaxed mb-8 whitespace-pre-wrap">{selectedProject.description}</p>

                  <div className="flex flex-wrap gap-3 mb-10">
                    {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="text-sm font-mono text-accent border border-accent/20 bg-accent/5 px-4 py-2">{tech}</span>
                    ))}
                  </div>

                  {selectedProject.resources && selectedProject.resources.length > 0 && (
                    <div className="pt-8 border-t border-metallic/10">
                      <h4 className="text-textMuted font-mono text-sm tracking-widest uppercase mb-6 flex items-center">
                        <FileText size={16} className="mr-2" /> Fichiers & Documents du projet
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProject.resources.map((res, index) => (
                          <a key={index} href={res.file_url} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-4 bg-primary border border-metallic/20 hover:border-accent hover:bg-secondary/30 transition-all duration-300">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-secondary/50 text-accent group-hover:scale-110 transition-transform">
                                {getResourceIcon(res.type)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-textMain font-bold text-sm group-hover:text-accent transition-colors">{res.title}</span>
                                <span className="text-textMuted text-xs font-mono uppercase mt-1">
                                  {res.type === 'pdf' ? 'Document PDF' : res.type === 'ppt' ? 'Présentation' : 'Fichier Externe'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-metallic/40 group-hover:text-accent transition-colors">
                              <span className="text-xs font-mono hidden sm:block">Ouvrir</span>
                              <Download size={18} />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODALE LIGHTBOX (Plein écran pour images d'origine) */}
        <AnimatePresence>
          {isFullscreen && selectedProject && selectedProject.images && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.2 }}
              onClick={() => setIsFullscreen(false)} 
              className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/95 backdrop-blur-lg p-4 lg:p-12"
            >
              <button 
                onClick={() => setIsFullscreen(false)} 
                className="absolute top-6 right-6 lg:top-10 lg:right-10 z-[210] p-3 text-metallic/60 hover:text-accent hover:bg-secondary/30 border border-transparent hover:border-metallic/30 transition-all rounded-full"
                title="Fermer (Échap)"
              >
                <X size={32} />
              </button>

              <img 
                src={selectedProject.images[currentImageIndex]} 
                alt={`Vue plein écran - ${selectedProject.title}`} 
                onClick={(e) => e.stopPropagation()} 
                className="max-w-full max-h-[90vh] object-contain relative z-[205] drop-shadow-2xl" 
              />

              {selectedProject.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                    className="absolute left-4 lg:left-10 z-[210] p-4 bg-primary/80 border border-metallic/30 text-metallic/70 hover:text-accent hover:border-accent transition-all backdrop-blur-sm rounded-full"
                  >
                    <ChevronLeft size={36} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                    className="absolute right-4 lg:right-10 z-[210] p-4 bg-primary/80 border border-metallic/30 text-metallic/70 hover:text-accent hover:border-accent transition-all backdrop-blur-sm rounded-full"
                  >
                    <ChevronRight size={36} />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[210] bg-primary/80 border border-metallic/30 px-6 py-2 text-textMuted font-mono text-sm tracking-widest backdrop-blur-sm">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default ProjectsSection;