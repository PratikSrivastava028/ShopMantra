import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  MessageSquare,
  Truck,
  Users,
  TrendingUp,
  ShieldCheck,
  Plus,
  Check,
  LayoutDashboard
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useChatStore } from '../store/chatStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useCategoryStore } from '../store/categoryStore';
import { Product } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, toggleWishlist, wishlist } = useProductStore();
  const { toggleOpen: toggleAiChat } = useChatStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { categories: backendCategories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 3);
  const trending = products.filter(p => p.trending).slice(0, 3);

  // Dynamic categories from backend, enrich with images and descriptions
  const categoryImageMap: Record<string, { img: string; desc: string }> = {
    'electronics': { img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=60', desc: 'Laptops, keyboards, wireless peripherals.' },
    'fashion': { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&auto=format&fit=crop&q=60', desc: 'Tailored office shirts and apparel.' },
    'wellness': { img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=60', desc: 'Matcha, organic teas, and wellness.' },
    'home & living': { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=60', desc: 'Furniture, décor, and living essentials.' },
    'sports': { img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&auto=format&fit=crop&q=60', desc: 'Fitness, outdoors, and sports gear.' },
  };
  const fallbackImg = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150&auto=format&fit=crop&q=60';

  const categories = backendCategories.map(cat => {
    const key = cat.toLowerCase();
    const meta = categoryImageMap[key];
    const count = products.filter(p => p.category?.toLowerCase() === key).length;
    return {
      name: cat,
      count,
      img: meta?.img || fallbackImg,
      desc: meta?.desc || `Explore our collection of premium ${cat} products.`,
    };
  });

  const handleCategorySelect = (categoryName: string) => {
    useProductStore.getState().setSelectedCategory(categoryName);
    navigate('/customer/products');
  };

  const handleProductClick = (id: string) => {
    navigate(`/customer/product/${id}`);
  };

  return (
    <div className="space-y-16 pb-12">

      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white py-20 px-6 sm:px-12 lg:px-20 shadow-2xl">

        {/* Dynamic decorative gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-cyan-900/40 z-0" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse-subtle" /> ShopMantra Flagship E-Commerce
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Shop Smarter <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              with Cognitive AI
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-350 leading-relaxed font-medium">
            Discover products instantly using natural language, compare micro-specifications, and let AI bundle your perfect checkout setup automatically.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate('/customer/products')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2 group"
            >
              Start Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={toggleAiChat}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse-subtle" /> Try AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold tracking-tight">Browse Premium Categories</h2>
          <p className="text-xs text-brand-muted mt-1">Curated collections with AI tags for enterprise vetting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              onClick={() => handleCategorySelect(cat.name)}
              key={cat.name}
              className="group bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex gap-4 items-center w-full text-left"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-16 h-16 rounded-xl object-cover border group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100">{cat.name}</h3>
                <p className="text-[11px] text-brand-muted mt-1 leading-normal">{cat.desc}</p>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-2 block flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Explore Catalogue <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold tracking-tight">Featured Smart Picks</h2>
            </div>
            <p className="text-xs text-brand-muted mt-1">Top-rated items featuring exclusive discount coupons.</p>
          </div>
          <Link to="/customer/products" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div
                className="relative overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300"
                />
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">{product.brand}</span>
                  <h3
                    onClick={() => handleProductClick(product.id)}
                    className="font-bold text-sm text-slate-850 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-brand-muted line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">
                      {product.currency === 'USD' ? '$' : '₹'}{product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-brand-danger line-through font-medium">
                        {product.currency === 'USD' ? '$' : '₹'}{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        addToCart(product, 1);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white transition-all"
                    title="Add directly to cart"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AI Shopping Features Benefits */}
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-brand-border/60 dark:border-slate-800/60 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Integration
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">The AI-First Advantage</h2>
            <p className="text-xs text-brand-muted mt-2 leading-relaxed">
              ShopMantra shifts e-commerce from catalog clicking to natural conversational search. See how our AI companion elevates your online purchases.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Semantic Product Search', desc: 'Describe what you need in plain text: "office setup under $1200".' },
              { title: 'Specs Comparison Engines', desc: 'AI reviews gigabytes of specs sheets to isolate technical differences.' },
              { title: 'Instant direct checkout injection', desc: 'Instruct AI: "Add matching mouse to cart" to avoid manual shopping grids.' }
            ].map((f, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.title}</h4>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-normal">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={toggleAiChat}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-pulse-subtle"
          >
            Launch Chatbot Assistant <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic chat mock visual interface */}
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl shadow-lg p-5 space-y-4">
          <div className="flex gap-2.5 items-center border-b pb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-xs font-bold tracking-tight">ShopMantra Cognitive Demo</span>
          </div>

          <div className="space-y-3 text-xs leading-normal">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border text-[9px] shrink-0">U</div>
              <div className="bg-slate-150 p-2.5 rounded-xl rounded-tl-none font-medium">"I need a black cotton office shirt in slim fit"</div>
            </div>

            <div className="flex gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] shrink-0"><Sparkles className="w-3 h-3" /></div>
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-xl rounded-tl-none space-y-2 border">
                <p>I recommend the **Tailored Signature Black Office Shirt**.</p>
                <div className="bg-white dark:bg-slate-900 border p-2 rounded-lg flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=60"
                    alt=""
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div>
                    <h5 className="font-bold text-[10px]">Tailored Office Shirt</h5>
                    <span className="font-bold text-[10px] text-indigo-600">$59.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending Products Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <h2 className="text-2xl font-extrabold tracking-tight">Hot & Trending</h2>
            </div>
            <p className="text-xs text-brand-muted mt-1">High-demand items moving fast today.</p>
          </div>
          <Link to="/customer/products" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div
                className="relative overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">{product.brand}</span>
                  <h3
                    onClick={() => handleProductClick(product.id)}
                    className="font-bold text-sm text-slate-850 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-brand-muted line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">${product.price}</span>
                    {product.discount > 0 && (
                      <span className="text-xs text-brand-danger line-through font-medium">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        addToCart(product, 1);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white transition-all"
                    title="Add directly to cart"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight">Loved by Customers Globally</h2>
          <p className="text-xs text-brand-muted mt-1">Verified buyer evaluations of ShopMantra experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Connor', review: 'The AI Buddy literally designed my workspace layout. I typed: "Quiet mouse and keyboard under $150" and it compiled a bundle, added it to my cart, and checked out in 3 clicks.', role: 'Data Engineer' },
            { name: 'Linus Torvalds', review: 'Fast loading times, responsive styling, and clean components. The specification comparison layout is an absolute masterpiece.', role: 'Kernel Architect' },
            { name: 'Marcus Aurelius', review: 'A stunningly beautiful UI. The integration with microservices feels seamless. Highly recommended for investor demos and actual utility alike.', role: 'Product Manager' }
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => <span key={idx}>★</span>)}
              </div>
              <p className="text-xs text-brand-muted leading-relaxed font-medium">"{t.review}"</p>
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase text-indigo-600">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
                  <span className="text-[10px] text-brand-muted block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};
