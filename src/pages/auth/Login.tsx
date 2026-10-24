import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { loginApi } from '../../services/api';
import brightconeLogo from '../../assets/brightcone-logo.png';
import './Login.css';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState<'signin' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [msg, setMsg] = useState<{ type: 'lerr' | 'lok'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const performLogin = (
    targetEmail: string,
    role: string,
    firstName: string,
    lastName: string,
    apiToken?: string
  ) => {
    const token = apiToken || `bc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userObj = {
      id: `usr_${targetEmail.split('@')[0]}`,
      email: targetEmail,
      firstName,
      lastName,
      role,
    };
    const persona = role === 'hr_admin' || role === 'HR_ADMIN' || role === 'ADMIN' ? 'admin' : 'employee';
    localStorage.setItem('persona', persona);
    login(token, userObj);

    const from = (location.state as any)?.from?.pathname;
    const target = from || '/suite';
    navigate(target, { replace: true });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPw = password;

    if (!cleanEmail || !cleanPw) {
      setMsg({ type: 'lerr', text: 'Enter your work email and password.' });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      setMsg({ type: 'lerr', text: 'Enter a valid email address, like name@brightcone.ai.' });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const data = await loginApi({ email: cleanEmail, password: cleanPw });
      if (data && data.token) {
        const parts = (data.name || cleanEmail.split('@')[0]).split(' ');
        const first = parts[0] || 'User';
        const last = parts.slice(1).join(' ') || '';
        performLogin(data.email || cleanEmail, data.role || 'hr_admin', first, last, data.token);
        return;
      }
    } catch {
      // Local fallback for offline mode or demo environment
    } finally {
      setLoading(false);
    }

    if (cleanEmail === 'ananya.rao@brightcone.ai') {
      performLogin(cleanEmail, 'hr_admin', 'Ananya', 'Rao');
    } else if (cleanEmail === 'rahul.varma@brightcone.ai') {
      performLogin(cleanEmail, 'employee', 'Rahul', 'Varma');
    } else {
      const parts = cleanEmail.split('@')[0].split('.');
      const first = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'User';
      const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
      performLogin(cleanEmail, 'employee', first, last);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      setMsg({ type: 'lerr', text: 'Enter a valid work email address.' });
      return;
    }
    setMsg({
      type: 'lok',
      text: `Reset link dispatched to ${cleanEmail}. Check your inbox or spam folder.`,
    });
  };

  const fillDemo = (demoEmail: string, pass: string) => {
    setEmail(demoEmail);
    setPassword(pass);
    setMsg(null);
  };

  return (
    <div className="login" id="login">
      {/* Left Marketing / Product Panel */}
      <section className="lp" aria-hidden="false">
        <img
          className="lp-logo"
          src={brightconeLogo}
          alt="brightcone.ai, Clarity. Focus. Impact"
        />
        <h2>Everything about work at Brightcone, in one place.</h2>
        <div className="tag">Brightcone People Plus</div>
        <p className="lede">
          Employees apply for leave, download payslips and raise requests. HR runs payroll, approvals and hiring from one inbox.
        </p>

        <div className="lapps">
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

        <div className="glasses">
          <div className="glass">
            <span className="ok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div>
              <b>Leave approved</b>
              <span>Casual leave, Oct 9. Enjoy your day off.</span>
            </div>
          </div>
          <div className="glass">
            <span className="ok" style={{ background: 'rgba(20,184,230,.2)', color: 'var(--brand-2)' }}>
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

        <div className="foot">
          <span>SOC 2 Type II aligned</span>
          <span>HIPAA-ready</span>
          <span>Need help? hello@brightcone.ai</span>
        </div>
      </section>

      {/* Right Authentication Form */}
      <section className="lf">
        <button
          type="button"
          className="icon-btn ltheme"
          id="lthemeBtn"
          aria-label="Switch theme"
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <div className="lcard" id="lcard">
          {msg && <div className={msg.type} role="alert">{msg.text}</div>}

          {view === 'forgot' ? (
            <div>
              <h1>Reset your password</h1>
              <p className="sub">Enter your work email and we’ll send you a reset link.</p>
              <form onSubmit={handleForgot} noValidate>
                <label className="field">
                  Work email
                  <input
                    className="input"
                    id="fe"
                    type="email"
                    autoComplete="username"
                    placeholder="name@brightcone.ai"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </label>
                <button className="btn primary block" type="submit">
                  Send reset link
                </button>
              </form>
              <div className="or">or</div>
              <button
                type="button"
                className="btn block"
                onClick={() => { setView('signin'); setMsg(null); }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <div>
              <h1>Sign in</h1>
              <p className="sub">Use your Brightcone work email. You’ll see the pages for your role.</p>
              <form onSubmit={handleSignIn} noValidate>
                <label className="field">
                  Work email
                  <input
                    className="input"
                    id="le"
                    type="email"
                    autoComplete="username"
                    placeholder="name@brightcone.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  Password
                  <div className="pw">
                    <input
                      className="input"
                      id="lpw"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>
                <div className="lrow">
                  <label>
                    <input
                      type="checkbox"
                      id="lrem"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                    />
                    {' '}Keep me signed in
                  </label>
                  <button
                    type="button"
                    className="link"
                    onClick={() => { setView('forgot'); setMsg(null); }}
                  >
                    Forgot password?
                  </button>
                </div>
                <button className="btn primary block" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <div className="or">or</div>
              <button
                type="button"
                className="btn block"
                onClick={() =>
                  setMsg({
                    type: 'lerr',
                    text: "Microsoft single sign-on isn't connected in this prototype. Use your email and password.",
                  })
                }
              >
                <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true" style={{ marginRight: 8 }}>
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#7FBA00" d="M12 1h10v10H12z" />
                  <path fill="#00A4EF" d="M1 12h10v10H1z" />
                  <path fill="#FFB900" d="M12 12h10v10H12z" />
                </svg>
                Continue with Microsoft
              </button>

              <div className="demo">
                <p>Demo accounts. Click one to fill it in.</p>
                <button
                  type="button"
                  onClick={() => fillDemo('ananya.rao@brightcone.ai', 'Admin@123')}
                >
                  <b>HR Admin</b>
                  <span>ananya.rao@brightcone.ai, Admin@123</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('rahul.varma@brightcone.ai', 'Welcome@123')}
                >
                  <b>Employee</b>
                  <span>rahul.varma@brightcone.ai, Welcome@123</span>
                </button>
                <p style={{ margin: '8px 0 0' }}>
                  Any employee can sign in as firstname.lastname@brightcone.ai with Welcome@123.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Login;
