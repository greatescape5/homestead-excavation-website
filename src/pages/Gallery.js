import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const s = {
  page: { paddingTop: 116 },
  hero: { background: 'var(--green-dark)', padding: '4rem 1.5rem 3rem' },
  heroInner: { maxWidth: 1100, margin: '0 auto' },
  eyebrow: { color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', borderLeft: '3px solid var(--gold)', paddingLeft: 10, marginBottom: 12 },
  h1: { fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 800, color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 0.95, marginBottom: '1rem' },
  heroPara: { color: '#aaa', fontSize: 16, maxWidth: 480 },
  filtersBar: { background: 'var(--white)', borderBottom: '1px solid var(--gray-200)', padding: '1rem 1.5rem', position: 'sticky', top: 116, zIndex: 10 },
  filtersInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { background: 'var(--white)', border: '1.5px solid var(--gray-200)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 500, color: 'var(--gray-700)', transition: 'all 0.15s', cursor: 'pointer' },
  filterActive: { background: 'var(--green-dark)', border: '1.5px solid var(--green-dark)', color: 'var(--gold)' },
  grid: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' },
  projectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { border: '1.5px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s', background: 'var(--white)' },
  cardImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', background: 'var(--green-dark)' },
  cardImgFeatured: { aspectRatio: '16/9' },
  cardBody: { padding: '1rem 1.25rem' },
  cardTitle: { fontSize: 15, fontWeight: 600, color: 'var(--green-dark)' },
  cardCat: { fontSize: 12, color: 'var(--gray-500)', marginTop: 3 },
  categoryTag: { display: 'inline-block', background: 'var(--gold)', color: 'var(--white)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 20, marginTop: 6 },
  placeholder: { width: '100%', aspectRatio: '4/3', background: '#2C3E28', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeholderIcon: { fontSize: 36, opacity: 0.2 },
  placeholderText: { fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' },
  ctaSection: { background: 'var(--cream)', borderTop: '1px solid var(--gray-200)', padding: '4rem 1.5rem', textAlign: 'center' },
  ctaTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--green-dark)', letterSpacing: '0.03em', marginBottom: 12 },
  ctaSub: { color: 'var(--gray-500)', fontSize: 15, marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' },
  ctaBtn: { background: 'var(--gold)', color: 'var(--white)', border: 'none', borderRadius: 4, padding: '14px 32px', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.15s', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '4rem', color: 'var(--gray-500)', fontSize: 15 },
};

export default function Gallery() {
  const [active, setActive] = useState('All');
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Project Gallery | Homestead Concrete & Excavation";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [photosRes, catsRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/photos?order=featured.desc,sort_order,created_at.desc&select=*,categories(name)`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/categories?order=sort_order`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        }),
      ]);
      const photosData = await photosRes.json();
      const catsData = await catsRes.json();
      if (Array.isArray(photosData)) setPhotos(photosData);
      if (Array.isArray(catsData)) setCategories(catsData);
    } catch (err) {
      console.error('Gallery fetch error:', err);
    }
    setLoading(false);
  };

  const filters = ['All', ...categories.map(c => c.name)];
  const filtered = active === 'All' ? photos : photos.filter(p => p.categories?.name === active);

  return (
    <div style={s.page}>
      <section style={s.hero} aria-label="Gallery hero">
        <div style={s.heroInner}>
          <div style={s.eyebrow}>Our work</div>
          <h1 style={s.h1}>Built by hand.<br />Built to last.</h1>
          <p style={s.heroPara}>A look at concrete and excavation projects across North Idaho. Photos from the job site, no stock images.</p>
        </div>
      </section>

      <div style={s.filtersBar}>
        <div style={s.filtersInner}>
          {filters.map(f => (
            <button key={f} style={{ ...s.filterBtn, ...(active === f ? s.filterActive : {}) }}
              onClick={() => setActive(f)} aria-pressed={active === f}>{f}</button>
          ))}
        </div>
      </div>

      <div style={s.grid}>
        {loading ? (
          <div style={s.loading}>Loading gallery...</div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              {photos.length === 0 ? ' — photos will be added as jobs are completed.' : ''}
            </p>
            <div style={s.projectsGrid}>
              {filtered.map(photo => (
                <article key={photo.id} style={s.card}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <img src={photo.public_url} alt={photo.title}
                    style={{ ...s.cardImg, ...(photo.featured ? s.cardImgFeatured : {}) }} />
                  <div style={s.cardBody}>
                    <div style={s.cardTitle}>{photo.title}</div>
                    {photo.categories?.name && (
                      <span style={s.categoryTag}>{photo.categories.name}</span>
                    )}
                  </div>
                </article>
              ))}
              {filtered.length === 0 && !loading && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--gray-500)', fontSize: 15 }}>
                  No projects in this category yet — check back soon.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Like what you see?</h2>
        <p style={s.ctaSub}>Get a free estimate on your concrete or excavation project.</p>
        <Link to="/contact">
          <button style={s.ctaBtn}
            onMouseEnter={e => e.target.style.background = 'var(--gold-light)'}
            onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
            Request a Free Quote →
          </button>
        </Link>
      </section>
    </div>
  );
}
