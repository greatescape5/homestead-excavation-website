import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'var(--green-dark)',
    borderBottom: '2px solid var(--gold)',
    transition: 'box-shadow 0.2s',
  },
  navScrolled: { boxShadow: '0 2px 24px rgba(0,0,0,0.4)' },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    padding: '0 1.5rem',
    height: 116,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
  },
  logoImg: {
    height: 104,
    width: 'auto',
    objectFit: 'contain',
    borderRadius: 8,
    background: '#F0EDE4',
    padding: 4,
  },
  logoText: { display: 'flex', flexDirection: 'column', gap: 0 },
  logoTop: {
    fontFamily: 'var(--font-display)',
    fontSize: 20, fontWeight: 800, letterSpacing: '0.05em',
    color: 'var(--white)', lineHeight: 1,
  },
  logoSub: {
    fontSize: 10, fontWeight: 500, letterSpacing: '0.15em',
    color: 'var(--gold)', textTransform: 'uppercase', lineHeight: 1.4,
  },
  links: { display: 'flex', alignItems: 'center', gap: '2rem' },
  link: {
    color: '#ccc', fontSize: 13, fontWeight: 500,
    letterSpacing: '0.05em', textTransform: 'uppercase',
    transition: 'color 0.15s',
  },
  linkActive: { color: 'var(--gold)' },
  cta: {
    background: 'var(--gold)', color: 'var(--white)',
    border: 'none', borderRadius: 4,
    padding: '8px 18px', fontSize: 13, fontWeight: 600,
    letterSpacing: '0.04em', textTransform: 'uppercase',
    transition: 'background 0.15s', cursor: 'pointer',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: 'var(--white)', fontSize: 24, padding: 4, cursor: 'pointer',
  },
  mobileMenu: {
    background: 'var(--green-dark)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem 1.5rem',
  },
  mobileLink: {
    display: 'block', color: '#ccc', fontSize: 15, fontWeight: 500,
    padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  mobileCta: {
    display: 'block', marginTop: '1rem',
    background: 'var(--gold)', color: 'var(--white)',
    border: 'none', borderRadius: 4,
    padding: '12px', fontSize: 14, fontWeight: 600,
    textAlign: 'center', width: '100%',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }} role="navigation" aria-label="Main navigation">
      <div style={styles.inner}>
        <Link to="/" style={styles.logoWrap} aria-label="Homestead Concrete & Excavation home">
          {!logoError ? (
            <img
              src="/logo.png"
              alt="Homestead Concrete & Excavation logo"
              style={styles.logoImg}
              onError={() => setLogoError(true)}
            />
          ) : null}
          <div style={styles.logoText}>
            <span style={styles.logoTop}>HOMESTEAD</span>
            <span style={styles.logoSub}>Concrete &amp; Excavation</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={styles.links} className="nav-desktop">
          {[['/', 'Home'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link key={path} to={path}
              style={{ ...styles.link, ...(isActive(path) ? styles.linkActive : {}) }}>
              {label}
            </Link>
          ))}
          <Link to="/contact">
            <button style={styles.cta}
              onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
              onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
              Free Quote
            </button>
          </Link>
        </div>

        {/* Hamburger */}
        <button style={styles.hamburger} className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle mobile menu" aria-expanded={menuOpen}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {[['/', 'Home'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link key={path} to={path} style={styles.mobileLink}>{label}</Link>
          ))}
          <Link to="/contact" style={styles.mobileCta} onClick={() => setMenuOpen(false)}>
            Get a Free Quote
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
