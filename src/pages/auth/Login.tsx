import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../services/authContext';
import { loginApi } from '../../services/api';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter your work email and password.');
      setInfoMsg(null);
      return;
    }

    setError(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      const data = await loginApi({ email: email.trim().toLowerCase(), password });
      if (data && data.token) {
        const user = {
          pid: data.pid,
          email: data.email,
          name: data.name,
          role: data.role,
        };
        const persona = data.role === 'HR_ADMIN' || data.role === 'ADMIN' ? 'admin' : 'employee';
        localStorage.setItem('persona', persona);
        login(data.token, user);

        const defaultPath = persona === 'admin' ? '/learn/dashboard' : '/learn/my-learning';
        const from = (location.state as any)?.from?.pathname;
        const targetPath =
          from && (persona === 'admin' || (!from.includes('/dashboard') && !from.includes('/courses') && !from.includes('/performance')))
            ? from
            : defaultPath;
        navigate(targetPath, { replace: true });
      } else {
        setError('Login failed: Invalid server response.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && (err.response.status === 401 || err.response.status === 400)) {
        setError('That password or email isn’t right. Please verify your credentials.');
      } else {
        setError('Unable to reach authentication service. Please check your network and retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError(null);
    setInfoMsg(
      email.trim()
        ? `If an account exists for ${email.trim()}, password reset instructions have been dispatched.`
        : 'Enter your work email above to request password reset instructions.'
    );
  };

  const handleMicrosoftSso = () => {
    setError(null);
    setInfoMsg('Microsoft single sign-on is not enabled in this deployment. Please use your work email and password.');
  };

  return (
    <div className={styles.login} data-testid="login">
      {/* Left Hero Brand Panel */}
      <section className={styles.lp} aria-hidden="false">
        <div className={styles.lpLogo}>
          <div className={styles.lpLogoBadge}>B</div>
          <span className={styles.lpLogoText}>Brightcone</span>
        </div>

        <h2 className={styles.lpH2}>Everything about work at Brightcone, in one place.</h2>
        <div className={styles.lpTag}>Brightcone People Plus</div>
        <p className={styles.lpLede}>
          Employees apply for leave, download payslips and complete training. HR runs payroll, reviews, approvals and compliance from one inbox.
        </p>

        <div className={styles.lapps}>
          <span><i style={{ background: '#12A58E' }} />People</span>
          <span><i style={{ background: '#7C5CFF' }} />Recruit</span>
          <span><i style={{ background: '#0F9F6E' }} />Payroll</span>
          <span><i style={{ background: '#E07A1D' }} />Expense</span>
          <span><i style={{ background: '#D9466F' }} />Sign</span>
          <span><i style={{ background: '#0BA6CC' }} />Connect</span>
          <span><i style={{ background: '#6366F1' }} />Learn</span>
          <span><i style={{ background: '#3B82C4' }} />Shift</span>
          <span><i style={{ background: '#0B87FF' }} />People Plus</span>
        </div>

        <div className={styles.glasses}>
          <div className={styles.glass}>
            <span className={styles.glassOk}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div>
              <b>Leave approved</b>
              <span>Casual leave, Oct 9. Enjoy your day off.</span>
            </div>
          </div>
          <div className={styles.glass}>
            <span className={styles.glassOk} style={{ background: 'rgba(20,184,230,.2)', color: 'var(--brand-2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <circle cx="12" cy="12.5" r="2.5" />
              </svg>
            </span>
            <div>
              <b>September payslip is ready</b>
              <span>Credited to your account on Oct 1.</span>
            </div>
          </div>
        </div>

        <div className={styles.lpFoot}>
          <span>SOC 2 Type II aligned</span>
          <span>HIPAA-ready</span>
          <span>Need help? hello@brightcone.ai</span>
        </div>
      </section>

      {/* Right Form Panel */}
      <section className={styles.lf}>
        <div className={styles.lcard}>
          <h1>Sign in</h1>
          <p className={styles.sub}>Use your Brightcone work email. You’ll see the pages for your role.</p>

          {error && (
            <div className={styles.lerr} role="alert">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className={styles.lok} role="status">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label className={styles.field} htmlFor="email">
              Work email
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@brightcone.ai"
                autoComplete="username"
                required
              />
            </label>

            <label className={styles.field} htmlFor="password">
              Password
              <div className={styles.pw}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className={styles.lrow}>
              <label>
                <input
                  type="checkbox"
                  id="lrem"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                className={styles.link}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={`${styles.btnBlock} ${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className={styles.or}>or</div>

          <button
            type="button"
            className={`${styles.btnBlock} ${styles.btnSecondary}`}
            onClick={handleMicrosoftSso}
          >
            <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#7FBA00" d="M12 1h10v10H12z" />
              <path fill="#00A4EF" d="M1 12h10v10H1z" />
              <path fill="#FFB900" d="M12 12h10v10H12z" />
            </svg>
            <span>Continue with Microsoft</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Login;
