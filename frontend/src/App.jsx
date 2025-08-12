import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import TrackIncidentPage from './pages/TrackIncidentPage';
import LoginPage from './pages/LoginPage'; // ✅ Import correcto
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reportar" element={<ReportPage />} />
            <Route path="/seguimiento" element={<TrackIncidentPage />} />
            <Route path="/login" element={<LoginPage />} /> {/* ✅ Ruta funcional */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;