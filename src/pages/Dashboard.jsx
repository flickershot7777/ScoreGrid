import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, examRes, resRes] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('name'),
        supabase.from('exams').select('*, categories(name, icon)').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('exam_results').select('*, exams(title)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(5),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (examRes.data) setExams(examRes.data);
      if (resRes.data) setResults(resRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = selectedCategory === 'all'
    ? exams
    : exams.filter(e => e.category_id === selectedCategory);

  const getDifficultyClass = (d) => {
    if (d === 'easy') return 'badge-easy';
    if (d === 'hard') return 'badge-hard';
    return 'badge-medium';
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="dashboard container">
        {/* Welcome Banner */}
        <div className="dashboard__banner glass-card">
          <div className="dashboard__banner-content">
            <h1>Welcome back! 👋</h1>
            <p>
              {user.email} • {results.length > 0
                ? `You've completed ${results.length} exam${results.length > 1 ? 's' : ''} recently`
                : 'Ready to start your first mock exam?'}
            </p>
          </div>
          <div className="dashboard__banner-stats">
            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-value">{exams.length}</span>
              <span className="dashboard__mini-stat-label">Available</span>
            </div>
            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-value">{categories.length}</span>
              <span className="dashboard__mini-stat-label">Categories</span>
            </div>
            <div className="dashboard__mini-stat">
              <span className="dashboard__mini-stat-value">{results.length}</span>
              <span className="dashboard__mini-stat-label">Attempts</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="dashboard__filters">
          <button
            className={`dashboard__filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Exams
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`dashboard__filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Exam Grid */}
        {filteredExams.length === 0 ? (
          <div className="dashboard__empty glass-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <h3>No exams available</h3>
            <p>Check back soon or ask your admin to add exams.</p>
          </div>
        ) : (
          <div className="dashboard__grid">
            {filteredExams.map((exam, i) => (
              <div key={exam.id} className="exam-card glass-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="exam-card__header">
                  <span className="exam-card__category">
                    {exam.categories?.icon} {exam.categories?.name || 'General'}
                  </span>
                  <span className={`badge ${getDifficultyClass(exam.difficulty)}`}>
                    {exam.difficulty}
                  </span>
                </div>

                <h3 className="exam-card__title">{exam.title}</h3>
                {exam.description && (
                  <p className="exam-card__desc">{exam.description}</p>
                )}

                <div className="exam-card__meta">
                  <div className="exam-card__meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {exam.duration_minutes} min
                  </div>
                  <div className="exam-card__meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {exam.total_questions} questions
                  </div>
                </div>

                <Link to={`/exam/${exam.id}`} className="btn btn-primary exam-card__btn">
                  Start Exam
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <section className="dashboard__results">
            <h2 className="dashboard__section-title">Recent Results</h2>
            <div className="results-list">
              {results.map((r) => {
                const pct = Math.round((r.score / r.total_questions) * 100);
                return (
                  <Link to={`/results/${r.id}`} key={r.id} className="result-item glass-card">
                    <div className="result-item__info">
                      <h4>{r.exams?.title || 'Exam'}</h4>
                      <p>{new Date(r.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="result-item__score">
                      <div className={`result-item__ring ${pct >= 70 ? 'good' : pct >= 40 ? 'ok' : 'bad'}`}>
                        <span>{pct}%</span>
                      </div>
                      <p>{r.score}/{r.total_questions}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
