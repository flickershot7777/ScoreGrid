import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Exam.css';

export default function Exam() {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchExam();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [examId]);

  const fetchExam = async () => {
    try {
      const { data: examData } = await supabase.from('exams').select('*, categories(name, icon)').eq('id', examId).single();
      const { data: questionData } = await supabase.from('questions').select('*').eq('exam_id', examId).order('sort_order');
      if (examData) { setExam(examData); setTimeLeft(examData.duration_minutes * 60); }
      if (questionData) setQuestions(questionData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (started && timeLeft === 0 && !submitting) { handleSubmit(); }
  }, [timeLeft, started]);

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const handleSelectAnswer = (qId, opt) => setAnswers(prev => ({ ...prev, [qId]: opt }));

  const handleToggleFlag = () => {
    const qId = questions[currentIndex].id;
    setFlagged(prev => { const n = new Set(prev); n.has(qId) ? n.delete(qId) : n.add(qId); return n; });
  };

  const getQuestionStatus = (qId) => {
    if (flagged.has(qId) && answers[qId]) return 'flagged-answered';
    if (flagged.has(qId)) return 'flagged';
    if (answers[qId]) return 'answered';
    return 'unanswered';
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    let score = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_answer) score++; });
    const timeTaken = exam.duration_minutes * 60 - timeLeft;
    try {
      const { data, error } = await supabase.from('exam_results').insert({ user_id: user.id, exam_id: examId, score, total_questions: questions.length, answers, time_taken_seconds: timeTaken }).select().single();
      if (error) throw error;
      navigate(`/results/${data.id}`, { state: { result: data, questions, exam } });
    } catch (err) { console.error(err); navigate('/dashboard'); }
  }, [answers, questions, exam, timeLeft, examId, user, submitting, navigate]);

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;
  const unansweredCount = questions.length - answeredCount;

  if (loading) return <div className="page-wrapper"><div className="loading-screen"><div className="loader"></div><p>Loading exam...</p></div></div>;

  if (!exam || questions.length === 0) return (
    <div className="page-wrapper"><div className="exam-error container">
      <h2>Exam not found</h2><p>This exam doesn't exist or has no questions.</p>
      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div></div>
  );

  if (!started) return (
    <div className="page-wrapper"><div className="exam-start container"><div className="exam-start__card glass-card">
      <div className="exam-start__icon">📝</div>
      <h1>{exam.title}</h1>
      <p className="exam-start__category">{exam.categories?.icon} {exam.categories?.name}</p>
      {exam.description && <p className="exam-start__desc">{exam.description}</p>}
      <div className="exam-start__info">
        <div className="exam-start__info-item"><span>⏱ {exam.duration_minutes} minutes</span></div>
        <div className="exam-start__info-item"><span>📄 {questions.length} questions</span></div>
        <div className="exam-start__info-item"><span className={`badge ${exam.difficulty === 'easy' ? 'badge-easy' : exam.difficulty === 'hard' ? 'badge-hard' : 'badge-medium'}`}>{exam.difficulty}</span></div>
      </div>
      <div className="exam-start__rules"><h3>Instructions</h3>
        <ul><li>Answer all questions within the time limit.</li><li>You can flag questions to review later.</li><li>The exam auto-submits when time runs out.</li></ul>
      </div>
      <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)}>Start Exam →</button>
    </div></div></div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div className="exam-header__left">
          <h2 className="exam-header__title">{exam.title}</h2>
          <span className="exam-header__progress">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className={`exam-header__timer ${timeLeft <= 300 ? 'warning' : ''} ${timeLeft <= 60 ? 'danger' : ''}`}>
          ⏱ Time: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="exam-layout">
        <aside className="exam-sidebar">
          <div className="exam-sidebar__section"><h3>Test Progress</h3>
            <div className="exam-sidebar__stats">
              <span className="exam-sidebar__stat"><span className="dot dot--answered"></span> Answered: {answeredCount}</span>
              <span className="exam-sidebar__stat"><span className="dot dot--unanswered"></span> Remaining: {unansweredCount}</span>
            </div>
          </div>
          <div className="exam-sidebar__section"><h3>Questions</h3>
            <div className="exam-palette">
              {questions.map((q, idx) => (
                <button key={q.id} className={`exam-palette__btn ${getQuestionStatus(q.id)} ${idx === currentIndex ? 'current' : ''}`} onClick={() => setCurrentIndex(idx)}>{idx + 1}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-danger exam-sidebar__submit" onClick={() => setShowSubmitModal(true)}>Submit Test</button>
        </aside>

        <main className="exam-main">
          <div className="exam-question glass-card">
            <div className="exam-question__header">
              <h3>Question {currentIndex + 1}</h3>
              <button className={`exam-flag-btn ${flagged.has(currentQuestion.id) ? 'flagged' : ''}`} onClick={handleToggleFlag}>
                🚩 {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
              </button>
            </div>
            <p className="exam-question__text">{currentQuestion.question_text}</p>
            <div className="exam-options">
              {['A','B','C','D'].map(opt => {
                const text = currentQuestion[`option_${opt.toLowerCase()}`];
                if (!text) return null;
                return (
                  <button key={opt} className={`exam-option ${answers[currentQuestion.id] === opt ? 'selected' : ''}`} onClick={() => handleSelectAnswer(currentQuestion.id, opt)}>
                    <span className="exam-option__letter">{opt}</span>
                    <span className="exam-option__text">{text}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="exam-nav">
            <button className="btn btn-secondary" disabled={currentIndex === 0} onClick={() => setCurrentIndex(p => p - 1)}>Previous</button>
            <span className="exam-nav__status">{answers[currentQuestion.id] ? '✓ Answered' : 'Not answered'}</span>
            <button className="btn btn-primary" disabled={currentIndex === questions.length - 1} onClick={() => setCurrentIndex(p => p + 1)}>Next</button>
          </div>
        </main>
      </div>

      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Submit Exam?</h2><button className="btn btn-ghost btn-icon" onClick={() => setShowSubmitModal(false)}>✕</button></div>
            <div className="submit-summary">
              <div className="submit-summary__item"><span className="dot dot--answered"></span><span>Answered</span><strong>{answeredCount}</strong></div>
              <div className="submit-summary__item"><span className="dot dot--unanswered"></span><span>Unanswered</span><strong>{unansweredCount}</strong></div>
              <div className="submit-summary__item"><span className="dot dot--flagged"></span><span>Flagged</span><strong>{flaggedCount}</strong></div>
            </div>
            {unansweredCount > 0 && <div className="alert alert-info">⚠️ You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.</div>}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>Continue Exam</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Exam'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
