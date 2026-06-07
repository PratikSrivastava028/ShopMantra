import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3 tracking-wider uppercase">Loading security context...</span>
      </div>
    );
  }

  return <>{children}</>;
};
export default AuthProvider;
