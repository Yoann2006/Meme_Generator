// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import Preview from './pages/Preview';
import Gallery from './pages/Gallery';
import MemeDetail from './pages/Gallery_detail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<MemeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
