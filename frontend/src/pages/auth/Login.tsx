import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Chrome, Github } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      setSuccessMessage('Login successful. A security notification email has been sent to your registered email address.');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2500);
    }
  };

  const handleOAuth = (_provider: string) => {
    // OAuth via social providers is not yet supported
    alert('Social login is not available yet. Please use email & password.');
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
      
      {/* Decorative corner gradient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-2xl opacity-20 pointer-events-none" />
      
      {/* Brand logo & title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse-subtle" /> AI-First Shopping Experience
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-brand-muted mt-2">
          Sign in to your ShopMantra account to continue.
        </p>
      </div>

      {/* System Error notices */}
      {(error || localError) && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-2xl text-xs flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-brand-muted hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & submit */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-350"
            />
            <span className="text-xs text-brand-muted">Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:bg-indigo-400"
        >
          {isLoading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* Separator divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-x-0 border-t border-brand-border dark:border-slate-850" />
        <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold text-brand-muted">
          Or continue with
        </span>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOAuth('Google')}
          className="flex items-center justify-center gap-2 border border-brand-border dark:border-slate-800 py-2.5 rounded-xl text-xs font-semibold text-brand-muted hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-brand-text dark:hover:text-slate-100"
        >
          <Chrome className="w-4 h-4 text-rose-500" /> Google
        </button>
        <button
          onClick={() => handleOAuth('GitHub')}
          className="flex items-center justify-center gap-2 border border-brand-border dark:border-slate-800 py-2.5 rounded-xl text-xs font-semibold text-brand-muted hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-brand-text dark:hover:text-slate-100"
        >
          <Github className="w-4 h-4 text-slate-800 dark:text-slate-100" /> GitHub
        </button>
      </div>

      {/* Signup notice */}
      <div className="text-center pt-2">
        <span className="text-xs text-brand-muted">New to ShopMantra? </span>
        <Link to="/signup" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
          Create an Account
        </Link>
      </div>

    </div>
  );
};
