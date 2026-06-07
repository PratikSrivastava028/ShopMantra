import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';

export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-brand-lightBg dark:bg-brand-darkBg transition-all">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden">
        
        {/* Decorative alert glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-rose-500 to-amber-400 rounded-full blur-2xl opacity-15 pointer-events-none" />

        {/* Animated red error icon */}
        <div className="w-16 h-16 rounded-full bg-rose-55/10 text-rose-550 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-950 animate-pulse">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950 rounded-full text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Transaction Authorization Blocked
          </span>
          <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tracking-tight">Payment Declined</h2>
          <p className="text-xs text-brand-muted max-w-xs mx-auto">
            Your bank or card issuer declined the payment. This might be due to insufficient funds, strict online limits, or incorrect CVV entry. No funds have been captured.
          </p>
        </div>

        {/* Support guidelines list */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border text-xs text-brand-muted text-left space-y-2.5 font-semibold">
          <p className="text-slate-800 dark:text-slate-200">Recommended Steps:</p>
          <ul className="list-disc ml-4 space-y-1 text-[11px] font-medium leading-normal">
            <li>Verify expiry, CVV, or card number entries.</li>
            <li>Use alternative methods such as UPI or GPay.</li>
            <li>Consult card issuer regarding international authorization blocks.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Retry Checkout
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 py-3 border hover:bg-slate-50 text-brand-muted hover:text-slate-850 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Edit Cart Items
          </button>
        </div>

      </div>
    </div>
  );
};
