import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { ic } from '../../components/icons';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performLogin = (targetEmail: string, role: string, firstName: string, lastName: string) => {
    const token = `bc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userObj = {
      id: `usr_${targetEmail.split('@')[0]}`,
      email: targetEmail,
      firstName,
      lastName,
      role,
    };
    login(token, userObj);
    navigate('/suite', { replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    if (cleanEmail === 'rahul.varma@brightcone.ai') {
      performLogin(cleanEmail, 'employee', 'Rahul', 'Varma');
    } else if (cleanEmail === 'ananya.rao@brightcone.ai') {
      performLogin(cleanEmail, 'hr_admin', 'Ananya', 'Rao');
    } else {
      const parts = cleanEmail.split('@')[0].split('.');
      const first = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'User';
      const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
      performLogin(cleanEmail, 'hr_admin', first, last);
    }
  };

  const handleDemoLogin = (demoEmail: string, role: string, firstName: string, lastName: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    setErrorMessage(null);
    performLogin(demoEmail, role, firstName, lastName);
  };

  return (
    <div className="login">
      {/* Left Branding Panel */}
      <section className="lp">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-lg shadow-lg">
            B
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">Brightcone</span>
        </div>

        <h2>Everything about work at Brightcone, in one place.</h2>
        <div className="tag">Brightcone People Plus</div>
        <p className="lede">
          Employees apply for leave, download payslips and raise requests. HR runs payroll, approvals and hiring from one inbox.
        </p>

        <div className="glasses">
          <div className="glass">
            <span className="ok">
              {ic('check', 16)}
            </span>
            <div>
              <b>Leave approved</b>
              <span>Casual leave, Oct 9. Enjoy your day off.</span>
            </div>
          </div>

          <div className="glass">
            <span className="ok" style={{ background: 'rgba(20, 184, 230, 0.2)', color: 'var(--brand-2)' }}>
              {ic('receipt', 16)}
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

      {/* Right Sign-in Form Panel */}
      <section className="lf">
        <div className="lcard">
          <h1>Sign in</h1>
          <p className="sub">Use your Brightcone work email. You’ll see the pages for your role.</p>

          {errorMessage && (
            <div className="lerr" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label className="field block">
              <span className="block text-xs font-medium text-[var(--muted)] mb-1">Work email</span>
              <input
                className="input w-full"
                type="email"
                autoComplete="username"
                placeholder="name@brightcone.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="field block mt-3">
              <span className="block text-xs font-medium text-[var(--muted)] mb-1">Password</span>
              <div className="pw">
                <input
                  className="input w-full"
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

            <div className="lrow mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                />
                <span className="text-xs text-[var(--muted)]">Keep me signed in</span>
              </label>
              <button
                type="button"
                className="text-xs text-[var(--brand)] hover:underline cursor-pointer bg-transparent border-0"
                onClick={() => setErrorMessage('Password reset link is sent to your registered work email.')}
              >
                Forgot password?
              </button>
            </div>

            <button className="btn primary block mt-4" type="submit">
              Sign in
            </button>
          </form>

          <div className="or">or</div>

          {/* Quick Demo Sign In */}
          <div className="demo">
            <p>Demo accounts. Click one to fill and sign in immediately.</p>
            <button
              type="button"
              onClick={() => handleDemoLogin('ananya.rao@brightcone.ai', 'hr_admin', 'Ananya', 'Rao')}
            >
              <b>HR Admin</b>
              <span>ananya.rao@brightcone.ai</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('rahul.varma@brightcone.ai', 'employee', 'Rahul', 'Varma')}
            >
              <b>Employee</b>
              <span>rahul.varma@brightcone.ai</span>
            </button>
            <p className="mt-2 text-[11px] text-[var(--muted)]">
              Any employee can sign in as firstname.lastname@brightcone.ai with their credentials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
