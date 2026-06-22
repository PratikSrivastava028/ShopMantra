import React, { useEffect } from 'react';
import { 
  Grid, 
  List, 
  SlidersHorizontal, 
  RotateCcw, 
  ShoppingBag, 
  Check, 
  Heart,
  Star,
  ChevronDown
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCategoryStore } from '../store/categoryStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

export const ProductListing: React.FC = () => {
  const navigate = useNavigate();
  const { 
    products,
    filteredProducts, 
    fetchProducts, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory,
    priceRange, 
    setPriceRange,
    sortBy, 
    setSortBy,
    layout, 
    setLayout,
    wishlist, 
    toggleWishlist,
    resetFilters,
    isLoading
  } = useProductStore();

  const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1500;
  const currencySymbol = products.length > 0 && products[0].currency === 'USD' ? '$' : '₹';

  const { addToCart, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { categories: backendCategories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const categories = ['All', ...backendCategories];

  const handleProductClick = (id: string) => {
    navigate(`/customer/product/${id}`);
  };

  const isProductInWishlist = (id: string) => wishlist.some(p => p.id === id);

  return (
    <div className="space-y-6">
      
      {/* Search Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Shop Catalogue</h2>
          {searchQuery && (
            <p className="text-xs text-brand-muted mt-1">
              Search results for: <span className="font-semibold text-indigo-600">"{searchQuery}"</span> ({filteredProducts.length} items found)
            </p>
          )}
        </div>
        
        {/* Layout & Sort Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Sorting */}
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 border text-xs">
            <span className="text-brand-muted mr-1.5 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="discount">Highest Discounts</option>
            </select>
          </div>

          {/* Grid/List Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-sm' 
                  : 'text-brand-muted hover:text-slate-700'
              }`}
              title="Grid Layout"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'list' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-sm' 
                  : 'text-brand-muted hover:text-slate-700'
              }`}
              title="List Layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* FILTERS SIDEBAR */}
        <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-6 shrink-0 lg:sticky lg:top-24">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filters
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-brand-muted hover:text-indigo-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Category</h3>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-brand-muted hover:text-brand-text dark:hover:text-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Price Range</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-brand-muted">
                <span>{currencySymbol}0</span>
                <span className="text-indigo-600">{currencySymbol}{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                step={Math.ceil(maxProductPrice / 100) || 1}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>



        </aside>

        {/* PRODUCTS LIST */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            layout === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                  >
                    {/* Wishlist Icon */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full border shadow-sm z-10 transition-colors ${
                        isProductInWishlist(product.id)
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100 dark:border-rose-900'
                          : 'bg-white dark:bg-slate-800 text-brand-muted hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    <div 
                      className="relative overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-800"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-350"
                      />
                      {product.discount > 0 && (
                        <span className="absolute bottom-3 left-3 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          -{product.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-brand-muted">
                          <span className="uppercase">{product.brand}</span>
                          <span className="flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>
                        </div>
                        <h3 
                          onClick={() => handleProductClick(product.id)}
                          className="font-bold text-sm text-slate-850 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-brand-muted line-clamp-2 leading-relaxed">{product.description}</p>
                      </div>

                      <div className="flex justify-between items-center pt-1.5 border-t border-brand-border/40">
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
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Layout */
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row p-4 gap-4 items-center group relative"
                  >
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-4 right-4 p-1.5 rounded-full border shadow-sm z-10 transition-colors ${
                        isProductInWishlist(product.id)
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100 dark:border-rose-900'
                          : 'bg-white dark:bg-slate-800 text-brand-muted hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full sm:w-36 h-28 object-cover rounded-xl border bg-slate-50 shrink-0 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-muted uppercase">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>
                        </div>
                        <h3
                          onClick={() => handleProductClick(product.id)}
                          className="font-bold text-sm text-slate-850 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-1 mt-0.5"
                        >
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-brand-muted line-clamp-2 leading-relaxed mt-1">{product.description}</p>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-brand-border/40">
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
                          className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white dark:bg-slate-900 border rounded-2xl p-12 text-center space-y-4 h-80 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-muted flex items-center justify-center text-lg">🔍</div>
              <div>
                <h3 className="font-bold text-slate-850 dark:text-slate-100">No matching products found</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                  Try adjusting your filters, modifying your search term, or clearing everything to see our entire premium catalogue.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-indigo-600"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
