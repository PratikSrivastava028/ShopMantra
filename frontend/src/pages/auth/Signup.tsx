import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error, isLoading, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const calculatePasswordStrength = (pwd: string): { label: string; color: string; score: number } => {
    if (!pwd) return { label: 'Weak', color: 'bg-slate-200', score: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', score: 25 };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', score: 50 };
    if (score === 3) return { label: 'Strong', color: 'bg-indigo-500', score: 75 };
    return { label: 'Excellent', color: 'bg-emerald-500', score: 100 };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    if (!terms) {
      setLocalError('Please accept the Terms of Service.');
      return;
    }

    const success = await signup(name, email, password, role);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-md space-y-5 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
        
        {/* Decorative background blur */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-2xl opacity-20 pointer-events-none" />

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Start Shopping Smarter
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Create Account</h2>
          <p className="text-xs text-brand-muted mt-2">
            Join ShopMantra today and experience cognitive e-commerce.
          </p>
        </div>

        {/* System Error notices */}
        {(error || localError) && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Full Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Role Choice input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Register As</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  role === 'customer'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-brand-muted hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                Register as User
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  role === 'seller'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-brand-muted hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                Register as Seller
              </button>
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
              <input
                type="email"
                required
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 8 characters"
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

            {/* Password strength meter */}
            {password && (
              <div className="pt-1.5 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-brand-muted">Strength:</span>
                  <span className="font-bold uppercase" style={{ color: strength.color.includes('bg-') ? undefined : strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${strength.color}`} 
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start gap-2 pt-1 select-none">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-350"
            />
            <label htmlFor="terms" className="text-[11px] text-brand-muted leading-relaxed cursor-pointer">
              I agree to the <span className="font-semibold text-indigo-600 hover:underline">Terms of Service</span> and <span className="font-semibold text-indigo-600 hover:underline">Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:bg-indigo-400"
          >
            {isLoading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="text-center pt-2">
          <span className="text-xs text-brand-muted">Already registered? </span>
          <Link to="/login" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
            Sign In here
          </Link>
        </div>

    </div>
  );
};
