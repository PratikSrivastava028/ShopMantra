import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, X, PackageOpen, Filter,
  PauseCircle, PlayCircle, Minus, ChevronUp, ChevronDown
} from 'lucide-react';
import { useSellerStore } from '../../store/sellerStore';
import { useCategoryStore } from '../../store/categoryStore';
import { SellerProduct } from '../../types';

export const SellerProducts: React.FC = () => {
  const { products, addProduct, editProduct, deleteProduct, updateStock, toggleProductStatus, fetchDashboardData, isLoading } = useSellerStore();
  const { categories: backendCategories, fetchCategories, createCategory } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('Electronics');
  const [status, setStatus] = useState<'active' | 'draft' | 'out_of_stock'>('active');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Category creation
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Inline stock editing
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockValue, setEditingStockValue] = useState(0);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchDashboardData();
  }, []);

  const allCategories = ['All', ...backendCategories];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setName(''); setPrice(29.99); setStock(20);
    setCategory(backendCategories[0] || 'Electronics');
    setStatus('active'); setDescription(''); setFeatures([]);
    setImageUrl('');
    setCurrency('INR');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: SellerProduct) => {
    setModalMode('edit');
    setSelectedProduct(p);
    setName(p.name); setPrice(p.price); setStock(p.stock);
    setCategory(p.category); setStatus(p.status); setDescription(p.description);
    setFeatures(p.features || []);
    setImageUrl(p.imageUrl || '');
    setCurrency(p.currency || 'INR');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalCategory = category;
    if (showAddCategory && newCategoryInput.trim()) {
      finalCategory = newCategoryInput.trim();
      createCategory(finalCategory);
    }

    if (modalMode === 'add') {
      addProduct({ name, price, currency, stock, category: finalCategory, status, description, features, imageUrl,
        seoKeywords: [name.toLowerCase()], tags: [finalCategory], active: status === 'active' });
    } else if (modalMode === 'edit' && selectedProduct) {
      editProduct({ ...selectedProduct, name, price, currency, stock, category: finalCategory, status, description, features, imageUrl });
    }
    setIsModalOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryInput.trim()) return;
    setIsCreatingCategory(true);
    await createCategory(newCategoryInput.trim());
    setCategory(newCategoryInput.trim());
    setNewCategoryInput('');
    setShowAddCategory(false);
    setIsCreatingCategory(false);
  };

  const handleDelete = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSaveStock = async (id: string) => {
    await updateStock(id, editingStockValue);
    setEditingStockId(null);
  };

  const stockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-rose-600';
    if (stock <= 5) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Store Inventory</h2>
          <p className="text-xs text-brand-muted mt-1">Manage listings, update stock, and control product visibility.</p>
        </div>
        <button onClick={handleOpenAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-muted" />
          <input type="text" placeholder="Search inventory..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl pl-9 pr-4 py-2 text-xs outline-none border focus:border-indigo-600" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted shrink-0">
          <Filter className="w-4 h-4" />
          <span>Category:</span>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer">
            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Product Table */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-bold text-brand-muted tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Sold</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-5">
                      <div className="flex gap-3 items-center min-w-[160px]">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover border shrink-0 bg-slate-50" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border shrink-0 flex items-center justify-center font-bold text-indigo-600 text-sm">
                            {product.name[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-850 dark:text-slate-200 truncate max-w-[140px]">{product.name}</h4>
                          <span className="text-[10px] font-mono text-brand-muted block mt-0.5">{product.id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-brand-muted font-medium">{product.category}</td>
                    <td className="py-3.5 font-bold text-slate-855 dark:text-slate-100">
                      {product.currency === 'USD' ? '$' : '₹'}{product.price.toFixed(2)}
                    </td>
                    <td className="py-3.5">
                      {editingStockId === product.id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" min="0" value={editingStockValue}
                            onChange={e => setEditingStockValue(parseInt(e.target.value) || 0)}
                            className="w-16 border rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-600 bg-slate-50 dark:bg-slate-800"
                            autoFocus />
                          <button onClick={() => handleSaveStock(product.id)}
                            className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">Save</button>
                          <button onClick={() => setEditingStockId(null)}
                            className="px-2 py-1 border rounded-lg text-[10px] text-brand-muted">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingStockId(product.id); setEditingStockValue(product.stock); }}
                          className={`font-bold hover:underline ${stockStatusColor(product.stock)}`} title="Click to edit stock">
                          {product.stock} units
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 text-brand-muted font-medium">{product.sales} orders</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        !product.active ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        : product.status === 'active' ? 'bg-emerald-50 text-emerald-600'
                        : product.status === 'draft'  ? 'bg-amber-50 text-amber-600'
                        : 'bg-rose-50 text-rose-600'
                      }`}>
                        {!product.active ? 'Paused' : product.status === 'active' ? 'Active' : product.status === 'draft' ? 'Draft' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Pause / Activate */}
                        <button onClick={() => toggleProductStatus(product.id)}
                          className={`p-1.5 rounded-lg border text-xs hover:opacity-80 transition ${product.active ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                          title={product.active ? 'Pause product' : 'Activate product'}>
                          {product.active ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        </button>
                        {/* Edit */}
                        <button onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-muted hover:text-indigo-600" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete */}
                        <button onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg border hover:bg-red-50 dark:hover:bg-red-950/20 text-rose-500" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-16 text-center space-y-4 h-[280px] flex flex-col items-center justify-center">
          <PackageOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <div>
            <h3 className="font-bold text-slate-850 dark:text-slate-100">No products found</h3>
            <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All' ? 'Try adjusting your filters.' : 'Add your first product to start selling.'}
            </p>
          </div>
          {!searchQuery && selectedCategory === 'All' && (
            <button onClick={handleOpenAddModal} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
              Add First Product
            </button>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl border rounded-3xl flex flex-col animate-slide-up max-h-[90vh]"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <span className="font-extrabold text-sm tracking-tight">
                {modalMode === 'add' ? 'Add New Product' : `Edit: ${name}`}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-4 h-4 text-brand-muted" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleModalSubmit} className="space-y-4 text-xs font-semibold" id="product-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-brand-muted">Product Title *</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600 text-slate-800 dark:text-slate-200" />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-brand-muted">Product Image Link (URL) *</label>
                    <input type="url" required value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600 text-slate-800 dark:text-slate-200" />
                  </div>

                  {/* Currency */}
                  <div className="space-y-1.5">
                    <label className="text-brand-muted">Currency *</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value as 'INR' | 'USD')}
                      className="w-full bg-slate-50 dark:bg-slate-850 border rounded-xl px-3 py-2.5 outline-none cursor-pointer text-slate-800 dark:text-slate-200 font-bold">
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-brand-muted">Price ({currency === 'USD' ? '$' : '₹'}) *</label>
                    <input type="number" step="0.01" required min="0" value={price}
                      onChange={e => setPrice(parseFloat(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600 text-slate-800 dark:text-slate-200" />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-brand-muted">Initial Stock</label>
                    <input type="number" required min="0" value={stock}
                      onChange={e => setStock(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600" />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-brand-muted">Category</label>
                      <button type="button" onClick={() => setShowAddCategory(!showAddCategory)}
                        className="text-[10px] text-indigo-600 hover:underline font-bold">
                        {showAddCategory ? 'Use Existing' : '+ New Category'}
                      </button>
                    </div>
                    {showAddCategory ? (
                      <div className="flex gap-2">
                        <input type="text" placeholder="e.g. Smart Wearables" value={newCategoryInput}
                          onChange={e => setNewCategoryInput(e.target.value)}
                          className="flex-1 bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600" />
                        <button type="button" onClick={handleCreateCategory} disabled={isCreatingCategory}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-60">
                          {isCreatingCategory ? '...' : 'Create'}
                        </button>
                      </div>
                    ) : (
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 border rounded-xl px-3 py-2.5 outline-none cursor-pointer text-slate-800 dark:text-slate-200">
                        {backendCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-brand-muted">Publish Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-850 border rounded-xl px-3 py-2.5 outline-none cursor-pointer">
                      <option value="active">Active (Visible to customers)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-brand-muted">Product Description</label>
                    <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600 resize-none text-slate-800 dark:text-slate-200" />
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-brand-muted">Bullet Specifications</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. 144Hz IPS Display" value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (featureInput.trim()) { setFeatures([...features, featureInput.trim()]); setFeatureInput(''); } }}}
                        className="flex-1 bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2.5 border outline-none focus:border-indigo-600" />
                      <button type="button"
                        onClick={() => { if (featureInput.trim()) { setFeatures([...features, featureInput.trim()]); setFeatureInput(''); }}}
                        className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:opacity-90 text-white rounded-xl">Add</button>
                    </div>
                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {features.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                            {f}
                            <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                              className="text-rose-500 hover:text-rose-700"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2.5 p-6 border-t shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-muted text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" form="product-form" disabled={isLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-60">
                {isLoading ? 'Saving...' : modalMode === 'add' ? 'Publish Listing' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border border-brand-border dark:border-slate-800 rounded-3xl flex flex-col p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 text-rose-500 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center border border-rose-100 dark:border-rose-900">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm tracking-tight text-slate-850 dark:text-slate-100">Delete Product</h3>
            </div>
            
            <p className="text-xs text-brand-muted leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">"{productToDelete?.name}"</span>? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-855 text-brand-muted text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/10 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
