import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Preview.css";

const MemePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl } = location.state || {};
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    setShareSupported(!!navigator.share);
  }, []);

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

  const handleShare = async () => {
    try {
      if (shareSupported) {
        await navigator.share({
          title: "Mon Mème Créatif",
          text: "Regardez le mème que j'ai créé !",
          url: imageUrl,
        });
      } else {
        await navigator.clipboard.writeText("Voici mon mème : " + imageUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Erreur de partage :", err);
    }
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
          className={`action-btn secondary ${isCopied ? "copied" : ""}`}
          onClick={handleShare}
        >
          {isCopied ? (
            "Lien copié !"
          ) : shareSupported ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Partager
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copier le lien
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