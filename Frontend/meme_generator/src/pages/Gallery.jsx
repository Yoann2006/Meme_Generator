import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/memes/create/")
      .then(response => setMemes(response.data))
      .catch(error => console.error("Erreur de récupération des mèmes:", error));
  }, []);

  return (
    <div className="gallery-container">
      <h2>Galerie de Mèmes</h2>
      <div className="gallery-grid">
        {memes.map(meme => (
          <div key={meme.id} className="meme-thumbnail" onClick={() => navigate(`/gallery/${meme.id}`)}>
            <img src={`http://localhost:8000${meme.image}`} alt="Mème" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
