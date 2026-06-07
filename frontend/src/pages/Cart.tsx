import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Bookmark, 
  BookmarkCheck,
  Plus, 
  Minus, 
  Sparkles, 
  ChevronRight, 
  Tag,
  ArrowLeft,
  X
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    toggleSaveForLater, 
    couponCode, 
    discountPercent, 
    applyCoupon, 
    removeCoupon,
    getSummary,
    fetchCart
  } = useCartStore();

  const { products, fetchProducts } = useProductStore();

  React.useEffect(() => {
    const initCart = async () => {
      if (products.length === 0) {
        await fetchProducts();
      }
      await fetchCart(useProductStore.getState().products);
    };
    initCart();
  }, [fetchCart, fetchProducts, products.length]);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);

  const activeItems = items.filter(item => !item.savedForLater);
  const savedItems = items.filter(item => item.savedForLater);

  const { subtotal, discount, tax, shipping, total } = getSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(false);
    if (!couponInput.trim()) return;
    
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    } else {
      setCouponError(true);
    }
  };

  const handleCheckout = () => {
    navigate('/customer/checkout');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Shopping Bag</h2>
          <p className="text-xs text-brand-muted mt-1">Review your premium selections and cognitive coupons.</p>
        </div>
        <Link to="/customer/products" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      {activeItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Items List Column */}
          <div className="lg:col-span-2 space-y-4">
            {activeItems.map((item) => (
              <div 
                key={item.product.id}
                className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between group"
              >
                
                {/* Details thumbnail */}
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover border bg-slate-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold text-brand-muted block">{item.product.brand}</span>
                    <h3 
                      onClick={() => navigate(`/customer/product/${item.product.id}`)}
                      className="font-bold text-sm text-slate-855 dark:text-slate-100 hover:text-indigo-600 cursor-pointer truncate mt-0.5"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-[10px] text-brand-muted mt-0.5">Category: {item.product.category}</p>
                    <span className="text-xs font-bold text-indigo-600 mt-1 block">
                      {item.product.currency === 'USD' ? '$' : '₹'}{item.product.price}
                    </span>
                  </div>
                </div>

                {/* Controls (quantity, save, remove) */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity selector */}
                  <div className="flex items-center border rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 rounded hover:bg-white text-brand-muted hover:text-slate-850 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-extrabold text-slate-800 dark:text-slate-200 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 rounded hover:bg-white text-brand-muted hover:text-slate-850 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSaveForLater(item.product.id)}
                      className="p-2 rounded-lg text-brand-muted hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      title="Save for Later"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 rounded-lg text-brand-muted hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* RIGHT: Summary panel Column */}
          <div className="space-y-6">
            
            {/* Coupon Application card */}
            <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" /> Apply Coupon
              </span>
              
              {couponCode ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-600">
                  <span className="font-semibold tracking-wider uppercase">Active: {couponCode} (-25% OFF)</span>
                  <button onClick={removeCoupon} className="hover:text-rose-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. SHOPAI25)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(false);
                    }}
                    className="flex-1 bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-850 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[10px] text-brand-danger font-semibold">Invalid coupon code. Try "SHOPAI25" or "WELCOME10".</p>
              )}
            </div>

            {/* Invoices summary card */}
            <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="font-extrabold text-sm tracking-tight block">Order Summary</span>
              
              <div className="space-y-2.5 text-xs text-brand-muted leading-relaxed font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-850 dark:text-slate-200">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>Discount Applied</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span className="text-slate-850 dark:text-slate-200">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-slate-850 dark:text-slate-200">
                    {shipping === 0 ? <span className="text-emerald-500 font-extrabold">FREE</span> : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <hr className="border-brand-border dark:border-slate-800 my-1" />
                
                <div className="flex justify-between text-sm font-extrabold text-slate-850 dark:text-slate-100">
                  <span>Grand Total</span>
                  <span className="text-indigo-600 dark:text-cyan-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5"
              >
                Proceed to Checkout <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-16 text-center space-y-4 h-[350px] flex flex-col items-center justify-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-muted flex items-center justify-center text-lg">🛒</div>
          <div>
            <h3 className="font-bold text-slate-850 dark:text-slate-100">Your shopping cart is empty</h3>
            <p className="text-xs text-brand-muted mt-1 max-w-sm">
              Explore our trending items or ask the AI Shopping Buddy to add recommended setups to your bag.
            </p>
          </div>
          <button
            onClick={() => navigate('/customer/products')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* SAVE FOR LATER COLLECTION */}
      {savedItems.length > 0 && (
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-base tracking-tight">Saved For Later ({savedItems.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => (
              <div 
                key={item.product.id}
                className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex gap-3 items-center">
                  <img src={item.product.image} alt="" className="w-12 h-12 object-cover rounded-lg border bg-slate-50" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-850 dark:text-slate-200 line-clamp-1">{item.product.name}</h4>
                    <span className="text-[11px] font-bold text-indigo-600 block mt-0.5">
                      {item.product.currency === 'USD' ? '$' : '₹'}{item.product.price}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveForLater(item.product.id)}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg border text-brand-muted hover:text-rose-650"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
