import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { loginApi } from '../../services/api';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await loginApi({ email: email.trim(), password });
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
          from && (persona === 'admin' || (!from.includes('/dashboard') && !from.includes('/courses')))
            ? from
            : defaultPath;
        navigate(targetPath, { replace: true });
      } else {
        setError('Login failed: Invalid server response.');
      }
    } catch (err: any) {
      if (err.response && (err.response.status === 401 || err.response.status === 400)) {
        setError('Invalid credentials. Please check your email and password.');
      } else {
        setError('Unable to reach authentication service. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper} data-testid="login">
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <div className={styles.logoBadge}>B</div>
          <div>
            <div className={styles.brandTitle}>Brightcone HR</div>
            <div className={styles.brandSub}>People Plus Platform</div>
          </div>
        </div>

        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Enter your work credentials to access your portal</p>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Work Email
            </label>
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
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
