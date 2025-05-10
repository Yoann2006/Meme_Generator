import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8000/memes/create/");
        const sortedMemes = sortMemes(response.data, sortBy);
        setMemes(sortedMemes);
        setError(null);
      } catch (error) {
        console.error("Erreur de récupération des mèmes:", error);
        setError("Impossible de charger la galerie. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [sortBy]);

  const sortMemes = (memes, sortMethod) => {
    const sorted = [...memes];
    switch (sortMethod) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "popular":
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return sorted;
    }
  };

  const filteredMemes = memes.filter(meme =>
    meme.top_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meme.bottom_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemeClick = (meme) => {
    navigate(`/gallery/${meme.id}`, { state: { meme } });
  };

  const handleCreateNew = () => {
    navigate("/");
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Galerie de Mèmes</h1>
        <p>Découvrez les créations de notre communauté</p>
      </div>

      <div className="gallery-controls">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Rechercher des mèmes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-options">
          <label>Trier par :</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="popular">Plus populaires</option>
          </select>
        </div>

        <button className="create-btn" onClick={handleCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Créer un mème
        </button>
      </div>

      {error && (
        <div className="error-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des mèmes...</p>
        </div>
      ) : filteredMemes.length === 0 ? (
        <div className="empty-gallery">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h3>Aucun mème trouvé</h3>
          <p>{searchTerm ? "Aucun résultat pour votre recherche" : "La galerie est vide pour le moment"}</p>
          <button className="create-btn" onClick={handleCreateNew}>
            Créer le premier mème
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredMemes.map(meme => (
            <div 
              key={meme.id} 
              className="meme-card"
              onClick={() => handleMemeClick(meme)}
            >
              <div className="meme-image-container">
                <img 
                  src={`http://localhost:8000${meme.image}`} 
                  alt={`Mème: ${meme.top_text || ""} ${meme.bottom_text || ""}`}
                  loading="lazy"
                />
              </div>
              <div className="meme-info">
                <div className="meme-text">
                  {meme.top_text && <p className="top-text">{meme.top_text}</p>}
                  {meme.bottom_text && <p className="bottom-text">{meme.bottom_text}</p>}
                </div>
                <div className="meme-meta">
                  <span className="likes">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {meme.likes || 0}
                  </span>
                  <span className="date">
                    {new Date(meme.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;