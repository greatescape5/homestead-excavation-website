import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FILTERS = ['All', 'Concrete', 'Excavation', 'Driveways & Flatwork', 'Foundations', 'Clearing & Demo'];

const PLACEHOLDER_PROJECTS = [
  { id: 1, title: 'Residential Foundation — Sandpoint', category: 'Foundations', featured: true },
  { id: 2, title: 'Concrete Driveway — Athol', category: 'Driveways & Flatwork', featured: false },
  { id: 3, title: 'Site Excavation — Coeur d\'Alene', category: 'Excavation', featured: false },
  { id: 4, title: 'Retaining Wall — Sagle', category: 'Concrete', featured: false },
  { id: 5, title: 'Lot Clearing — Sandpoint', category: 'Clearing & Demo', featured: false },
  { id: 6, title: 'Garage Slab — Ponderay', category: 'Driveways & Flatwork', featured: false },
  { id: 7, title: 'Footings — Athol', category: 'Foundations', featured: false },
  { id: 8, title: 'Sidewalk & Exterior — CDA', category: 'Concrete', featured: false },
  { id: 9, title: 'Full Site Dig — Sandpoint', category: 'Excavation', featured: false },
];

const s = {
  page: { paddingTop: 64 },
  hero: { background: 'var(--green-dark)', padding: '4rem 1.5rem 3rem' },
  heroInner: { maxWidth: 1100, margin: '0 auto' },
  eyebrow: {
    color: 'var(--gold)', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.2em', textTransform: 'uppercase',
    borderLeft: '3px solid var(--gold)', paddingLeft: 10, marginBottom: 12,
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(42px, 7vw, 72px)',
    fontWeight: 800, color: 'var(--white)',
    textTransform: 'uppercase', letterSpacing: '0.03em',
    lineHeight: 0.95, marginBottom: '1rem',
  },
  heroPara: { color: '#aaa', fontSize: 16, maxWidth: 480 },
  filtersBar: {
    background: 'var(--white)',
    borderBottom: '1px solid var(--gray-200)',
    padding: '1rem 1.5rem', position: 'sticky', top: 64, zIndex: 10,
  },
  filtersInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: {
    background: 'var(--white)', border: '1.5px solid var(--gray-200)',
    borderRadius: 20, padding: '6px 16px',
    fontSize: 13, fontWeight: 500, color: 'var(--gray-700)',
    transition: 'all 0.15s', cursor: 'pointer',
  },
  filterActive: {
    background: 'var(--green-dark)', border: '1.5px solid var(--green-dark)',
    color: 'var(--gold)',
  },
  grid: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1.5px solid var(--gray-200)',
    borderRadius: 8, overflow: 'hidden',
    transition: 'transform 0.15s, box-shadow 0.15s',
    background: 'var(--white)',
  },
  cardImg: {
    aspectRatio: '4/3',
    background: 'var(--green-dark)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 10, position: 'relative',
  },
  cardImgFeatured: { aspectRatio: '16/9', background: '#2C3E28' },
  photoPlaceholder: { fontSize: 48, opacity: 0.2 },
  cardPhotoLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' },
  cardCategoryTag: {
    position: 'absolute', top: 12, left: 12,
    background: 'var(--gold)', color: 'var(--white)',
    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20,
  },
  featuredTag: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(255,255,255,0.15)', color: 'var(--white)',
    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  cardBody: { padding: '1rem 1.25rem' },
  cardTitle: { fontSize: 15, fontWeight: 600, color: 'var(--green-dark)' },
  // CTA
  ctaSection: {
    background: 'var(--cream)',
    borderTop: '1px solid var(--gray-200)',
    padding: '4rem 1.5rem', textAlign: 'center',
  },
  ctaTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 5vw, 44px)',
    fontWeight: 800, textTransform: 'uppercase',
    color: 'var(--green-dark)', letterSpacing: '0.03em', marginBottom: 12,
  },
  ctaSub: { color: 'var(--gray-500)', fontSize: 15, marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' },
  ctaBtn: {
    background: 'var(--gold)', color: 'var(--white)',
    border: 'none', borderRadius: 4,
    padding: '14px 32px', fontSize: 14, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    transition: 'background 0.15s',
  },
  emptyNote: {
    gridColumn: '1/-1', textAlign: 'center',
    padding: '4rem 2rem', color: 'var(--gray-500)', fontSize: 15,
  },
};

export default function Gallery() {
  const [active, setActive] = useState('All');

  useEffect(() => {
    document.title = "Project Gallery | Homestead Concrete & Excavation";
  }, []);

  const filtered = active === 'All'
    ? PLACEHOLDER_PROJECTS
    : PLACEHOLDER_PROJECTS.filter(p => p.category === active);

  return (
    <div style={s.page}>
      <section style={s.hero} aria-label="Gallery hero">
        <div style={s.heroInner}>
          <div style={s.eyebrow}>Our work</div>
          <h1 style={s.h1}>Built by hand.<br />Built to last.</h1>
          <p style={s.heroPara}>A look at concrete and excavation projects across North Idaho. Photos from the job site, no stock images.</p>
        </div>
      </section>

      <div style={s.filtersBar} role="navigation" aria-label="Filter projects">
        <div style={s.filtersInner}>
          {FILTERS.map(f => (
            <button key={f}
              style={{ ...s.filterBtn, ...(active === f ? s.filterActive : {}) }}
              onClick={() => setActive(f)}
              aria-pressed={active === f}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={s.grid}>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
          {filtered.length} project{filtered.length !== 1 ? 's' : ''} — photos will be added as jobs are completed.
        </p>
        <div style={s.projectsGrid}>
          {filtered.map(project => (
            <article key={project.id} style={s.card}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ ...s.cardImg, ...(project.featured ? s.cardImgFeatured : {}) }}>
                <span style={s.photoPlaceholder} aria-hidden="true">📷</span>
                <span style={s.cardPhotoLabel}>Photo coming soon</span>
                <span style={s.cardCategoryTag}>{project.category}</span>
                {project.featured && <span style={s.featuredTag}>Featured</span>}
              </div>
              <div style={s.cardBody}>
                <h2 style={s.cardTitle}>{project.title}</h2>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div style={s.emptyNote}>No projects in this category yet — check back soon.</div>
          )}
        </div>
      </div>

      <section style={s.ctaSection} aria-labelledby="gallery-cta">
        <h2 id="gallery-cta" style={s.ctaTitle}>Like what you see?</h2>
        <p style={s.ctaSub}>Get a free estimate on your concrete or excavation project.</p>
        <Link to="/contact">
          <button style={s.ctaBtn}
            onMouseEnter={e => e.target.style.background='var(--gold-light)'}
            onMouseLeave={e => e.target.style.background='var(--gold)'}>
            Request a Free Quote →
          </button>
        </Link>
      </section>
    </div>
  );
}
