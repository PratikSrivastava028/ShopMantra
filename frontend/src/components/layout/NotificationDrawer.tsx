import React from 'react';
import { X, CheckCheck, Trash2, BellOff, ShoppingBag, CreditCard, Gift, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationType } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    activeFilter, 
    setActiveFilter 
  } = useNotificationStore();

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(
    n => activeFilter === 'All' || n.type === activeFilter
  );

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'Orders':
        return <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Payments':
        return <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Promotions':
        return <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Seller Alerts':
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-brand-border dark:border-slate-800 flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 border-b border-brand-border dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-brand-text dark:text-slate-100">Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllAsRead}
              className="p-1.5 rounded-lg text-brand-muted hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-brand-border dark:border-slate-800 flex gap-1.5 overflow-x-auto">
          {['All', 'Orders', 'Payments', 'Promotions', 'Seller Alerts'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-brand-muted hover:text-brand-text dark:hover:text-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto divide-y divide-brand-border dark:divide-slate-800">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 transition-colors flex gap-3 relative group ${
                  notif.read ? 'bg-transparent' : 'bg-indigo-50/20 dark:bg-indigo-950/10'
                }`}
              >
                {/* Circle Icon */}
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>
                
                {/* Text Body */}
                <div className="space-y-1 pr-6 flex-1">
                  <h4 className="text-sm font-semibold text-brand-text dark:text-slate-100 flex items-center gap-1.5">
                    {notif.title}
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                    )}
                  </h4>
                  <p className="text-xs text-brand-muted leading-relaxed leading-normal">{notif.message}</p>
                  <span className="text-[10px] text-brand-muted block">{notif.date}</span>
                </div>

                {/* Actions */}
                <div className="absolute right-3 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1 rounded bg-white dark:bg-slate-800 border shadow hover:text-indigo-600"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1 rounded bg-white dark:bg-slate-800 border shadow hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <BellOff className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-text dark:text-slate-100">All caught up!</p>
                <p className="text-xs text-brand-muted mt-1">No notifications matching this category.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};
