import { useState, useEffect } from 'react';
import { Trash2, Mail, User, Clock, Loader2, MessageSquare } from 'lucide-react';

const ContactTab = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/messages`;

  // 1. Récupérer les messages (GET)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur lors de la récupération des messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // 2. Supprimer un message (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      // Mettre à jour l'affichage en retirant le message supprimé
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de supprimer le message.");
    }
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-accent w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-textMain uppercase tracking-wider font-heading">
            Boîte de réception
          </h2>
          <p className="text-textMuted mt-1">Gérez les messages envoyés depuis votre portfolio.</p>
        </div>
        <div className="bg-secondary/50 px-4 py-2 border border-metallic/20 rounded text-accent font-mono text-sm">
          {messages.length} message{messages.length > 1 ? 's' : ''}
        </div>
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
              
              {/* Bouton Supprimer */}
              <button 
                onClick={() => handleDelete(msg.id)}
                className="absolute top-6 right-6 text-textMuted hover:text-red-500 transition-colors p-2"
                title="Supprimer ce message"
              >
                <Trash2 size={20} />
              </button>

              {/* En-tête du message */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 border-b border-metallic/10 pb-4 pr-12">
                <div className="flex items-center gap-3 text-textMain">
                  <User size={18} className="text-accent" />
                  <span className="font-bold">{msg.name}</span>
                </div>
                
                <a href={`mailto:${msg.email}`} className="flex items-center gap-3 text-textMuted hover:text-accent transition-colors">
                  <Mail size={18} />
                  <span>{msg.email}</span>
                </a>
                
                <div className="flex items-center gap-3 text-textMuted text-sm font-mono md:ml-auto">
                  <Clock size={16} />
                  <span>{formatDate(msg.created_at)}</span>
                </div>
              </div>

              {/* Contenu du message */}
              <div className="text-textMuted whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>
              
              {/* Bouton Répondre (raccourci) */}
              <div className="mt-6 pt-4">
                <a 
                  href={`mailto:${msg.email}?subject=Réponse de Moutawakil Imrane`}
                  className="inline-block bg-accent/10 text-accent border border-accent/30 px-6 py-2 text-sm font-mono hover:bg-accent hover:text-primary transition-colors"
                >
                  Répondre
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactTab;