import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';

const Upload = ({ onMemeCreated }) => {
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('top_text', topText);
    formData.append('bottom_text', bottomText);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/memes/create/', formData);
      onMemeCreated(res.data);
      setImage(null);
      setTopText('');
      setBottomText('');
      setPreview(null);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Créer un mème</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input type="text" placeholder="Texte du haut" value={topText} onChange={(e) => setTopText(e.target.value)} />
        <input type="text" placeholder="Texte du bas" value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'Générer le mème'}</button>
      </form>
      {preview && (
        <div className="preview">
          <img src={preview} alt="Aperçu" className="preview-image" />
          <div className="text top">{topText}</div>
          <div className="text bottom">{bottomText}</div>
        </div>
      )}
    </div>
  );
};

export default Upload;
