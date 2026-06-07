import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — completely bare layout for authentication pages.
 * No Navbar, no Footer, no branding strip.
 */
export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-lightBg dark:bg-brand-darkBg text-brand-text dark:text-slate-100 transition-colors duration-200 px-4 py-8">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
