import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Moon, Sun, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth';
import { useTheme } from '../context/ThemeContext';
import brightconeEmblem from '../assets/brightcone-emblem.png';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!consent) {
      setError('You must acknowledge the enterprise terms and privacy notice.');
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({ name, email, password });
      navigate('/recruitment');
    } catch (err: any) {
      const msg =
        err.response?.data?.description ||
        err.response?.data?.error ||
        'Could not complete registration. Email may already be registered.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignUp = () => {
    setError('Microsoft single sign-on is not enabled in this deployment. Please register using your email and password.');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F6FB] dark:bg-[#070D1E] text-[#0E1730] dark:text-white transition-colors">
      {/* LEFT SECTION — Brand Hero & Feature Highlights (Matches SignInPage exactly) */}
      <section className="relative overflow-hidden bg-[#06101F] text-white p-8 sm:p-12 lg:p-16 lg:w-[50%] flex flex-col justify-between shrink-0 min-h-[520px] lg:min-h-screen">
        {/* Decorative ambient gradient aura */}
        <div 
          className="absolute -right-36 -bottom-36 w-[560px] h-[560px] rounded-full pointer-events-none filter blur-[80px] opacity-40"
          style={{
            background: 'conic-gradient(from 210deg, #0B6FDB, #0BA6CC, transparent 65%)'
          }}
        />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60 [mask-image:linear-gradient(180deg,#000_15%,transparent_90%)]" />

        {/* Brand Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 hover:opacity-95 transition-opacity">
            <img 
              src={brightconeEmblem} 
              alt="Brightcone Logo" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-white font-heading">
              brightcone<span className="text-[#0BA6CC]">.ai</span>
            </span>
          </Link>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-[1.15] font-heading max-w-lg">
            Everything about work at Brightcone, in one place.
          </h2>

          <div className="text-sm font-semibold tracking-wide text-[#0BA6CC]">
            Brightcone People Plus
          </div>

          <p className="text-sm sm:text-base text-[#C9D3EE] leading-relaxed max-w-lg font-normal">
            Employees apply for leave, download payslips and raise requests. HR runs approvals and hiring from one inbox.
          </p>

          {/* Feature Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#DDD6FE] flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
              Recruit
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              People
            </span>
          </div>

          {/* Floating Glassmorphism Cards */}
          <div className="pt-2 space-y-3">
            <div className="bg-white/8 border border-white/12 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3.5 max-w-sm shadow-xl transition-transform hover:scale-[1.01]">
              <div className="w-8 h-8 rounded-full bg-[#15A36B]/25 text-[#4BE0A5] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-tight">Direct Employee Provisioning</div>
                <div className="text-[11px] text-[#C9D3EE]">Automatic onboarding into Brightcone directory.</div>
              </div>
            </div>

            <div className="bg-white/8 border border-white/12 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3.5 max-w-sm shadow-xl sm:ml-8 transition-transform hover:scale-[1.01]">
              <div className="w-8 h-8 rounded-full bg-[#0BA6CC]/25 text-[#0BA6CC] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-tight">Enterprise-grade Security</div>
                <div className="text-[11px] text-[#C9D3EE]">Argon2 password hashing & JWT authentication.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-[#93A0C4]">
          <span>SOC 2 Type II aligned</span>
          <span>•</span>
          <span>HIPAA-ready</span>
          <span>•</span>
          <span>Need help? hello@brightcone.ai</span>
        </div>
      </section>

      {/* RIGHT SECTION — Sign Up Form */}
      <section className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative min-h-[600px]">
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-[420px] animate-in fade-in duration-200 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0E1730] dark:text-white font-heading">
            Create account
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6787] dark:text-slate-400 mt-1.5 mb-5">
            Use your Brightcone work email to register your employee account.
          </p>

          {/* Role disclaimer banner */}
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 text-[#0B6FDB] dark:text-blue-300 text-xs flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#0B6FDB] dark:text-blue-300" />
            <span>
              New accounts are provisioned with the standard <strong>EMPLOYEE</strong> role for security.
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-[#FDE8EA] border border-[#D93D4A]/30 text-[#D93D4A] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0E1730] dark:text-slate-300 mb-1">
                Full name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-[#E3E8F2] dark:border-slate-700 rounded-lg text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#0B6FDB] focus:ring-2 focus:ring-[#0B6FDB]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0E1730] dark:text-slate-300 mb-1">
                Work email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="name@brightcone.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-[#E3E8F2] dark:border-slate-700 rounded-lg text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#0B6FDB] focus:ring-2 focus:ring-[#0B6FDB]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0E1730] dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-14 py-2.5 text-sm bg-white dark:bg-slate-900 border border-[#E3E8F2] dark:border-slate-700 rounded-lg text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#0B6FDB] focus:ring-2 focus:ring-[#0B6FDB]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0B6FDB] hover:text-[#095bc2] px-1 py-0.5"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0E1730] dark:text-slate-300 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-[#E3E8F2] dark:border-slate-700 rounded-lg text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#0B6FDB] focus:ring-2 focus:ring-[#0B6FDB]/20 transition-colors"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-[#0E1730] dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0B6FDB] focus:ring-[#0B6FDB]"
                />
                <span className="leading-tight text-[#5B6787] dark:text-slate-400">
                  I agree to the Brightcone HR Acceptable Use Policy and enterprise role management guidelines.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0B6FDB] hover:bg-[#095bc2] text-white font-semibold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3 text-xs text-[#8D97B0]">
            <div className="flex-1 h-px bg-[#E3E8F2] dark:bg-slate-700" />
            <span>or</span>
            <div className="flex-1 h-px bg-[#E3E8F2] dark:bg-slate-700" />
          </div>

          {/* Microsoft SSO */}
          <button
            type="button"
            onClick={handleMicrosoftSignUp}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E3E8F2] dark:border-slate-700 text-[#0E1730] dark:text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#7FBA00" d="M12 1h10v10H12z" />
              <path fill="#00A4EF" d="M1 12h10v10H1z" />
              <path fill="#FFB900" d="M12 12h10v10H12z" />
            </svg>
            Continue with Microsoft
          </button>

          {/* Already have an account link */}
          <div className="mt-5 text-center text-xs text-[#5B6787] dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-[#0B6FDB] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
