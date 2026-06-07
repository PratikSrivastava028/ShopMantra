import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate reset request delay
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-200">
      
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
        
        {/* Corner decor */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-2xl opacity-20 pointer-events-none" />

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">Recovery Email Sent</h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              If an account is associated with <span className="font-semibold text-indigo-600">{email}</span>, you will receive an inbox link containing instructions to reset your password.
            </p>
            <div className="pt-2">
              <Link 
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Account Security
              </div>
              <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight">Forgot Password</h2>
              <p className="text-xs text-brand-muted mt-2">
                Enter your email address below, and we will dispatch a secure link to restore your credentials.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none border dark:border-slate-800 focus:border-brand-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:bg-indigo-400"
              >
                {isLoading ? 'Processing request...' : 'Send Recovery Link'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-brand-border dark:border-slate-850">
              <Link 
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </>
        )}

      </div>

    </div>
  );
};
