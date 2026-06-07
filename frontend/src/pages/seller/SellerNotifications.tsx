import React, { useState } from 'react';
import { Bell, BellRing, Trash2, CheckCheck, CreditCard, Sparkles, TrendingUp } from 'lucide-react';

export const SellerNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState([
    { id: 'al-1', title: 'Payout Processed Successfully 🚀', message: 'Your monthly withdrawal of ₹400,000 has been transferred to Chase Business bank account.', date: '3 days ago', read: false },
    { id: 'al-2', title: 'Flawless Green Tea Review! 🍵', message: 'Customer Yuki M. submitted a verified 5-star evaluation for ZenMantra Japanese Green Tea Sencha.', date: '4 days ago', read: true },
    { id: 'al-3', title: 'Stock level alert: AeroBlade 💻', message: 'Item AeroBlade 15 Gaming Laptop has dipped below threshold. Current warehouse stock: 14 units.', date: '1 week ago', read: true }
  ]);

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Seller Alerts</h2>
          <p className="text-xs text-brand-muted mt-1">Review operational updates, inventory alerts, and payout verifications.</p>
        </div>
        
        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 border rounded-xl text-xs font-bold text-brand-muted hover:text-slate-850 flex items-center gap-1.5 bg-white shadow-sm"
        >
          <CheckCheck className="w-4 h-4" /> Mark all as Read
        </button>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={`p-5 rounded-2xl border transition-all flex justify-between gap-4 items-center group relative ${
                al.read ? 'bg-white dark:bg-slate-900 border-brand-border dark:border-slate-800' : 'bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900'
              }`}
            >
              <div className="flex gap-4 items-center min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-200 flex items-center gap-2">
                    {al.title}
                    {!al.read && <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0" />}
                  </h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed leading-normal">{al.message}</p>
                  <span className="text-[10px] text-brand-muted block mt-1.5">{al.date}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(al.id)}
                className="p-2 rounded-lg border text-brand-muted hover:text-rose-650 opacity-0 group-hover:opacity-100 transition-opacity bg-white shrink-0"
                title="Delete alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>

            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white border rounded-3xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-text">No active alerts</p>
            <p className="text-xs text-brand-muted mt-1">All quiet! No recent warehouse or payment notices.</p>
          </div>
        </div>
      )}

    </div>
  );
};
