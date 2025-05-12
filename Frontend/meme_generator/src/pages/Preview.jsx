import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Preview.css";

const MemePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);

  if (!imageUrl) {
    return (
      <div className="preview-container error-container">
        <div className="error-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>Aucun mème trouvé</h2>
          <p>Retournez à l'éditeur pour créer un nouveau mème</p>
          <button 
            className="action-btn primary"
            onClick={() => navigate("/")}
          >
            ← Créer un mème
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `meme-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const shareMeme = (platform) => {
    const text = "Regardez ce mème que j'ai créé !";
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(imageUrl);

    const platforms = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    };

    window.open(platforms[platform], "_blank", "width=600,height=500");
  };

  const handleBackToEditor = () => {
    navigate("/", { state: { imageUrl } });
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>Votre Mème est Prêt !</h1>
        <p>Partagez votre création avec le monde</p>
      </div>

      <div className="meme-display">
        <img 
          src={imageUrl} 
          alt="Mème généré" 
          className="meme-image"
          onLoad={() => window.scrollTo(0, 0)}
        />
      </div>

      <div className="action-buttons">
        <button 
          className={`action-btn primary ${isDownloading ? "downloading" : ""}`}
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

        <button 
          className="action-btn tertiary"
          onClick={handleBackToEditor}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Modifier à nouveau
        </button>
      </div>

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

      <div className="more-options">
        <button 
          className="gallery-btn"
          onClick={() => navigate("/gallery")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Voir la galerie
        </button>
      </div>
    </div>
  );
};

export default MemePreview;