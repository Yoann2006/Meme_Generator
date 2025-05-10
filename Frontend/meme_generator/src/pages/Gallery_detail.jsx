import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gallery_detail.css";

const MemeDetail = () => {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/memes/detail/${id}/`)
      .then((res) => setMeme(res.data))
      .catch((err) => console.error("Erreur récupération mème:", err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/memes/detail/${id}/`);
      navigate("/gallery");
    } catch (err) {
      console.error("Erreur suppression mème:", err);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `http://localhost:8000${meme.image}`;
    link.download = meme.image.split("/").pop();
    link.click();
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=http://localhost:8000${meme.image}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `https://wa.me/?text=Regarde ce mème ! http://localhost:8000${meme.image}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  if (!meme) return <div>Chargement...</div>;

  return (
    <div className="detail-container">
      <img
        src={`http://localhost:8000${meme.image}`}
        alt="Mème en grand format"
        className="detail-image"
      />
      <div className="button-group">
        <button onClick={handleDownload}>Télécharger</button>
        <button onClick={handleFacebookShare}>Partager sur Facebook</button>
        <button onClick={handleWhatsAppShare}>Partager sur WhatsApp</button>
        <button onClick={handleDelete}>Supprimer</button>
      </div>
    </div>
  );
};

export default MemeDetail;
