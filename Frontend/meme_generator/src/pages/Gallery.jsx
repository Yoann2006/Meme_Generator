import { useEffect, useState } from 'react';
import api from '../api';
import ShareButtons from './ShareButtons';

const MemeGallery = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    api.get('/memes/').then((res) => setMemes(res.data));
  }, []);

  return (
    <div>
      <h2>Galerie</h2>
      {memes.map((meme) => (
        <div key={meme.id}>
          <img src={`http://localhost:8000${meme.generated_meme}`} alt="Meme" width="300" />
          <ShareButtons url={`http://localhost:8000${meme.generated_meme}`} />
        </div>
      ))}
    </div>
  );
};

export default MemeGallery;
