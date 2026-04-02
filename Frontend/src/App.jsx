import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ApiDocs from './pages/ApiDocs';
import About from './pages/About';
import Console from './pages/Console';
import MediChat from './pages/MediChat';

// Optional: keep for local debugging / testing
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const App = () => {
  // ensure env var is read so build-time warnings are avoided
  React.useEffect(() => {
    if (!apiUrl) {
      console.warn('VITE_API_URL is not configured');
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/about" element={<About />} />
          <Route path="/console" element={<Console />} />
          <Route path="/chat" element={<MediChat />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
