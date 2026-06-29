import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const SERVICES = [
  { icon: '🏗️', title: 'Footings & Foundations', desc: 'Residential and commercial footings, poured foundations, and structural concrete.' },
  { icon: '⬛', title: 'Slabs & Flatwork', desc: 'Garage slabs, shop floors, driveways, patios, and finish concrete work.' },
  { icon: '🚶', title: 'Sidewalks & Exterior', desc: 'Sidewalks, walkways, and all exterior concrete surfaces.' },
  { icon: '🧱', title: 'Retaining Walls & Stairs', desc: 'Concrete retaining walls, stairs, pavers, and decorative concrete.' },
  { icon: '🌲', title: 'Lot Clearing & Demo', desc: 'Land clearing, demolition, grading, and site preparation.' },
  { icon: '🏠', title: 'House & Site Digs', desc: 'Basement digs, foundation excavation, and full site excavation.' },
  { icon: '🔧', title: 'Septic & Utilities', desc: 'Septic system installation, utility trenching, and underground work.' },
  { icon: '🚛', title: 'Dump Truck Hauling', desc: 'Material hauling, debris removal, and aggregate delivery across North Idaho.' },
];

const AREAS = ["Sandpoint", "Athol", "Coeur d'Alene", "Ponderay", "Sagle", "Priest River", "Spirit Lake", "Post Falls"];

const s = {
  page: { paddingTop: 64 },
  hero: { background: 'var(--green-dark)', padding: '5rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' },
  heroBg: { position: 'absolute', top: 0, right: '-2rem', bottom: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(120px, 20vw, 220px)', fontWeight: 800, color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', display: 'flex', alignItems: 'center' },
  heroInner: { maxWidth: 1100, margin: '0 auto', position: 'relative' },
  eyebrow: { display: 'inline-block', color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', borderLeft: '3px solid var(--gold)', paddingLeft: 10, marginBottom: 16 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--white)', lineHeight: 0.95, marginBottom: '1rem', textTransform: 'uppercase' },
  h1Gold: { color: 'var(--gold)', display: 'block' },
  heroSub: { color: '#aaa', fontSize: 16, lineHeight: 1.7, maxWidth: 500, marginBottom: '2rem' },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  btnPrimary: { background: 'var(--gold)', color: 'var(--white)', border: 'none', borderRadius: 4, padding: '14px 28px', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.15s', cursor: 'pointer' },
  btnOutline: { background: 'transparent', color: 'var(--white)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 4, padding: '14px 28px', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'border-color 0.15s, color 0.15s', cursor: 'pointer' },
  heroBadges: { display: 'flex', gap: 12, marginTop: '2.5rem', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#ccc' },
  trustBar: { background: 'var(--gold)', padding: '14px 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' },
  trustItem: { color: 'var(--green-dark)', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' },
  servicesSection: { padding: '5rem 1.5rem', background: 'var(--white)' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionEyebrow: { color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--green-dark)', letterSpacing: '0.03em', marginBottom: '0.5rem' },
  sectionSub: { color: 'var(--gray-500)', fontSize: 15, marginBottom: '3rem', maxWidth: 520 },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: '#e8e4de', border: '1px solid #e8e4de' },
  serviceCard: { background: 'var(--white)', padding: '1.5rem', transition: 'background 0.15s' },
  serviceIcon: { fontSize: 28, marginBottom: 10 },
  serviceTitle: { fontSize: 15, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 6 },
  serviceDesc: { fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 },
  // GALLERY PREVIEW
  gallerySection: { padding: '5rem 1.5rem', background: 'var(--green-dark)' },
  galleryInner: { maxWidth: 1100, margin: '0 auto' },
  galleryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 },
  galleryEyebrow: { color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 },
  galleryTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '0.03em', lineHeight: 1 },
  viewAllBtn: { background: 'transparent', color: 'var(--gold)', border: '1.5px solid var(--gold)', borderRadius: 4, padding: '10px 20px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' },
  categoriesWrap: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  categoryBlock: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' },
  categoryHeader: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  categoryName: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '0.05em' },
  categoryCount: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' },
  photoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 2 },
  photoThumb: { aspectRatio: '1', objectFit: 'cover', display: 'block', width: '100%', background: '#2C3E28' },
  photoPlaceholder: { aspectRatio: '1', background: '#2C3E28', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { fontSize: 24, opacity: 0.15 },
  galleryEmptyNote: { color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'center', padding: '3rem', gridColumn: '1/-1' },
  // FORM
  formSection: { padding: '5rem 1.5rem', background: 'var(--cream)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' },
  formAccent: { width: 40, height: 4, background: 'var(--gold)', borderRadius: 2, marginBottom: '1.5rem' },
  formTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--green-dark)', letterSpacing: '0.03em', lineHeight: 1, marginBottom: '1rem' },
  formDesc: { color: 'var(--gray-500)', fontSize: 15, lineHeight: 1.7, marginBottom: '1.5rem' },
  directContact: { borderTop: '1px solid #ddd', paddingTop: '1.5rem', marginTop: '1.5rem' },
  directLabel: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 },
  directPhone: { fontSize: 24, fontWeight: 700, color: 'var(--green-dark)', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' },
  directEmail: { fontSize: 13, color: 'var(--gray-500)', marginTop: 4 },
  areasSection: { padding: '4rem 1.5rem', background: 'var(--green-dark)' },
  areasTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '0.03em', marginBottom: '0.5rem' },
  areasSub: { color: '#888', fontSize: 14, marginBottom: '2rem' },
  areasGrid: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  areaPill: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '8px 18px', fontSize: 13, color: '#ccc' },
};

