import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './ManageCategories.css';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '📚', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', icon: '📚', is_active: true }); setShowModal(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '📚', is_active: cat.is_active }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await supabase.from('categories').update(form).eq('id', editing.id);
      } else {
        await supabase.from('categories').insert(form);
      }
      setShowModal(false);
      fetch();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? All its exams will also be deleted.')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetch();
  };

  if (loading) return <div className="page-wrapper"><div className="loading-screen"><div className="loader"></div></div></div>;

  return (
    <div className="page-wrapper">
      <div className="manage container">
        <div className="manage__header">
          <div>
            <h1>Manage Categories</h1>
            <p>{categories.length} categories</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
        </div>

        {categories.length === 0 ? (
          <div className="manage__empty glass-card">
            <p>No categories yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="manage__table-wrap glass-card">
            <table className="manage__table">
              <thead>
                <tr><th>Icon</th><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td className="manage__table-icon">{cat.icon}</td>
                    <td className="manage__table-name">{cat.name}</td>
                    <td className="manage__table-desc">{cat.description || '—'}</td>
                    <td><span className={`badge ${cat.is_active ? 'badge-easy' : 'badge-hard'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="manage__table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger-400)' }} onClick={() => handleDelete(cat.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSave} className="manage__form">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon (emoji)</label>
                  <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
