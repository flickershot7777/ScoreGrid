import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Results.css';

export default function Results() {
  const { resultId } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [exam, setExam] = useState(location.state?.exam || null);
  const [loading, setLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (!result) fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const { data: r } = await supabase.from('exam_results').select('*, exams(*, categories(name, icon))').eq('id', resultId).single();
      if (r) {
        setResult(r);
        setExam(r.exams);
        const { data: q } = await supabase.from('questions').select('*').eq('exam_id', r.exam_id).order('sort_order');
        if (q) setQuestions(q);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="page-wrapper"><div className="loading-screen"><div className="loader"></div><p>Loading results...</p></div></div>;
  if (!result) return <div className="page-wrapper"><div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Result not found</h2><Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Dashboard</Link></div></div>;

  const pct = Math.round((result.score / result.total_questions) * 100);
  const incorrect = result.total_questions - result.score - (result.total_questions - Object.keys(result.answers || {}).length);
  const unanswered = result.total_questions - Object.keys(result.answers || {}).length;
  const minutes = Math.floor((result.time_taken_seconds || 0) / 60);
  const seconds = (result.time_taken_seconds || 0) % 60;

  return (
    <div className="page-wrapper">
      <div className="results container">
        <div className="results__header">
          <h1>Exam Results</h1>
          <p>{exam?.title || 'Mock Exam'}</p>
        </div>

        {/* Score Card */}
        <div className="results__score-card glass-card">
          <div className="results__ring-wrap">
            <div className={`results__ring ${pct >= 70 ? 'good' : pct >= 40 ? 'ok' : 'bad'}`}>
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${pct * 3.267} 326.7`}
                  transform="rotate(-90 60 60)"
                  className="results__ring-progress"
                />
              </svg>
              <div className="results__ring-text">
                <span className="results__ring-pct">{pct}%</span>
                <span className="results__ring-label">Score</span>
              </div>
            </div>
          </div>

          <div className="results__stats-grid">
            <div className="results__stat-box results__stat-box--correct">
              <span className="results__stat-val">{result.score}</span>
              <span className="results__stat-lbl">Correct</span>
            </div>
            <div className="results__stat-box results__stat-box--incorrect">
              <span className="results__stat-val">{incorrect >= 0 ? incorrect : 0}</span>
              <span className="results__stat-lbl">Incorrect</span>
            </div>
            <div className="results__stat-box results__stat-box--unanswered">
              <span className="results__stat-val">{unanswered}</span>
              <span className="results__stat-lbl">Unanswered</span>
            </div>
            <div className="results__stat-box results__stat-box--time">
              <span className="results__stat-val">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              <span className="results__stat-lbl">Time Taken</span>
            </div>
          </div>
        </div>

        <div className="results__actions">
          <Link to={`/exam/${result.exam_id}`} className="btn btn-primary">Retake Exam</Link>
          <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        {/* Question Review */}
        {questions.length > 0 && (
          <div className="results__review">
            <h2>Question Review</h2>
            <div className="results__questions">
              {questions.map((q, idx) => {
                const userAns = result.answers?.[q.id];
                const isCorrect = userAns === q.correct_answer;
                const isUnanswered = !userAns;
                return (
                  <div key={q.id} className={`review-card glass-card ${isCorrect ? 'correct' : isUnanswered ? 'unanswered' : 'incorrect'}`}>
                    <div className="review-card__header">
                      <span className="review-card__num">Q{idx + 1}</span>
                      <span className={`review-card__badge ${isCorrect ? 'correct' : isUnanswered ? 'unanswered' : 'incorrect'}`}>
                        {isCorrect ? '✓ Correct' : isUnanswered ? '— Skipped' : '✕ Incorrect'}
                      </span>
                    </div>
                    <p className="review-card__text">{q.question_text}</p>
                    <div className="review-card__options">
                      {['A','B','C','D'].map(opt => {
                        const text = q[`option_${opt.toLowerCase()}`];
                        if (!text) return null;
                        const isUserChoice = userAns === opt;
                        const isAnswer = q.correct_answer === opt;
                        let cls = '';
                        if (isAnswer) cls = 'correct-answer';
                        else if (isUserChoice && !isCorrect) cls = 'wrong-answer';
                        return (
                          <div key={opt} className={`review-option ${cls}`}>
                            <span className="review-option__letter">{opt}</span>
                            <span>{text}</span>
                            {isAnswer && <span className="review-option__tag">✓</span>}
                            {isUserChoice && !isAnswer && <span className="review-option__tag wrong">✕</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
