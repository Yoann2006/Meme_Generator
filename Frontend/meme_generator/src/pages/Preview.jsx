// src/components/Preview.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MemePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl } = location.state || {};

  if (!imageUrl) {
    return <p>Aucun mème trouvé</p>;
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "meme.jpg";
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mon Mème",
          url: imageUrl,
        });
      } catch (err) {
        console.error("Erreur de partage :", err);
      }
    } else {
      alert("Le partage n'est pas supporté sur cet appareil.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Mème généré</h2>
      <div className="preview">
        <img src={imageUrl} alt="Mème généré" style={{ maxWidth: "100%" }} />
      </div>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={handleDownload}>📥 Télécharger</button>
        <button onClick={handleShare}>🔗 Partager</button>
        <button onClick={() => navigate("/gallery")}>🖼️ Galerie</button>
      </div>
    </div>
  );
};

export default MemePreview;
