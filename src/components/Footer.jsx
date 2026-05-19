import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span>ExamPro</span>
            </div>
            <p className="footer__tagline">
              Master your exams with confidence. Practice anytime, anywhere.
            </p>
          </div>

          {/* Links */}
          <div className="footer__links">
            <h4>Platform</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/auth">Sign Up</Link>
          </div>

          <div className="footer__links">
            <h4>Resources</h4>
            <a href="#">Help Center</a>
            <a href="#">Study Tips</a>
          </div>

          <div className="footer__links">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} ExamPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
