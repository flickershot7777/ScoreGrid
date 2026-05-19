import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <span className="header__logo-text">ExamPro</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav">
          <Link to="/" className={`header__link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {user && (
            <Link to="/dashboard" className={`header__link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className={`header__link header__link--admin ${isActive('/admin') ? 'active' : ''}`}>
                Admin Panel
              </Link>
              <Link to="/admin/categories" className={`header__link header__link--admin ${isActive('/admin/categories') ? 'active' : ''}`}>
                Categories
              </Link>
              <Link to="/admin/exams" className={`header__link header__link--admin ${isActive('/admin/exams') ? 'active' : ''}`}>
                Exams
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="header__actions">
          {user ? (
            <div className="header__user">
              <button
                className="header__avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                <div className="header__avatar">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <svg className={`header__chevron ${dropdownOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="header__dropdown">
                  <div className="header__dropdown-header">
                    <p className="header__dropdown-email">{user.email}</p>
                    {isAdmin && <span className="badge badge-primary">OPCO</span>}
                  </div>
                  <div className="header__dropdown-divider"></div>
                  <Link to="/dashboard" className="header__dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="header__dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  <div className="header__dropdown-divider"></div>
                  <button className="header__dropdown-item header__dropdown-item--danger" onClick={handleSignOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Get Started
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className={`header__hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="header__mobile-menu">
          <Link to="/" className="header__mobile-link">Home</Link>
          {user && (
            <Link to="/dashboard" className="header__mobile-link">Dashboard</Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className="header__mobile-link">Admin Panel</Link>
              <Link to="/admin/categories" className="header__mobile-link">Categories</Link>
              <Link to="/admin/exams" className="header__mobile-link">Exams</Link>
            </>
          )}
          {user ? (
            <button className="header__mobile-link header__mobile-link--danger" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="header__mobile-link header__mobile-link--primary">
              Get Started
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
