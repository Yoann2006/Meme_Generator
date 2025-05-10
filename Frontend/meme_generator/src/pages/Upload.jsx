import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const MemeEditor = () => {
  const [imageFile, setImageFile] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const canvasRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          drawMeme(img, topText, bottomText);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawMeme = (img, top, bottom) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.floor(canvas.width / 12);
    ctx.font = `${fontSize}px Impact`;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";

    if (top) {
      ctx.fillText(top.toUpperCase(), canvas.width / 2, fontSize + 10);
      ctx.strokeText(top.toUpperCase(), canvas.width / 2, fontSize + 10);
    }

    if (bottom) {
      ctx.fillText(bottom.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottom.toUpperCase(), canvas.width / 2, canvas.height - 20);
    }

    setPreviewUrl(canvas.toDataURL("image/jpeg"));
  };

  useEffect(() => {
    if (originalImage) {
      drawMeme(originalImage, topText, bottomText);
    }
  }, [topText, bottomText]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "meme.jpg");
      formData.append("top_text", topText);
      formData.append("bottom_text", bottomText);

      try {
        await axios.post("http://localhost:8000/memes/create/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const tempUrl = URL.createObjectURL(blob);
        navigate("/preview", { state: { imageUrl: tempUrl } });

      } catch (err) {
        console.error("Erreur lors de l'envoi :", err);
      }
    }, "image/jpeg");
  };

  return (
    <div className="upload-container">
      <h2>Créer un Mème</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Texte en haut"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Texte en bas"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <button type="submit">Générer & Envoyer</button>
      </form>

      <div className="preview">
        {previewUrl && <img src={previewUrl} alt="Aperçu du mème" />}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default MemeEditor;
