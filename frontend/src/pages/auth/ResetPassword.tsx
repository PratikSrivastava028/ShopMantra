import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    // Simulate reset latency
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-200">
      
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
        
        {/* Decorative corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-2xl opacity-20 pointer-events-none" />

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">Password Reset Complete</h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Your password has been successfully updated. You may now proceed to log in with your new credentials.
            </p>
            <div className="pt-2">
              <Link 
                to="/login"
                className="w-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg text-center"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Secure Credentials
              </div>
              <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight">Reset Password</h2>
              <p className="text-xs text-brand-muted mt-2">
                Create a strong, unique password containing at least 8 characters.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:bg-indigo-400"
              >
                {isLoading ? 'Resetting password...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

      </div>

    </div>
  );
};
