import React, { useState } from 'react';
import { supabase } from '../supabase';

const SERVICES = [
  'Footings & Foundations',
  'Slabs & Flatwork',
  'Sidewalks & Exterior',
  'Concrete Stairs, Pavers & Retaining Walls',
  'Lot Clearing & Demolition',
  'Foundation & Site Digs',
  'Septic Systems & Utilities',
  'Dump Truck Hauling',
  'Other / Not Sure',
];

const s = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' },
  input: {
    padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd',
    borderRadius: 4, outline: 'none', transition: 'border-color 0.15s',
    background: '#fff', color: 'var(--gray-900)',
  },
  textarea: {
    padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd',
    borderRadius: 4, outline: 'none', resize: 'vertical',
    minHeight: 110, transition: 'border-color 0.15s',
    background: '#fff', color: 'var(--gray-900)', fontFamily: 'var(--font-body)',
  },
  select: {
    padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd',
    borderRadius: 4, outline: 'none', background: '#fff',
    color: 'var(--gray-900)', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  },
  notify: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    background: '#EAF3DE', border: '1px solid #C0DD97',
    borderRadius: 4, padding: '10px 12px',
  },
  notifyIcon: { fontSize: 16, marginTop: 1 },
  notifyText: { fontSize: 12, color: '#27500A', lineHeight: 1.5 },
  btn: {
    background: 'var(--gold)', color: 'var(--white)',
    border: 'none', borderRadius: 4,
    padding: '14px 28px', fontSize: 14, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    transition: 'background 0.15s, transform 0.1s',
    alignSelf: 'flex-start',
  },
  btnLoading: { opacity: 0.7, cursor: 'not-allowed' },
  success: {
    background: '#EAF3DE', border: '1px solid #C0DD97',
    borderRadius: 4, padding: '1.5rem', textAlign: 'center',
  },
  successTitle: { fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 },
  successText: { fontSize: 14, color: '#27500A' },
  error: {
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: 4, padding: '10px 14px',
    fontSize: 13, color: '#991B1B',
  },
};

export default function ContactForm({ compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', details: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const focusStyle = { borderColor: 'var(--gold)' };
  const handleFocus = (e) => Object.assign(e.target.style, focusStyle);
  const handleBlur = (e) => { e.target.style.borderColor = '#ddd'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setErrorMsg('Name and phone are required.'); return; }
    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('leads').insert([{
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        service: form.service || null,
        details: form.details || null,
        source: 'website',
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please call or text us directly at (208) 946-9198.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={s.success}>
        <div style={s.successTitle}>✓ Request received!</div>
        <p style={s.successText}>
          Chris will reach out shortly — usually within a few hours.<br />
          For urgent jobs, call or text <a href="tel:+12089469198" style={{ color: 'var(--green-dark)', fontWeight: 600 }}>(208) 946-9198</a>.
        </p>
      </div>
    );
  }

  return (
    <form style={s.form} onSubmit={handleSubmit} noValidate>
      <div style={s.row} className="form-row">
        <div style={s.field}>
          <label style={s.label}>Name *</label>
          <input style={s.input} type="text" placeholder="Your name"
            value={form.name} onChange={set('name')}
            onFocus={handleFocus} onBlur={handleBlur} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Phone *</label>
          <input style={s.input} type="tel" placeholder="(208) 000-0000"
            value={form.phone} onChange={set('phone')}
            onFocus={handleFocus} onBlur={handleBlur} required />
        </div>
      </div>
      {!compact && (
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@email.com"
            value={form.email} onChange={set('email')}
            onFocus={handleFocus} onBlur={handleBlur} />
        </div>
      )}
      <div style={s.field}>
        <label style={s.label}>Service needed</label>
        <select style={s.select} value={form.service} onChange={set('service')}
          onFocus={handleFocus} onBlur={handleBlur}>
          <option value="">Select a service...</option>
          {SERVICES.map(sv => <option key={sv} value={sv}>{sv}</option>)}
        </select>
      </div>
      <div style={s.field}>
        <label style={s.label}>Project details</label>
        <textarea style={s.textarea}
          placeholder="Describe your project — location, scope, timeline, any questions..."
          value={form.details} onChange={set('details')}
          onFocus={handleFocus} onBlur={handleBlur} />
      </div>
      <div style={s.notify}>
        <span style={s.notifyIcon}>⚡</span>
        <span style={s.notifyText}>
          Submissions notify Chris instantly by text and email, and are logged directly as a new lead.
        </span>
      </div>
      {errorMsg && <div style={s.error}>{errorMsg}</div>}
      <button type="submit"
        style={{ ...s.btn, ...(status === 'loading' ? s.btnLoading : {}) }}
        disabled={status === 'loading'}
        onMouseEnter={e => { if (status !== 'loading') e.target.style.background = 'var(--gold-light)'; }}
        onMouseLeave={e => e.target.style.background = 'var(--gold)'}>
        {status === 'loading' ? 'Sending...' : 'Send Request →'}
      </button>
      <style>{`@media (max-width: 560px) { .form-row { grid-template-columns: 1fr !important; } }`}</style>
    </form>
  );
}
