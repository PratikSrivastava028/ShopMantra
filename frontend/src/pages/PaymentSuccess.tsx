import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const orderId = `SM-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-brand-lightBg dark:bg-brand-darkBg transition-all">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden">
        
        {/* Confetti gradients */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full blur-2xl opacity-15 pointer-events-none" />

        {/* Animated Green Circle */}
        <div className="w-16 h-16 rounded-full bg-emerald-55/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-950 animate-bounce">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Order Secured successfully
          </span>
          <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight">Payment Approved!</h2>
          <p className="text-xs text-brand-muted max-w-xs mx-auto">
            Your transaction has been approved. Your order ID is <span className="font-bold text-indigo-600">{orderId}</span>. A receipt has been dispatched to your email address.
          </p>
        </div>

        {/* Action cards */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border text-xs text-brand-muted space-y-2 text-left font-semibold">
          <div className="flex justify-between">
            <span>Transaction Status</span>
            <span className="text-emerald-500 font-bold uppercase">Success</span>
          </div>
          <div className="flex justify-between">
            <span>Security Signature</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">SHA-256 Auth</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/customer/orders')}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            Track Order Timeline <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 border hover:bg-slate-50 text-brand-muted hover:text-slate-850 font-bold text-xs rounded-xl"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};
