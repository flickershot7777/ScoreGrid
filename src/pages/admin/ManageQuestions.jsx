import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../admin/ManageCategories.css';

export default function ManageQuestions() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', sort_order: 0 });

  useEffect(() => { fetchAll(); }, [examId]);

  const fetchAll = async () => {
    const [e, q] = await Promise.all([
      supabase.from('exams').select('*, categories(name)').eq('id', examId).single(),
      supabase.from('questions').select('*').eq('exam_id', examId).order('sort_order'),
    ]);
    if (e.data) setExam(e.data);
    if (q.data) setQuestions(q.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', sort_order: questions.length + 1 });
    setShowModal(true);
  };

  const openEdit = (q) => {
    setEditing(q);
    setForm({ question_text: q.question_text, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_answer: q.correct_answer, sort_order: q.sort_order });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await supabase.from('questions').update(form).eq('id', editing.id);
      } else {
        await supabase.from('questions').insert({ ...form, exam_id: examId });
      }
      setShowModal(false);
      fetchAll();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    await supabase.from('questions').delete().eq('id', id);
    fetchAll();
  };

  if (loading) return <div className="page-wrapper"><div className="loading-screen"><div className="loader"></div></div></div>;

  return (
    <div className="page-wrapper">
      <div className="manage container">
        <div className="manage__header">
          <div>
            <Link to="/admin/exams" className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }}>← Back to Exams</Link>
            <h1>{exam?.title || 'Exam'} — Questions</h1>
            <p>{questions.length} / {exam?.total_questions || '?'} questions added</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Question</button>
        </div>

        {questions.length === 0 ? (
          <div className="manage__empty glass-card"><p>No questions yet. Add questions to this exam.</p></div>
        ) : (
          <div className="manage__questions-list">
            {questions.map((q, idx) => (
              <div key={q.id} className="question-card glass-card">
                <div className="question-card__header">
                  <span className="question-card__num">Q{idx + 1}</span>
                  <span className="badge badge-primary">Answer: {q.correct_answer}</span>
                  <div className="question-card__actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(q)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger-400)' }} onClick={() => handleDelete(q.id)}>Delete</button>
                  </div>
                </div>
                <p className="question-card__text">{q.question_text}</p>
                <div className="question-card__options">
                  {['A','B','C','D'].map(o => (
                    <span key={o} className={`question-card__opt ${q.correct_answer === o ? 'correct' : ''}`}>
                      <strong>{o}.</strong> {q[`option_${o.toLowerCase()}`]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <div className="modal-header">
                <h2 className="modal-title">{editing ? 'Edit Question' : 'Add Question'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSave} className="manage__form">
                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <textarea className="form-textarea" rows={3} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))} required />
                </div>
                <div className="manage__form-row">
                  <div className="form-group">
                    <label className="form-label">Option A</label>
                    <input className="form-input" value={form.option_a} onChange={e => setForm(f => ({ ...f, option_a: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Option B</label>
                    <input className="form-input" value={form.option_b} onChange={e => setForm(f => ({ ...f, option_b: e.target.value }))} required />
                  </div>
                </div>
                <div className="manage__form-row">
                  <div className="form-group">
                    <label className="form-label">Option C</label>
                    <input className="form-input" value={form.option_c} onChange={e => setForm(f => ({ ...f, option_c: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Option D</label>
                    <input className="form-input" value={form.option_d} onChange={e => setForm(f => ({ ...f, option_d: e.target.value }))} required />
                  </div>
                </div>
                <div className="manage__form-row">
                  <div className="form-group">
                    <label className="form-label">Correct Answer</label>
                    <select className="form-select" value={form.correct_answer} onChange={e => setForm(f => ({ ...f, correct_answer: e.target.value }))}>
                      <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                  </div>
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
