
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Loader2,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// URL de base de l'API
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Conception CAO',
    description: '',
    technologies: '',
    images: [],
    resources: []
  });

  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [isUploadingRes, setIsUploadingRes] = useState(null);

  // ==========================================
  // RÉCUPÉRATION DES PROJETS
  // ==========================================

  const fetchProjects = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/projects`);

      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des projets');
      }

      const data = await res.json();

      const formattedData = Array.isArray(data)
        ? data.map((project) => {
            let parsedTechs = [];

            if (Array.isArray(project.technologies)) {
              parsedTechs = project.technologies;
            } else if (typeof project.technologies === 'string') {
              try {
                parsedTechs = JSON.parse(project.technologies);
              } catch (e) {
                parsedTechs = [];
              }
            }

            return {
              ...project,
              technologies: parsedTechs,
              images: Array.isArray(project.images)
                ? project.images
                : [],
              resources: Array.isArray(project.resources)
                ? project.resources
                : []
            };
          })
        : [];

      setProjects(formattedData);
    } catch (err) {
      console.error('Erreur fetchProjects :', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // SUPPRESSION D'UN PROJET
  // ==========================================

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Retirer ce projet de la liste ? (N'oublie pas d'enregistrer ensuite)"
      )
    ) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // ==========================================
  // OUVERTURE DU FORMULAIRE
  // ==========================================

  const handleOpenCreate = () => {
    setEditingId(null);

    setFormData({
      title: '',
      category: 'Conception CAO',
      description: '',
      technologies: '',
      images: [],
      resources: []
    });

    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingId(project.id);

    setFormData({
      title: project.title || '',
      category: project.category || 'Conception CAO',
      description: project.description || '',
      technologies:
        Array.isArray(project.technologies)
          ? project.technologies.join(', ')
          : '',
      images: project.images || [],
      resources: project.resources || []
    });

    setIsModalOpen(true);
  };

  // ==========================================
  // UPLOAD DES IMAGES
  // ==========================================

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setIsUploadingImg(true);

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch(
        `${API_BASE_URL}/upload-project-file`,
        {
          method: 'POST',
          body: data
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur d'upload");
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.url]
      }));
    } catch (err) {
      console.error(err);
      alert("Erreur d'upload de l'image");
    } finally {
      setIsUploadingImg(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ==========================================
  // GESTION DES RESSOURCES
  // ==========================================

  const addEmptyResource = () => {
    setFormData((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        {
          title: '',
          type: 'pdf',
          file_url: ''
        }
      ]
    }));
  };

  const handleResourceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.map((resource, i) =>
        i === index
          ? { ...resource, [field]: value }
          : resource
      )
    }));
  };

  const removeResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // ==========================================
  // UPLOAD DES RESSOURCES
  // ==========================================

  const handleResourceUpload = async (index, e) => {
    const file = e.target.files[0];

    if (!file) return;

    setIsUploadingRes(index);

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch(
        `${API_BASE_URL}/upload-project-file`,
        {
          method: 'POST',
          body: data
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur d'upload");
      }

      handleResourceChange(index, 'file_url', result.url);
    } catch (err) {
      console.error(err);
      alert("Erreur d'upload du fichier");
    } finally {
      setIsUploadingRes(null);
      e.target.value = '';
    }
  };

  // ==========================================
  // SOUMISSION DU FORMULAIRE
  // ==========================================

  const handleProjectSubmit = (e) => {
    e.preventDefault();

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    const newProject = {
      id: editingId ? editingId : Date.now(),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      technologies: techArray,
      images: formData.images,
      resources: formData.resources
    };

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId ? newProject : p
        )
      );
    } else {
      setProjects((prev) => [...prev, newProject]);
    }

    setIsModalOpen(false);
  };

  // ==========================================
  // SAUVEGARDE GLOBALE
  // ==========================================

  const handleGlobalSave = async () => {
    setIsSaving(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/bulk`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ projects })
        }
      );

      if (!res.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      alert('✅ Portefeuille de projets publié avec succès !');

      await fetchProjects();
    } catch (err) {
      console.error('Erreur de sauvegarde :', err);
      alert('❌ Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      {/* HEADER */}
      <header className="mb-10 flex justify-between items-center border-b border-metallic/20 pb-6">
        <h1 className="text-3xl font-heading font-bold flex items-center">
          <LayoutDashboard
            className="mr-4 text-accent"
            size={32}
          />
          Gestion des Projets
        </h1>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 bg-secondary text-textMain border border-metallic/30 px-6 py-3 font-mono text-sm font-bold tracking-widest uppercase hover:border-accent hover:text-accent transition-colors"
        >
          <Plus size={18} />
          <span>Nouveau Projet</span>
        </button>
      </header>

      {/* TABLEAU DES PROJETS */}
      <div className="bg-secondary/20 border border-metallic/20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-accent">
            <Loader2 className="animate-spin w-10 h-10 mb-4" />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-textMuted font-mono">
            Aucun projet trouvé.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-metallic/30 font-mono text-xs tracking-widest uppercase text-textMuted">
                <th className="p-4">Titre du projet</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-metallic/10 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 font-bold text-textMain flex items-center space-x-3">
                    {project.images &&
                    project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt="Aperçu"
                        className="w-10 h-10 object-cover border border-metallic/30"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary flex items-center justify-center border border-metallic/30 text-metallic/40">
                        <ImageIcon size={16} />
                      </div>
                    )}

                    <span>{project.title}</span>
                  </td>

                  <td className="p-4">
                    <span className="bg-primary border border-metallic/20 px-3 py-1 font-mono text-xs text-textMuted">
                      {project.category}
                    </span>
                  </td>

                  <td className="p-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-2 text-textMuted hover:text-accent hover:bg-secondary border border-transparent transition-all"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-textMuted hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BOUTON DE SAUVEGARDE */}
      <div className="mt-12 flex justify-end">
        <button
          onClick={handleGlobalSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-accent text-primary px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}

          <span>
            {isSaving
              ? 'Sauvegarde...'
              : 'Enregistrer et Publier'}
          </span>
        </button>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-primary border border-metallic/30 w-full max-w-4xl shadow-2xl my-8"
            >
              {/* EN-TÊTE MODAL */}
              <div className="flex justify-between items-center p-6 border-b border-metallic/20 bg-secondary/30">
                <h3 className="text-xl font-heading font-bold text-textMain">
                  {editingId
                    ? 'Modifier le Projet'
                    : 'Ajouter un Projet'}
                </h3>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-textMuted hover:text-accent"
                >
                  <X size={24} />
                </button>
              </div>

              {/* FORMULAIRE */}
              <form
                onSubmit={handleProjectSubmit}
                className="p-6 space-y-8"
              >
                {/* 1. INFORMATIONS GÉNÉRALES */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-textMuted font-mono text-xs uppercase tracking-widest">
                      Titre
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value
                        })
                      }
                      className="w-full bg-secondary/20 border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-textMuted font-mono text-xs uppercase tracking-widest">
                      Catégorie
                    </label>

                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value
                        })
                      }
                      className="w-full bg-secondary/20 border border-metallic/30 text-textMain px-4 py-3 focus:border-accent outline-none"
                    >
                      <option>Conception CAO</option>
                      <option>Usinage CNC</option>
                      <option>Productique</option>
                    </select>
                  </div>
                </div>

                {/* TECHNOLOGIES */}
                <div className="space-y-2">
                  <label className="text-textMuted font-mono text-xs uppercase tracking-widest">
                    Technologies (séparées par une virgule)
                  </label>

                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technologies: e.target.value
                      })
                    }
                    className="w-full bg-secondary/20 border border-metallic/30 text-textMain px-4 py-3 font-mono text-sm focus:border-accent outline-none"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                  <label className="text-textMuted font-mono text-xs uppercase tracking-widest">
                    Description
                  </label>

                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value
                      })
                    }
                    className="w-full bg-secondary/20 border border-metallic/30 text-textMain px-4 py-3 resize-none focus:border-accent outline-none"
                  />
                </div>

                {/* 2. IMAGES DU PROJET */}
                <div className="pt-6 border-t border-metallic/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-textMuted font-mono text-xs uppercase tracking-widest">
                      Images du projet
                    </label>

                    <label className="cursor-pointer bg-secondary text-textMain border border-metallic/30 px-4 py-2 font-mono text-xs uppercase hover:text-accent hover:border-accent transition-colors flex items-center space-x-2">
                      {isUploadingImg ? (
                        <Loader2
                          className="animate-spin"
                          size={14}
                        />
                      ) : (
                        <Upload size={14} />
                      )}

                      <span>
                        {isUploadingImg
                          ? 'Envoi...'
                          : 'Ajouter une image'}
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploadingImg}
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group w-32 h-32 border border-metallic/30 bg-secondary/30"
                      >
                        <img
                          src={img}
                          alt="Projet"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/80 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {formData.images.length === 0 && (
                      <p className="text-metallic/50 text-xs font-mono italic">
                        Aucune image.
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. FICHIERS ET RESSOURCES */}
                <div className="pt-6 border-t border-metallic/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-textMuted font-mono text-xs uppercase tracking-widest">
                      Fichiers & Ressources
                    </label>

                    <button
                      type="button"
                      onClick={addEmptyResource}
                      className="text-accent hover:text-accent/80 font-mono text-xs flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Ajouter un fichier</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.resources.map((res, idx) => (
                      <div
                        key={idx}
                        className="bg-secondary/30 border border-metallic/20 p-4 flex flex-col md:flex-row gap-4 items-center"
                      >
                        {/* TITRE */}
                        <div className="flex-1 space-y-2 w-full">
                          <input
                            type="text"
                            placeholder="Titre du fichier (ex: Plan PDF)"
                            value={res.title}
                            onChange={(e) =>
                              handleResourceChange(
                                idx,
                                'title',
                                e.target.value
                              )
                            }
                            className="w-full bg-primary border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none"
                          />
                        </div>

                        {/* TYPE */}
                        <div className="w-full md:w-32 space-y-2">
                          <select
                            value={res.type}
                            onChange={(e) =>
                              handleResourceChange(
                                idx,
                                'type',
                                e.target.value
                              )
                            }
                            className="w-full bg-primary border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none"
                          >
                            <option value="pdf">PDF</option>
                            <option value="ppt">Présentation</option>
                            <option value="video">Vidéo</option>
                            <option value="link">Lien externe</option>
                          </select>
                        </div>

                        {/* URL OU UPLOAD */}
                        <div className="flex-1 flex space-x-2 w-full">
                          <input
                            type="text"
                            placeholder="URL ou uploadez un fichier"
                            value={res.file_url}
                            onChange={(e) =>
                              handleResourceChange(
                                idx,
                                'file_url',
                                e.target.value
                              )
                            }
                            className="w-full bg-primary border border-metallic/30 text-textMain px-3 py-2 text-sm focus:border-accent outline-none font-mono"
                          />

                          <label className="cursor-pointer bg-secondary text-textMain border border-metallic/30 px-3 py-2 flex items-center hover:text-accent hover:border-accent transition-colors">
                            {isUploadingRes === idx ? (
                              <Loader2
                                className="animate-spin"
                                size={16}
                              />
                            ) : (
                              <Upload size={16} />
                            )}

                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                handleResourceUpload(idx, e)
                              }
                              disabled={isUploadingRes !== null}
                            />
                          </label>
                        </div>

                        {/* SUPPRESSION */}
                        <button
                          type="button"
                          onClick={() => removeResource(idx)}
                          className="p-2 text-textMuted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    {formData.resources.length === 0 && (
                      <p className="text-metallic/50 text-xs font-mono italic">
                        Aucun fichier attaché.
                      </p>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-metallic/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 font-mono text-sm uppercase text-textMuted hover:text-textMain"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="bg-accent text-primary px-8 py-3 font-mono text-sm font-bold uppercase hover:bg-accent/90"
                  >
                    Appliquer au brouillon
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsTab;
