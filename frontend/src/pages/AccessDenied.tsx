import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Corner glowing circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full blur-2xl opacity-20 pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Access Denied</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You do not have the required role privileges to access this page. Sellers cannot enter customer checkout paths, and customers cannot access seller dashboard panels.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Home className="w-4 h-4" /> Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
export default AccessDenied;
