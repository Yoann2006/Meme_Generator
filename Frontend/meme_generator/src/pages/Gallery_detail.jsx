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
    link.download = "meme.jpg";
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Regarde ce mème !",
        url: `http://localhost:8000${meme.image}`,
      });
    } else {
      alert("Le partage n'est pas supporté sur ce navigateur.");
    }
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
        <button onClick={handleShare}>Partager</button>
        <button onClick={handleDelete}>Supprimer</button>
      </div>
    </div>
  );
};

export default MemeDetail;
