import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const MemeEditor = () => {
  const [imageFile, setImageFile] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(40);
  const [textPositions, setTextPositions] = useState({
    top: { x: 0.5, y: 0.1 },
    bottom: { x: 0.5, y: 0.9 }
  });
  const [dragging, setDragging] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();

  const drawMeme = useCallback(() => {
    if (!originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0);

    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = fontSize / 5;
    ctx.textAlign = "center";

    if (topText) {
      const x = textPositions.top.x * canvas.width;
      const y = textPositions.top.y * canvas.height;
      ctx.strokeText(topText.toUpperCase(), x, y);
      ctx.fillText(topText.toUpperCase(), x, y);
    }

    if (bottomText) {
      const x = textPositions.bottom.x * canvas.width;
      const y = textPositions.bottom.y * canvas.height;
      ctx.strokeText(bottomText.toUpperCase(), x, y);
      ctx.fillText(bottomText.toUpperCase(), x, y);
    }

    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.9));
  }, [originalImage, topText, bottomText, fontSize, textColor, strokeColor, textPositions]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Veuillez sélectionner un fichier image valide (JPEG, PNG)");
      return;
    }

    setError(null);
    setImageFile(file);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setIsLoading(false);
      };
      img.onerror = () => {
        setError("Erreur lors du chargement de l'image");
        setIsLoading(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleMouseDown = (e) => {
    if (!previewUrl || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const topDist = Math.sqrt(
      Math.pow(x - textPositions.top.x, 2) + 
      Math.pow(y - textPositions.top.y, 2)
    );
    const bottomDist = Math.sqrt(
      Math.pow(x - textPositions.bottom.x, 2) + 
      Math.pow(y - textPositions.bottom.y, 2)
    );

    if (topText && topDist < 0.1) {
      setDragging('top');
    } else if (bottomText && bottomDist < 0.1) {
      setDragging('bottom');
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTextPositions(prev => ({
      ...prev,
      [dragging]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Veuillez sélectionner une image");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });

      const formData = new FormData();
      formData.append("image", blob, "meme.jpg");
      formData.append("top_text", topText);
      formData.append("bottom_text", bottomText);

      await axios.post("http://localhost:8000/memes/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const tempUrl = URL.createObjectURL(blob);
      navigate("/preview", { state: { imageUrl: tempUrl } });
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setError("Une erreur est survenue lors de l'envoi du mème");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="meme-editor-container">
      <div className="editor-header">
        <h1>Créateur de Mèmes</h1>
        <p>Transformez vos images en mèmes hilarants en quelques clics</p>
      </div>

      <div 
        className={`upload-area ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <div className="upload-content">
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h3>Glissez-déposez votre image ici</h3>
          <p>ou cliquez pour sélectionner un fichier</p>
          <div className="file-types">JPEG, PNG (Max. 5MB)</div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="editor-controls">
        <div className="text-controls">
          <div className="input-group">
            <label>Texte du haut</label>
            <input
              type="text"
              placeholder="Quand je..."
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              disabled={isLoading || !imageFile}
              maxLength={50}
            />
            <div className="character-count">{topText.length}/50</div>
          </div>

          <div className="input-group">
            <label>Texte du bas</label>
            <input
              type="text"
              placeholder="Et que je..."
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              disabled={isLoading || !imageFile}
              maxLength={50}
            />
            <div className="character-count">{bottomText.length}/50</div>
          </div>

          <div className="style-controls">
            <div className="control-group">
              <label>Couleur du texte</label>
              <input 
                type="color" 
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>Couleur du contour</label>
              <input 
                type="color" 
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>Taille du texte: {fontSize}px</label>
              <input
                type="range"
                min="20"
                max="100"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <button 
          className="generate-btn"
          onClick={handleSubmit}
          disabled={isLoading || !imageFile}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Génération en cours...
            </>
          ) : (
            "Générer mon Mème"
          )}
        </button>
      </div>

      <div className="meme-preview">
        <h3>Aperçu de votre mème</h3>
        {previewUrl ? (
          <div className="preview-container">
            <div 
              ref={previewRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ position: 'relative', cursor: dragging ? 'grabbing' : 'grab' }}
            >
              <img 
                src={previewUrl} 
                alt="Aperçu du mème" 
                className="preview-image"
              />
            </div>
            <div className="instructions">
              <p>Cliquez et glissez les textes pour les repositionner</p>
            </div>
          </div>
        ) : (
          <div className="empty-preview">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>Votre mème apparaîtra ici</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default MemeEditor;