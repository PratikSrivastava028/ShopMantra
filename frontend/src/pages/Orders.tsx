import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, PackageOpen, Star } from 'lucide-react';
import { api } from '../services/apiClient';
import { Order, OrderStatus } from '../types';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await api.orders.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100 dark:border-amber-900';
      case 'Processing':
        return 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 border-cyan-100 dark:border-cyan-900';
      case 'Shipped':
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-100 dark:border-indigo-900';
      case 'Delivered':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900';
      case 'Cancelled':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-100 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-600 border-transparent';
    }
  };

  const handleOrderClick = (id: string) => {
    navigate(`/customer/order/${id}`);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">Order Logs</h2>
        <p className="text-xs text-brand-muted mt-1">Review transaction history, delivery timelines, and download invoice receipts.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border rounded-2xl p-6 h-28 animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/6" />
              </div>
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-slate-750 transition-all flex flex-col sm:flex-row justify-between items-center gap-4 cursor-pointer group"
            >
              {/* Left detail info */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-center text-slate-500 shrink-0">
                  <ShoppingBag className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-850 dark:text-slate-100">{order.id}</span>
                    <span className="text-[10px] text-brand-muted font-semibold">{order.date}</span>
                  </div>
                  
                  {/* Thumbnail names line */}
                  <p className="text-xs text-brand-muted truncate max-w-sm sm:max-w-md mt-1 leading-normal">
                    {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                  </p>
                </div>
              </div>

              {/* Status color-coded pill + amount */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-brand-muted block uppercase">Grand Total</span>
                  <span className="font-extrabold text-sm text-slate-850 dark:text-slate-100 mt-0.5 block">₹{order.amount.toFixed(2)}</span>
                </div>
                
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border shrink-0 ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>

                <ChevronRight className="w-4 h-4 text-brand-muted group-hover:translate-x-0.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty Orders list state */
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-16 text-center space-y-4 h-[350px] flex flex-col items-center justify-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-muted flex items-center justify-center text-lg">📦</div>
          <div>
            <h3 className="font-bold text-slate-850 dark:text-slate-100">No orders placed yet</h3>
            <p className="text-xs text-brand-muted mt-1 max-w-sm">
              Your transaction history log is clean. Go back to our catalogue or explore recommended products.
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Browse Products
          </button>
        </div>
      )}

    </div>
  );
};