export default function Home() {
  const [galleryData, setGalleryData] = useState([]);

  useEffect(() => {
    document.title = "Homestead Concrete & Excavation | North Idaho Contractor";
    fetchGalleryPreview();
  }, []);

  const fetchGalleryPreview = async () => {
    try {
      // Fetch photos with their categories, get 2 categories with up to 4 photos each
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/photos?order=featured.desc,sort_order,created_at.desc&select=*,categories(id,name)&limit=20`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const photos = await res.json();
      if (!Array.isArray(photos)) return;

      // Group by category, take first 2 categories
      const grouped = {};
      photos.forEach(p => {
        const catName = p.categories?.name || 'Other';
        const catId = p.categories?.id || 'other';
        if (!grouped[catId]) grouped[catId] = { name: catName, photos: [] };
        if (grouped[catId].photos.length < 4) grouped[catId].photos.push(p);
      });

      setGalleryData(Object.values(grouped).slice(0, 2));
    } catch (err) {
      console.error('Gallery preview error:', err);
    }
  };

  return (
    <div style={s.page}>
      {/* ── HERO ── */}
      <section style={s.hero} aria-label="Hero">
        <div style={s.heroBg} aria-hidden="true">DIG</div>
        <div style={s.heroInner}>
          <span style={s.eyebrow}>North Idaho's trusted contractor</span>
          <h1 style={s.h1}>
            Built to last.
            <span style={s.h1Gold}>Done right.</span>
          </h1>
          <p style={s.heroSub}>
            Concrete foundations, excavation, lot clearing, septic systems, and dump truck hauling
            across Sandpoint, Athol, and Coeur d'Alene since 2022.
          </p>
          <div style={s.heroBtns}>
            <Link to="/contact">
              <button style={s.btnPrimary}
                onMouseEnter={e => e.target.style.background='var(--gold-light)'}
                onMouseLeave={e => e.target.style.background='var(--gold)'}>
                Get a Free Quote
              </button>
            </Link>
            <Link to="/gallery">
              <button style={s.btnOutline}
                onMouseEnter={e => { e.target.style.borderColor='var(--gold)'; e.target.style.color='var(--gold)'; }}
                onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.25)'; e.target.style.color='var(--white)'; }}>
                See Our Work
              </button>
            </Link>
          </div>
          <div style={s.heroBadges}>
            {['Est. 2022', 'Athol, ID', '(208) 946-9198', 'Free Estimates'].map(b => (
              <span key={b} style={s.badge}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={s.trustBar}>
        {['Licensed & Insured', '·', 'Free Estimates', '·', 'Serving All of North Idaho', '·', 'Call or Text Anytime'].map((item, i) =>
          item === '·'
            ? <span key={i} style={{ color: 'rgba(28,43,26,0.4)', fontSize: 18 }}>•</span>
            : <span key={i} style={s.trustItem}>{item}</span>
        )}
      </div>

      {/* ── SERVICES ── */}
      <section style={s.servicesSection} aria-labelledby="services-heading">
        <div style={s.sectionInner}>
          <div style={s.sectionEyebrow}>What we do</div>
          <h2 id="services-heading" style={s.sectionTitle}>Full-scope concrete<br />&amp; excavation</h2>
          <p style={s.sectionSub}>From footings to finish work, site clearing to septic — we handle the heavy work so your project gets done right.</p>
          <div style={s.servicesGrid}>
            {SERVICES.map(sv => (
              <div key={sv.title} style={s.serviceCard}
                onMouseEnter={e => e.currentTarget.style.background='var(--gray-100)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--white)'}>
                <div style={s.serviceIcon}>{sv.icon}</div>
                <h3 style={s.serviceTitle}>{sv.title}</h3>
                <p style={s.serviceDesc}>{sv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section style={s.gallerySection} aria-labelledby="gallery-preview-heading">
        <div style={s.galleryInner}>
          <div style={s.galleryHeader}>
            <div>
              <div style={s.galleryEyebrow}>Recent work</div>
              <h2 id="gallery-preview-heading" style={s.galleryTitle}>From the job site</h2>
            </div>
            <Link to="/gallery">
              <button style={s.viewAllBtn}
                onMouseEnter={e => { e.target.style.background='var(--gold)'; e.target.style.color='var(--white)'; }}
                onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='var(--gold)'; }}>
                View All Work →
              </button>
            </Link>
          </div>

          {galleryData.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, textAlign: 'center', padding: '3rem 0' }}>
              Photos coming soon — check back after our next job site shoot.
            </div>
          ) : (
            <div style={s.categoriesWrap} className="gallery-preview-grid">
              {galleryData.map(cat => (
                <div key={cat.name} style={s.categoryBlock}>
                  <div style={s.categoryHeader}>
                    <span style={s.categoryName}>{cat.name}</span>
                    <span style={s.categoryCount}>{cat.photos.length} photo{cat.photos.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={s.photoGrid}>
                    {cat.photos.slice(0, 4).map(photo => (
                      <img key={photo.id} src={photo.public_url} alt={photo.title} style={s.photoThumb} />
                    ))}
                    {Array.from({ length: Math.max(0, 4 - cat.photos.length) }).map((_, i) => (
                      <div key={i} style={s.photoPlaceholder}>
                        <span style={s.placeholderIcon}>📷</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FORM ── */}
      <section style={s.formSection} aria-labelledby="quote-heading">
        <div style={s.sectionInner}>
          <div style={s.formGrid} className="form-section-grid">
            <div>
              <div style={s.formAccent} />
              <h2 id="quote-heading" style={s.formTitle}>Ready to get<br />started?</h2>
              <p style={s.formDesc}>
                Tell us about your project and we'll get back to you fast — usually the same day.
                No pressure, no commitment, just a straight answer on what your job will take.
              </p>
              <div style={s.directContact}>
                <div style={s.directLabel}>Or call / text directly</div>
                <a href="tel:+12089469198" style={{ ...s.directPhone, color: 'var(--green-dark)', textDecoration: 'none' }}>
                  (208) 946-9198
                </a>
                <div style={s.directEmail}>
                  <a href="mailto:Homesteadexconcrete@gmail.com" style={{ color: 'var(--gray-500)' }}>
                    Homesteadexconcrete@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div><ContactForm compact={false} /></div>
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA ── */}
      <section style={s.areasSection} aria-labelledby="areas-heading">
        <div style={s.sectionInner}>
          <h2 id="areas-heading" style={s.areasTitle}>Service area</h2>
          <p style={s.areasSub}>Proudly serving communities across North Idaho</p>
          <div style={s.areasGrid}>
            {AREAS.map(a => <span key={a} style={s.areaPill}>{a}</span>)}
            <span style={{ ...s.areaPill, borderStyle: 'dashed' }}>+ surrounding areas</span>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .form-section-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .gallery-preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
