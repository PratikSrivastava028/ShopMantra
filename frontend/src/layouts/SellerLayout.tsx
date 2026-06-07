import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SellerSidebar } from '../components/layout/SellerSidebar';
import { Bell, Search, Menu, X } from 'lucide-react';

export const SellerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Route security: must be authenticated and have the 'seller' role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'seller') {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* 1. Desktop Sidebar navigation (hidden on mobile, visible on md and up) */}
      <SellerSidebar className="hidden md:flex" />

      {/* 2. Mobile Drawer Navigation Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          {/* Backdrop blur */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Sliding Panel */}
          <div className="relative flex w-64 h-full bg-white dark:bg-slate-900 shadow-2xl z-50 animate-slide-right flex-col">
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border text-brand-muted hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Embedded sidebar mapping navigation actions */}
            <SellerSidebar 
              onNavigate={() => setIsMobileSidebarOpen(false)} 
              className="w-full border-none h-full relative" 
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header dashboard action */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger for Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-brand-muted hover:text-indigo-600 hover:bg-slate-55 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-sm text-slate-850 dark:text-slate-200 tracking-tight">Enterprise Console</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Quick dynamic metrics search */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border text-xs">
              <Search className="w-3.5 h-3.5 text-brand-muted" />
              <input
                type="text"
                placeholder="Search sales reports, ID..."
                className="bg-transparent border-none outline-none text-[11px] w-48 placeholder-brand-muted"
              />
            </div>
            
            <button 
              onClick={() => navigate('/seller/notifications')}
              className="p-1.5 rounded-lg text-brand-muted hover:text-indigo-600 hover:bg-slate-55 dark:hover:bg-slate-800 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            </button>

            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border"
            />
          </div>
        </header>

        {/* Dashboard inner panels nested routing */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};
