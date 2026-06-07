import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { api } from '../services/apiClient';
import { Address } from '../types';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSummary, clearCart, discountPercent, fetchCart } = useCartStore();
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

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment Method, 3: Review & Submit
  const [shipping, setShipping] = useState<Address>({
    fullName: 'John Doe',
    addressLine1: '456 Innovation Boulevard',
    addressLine2: 'Suite 201',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
    phone: '+1 (555) 019-2834'
  });
  
  const [billing, setBilling] = useState<Address>({
    fullName: 'John Doe',
    addressLine1: '456 Innovation Boulevard',
    addressLine2: 'Suite 201',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
    phone: '+1 (555) 019-2834'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeItems = items.filter(item => !item.savedForLater);
  
  // Safe redirect if cart is empty
  React.useEffect(() => {
    if (activeItems.length === 0) {
      navigate('/cart');
    }
  }, [activeItems, navigate]);

  const { subtotal, discount, tax, shipping: shippingCost, total } = getSummary();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (sameAsShipping) {
        setBilling(shipping);
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Create live backend order
      const order = await api.orders.create({
        shippingAddress: {
          street: shipping.addressLine1,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.postalCode,
          country: shipping.country,
        },
        discountPercent,
      });

      const orderId = order.id;

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Razorpay SDK failed to load.');
      }

      // 3. Create payment in backend (gets razorpayOrderId)
      const paymentResponse = await api.payments.create(orderId);
      const razorpayOrderId = paymentResponse.payment.razorpayOrderId;
      const price = paymentResponse.payment.price;
      const keyId = paymentResponse.keyId;

      // 4. Open Razorpay checkout modal
      const options = {
        key: keyId || 'rzp_test_mockKeyShopMantra', // Use dynamic key from backend
        amount: price.amount,
        currency: price.currency,
        name: 'ShopMantra AI',
        description: 'Secure Order Payment',
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            setIsSubmitting(true);
            // Call backend payments verify endpoint with signatures
            await api.payments.verify({
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            
            clearCart();
            setIsSubmitting(false);
            navigate('/payment/success');
          } catch (verifyErr) {
            console.error('Payment signature verification failed:', verifyErr);
            setIsSubmitting(false);
            navigate('/payment/failed');
          }
        },
        prefill: {
          name: shipping.fullName,
          email: 'customer@shopmantra.ai',
          contact: shipping.phone,
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout Razorpay flow error:', err);
      setIsSubmitting(false);
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errMsg);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Step Indicator Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Checkout Securely</h2>
          <p className="text-xs text-brand-muted mt-1">Complete your enterprise order with 256-bit encryption cover.</p>
        </div>
        
        {/* Wizard Steps */}
        <div className="flex gap-2 items-center text-xs font-bold text-brand-muted select-none">
          <span className={`${step >= 1 ? 'text-indigo-600 font-bold' : ''}`}>1. Address</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={`${step >= 2 ? 'text-indigo-600 font-bold' : ''}`}>2. Payment</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={`${step >= 3 ? 'text-indigo-600 font-bold' : ''}`}>3. Place Order</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900 p-4 rounded-2xl text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2 animate-pulse-subtle animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Steps Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: Address and details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Shipping & Billing Address
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-brand-muted">Cardholder Full Name</label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-brand-muted">Address Line 1</label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, P.O. box"
                    value={shipping.addressLine1}
                    onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-brand-muted">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit"
                    value={shipping.addressLine2}
                    onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-muted">City</label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-muted">State / Province</label>
                  <input
                    type="text"
                    required
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-muted">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-muted">Country</label>
                  <input
                    type="text"
                    required
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-brand-muted">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Billing matching check */}
              <div className="pt-2 border-t flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billingCheck"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="billingCheck" className="text-xs text-brand-muted cursor-pointer select-none">
                  Billing Address is the same as shipping
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Methods wizard */}
          {step === 2 && (
            <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Select Payment Method
              </span>

              {/* Selection cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {[
                  { id: 'card', label: 'Razorpay Online Pay', desc: 'Credit Cards, Netbanking' },
                  { id: 'upi', label: 'UPI / VPA Wallet', desc: 'Instant UPI verification' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 group ${
                      paymentMethod === m.id
                        ? 'border-indigo-600 bg-indigo-55/10 text-indigo-600 dark:text-cyan-400 font-bold ring-2 ring-indigo-50 dark:ring-indigo-900/30'
                        : 'border-slate-200 text-brand-muted hover:border-slate-350 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                      paymentMethod === m.id ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{m.label}</span>
                      <span className="text-[9px] text-brand-muted block mt-0.5">{m.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Method detail configurations */}
              {paymentMethod === 'card' && (
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border text-center space-y-2">
                  <p className="text-xs text-brand-muted">Secure Razorpay integration. You can pay via Cards, UPI, Netbanking or Wallet in the next step.</p>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border">
                  <label className="font-semibold text-brand-muted block">Enter UPI Virtual Address (VPA)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="john@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              )}

              {/* Wizard navigation buttons */}
              <div className="flex justify-between pt-2 border-t">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 border hover:bg-slate-50 rounded-xl text-xs font-bold text-brand-muted flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Address
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  Review Order <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Review and place order */}
          {step === 3 && (
            <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Verify Details & Place Order
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold leading-relaxed">
                {/* Shipping address recap */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted block mb-1">Shipping Details</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{shipping.fullName}</p>
                  <p className="text-brand-muted font-medium">{shipping.addressLine1}, {shipping.addressLine2 || ''}</p>
                  <p className="text-brand-muted font-medium">{shipping.city}, {shipping.state} {shipping.postalCode}</p>
                  <p className="text-brand-muted font-medium">Phone: {shipping.phone}</p>
                </div>

                {/* Payment recap */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted block mb-1">Payment Method</span>
                  <p className="text-slate-850 dark:text-slate-200 font-bold uppercase">{paymentMethod} Integration</p>
                  <p className="text-brand-muted font-medium">
                    {paymentMethod === 'card' ? 'Secure Online Razorpay Portal' : `UPI ID: ${upiId || 'john@okaxis'}`}
                  </p>
                  <p className="text-brand-muted text-[10px] flex items-center gap-1 font-bold text-emerald-600 mt-2">
                    <ShieldCheck className="w-4.5 h-4.5" /> SECURED COGNITIVE CHECKOUT
                  </p>
                </div>
              </div>

              {/* Wizard navigation */}
              <div className="flex justify-between pt-2 border-t">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border hover:bg-slate-50 rounded-xl text-xs font-bold text-brand-muted flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Edit Payment
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>Completing Transaction secure...</>
                  ) : (
                    <>Place Secure Order (₹{total.toFixed(2)})</>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Items recap summary invoice */}
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-6">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-indigo-600" /> Order Summary
          </span>

          {/* Itemized row list */}
          <div className="divide-y divide-brand-border/60 max-h-56 overflow-y-auto">
            {activeItems.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex gap-2.5 items-center min-w-0">
                  <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded border bg-slate-50 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-850 dark:text-slate-200 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-brand-muted">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-850 dark:text-slate-100">
                  {item.product.currency === 'USD' ? '$' : '₹'}{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-brand-border" />

          {/* Receipt billing totals block */}
          <div className="space-y-2 text-xs text-brand-muted font-semibold leading-relaxed">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-850 dark:text-slate-200">₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-500 font-bold">
                <span>Discount coupon</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="text-slate-850 dark:text-slate-200">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-slate-850 dark:text-slate-200">
                {shippingCost === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <hr className="border-brand-border my-1" />
            <div className="flex justify-between text-sm font-extrabold text-slate-850 dark:text-slate-100">
              <span>Total Price</span>
              <span className="text-indigo-600 dark:text-cyan-400">₹{total.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Checkout;
