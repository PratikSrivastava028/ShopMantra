import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  FileText, 
  Check, 
  Truck, 
  Package, 
  Home, 
  Sparkles
} from 'lucide-react';
import { api } from '../services/apiClient';
import { Order, OrderStatus } from '../types';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.orders.getUserOrders();
        const found = data.find(o => o.id === id);
        setOrder(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-xs text-brand-muted mt-3 font-semibold uppercase tracking-wider">Retrieving order tracking...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[50vh] text-center p-8 space-y-4 flex flex-col items-center justify-center">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Order not found</h3>
        <p className="text-xs text-brand-muted">The order ID does not exist or you do not have permission to view it.</p>
        <button onClick={() => navigate('/customer/orders')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Return to Orders
        </button>
      </div>
    );
  }

  // Get active step value for timeline tracking (0: Pending, 1: Processing, 2: Shipped, 3: Delivered)
  const getTimelineStep = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getTimelineStep(order.status);

  const timelineSteps = [
    { label: 'Ordered', desc: 'Secure order placed', icon: <Package className="w-4 h-4" /> },
    { label: 'Processing', desc: 'Listing details packed', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Shipped', desc: 'Dispatched via express', icon: <Truck className="w-4 h-4" /> },
    { label: 'Delivered', desc: 'Handed over successfully', icon: <Home className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/customer/orders')}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-muted hover:text-indigo-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders Log
          </button>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Tracking: {order.id}</h2>
            <span className="text-[10px] text-brand-muted font-semibold">Ordered on {order.date}</span>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-4 py-2 border rounded-xl text-xs font-bold text-brand-muted hover:text-slate-850 flex items-center gap-1.5 bg-white dark:bg-slate-900 shadow-sm"
        >
          <FileText className="w-4 h-4" /> Print Invoice
        </button>
      </div>

      {/* TIMELINE VISUAL TRACKER CARD */}
      {order.status !== 'Cancelled' ? (
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <span className="font-extrabold text-sm tracking-tight block mb-6">Delivery Progress</span>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            
            {/* Horizontal connection line for desktop */}
            <div className="hidden md:block absolute left-6 right-6 top-5 h-0.5 bg-slate-150 dark:bg-slate-800 z-0">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${(currentStepIdx / 3) * 100}%` }}
              />
            </div>

            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isActive = idx === currentStepIdx;

              return (
                <div key={idx} className="flex md:flex-col items-center gap-3 text-left md:text-center z-10 flex-1 w-full md:w-auto">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white border-transparent'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200'
                  } ${isActive ? 'ring-4 ring-indigo-100 dark:ring-indigo-900/30' : ''}`}>
                    {isCompleted && idx < currentStepIdx ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${
                      isCompleted ? 'text-slate-850 dark:text-slate-100' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-brand-muted block mt-0.5">{step.desc}</span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      ) : (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 p-5 rounded-2xl text-xs text-rose-600 flex items-center gap-2">
          <span>This order has been cancelled. If this is in error or you would like to reactivate, please consult support@shopmantra.ai.</span>
        </div>
      )}

      {/* ADDRESSES & PAYMENT INFRASTRUCTURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Shipping address */}
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Destination
          </span>
          <div className="text-xs space-y-1 font-semibold text-brand-muted leading-relaxed">
            <p className="text-slate-850 dark:text-slate-250 font-bold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" /> Billing Details
          </span>
          <div className="text-xs space-y-1 font-semibold text-brand-muted leading-relaxed">
            <p className="text-slate-850 dark:text-slate-250 font-bold">{order.billingAddress.fullName}</p>
            <p>{order.billingAddress.addressLine1}, {order.billingAddress.addressLine2}</p>
            <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
            <p>{order.billingAddress.country}</p>
          </div>
        </div>

        {/* Payment recap details */}
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Summary
          </span>
          <div className="text-xs space-y-2 font-semibold text-brand-muted leading-relaxed">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="text-slate-850 dark:text-slate-250 font-bold uppercase">{order.paymentMethod}</span>
            </div>
            {order.paymentInfo && (
              <>
                {order.paymentInfo.last4 && (
                  <div className="flex justify-between">
                    <span>Card digits</span>
                    <span className="text-slate-850 dark:text-slate-250">Visa ending in *{order.paymentInfo.last4}</span>
                  </div>
                )}
                {order.paymentInfo.transactionId && (
                  <div className="flex justify-between items-center gap-1">
                    <span>Reference ID</span>
                    <span className="text-[10px] font-mono text-slate-800 dark:text-slate-200 select-all truncate">{order.paymentInfo.transactionId}</span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between border-t pt-2 mt-1">
              <span>Verification</span>
              <span className="text-emerald-500 font-extrabold text-[10px] uppercase flex items-center gap-0.5">
                <Check className="w-3.5 h-3.5" /> Approved SECURE
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ITEMS LIST & PRICE BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Items rows Column */}
        <div className="flex-1 p-6 divide-y divide-brand-border">
          <span className="font-extrabold text-sm tracking-tight block mb-4">Purchased Items</span>
          
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs first:pt-0 last:pb-0">
              <div className="flex gap-3 items-center min-w-0">
                <img src={item.product.image} alt="" className="w-12 h-12 object-cover rounded-xl border bg-slate-50 shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 hover:text-indigo-600 truncate">{item.product.name}</h4>
                  <span className="text-[10px] text-brand-muted">Quantity: {item.quantity} • ₹{item.price} each</span>
                </div>
              </div>
              <span className="font-extrabold text-slate-855 dark:text-slate-100 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Costs invoice summary panel */}
        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/40 p-6 border-t md:border-t-0 md:border-l border-brand-border space-y-4 shrink-0 justify-between flex flex-col">
          <span className="font-extrabold text-sm tracking-tight block">Invoice Breakdown</span>
          
          <div className="space-y-2.5 text-xs text-brand-muted font-semibold leading-relaxed">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="text-slate-850 dark:text-slate-200">₹{order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-slate-850 dark:text-slate-200">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes Included</span>
              <span className="text-slate-850 dark:text-slate-200">8% Cover</span>
            </div>
            
            <hr className="border-brand-border my-1" />
            
            <div className="flex justify-between text-sm font-extrabold text-slate-850 dark:text-slate-100">
              <span>Grand Total Paid</span>
              <span className="text-indigo-600 dark:text-cyan-400">₹{order.amount.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="text-[9px] text-brand-muted leading-relaxed font-medium">Thank you for ordering with ShopMantra AI. Your order is secured and covered by standard consumer protection regulations.</p>
        </div>

      </div>

    </div>
  );
};
