import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Gallery_detail.css";

const MemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [meme, setMeme] = useState(location.state?.meme || null);
  const [isLoading, setIsLoading] = useState(!location.state?.meme);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!meme) {
      const fetchMeme = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:8000/memes/detail/${id}/`);
          setMeme(response.data);
          setError(null);
        } catch (err) {
          console.error("Erreur récupération mème:", err);
          setError("Impossible de charger le mème. Il a peut-être été supprimé.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeme();
    }
  }, [id, meme]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce mème ?")) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:8000/memes/detail/${id}/`);
      navigate("/gallery", { state: { memeDeleted: true } });
    } catch (err) {
      console.error("Erreur suppression mème:", err);
      setError("Erreur lors de la suppression. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = `http://localhost:8000${meme.image}`;
    link.download = `meme-${id}-${meme.image.split("/").pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const shareMeme = (platform) => {
    const baseUrl = window.location.origin;
    const imageUrl = `http://localhost:8000${meme.image}`;
    const text = `Regardez ce mème: "${meme.top_text || ''} ${meme.bottom_text || ''}"`;

    const platforms = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${imageUrl}`)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(imageUrl)}&title=${encodeURIComponent(text)}`
    };

    window.open(platforms[platform], "_blank", "width=600,height=500");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="detail-container loading">
        <div className="spinner"></div>
        <p>Chargement du mème...</p>
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="detail-container error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>{error || "Mème introuvable"}</h3>
        <button onClick={() => navigate("/gallery")}>Retour à la galerie</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button className="back-button" onClick={handleBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
        Retour
      </button>

      <div className="meme-detail-card">
        <div className="meme-image-container">
          <img
            src={`http://localhost:8000${meme.image}`}
            alt={`Mème: ${meme.top_text || ''} ${meme.bottom_text || ''}`}
            className="detail-image"
          />
        </div>

        <div className="meme-info">
          <div className="meme-text">
            {meme.top_text && <p className="top-text">{meme.top_text}</p>}
            {meme.bottom_text && <p className="bottom-text">{meme.bottom_text}</p>}
          </div>

          <div className="meme-meta">
            <span className="date">
              Créé le {new Date(meme.created_at).toLocaleDateString()}
            </span>
            {meme.likes > 0 && (
              <span className="likes">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {meme.likes} like{meme.likes > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className={`download-btn ${isDownloading ? 'downloading' : ''}`}
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              Téléchargement...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Télécharger
            </>
          )}
        </button>

        <div className="share-buttons">
          <button onClick={() => shareMeme('facebook')} className="facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Facebook
          </button>
          <button onClick={() => shareMeme('twitter')} className="twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
            Twitter
          </button>
          <button onClick={() => shareMeme('whatsapp')} className="whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path>
            </svg>
            WhatsApp
          </button>
        </div>

        <button 
          className={`delete-btn ${isDeleting ? 'deleting' : ''}`}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              Suppression...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Supprimer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MemeDetail;