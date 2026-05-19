import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState('signin'); // signin, signup, otp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { signUp, signInWithPassword, signInWithOTP, verifyOTP, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Account created! Check your email for verification.' });
      } else if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password);
        if (error) throw error;
        navigate('/dashboard');
      } else if (mode === 'otp') {
        if (!otpSent) {
          const { error } = await signInWithOTP(email);
          if (error) throw error;
          setOtpSent(true);
          setMessage({ type: 'success', text: 'Check your email for the verification code!' });
        } else {
          const { error } = await verifyOTP(email, otpCode);
          if (error) throw error;
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage({ type: '', text: '' });
    setOtpSent(false);
    setOtpCode('');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__orb auth-page__orb--1"></div>
        <div className="auth-page__orb auth-page__orb--2"></div>
      </div>

      <div className="auth-page__container">
        <Link to="/" className="auth-page__back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>

        <div className="auth-card glass-card">
          <div className="auth-card__header">
            <div className="auth-card__logo">
              <div className="auth-card__logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span>ExamPro</span>
            </div>
            <h1 className="auth-card__title">
              {mode === 'signup' ? 'Create Account' : mode === 'otp' ? 'Email OTP Login' : 'Welcome Back'}
            </h1>
            <p className="auth-card__subtitle">
              {mode === 'signup'
                ? 'Sign up to start taking mock exams'
                : mode === 'otp'
                ? 'We\'ll send a verification code to your email'
                : 'Sign in to continue your practice'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => switchMode('signin')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              Sign Up
            </button>
            <button
              className={`auth-tab ${mode === 'otp' ? 'active' : ''}`}
              onClick={() => switchMode('otp')}
            >
              Email OTP
            </button>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === 'error' ? '⚠️' : '✅'} {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {(mode === 'signin' || mode === 'signup') && (
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            {mode === 'otp' && otpSent && (
              <div className="form-group">
                <label className="form-label" htmlFor="otp">Verification Code</label>
                <input
                  id="otp"
                  type="text"
                  className="form-input"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? (
                <div className="loader" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
              ) : mode === 'signup' ? (
                'Create Account'
              ) : mode === 'otp' ? (
                otpSent ? 'Verify Code' : 'Send OTP'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Google OAuth */}
          <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
