import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Bell,
  Settings,
  ArrowLeft,
  ShoppingBasket,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SellerSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({ onNavigate, className }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const links = [
    { label: 'Dashboard', path: '/seller', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Products', path: '/seller/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Orders', path: '/seller/orders', icon: <ShoppingBasket className="w-4 h-4" /> },
    { label: 'Payments', path: '/seller/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Analytics', path: '/seller/analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Notifications', path: '/seller/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Settings', path: '/seller/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className={`w-64 border-r border-brand-border dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0 shrink-0 z-30 ${className || ''}`}>

      {/* Brand logo */}
      <div className="p-4 border-b border-brand-border dark:border-slate-800 flex items-center justify-between">
        <Link to="/" className="group">
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Seller Dashboard
          </span>
        </Link>
        <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
          Seller
        </span>
      </div>

      {/* Seller Credentials Info */}
      {user && (
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border-b border-brand-border dark:border-slate-800 flex items-center gap-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-brand-text dark:text-slate-200 truncate">{user.name}</h4>
            <p className="text-[9px] text-brand-muted truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/seller'}
            onClick={onNavigate}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-bold'
                : 'text-brand-muted hover:text-brand-text dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 transition-transform group-hover:scale-105">{link.icon}</span>
              <span>{link.label}</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-muted" />
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-brand-border dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" /> Sign Out
        </button>
      </div>

    </aside>
  );
};
