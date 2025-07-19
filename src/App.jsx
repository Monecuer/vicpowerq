// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Sermons from './pages/Sermons';
import Give from './pages/Give';
import Events from './pages/Events';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
           <Route path="/notifications" element={<Notifications />} />
        <Route path="/about" element={<About />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/give" element={<Give />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* ✅ Fixed */}
         <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
