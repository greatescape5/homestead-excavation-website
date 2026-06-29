import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <Ticker />
    </>
  );
}
