import React, { useState } from 'react';

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
    background: '#fff', color: '#1a1a18',
  },
  textarea: {
    padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd',
    borderRadius: 4, outline: 'none', resize: 'vertical',
    minHeight: 110, transition: 'border-color 0.15s',
    background: '#fff', color: '#1a1a18', fontFamily: 'Inter, sans-serif',
  },
  select: {
    padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd',
    borderRadius: 4, outline: 'none', background: '#fff',
    color: '#1a1a18', width: '100%',
  },
  notify: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    background: '#EAF3DE', border: '1px solid #C0DD97',
    borderRadius: 4, padding: '10px 12px',
  },
  notifyText: { fontSize: 12, color: '#27500A', lineHeight: 1.5 },
  btn: {
    background: '#C17F24', color: '#fff',
    border: 'none', borderRadius: 4,
    padding: '14px 28px', fontSize: 14, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    transition: 'background 0.15s, transform 0.1s',
    alignSelf: 'flex-start', cursor: 'pointer',
  },
  success: {
    background: '#EAF3DE', border: '1px solid #C0DD97',
    borderRadius: 4, padding: '1.5rem', textAlign: 'center',
  },
  successTitle: { fontSize: 18, fontWeight: 700, color: '#1C2B1A', marginBottom: 6 },
  successText: { fontSize: 14, color: '#27500A' },
  error: {
    background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: 4, padding: '10px 14px',
    fontSize: 13, color: '#991B1B',
  },
};

export default function ContactForm({ compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', service: '', details: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleFocus = (e) => { e.target.style.borderColor = '#C17F24'; };
  const handleBlur = (e) => { e.target.style.borderColor = '#ddd'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setErrorMsg('Name and phone are required.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
      const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Configuration error — please contact us directly.');
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          address: form.address || null,
          service: form.service || null,
          details: form.details || null,
          source: 'website',
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Supabase error:', response.status, errText);
        throw new Error(`Submit failed: ${response.status}`);
      }

      setStatus('success');
    } catch (err) {
      console.error('Form error:', err);
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
          For urgent jobs, call or text <a href="tel:+12089469198" style={{ color: '#1C2B1A', fontWeight: 600 }}>(208) 946-9198</a>.
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
        <div style={s.row} className="form-row">
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="you@email.com"
              value={form.email} onChange={set('email')}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Project Address</label>
            <input style={s.input} type="text" placeholder="123 Main St, Sandpoint"
              value={form.address} onChange={set('address')}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
        </div>
      )}

      {compact && (
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
        <span style={{ fontSize: 16 }}>⚡</span>
        <span style={s.notifyText}>
          Submissions notify Chris instantly by email and are logged directly as a new lead.
        </span>
      </div>
      {errorMsg && <div style={s.error}>{errorMsg}</div>}
      <button type="submit"
        style={{ ...s.btn, opacity: status === 'loading' ? 0.7 : 1 }}
        disabled={status === 'loading'}
        onMouseEnter={e => { if (status !== 'loading') e.target.style.background = '#D4962E'; }}
        onMouseLeave={e => { e.target.style.background = '#C17F24'; }}>
        {status === 'loading' ? 'Sending...' : 'Send Request →'}
      </button>
      <style>{`@media (max-width: 560px) { .form-row { grid-template-columns: 1fr !important; } }`}</style>
    </form>
  );
}
