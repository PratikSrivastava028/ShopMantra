import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowLeft, 
  Check, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/apiClient';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { toggleWishlist, wishlist, products } = useProductStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [isLoading, setIsLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const item = await api.products.getById(id);
        setProduct(item);
        setActiveImage(item.image);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-xs text-brand-muted mt-3 font-semibold uppercase tracking-wider">Retrieving product specs...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] text-center p-8 space-y-4 flex flex-col items-center justify-center">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Product not found</h3>
        <p className="text-xs text-brand-muted">The product you are trying to view does not exist in our catalog database.</p>
        <button onClick={() => navigate('/customer/products')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isLiked = wishlist.some(p => p.id === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    navigate('/customer/checkout');
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Back button */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>
      </div>

      {/* Product main panel grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border bg-slate-50 dark:bg-slate-850 h-[380px] flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all"
            />
          </div>
          
          <div className="flex gap-2.5 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-18 h-18 rounded-xl overflow-hidden border shrink-0 bg-slate-50 ${
                  activeImage === img ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-brand-border'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Title Info + Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">
                {product.brand} Collection
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 rounded-full border shadow-sm transition-colors ${
                  isLiked 
                    ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100 dark:border-rose-900' 
                    : 'bg-white dark:bg-slate-800 text-brand-muted hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100">{product.name}</h2>
            
            {/* Rating Stars info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`w-4 h-4 ${
                      idx < Math.floor(product.rating) ? 'fill-current' : ''
                    }`} 
                  />
                ))}
              </div>
              <span className="text-slate-850 dark:text-slate-200 font-bold">{product.rating}</span>
              <span>•</span>
              <span>({product.ratingCount} reviews)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed leading-normal">{product.description}</p>

          <hr className="border-brand-border dark:border-slate-850" />

          {/* Pricing Info */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {product.currency === 'USD' ? '$' : '₹'}{product.price}
            </span>
            {product.discount > 0 && (
              <div className="space-y-0.5">
                <span className="text-sm text-brand-danger line-through block font-medium">
                  {product.currency === 'USD' ? '$' : '₹'}{product.originalPrice}
                </span>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">-{product.discount}% OFF Coupon Applied</span>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2 ${
                addedMessage 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
              }`}
            >
              {addedMessage ? (
                <><Check className="w-4 h-4" /> Added to Cart</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-bold text-xs transition-all shadow hover:shadow-md"
            >
              Buy It Now
            </button>
          </div>

          {/* Key assurance points */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border text-center text-[10px] font-bold text-brand-muted">
            <div className="space-y-1">
              <Truck className="w-4 h-4 mx-auto text-indigo-500" />
              <span className="block text-slate-800 dark:text-slate-200">Free Delivery</span>
              <span className="block text-[9px] font-medium">Above ₹5000 orders</span>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-500" />
              <span className="block text-slate-800 dark:text-slate-200">1 Year Warranty</span>
              <span className="block text-[9px] font-medium">Manufacturer cover</span>
            </div>
            <div className="space-y-1">
              <Clock className="w-4 h-4 mx-auto text-amber-500" />
              <span className="block text-slate-800 dark:text-slate-200">Easy Returns</span>
              <span className="block text-[9px] font-medium">30 days exchange</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Panel: Specifications vs Reviews */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Tab Headers */}
        <div className="flex border-b border-brand-border dark:border-slate-850 gap-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'specs' 
                ? 'text-indigo-600 dark:text-cyan-400' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Specifications
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-cyan-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'reviews' 
                ? 'text-indigo-600 dark:text-cyan-400' 
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            Customer Reviews ({product.reviews.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-cyan-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' ? (
          <div className="max-w-2xl divide-y divide-brand-border dark:divide-slate-850 text-xs">
            {product.specs.length > 0 ? (
              product.specs.map((spec, i) => (
                <div key={i} className="flex py-3 gap-4">
                  <span className="w-1/3 font-bold text-brand-muted">{spec.name}</span>
                  <span className="w-2/3 text-slate-850 dark:text-slate-200 font-semibold">{spec.value}</span>
                </div>
              ))
            ) : (
              <p className="text-brand-muted py-4">No specific technical attributes defined.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="space-y-2 border-b last:border-none pb-4 last:pb-0 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-slate-200">{rev.userName}</h4>
                      <div className="flex items-center text-amber-500 gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-muted">{rev.date}</span>
                  </div>
                  <p className="text-brand-muted leading-relaxed font-medium">"{rev.comment}"</p>
                </div>
              ))
            ) : (
              <p className="text-brand-muted py-4">No reviews submitted yet for this product. Be the first to buy and submit feedback!</p>
            )}
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold tracking-tight">AI Recommended Complements</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div 
                  className="cursor-pointer overflow-hidden rounded-xl bg-slate-50"
                  onClick={() => navigate(`/customer/product/${item.id}`)}
                >
                  <img src={item.image} alt={item.name} className="w-full h-36 object-cover group-hover:scale-102 transition-all duration-300" />
                </div>
                
                <div className="space-y-2 mt-3">
                  <h4 
                    onClick={() => navigate(`/customer/product/${item.id}`)}
                    className="font-bold text-xs text-slate-850 dark:text-slate-100 hover:text-indigo-600 cursor-pointer truncate"
                  >
                    {item.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400">${item.price}</span>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login');
                        } else {
                          addToCart(item, 1);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs"
                      title="Add complement to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
