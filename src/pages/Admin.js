import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const headers = (token) => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${token || SUPABASE_KEY}`,
});

const s = {
  page: { paddingTop: 64, minHeight: '100vh', background: '#f5f2ec' },
  loginWrap: { maxWidth: 400, margin: '0 auto', padding: '4rem 1.5rem' },
  loginCard: { background: '#fff', border: '1.5px solid #e0ddd8', borderRadius: 8, padding: '2.5rem' },
  loginHeader: { textAlign: 'center', marginBottom: '2rem' },
  loginTitle: { fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', color: '#1C2B1A', letterSpacing: '0.05em' },
  loginSub: { fontSize: 13, color: '#888', marginTop: 4 },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 },
  input: { width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd', borderRadius: 4, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#C17F24', color: '#fff', border: 'none', borderRadius: 4, padding: '13px', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' },
  error: { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#991B1B', marginBottom: '1rem' },
  // ADMIN PANEL
  adminWrap: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' },
  adminHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 },
  adminTitle: { fontFamily: 'Barlow Condensed, sans-serif', fontSize: 32, fontWeight: 800, textTransform: 'uppercase', color: '#1C2B1A', letterSpacing: '0.05em' },
  logoutBtn: { background: 'transparent', border: '1.5px solid #ddd', borderRadius: 4, padding: '8px 16px', fontSize: 13, color: '#666', cursor: 'pointer' },
  tabs: { display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '1.5px solid #e0ddd8' },
  tab: { padding: '10px 20px', fontSize: 13, fontWeight: 500, color: '#888', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: -1.5 },
  tabActive: { color: '#1C2B1A', borderBottomColor: '#C17F24' },
  card: { background: '#fff', border: '1.5px solid #e0ddd8', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem' },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#1C2B1A', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  photoCard: { border: '1.5px solid #e0ddd8', borderRadius: 6, overflow: 'hidden', background: '#fff' },
  photoImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', background: '#f0ede8' },
  photoBody: { padding: '10px 12px' },
  photoTitle: { fontSize: 13, fontWeight: 500, color: '#1C2B1A', marginBottom: 4 },
  photoCat: { fontSize: 11, color: '#888' },
  photoActions: { display: 'flex', gap: 6, marginTop: 8 },
  deleteBtn: { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 4, padding: '4px 10px', fontSize: 11, cursor: 'pointer' },
  featuredBtn: { background: '#EAF3DE', color: '#27500A', border: '1px solid #C0DD97', borderRadius: 4, padding: '4px 10px', fontSize: 11, cursor: 'pointer' },
  uploadArea: { border: '2px dashed #ddd', borderRadius: 8, padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadText: { fontSize: 14, color: '#666' },
  uploadSub: { fontSize: 12, color: '#aaa', marginTop: 4 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  select: { width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid #ddd', borderRadius: 4, outline: 'none', background: '#fff', boxSizing: 'border-box' },
  submitBtn: { background: '#1C2B1A', color: '#fff', border: 'none', borderRadius: 4, padding: '11px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  catRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0ede8' },
  catName: { fontSize: 14, color: '#1C2B1A', fontWeight: 500 },
  inlineInput: { padding: '8px 12px', fontSize: 13, border: '1.5px solid #ddd', borderRadius: 4, outline: 'none', marginRight: 8 },
  addBtn: { background: '#C17F24', color: '#fff', border: 'none', borderRadius: 4, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  successMsg: { background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#27500A', marginBottom: '1rem' },
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', category_id: '', featured: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('hce_admin_token');
    if (stored) {
      try { setSession(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchCategories();
      fetchPhotos();
    }
  }, [session]);

  const login = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || 'Login failed');
      localStorage.setItem('hce_admin_token', JSON.stringify(data));
      setSession(data);
    } catch (err) {
      setLoginError(err.message);
    }
    setLoginLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('hce_admin_token');
    setSession(null);
  };

  const token = session?.access_token;

  const fetchCategories = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?order=sort_order`, { headers: headers(token) });
    const data = await res.json();
    if (Array.isArray(data)) setCategories(data);
  };

  const fetchPhotos = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/photos?order=sort_order,created_at.desc&select=*,categories(name)`, { headers: headers(token) });
    const data = await res.json();
    if (Array.isArray(data)) setPhotos(data);
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
      method: 'POST',
      headers: { ...headers(token), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name: newCatName.trim(), sort_order: categories.length + 1 }),
    });
    setNewCatName('');
    fetchCategories();
    showMsg('Category added!');
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await fetch(`${SUPABASE_URL}/rest/v1/categories?id=eq.${id}`, { method: 'DELETE', headers: headers(token) });
    fetchCategories();
  };

  const uploadPhoto = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadForm.title) { showMsg('Please select a file and enter a title.'); return; }
    setUploading(true);
    try {
      const ext = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/gallery/${fileName}`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': selectedFile.type },
        body: selectedFile,
      });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/gallery/${fileName}`;
      await fetch(`${SUPABASE_URL}/rest/v1/photos`, {
        method: 'POST',
        headers: { ...headers(token), 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          title: uploadForm.title,
          category_id: uploadForm.category_id || null,
          storage_path: `gallery/${fileName}`,
          public_url: publicUrl,
          featured: uploadForm.featured,
        }),
      });
      setSelectedFile(null);
      setUploadForm({ title: '', category_id: '', featured: false });
      fetchPhotos();
      showMsg('Photo uploaded successfully!');
    } catch (err) {
      showMsg('Upload failed — ' + err.message);
    }
    setUploading(false);
  };

  const deletePhoto = async (photo) => {
    if (!window.confirm('Delete this photo?')) return;
    await fetch(`${SUPABASE_URL}/storage/v1/object/gallery/${photo.storage_path.replace('gallery/', '')}`, { method: 'DELETE', headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` } });
    await fetch(`${SUPABASE_URL}/rest/v1/photos?id=eq.${photo.id}`, { method: 'DELETE', headers: headers(token) });
    fetchPhotos();
  };

  const toggleFeatured = async (photo) => {
    await fetch(`${SUPABASE_URL}/rest/v1/photos?id=eq.${photo.id}`, {
      method: 'PATCH',
      headers: { ...headers(token), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ featured: !photo.featured }),
    });
    fetchPhotos();
  };

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  if (!session) {
    return (
      <div style={s.page}>
        <div style={s.loginWrap}>
          <div style={s.loginCard}>
            <div style={s.loginHeader}>
              <div style={s.loginTitle}>Admin Login</div>
              <div style={s.loginSub}>Homestead Concrete & Excavation</div>
            </div>
            {loginError && <div style={s.error}>{loginError}</div>}
            <form onSubmit={login}>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@email.com" required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Password</label>
                <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <button type="submit" style={s.btn} disabled={loginLoading}>
                {loginLoading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.adminWrap}>
        <div style={s.adminHeader}>
          <div style={s.adminTitle}>Gallery Admin</div>
          <button style={s.logoutBtn} onClick={logout}>Sign Out</button>
        </div>

        {msg && <div style={s.successMsg}>{msg}</div>}

        <div style={s.tabs}>
          {[['photos', 'Photos'], ['upload', 'Upload Photo'], ['categories', 'Categories']].map(([id, label]) => (
            <button key={id} style={{ ...s.tab, ...(activeTab === id ? s.tabActive : {}) }} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {/* ── PHOTOS TAB ── */}
        {activeTab === 'photos' && (
          <div>
            <div style={s.card}>
              <div style={s.cardTitle}>All Photos ({photos.length})</div>
              {photos.length === 0 ? (
                <p style={{ color: '#888', fontSize: 14 }}>No photos yet — upload your first one.</p>
              ) : (
                <div style={s.grid}>
                  {photos.map(photo => (
                    <div key={photo.id} style={s.photoCard}>
                      <img src={photo.public_url} alt={photo.title} style={s.photoImg} />
                      <div style={s.photoBody}>
                        <div style={s.photoTitle}>{photo.title}</div>
                        <div style={s.photoCat}>{photo.categories?.name || 'Uncategorized'}{photo.featured ? ' · ⭐ Featured' : ''}</div>
                        <div style={s.photoActions}>
                          <button style={s.featuredBtn} onClick={() => toggleFeatured(photo)}>
                            {photo.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button style={s.deleteBtn} onClick={() => deletePhoto(photo)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── UPLOAD TAB ── */}
        {activeTab === 'upload' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Upload New Photo</div>
            <form onSubmit={uploadPhoto}>
              <div style={{ ...s.uploadArea, borderColor: selectedFile ? '#C17F24' : '#ddd', marginBottom: '1.5rem' }}
                onClick={() => document.getElementById('file-input').click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); setSelectedFile(e.dataTransfer.files[0]); }}>
                <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => setSelectedFile(e.target.files[0])} />
                <div style={s.uploadIcon}>📷</div>
                <div style={s.uploadText}>{selectedFile ? selectedFile.name : 'Click or drag to select a photo'}</div>
                <div style={s.uploadSub}>JPG, PNG, WEBP — max 10MB</div>
              </div>
              <div style={s.row}>
                <div>
                  <label style={s.label}>Photo Title</label>
                  <input style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} type="text"
                    placeholder="e.g. Concrete Driveway — Sandpoint"
                    value={uploadForm.title}
                    onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label style={s.label}>Category</label>
                  <select style={s.select} value={uploadForm.category_id}
                    onChange={e => setUploadForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', marginBottom: '1.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={uploadForm.featured}
                  onChange={e => setUploadForm(f => ({ ...f, featured: e.target.checked }))} />
                Feature this photo (shows prominently in gallery)
              </label>
              <button type="submit" style={s.submitBtn} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Photo →'}
              </button>
            </form>
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === 'categories' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Manage Categories</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
              <input style={{ ...s.inlineInput, flex: 1 }} type="text" placeholder="New category name..."
                value={newCatName} onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCategory()} />
              <button style={s.addBtn} onClick={addCategory}>Add Category</button>
            </div>
            {categories.map(cat => (
              <div key={cat.id} style={s.catRow}>
                <span style={s.catName}>{cat.name}</span>
                <button style={s.deleteBtn} onClick={() => deleteCategory(cat.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
