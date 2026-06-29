import React, { useEffect } from 'react';
import ContactForm from '../components/ContactForm';

const s = {
  page: { paddingTop: 116 },
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
  body: { maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '4rem', alignItems: 'start' },
  // INFO PANEL
  infoCard: {
    background: 'var(--cream)',
    border: '1.5px solid var(--gray-200)',
    borderRadius: 8, padding: '2rem',
    position: 'sticky', top: 80,
  },
  infoTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22, fontWeight: 800, textTransform: 'uppercase',
    color: 'var(--green-dark)', letterSpacing: '0.05em', marginBottom: '1.5rem',
  },
  infoItem: { display: 'flex', gap: 12, marginBottom: '1.5rem', alignItems: 'flex-start' },
  infoIcon: {
    width: 38, height: 38, background: 'var(--green-dark)',
    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: 16,
  },
  infoLabel: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: 600, color: 'var(--green-dark)', lineHeight: 1.5 },
  infoValueLink: { color: 'var(--gold)', fontWeight: 700, fontSize: 18 },
  divider: { border: 'none', borderTop: '1px solid var(--gray-200)', margin: '1.5rem 0' },
  areasLabel: { fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 },
  areasList: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  areaTag: {
    background: 'var(--white)', border: '1px solid var(--gray-200)',
    borderRadius: 20, padding: '4px 12px',
    fontSize: 12, color: 'var(--gray-700)',
  },
  // FORM PANEL
  formPanel: {},
  formPanelTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 28, fontWeight: 800, textTransform: 'uppercase',
    color: 'var(--green-dark)', letterSpacing: '0.04em', marginBottom: 6,
  },
  formPanelSub: { fontSize: 14, color: 'var(--gray-500)', marginBottom: '2rem', lineHeight: 1.6 },
};

const INFO_ITEMS = [
  { icon: '📞', label: 'Call or text', value: <a href="tel:+12089469198" style={s.infoValueLink}>(208) 946-9198</a> },
  { icon: '✉️', label: 'Email', value: <a href="mailto:Homesteadexconcrete@gmail.com" style={{ color: 'var(--green-dark)', fontSize: 13 }}>Homesteadexconcrete@gmail.com</a> },
  { icon: '📍', label: 'Based in', value: 'Athol, Idaho' },
  { icon: '🕐', label: 'Hours', value: 'Mon–Sat, 7am–6pm\nCall/text for urgent jobs' },
  { icon: '👤', label: 'Owner', value: 'Chris Bunty' },
];

const AREAS = ['Sandpoint', 'Athol', 'Coeur d\'Alene', 'Ponderay', 'Sagle', 'Priest River', 'Spirit Lake', 'Post Falls'];

export default function Contact() {
  useEffect(() => {
    document.title = "Contact & Free Quote | Homestead Concrete & Excavation";
  }, []);

  return (
    <div style={s.page}>
      <section style={s.hero} aria-label="Contact hero">
        <div style={s.heroInner}>
          <div style={s.eyebrow}>Get in touch</div>
          <h1 style={s.h1}>Request a<br />free estimate</h1>
          <p style={s.heroPara}>
            We respond fast — usually the same day. For urgent jobs, call or text directly.
          </p>
        </div>
      </section>

      <div style={s.body}>
        <div style={s.grid} className="contact-grid">
          {/* INFO */}
          <aside style={s.infoCard} aria-label="Contact information">
            <div style={s.infoTitle}>Contact info</div>
            {INFO_ITEMS.map(item => (
              <div key={item.label} style={s.infoItem}>
                <div style={s.infoIcon} aria-hidden="true">{item.icon}</div>
                <div>
                  <div style={s.infoLabel}>{item.label}</div>
                  <div style={{ ...s.infoValue, whiteSpace: 'pre-line' }}>{item.value}</div>
                </div>
              </div>
            ))}
            <hr style={s.divider} />
            <div style={s.areasLabel}>Service area</div>
            <div style={s.areasList}>
              {AREAS.map(a => <span key={a} style={s.areaTag}>{a}</span>)}
              <span style={{ ...s.areaTag, borderStyle: 'dashed' }}>+ more</span>
            </div>
          </aside>

          {/* FORM */}
          <div style={s.formPanel}>
            <h2 style={s.formPanelTitle}>Tell us about your project</h2>
            <p style={s.formPanelSub}>
              Fill out the form below and Chris will reach out shortly. No commitment, no pressure — just a straight answer on what your job will take.
            </p>
            <ContactForm compact={false} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
