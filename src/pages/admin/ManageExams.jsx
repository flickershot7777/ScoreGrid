import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../admin/ManageCategories.css';

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category_id: '', duration_minutes: 30, total_questions: 10, difficulty: 'medium', is_active: true });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [e, c] = await Promise.all([
      supabase.from('exams').select('*, categories(name, icon)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);
    if (e.data) setExams(e.data);
    if (c.data) setCategories(c.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', category_id: categories[0]?.id || '', duration_minutes: 30, total_questions: 10, difficulty: 'medium', is_active: true });
    setShowModal(true);
  };

  const openEdit = (ex) => {
    setEditing(ex);
    setForm({ title: ex.title, description: ex.description || '', category_id: ex.category_id, duration_minutes: ex.duration_minutes, total_questions: ex.total_questions, difficulty: ex.difficulty, is_active: ex.is_active });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await supabase.from('exams').update(form).eq('id', editing.id);
      } else {
        await supabase.from('exams').insert(form);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this exam and all its questions?')) return;
    await supabase.from('exams').delete().eq('id', id);
    fetchAll();
  };

  if (loading) return <div className="page-wrapper"><div className="loading-screen"><div className="loader"></div></div></div>;

  return (
    <div className="page-wrapper">
      <div className="manage container">
        <div className="manage__header">
          <div><h1>Manage Exams</h1><p>{exams.length} exams</p></div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Exam</button>
        </div>

        {exams.length === 0 ? (
          <div className="manage__empty glass-card"><p>No exams yet. Create a category first, then add exams.</p></div>
        ) : (
          <div className="manage__table-wrap glass-card">
            <table className="manage__table">
              <thead>
                <tr><th>Title</th><th>Category</th><th>Duration</th><th>Questions</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {exams.map(ex => (
                  <tr key={ex.id}>
                    <td className="manage__table-name">{ex.title}</td>
                    <td>{ex.categories?.icon} {ex.categories?.name || '—'}</td>
                    <td>{ex.duration_minutes} min</td>
                    <td>{ex.total_questions}</td>
                    <td><span className={`badge ${ex.difficulty === 'easy' ? 'badge-easy' : ex.difficulty === 'hard' ? 'badge-hard' : 'badge-medium'}`}>{ex.difficulty}</span></td>
                    <td><span className={`badge ${ex.is_active ? 'badge-easy' : 'badge-hard'}`}>{ex.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="manage__table-actions">
                      <Link to={`/admin/exams/${ex.id}/questions`} className="btn btn-ghost btn-sm">Questions</Link>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ex)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger-400)' }} onClick={() => handleDelete(ex.id)}>Delete</button>
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
                <h2 className="modal-title">{editing ? 'Edit Exam' : 'Add Exam'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSave} className="manage__form">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="manage__form-row">
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input type="number" className="form-input" min="1" max="300" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 30 }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Questions</label>
                    <input type="number" className="form-input" min="1" max="200" value={form.total_questions} onChange={e => setForm(f => ({ ...f, total_questions: parseInt(e.target.value) || 10 }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
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
