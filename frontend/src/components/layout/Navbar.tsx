import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  Bell,
  User,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useChatStore } from '../../store/chatStore';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoryStore';

interface NavbarProps {
  onToggleNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleNotifications }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { getUnreadCount } = useNotificationStore();
  const { toggleOpen: toggleAiChat } = useChatStore();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useProductStore();
  const { categories: backendCategories, fetchCategories } = useCategoryStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const navCategories = ['All', ...backendCategories];

  const cartCount = items.filter(item => !item.savedForLater).reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = getUnreadCount();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/customer/products');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    navigate('/customer/products');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-brand-border/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/customer" className="group">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                ShopMantra
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8 relative"
          >
            <div className={`w-full flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 border transition-all ${isSearchFocused ? 'border-brand-primary ring-2 ring-indigo-100 dark:ring-indigo-900/30' : 'border-transparent'
              }`}>
              <Search className="w-4 h-4 text-brand-muted" />
              <input
                type="text"
                placeholder="Ask AI to find products... (e.g. laptop under $1000)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent border-none text-sm outline-none text-brand-text dark:text-slate-100 placeholder-brand-muted"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-brand-muted hover:text-brand-text dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Categories Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-brand-muted hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400 py-2">
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 max-h-80 overflow-y-auto">
                {navCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-4 py-2.5 text-sm text-brand-muted hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={toggleAiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 transition-opacity shadow-sm hover:shadow-md animate-pulse-subtle"
            >
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-brand-muted hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-slate-800 transition-all"
              aria-label="Theme toggle"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/customer/profile"
              className="p-2 rounded-xl text-brand-muted hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-slate-800 transition-all relative"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <Link
              to="/customer/cart"
              className="p-2 rounded-xl text-brand-muted hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-slate-800 transition-all relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications Button */}
            <button
              onClick={onToggleNotifications}
              className="p-2 rounded-xl text-brand-muted hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-slate-800 transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-border dark:border-slate-700"
                  />
                </button>
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-xl shadow-xl z-50 animate-slide-up">
                      <div className="px-4 py-3 border-b border-brand-border dark:border-slate-800">
                        <p className="text-sm font-semibold text-brand-text dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-brand-muted truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/customer/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-brand-muted hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <User className="w-4 h-4" /> Profile Info
                        </Link>
                        <Link
                          to="/customer/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-brand-muted hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <ShoppingBag className="w-4 h-4" /> My Orders
                        </Link>
                        <hr className="my-1 border-brand-border dark:border-slate-800" />
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-danger rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Log In
              </Link>
            )}

          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-2">

            {/* Quick AI Buddy Trigger */}
            <button
              onClick={toggleAiChat}
              className="p-2 rounded-xl text-indigo-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="AI Buddy"
            >
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 space-y-3 shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Ask AI to shop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-full pl-9 pr-4 py-2 text-sm outline-none border border-transparent focus:border-brand-primary"
            />
          </form>

          {/* Categories Links */}
          <div className="py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    handleCategorySelect(cat);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-muted hover:text-brand-text dark:text-slate-300"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <hr className="border-brand-border dark:border-slate-800" />

          {/* Profile options */}
          <div className="space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-brand-text dark:text-slate-100">{user.name}</h4>
                    <p className="text-xs text-brand-muted">{user.email}</p>
                  </div>
                </div>

                <Link
                  to="/customer/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-muted dark:text-slate-300"
                >
                  <User className="w-4 h-4" /> Personal Info
                </Link>

                <Link
                  to="/customer/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-muted dark:text-slate-300"
                >
                  <ShoppingBag className="w-4 h-4" /> My Orders
                </Link>

                <Link
                  to="/customer/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-muted dark:text-slate-300 justify-between"
                >
                  <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Cart</span>
                  {cartCount > 0 && <span className="bg-indigo-600 text-white px-2 py-0.5 text-xs rounded-full">{cartCount}</span>}
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-brand-danger text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold"
              >
                Log In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
