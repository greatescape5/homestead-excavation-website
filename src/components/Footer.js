import React from 'react';
import { Link } from 'react-router-dom';

const s = {
  footer: { background: '#111', borderTop: '2px solid var(--gold)', padding: '2.5rem 1.5rem 1.5rem' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' },
  brand: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--white)', letterSpacing: '0.05em' },
  brandSub: { color: 'var(--gold)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 },
  tagline: { color: '#777', fontSize: 13, marginTop: 10, lineHeight: 1.6 },
  colTitle: { color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 },
  colLink: { display: 'block', color: '#999', fontSize: 13, marginBottom: 8, transition: 'color 0.15s' },
  colText: { color: '#999', fontSize: 13, lineHeight: 1.7 },
  divider: { borderColor: '#222', margin: '0 0 1rem' },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  copy: { color: '#555', fontSize: 12 },
  bottomLinks: { display: 'flex', gap: '1rem' },
  bottomLink: { color: '#555', fontSize: 12 },
};

export default function Footer() {
  return (
    <footer style={s.footer} role="contentinfo">
      <div style={s.inner}>
        <div style={s.grid}>
          <div>
            <div style={s.brand}>HOMESTEAD</div>
            <div style={s.brandSub}>Concrete &amp; Excavation</div>
            <p style={s.tagline}>North Idaho's trusted concrete and excavation contractor. Built right, built to last.</p>
          </div>
          <div>
            <div style={s.colTitle}>Services</div>
            {['Footings & Foundations','Slabs & Flatwork','Sidewalks & Exterior','Retaining Walls & Stairs','Lot Clearing & Demo','Septic Systems','Dump Truck Hauling'].map(s2 => (
              <Link key={s2} to="/contact" style={s.colLink}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = '#999'}>{s2}</Link>
            ))}
          </div>
          <div>
            <div style={s.colTitle}>Service Area</div>
            <p style={s.colText}>Sandpoint · Athol · Coeur d'Alene · Ponderay · Sagle · and surrounding North Idaho communities</p>
            <div style={{ marginTop: 16 }}>
              <div style={s.colTitle}>Contact</div>
              <p style={s.colText}>
                <a href="tel:+12089469198" style={{ color: 'var(--gold)' }}>(208) 946-9198</a><br />
                <a href="mailto:Homesteadexconcrete@gmail.com" style={{ color: '#999', fontSize: 12 }}>Homesteadexconcrete@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
        <hr style={s.divider} />
        <div style={s.bottom}>
          <span style={s.copy}>© {new Date().getFullYear()} Homestead Concrete &amp; Excavation. Est. 2022. Athol, ID.</span>
          <div style={s.bottomLinks}>
            <Link to="/contact" style={s.bottomLink}>Privacy Policy</Link>
            <Link to="/contact" style={s.bottomLink}>Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
