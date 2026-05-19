import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, exams: 0, questions: 0, results: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [cats, exms, qs, rs] = await Promise.all([
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('exams').select('id', { count: 'exact', head: true }),
        supabase.from('questions').select('id', { count: 'exact', head: true }),
        supabase.from('exam_results').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ categories: cats.count || 0, exams: exms.count || 0, questions: qs.count || 0, results: rs.count || 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="page-wrapper"><div className="loading-screen"><div className="loader"></div></div></div>;

  return (
    <div className="page-wrapper">
      <div className="admin container">
        <div className="admin__header">
          <h1>OPCO Admin Panel</h1>
          <p>Manage your exam platform</p>
        </div>

        <div className="admin__stats-grid">
          {[
            { label: 'Categories', value: stats.categories, icon: '📂', color: 'primary' },
            { label: 'Exams', value: stats.exams, icon: '📝', color: 'accent' },
            { label: 'Questions', value: stats.questions, icon: '❓', color: 'success' },
            { label: 'Submissions', value: stats.results, icon: '📊', color: 'warning' },
          ].map(s => (
            <div key={s.label} className={`admin__stat-card glass-card admin__stat-card--${s.color}`}>
              <div className="admin__stat-icon">{s.icon}</div>
              <div className="admin__stat-info">
                <span className="admin__stat-value">{s.value}</span>
                <span className="admin__stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin__actions-grid">
          <Link to="/admin/categories" className="admin__action-card glass-card">
            <div className="admin__action-icon">📂</div>
            <h3>Manage Categories</h3>
            <p>Create and organize exam categories</p>
            <span className="admin__action-link">Go →</span>
          </Link>
          <Link to="/admin/exams" className="admin__action-card glass-card">
            <div className="admin__action-icon">📝</div>
            <h3>Manage Exams</h3>
            <p>Create exams, set durations & difficulty</p>
            <span className="admin__action-link">Go →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
