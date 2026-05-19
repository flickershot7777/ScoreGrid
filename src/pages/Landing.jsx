import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
          <div className="hero__grid-pattern"></div>
        </div>

        <div className="hero__content container">
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            Practice. Learn. Succeed.
          </div>

          <h1 className="hero__title">
            Master Your Exams
            <br />
            <span className="hero__title-gradient">With Confidence</span>
          </h1>

          <p className="hero__subtitle">
            Take timed mock exams across multiple categories. Get instant results,
            track your progress, and ace your next test with ExamPro.
          </p>

          <div className="hero__actions">
            <Link to={user ? '/dashboard' : '/auth'} className="btn btn-primary btn-lg">
              {user ? 'Go to Dashboard' : 'Start Practicing'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">500+</span>
              <span className="hero__stat-label">Questions</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">50+</span>
              <span className="hero__stat-label">Mock Exams</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">10+</span>
              <span className="hero__stat-label">Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Our platform provides a comprehensive exam experience designed to help you perform your best.
            </p>
          </div>

          <div className="features__grid">
            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--primary">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Timed Exams</h3>
              <p className="feature-card__text">
                Simulate real exam conditions with customizable countdown timers set by administrators.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--accent">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Instant Results</h3>
              <p className="feature-card__text">
                Get detailed score breakdowns with question-by-question review immediately after submission.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--success">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Multiple Categories</h3>
              <p className="feature-card__text">
                Choose from a wide range of exam categories, each with carefully curated questions.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--warning">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Flag & Review</h3>
              <p className="feature-card__text">
                Flag tricky questions during the exam and review them before submitting your answers.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--danger">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Track Progress</h3>
              <p className="feature-card__text">
                View your past results, analyze performance trends, and identify areas for improvement.
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="feature-card__title">Any Device</h3>
              <p className="feature-card__text">
                Fully responsive design lets you practice on desktop, tablet, or mobile anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Get Started in Minutes</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step__number">1</div>
              <h3>Create Account</h3>
              <p>Sign up with email, OTP, or Google in seconds.</p>
            </div>
            <div className="step__connector"></div>
            <div className="step">
              <div className="step__number">2</div>
              <h3>Choose an Exam</h3>
              <p>Browse categories and pick your mock test.</p>
            </div>
            <div className="step__connector"></div>
            <div className="step">
              <div className="step__number">3</div>
              <h3>Take the Test</h3>
              <p>Answer questions with a real countdown timer.</p>
            </div>
            <div className="step__connector"></div>
            <div className="step">
              <div className="step__number">4</div>
              <h3>Get Results</h3>
              <p>Instant detailed scoring and review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta__card glass-card">
            <div className="cta__glow"></div>
            <h2>Ready to Start Practicing?</h2>
            <p>Join ExamPro today and take your first mock exam for free.</p>
            <Link to={user ? '/dashboard' : '/auth'} className="btn btn-primary btn-lg">
              {user ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
