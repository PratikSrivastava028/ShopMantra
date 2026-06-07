import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Lock, 
  Sparkles, 
  Check, 
  Trash2, 
  Eye, 
  Plus, 
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useProductStore();
  const { addToCart } = useCartStore();

  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'wishlist' | 'security'>('info');
  
  // Local forms state
  const [profileName, setProfileName] = useState(user?.name || 'John Doe');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'john.doe@shopmantra.ai');
  const [infoUpdated, setInfoUpdated] = useState(false);

  const [addresses, setAddresses] = useState([
    { id: 'addr-1', tag: 'Primary Workstation', name: 'John Doe', line1: '456 Innovation Boulevard', line2: 'Suite 201', city: 'San Francisco', state: 'CA', zip: '94107', country: 'United States', phone: '+1 (555) 019-2834' }
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ tag: 'Home', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '' });

  const [secPwd, setSecPwd] = useState({ old: '', new: '', confirm: '' });
  const [secUpdated, setSecUpdated] = useState(false);
  const [secError, setSecError] = useState<string | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoUpdated(true);
    setTimeout(() => setInfoUpdated(false), 2000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.line1 || !newAddr.city) return;
    
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        tag: newAddr.tag,
        name: newAddr.name,
        line1: newAddr.line1,
        line2: newAddr.line2,
        city: newAddr.city,
        state: newAddr.state,
        zip: newAddr.zip,
        country: newAddr.country,
        phone: newAddr.phone
      }
    ]);
    setShowAddAddress(false);
    setNewAddr({ tag: 'Home', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: '' });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError(null);
    setSecUpdated(false);

    if (secPwd.new.length < 8) {
      setSecError('New password must be at least 8 characters long.');
      return;
    }

    if (secPwd.new !== secPwd.confirm) {
      setSecError('Passwords do not match.');
      return;
    }

    setSecUpdated(true);
    setSecPwd({ old: '', new: '', confirm: '' });
    setTimeout(() => setSecUpdated(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Profile Dashboard cards */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-16 h-16 rounded-full object-cover border shadow-sm"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">{user.name}</h2>
            <p className="text-xs text-brand-muted font-medium">{user.email}</p>
            <div className="flex gap-2 justify-center sm:justify-start">
              <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {user.role} Member
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* TABS SIDEBAR LIST */}
        <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1 shrink-0">
          {[
            { id: 'info', label: 'Personal Information', icon: <User className="w-4 h-4" /> },
            { id: 'addresses', label: 'Addresses Book', icon: <MapPin className="w-4 h-4" /> },
            { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'wishlist', label: 'My Wishlist', icon: <Heart className="w-4 h-4" /> },
            { id: 'security', label: 'Account Security', icon: <Lock className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'orders') {
                  navigate('/customer/orders');
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-brand-muted hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'wishlist' && wishlist.length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {wishlist.length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* WORKSPACE CONTENT PANEL */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-6 rounded-3xl shadow-sm min-h-[350px]">
          
          {/* TAB 1: Personal Info */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateInfo} className="space-y-6 animate-fade-in">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" /> Personal Credentials
              </span>

              {infoUpdated && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-3.5 rounded-xl text-xs text-emerald-600 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Personal info saved successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-brand-muted">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-brand-muted">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Addresses Management */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Addresses Book
                </span>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                )}
              </div>

              {/* Add address sub-form sheet */}
              {showAddAddress && (
                <form onSubmit={handleAddAddressSubmit} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border space-y-4 text-xs font-semibold">
                  <span className="text-[10px] font-bold text-brand-muted uppercase block">New Delivery Address</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-brand-muted">Address Tag (e.g. Home, Work)</label>
                      <input
                        type="text"
                        required
                        value={newAddr.tag}
                        onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-muted">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.name}
                        onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-brand-muted">Address Line 1</label>
                      <input
                        type="text"
                        required
                        value={newAddr.line1}
                        onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-muted">City</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-muted">State / Province</label>
                      <input
                        type="text"
                        required
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-muted">ZIP / Postal Code</label>
                      <input
                        type="text"
                        required
                        value={newAddr.zip}
                        onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-muted">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 border rounded-xl hover:bg-white text-xs font-semibold text-brand-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address lists cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-brand-border dark:border-slate-800 p-4 rounded-2xl relative space-y-1 flex flex-col justify-between">
                    <div className="text-xs space-y-1 font-semibold text-brand-muted leading-relaxed">
                      <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider block w-max mb-1">
                        {addr.tag}
                      </span>
                      <p className="text-slate-850 dark:text-slate-205 font-bold">{addr.name}</p>
                      <p>{addr.line1}, {addr.line2}</p>
                      <p>{addr.city}, {addr.state} {addr.zip}</p>
                      <p>Phone: {addr.phone}</p>
                    </div>
                    
                    <div className="flex justify-end pt-2 border-t mt-2">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[10px] font-bold text-brand-danger hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Wishlist Collection */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fade-in">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-indigo-600" /> My Saved Wishlist
              </span>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <div 
                      key={product.id}
                      className="border border-brand-border dark:border-slate-800 p-3.5 rounded-2xl flex items-center gap-3.5 justify-between group"
                    >
                      <div 
                        onClick={() => navigate(`/customer/product/${product.id}`)}
                        className="flex gap-3 items-center min-w-0 cursor-pointer"
                      >
                        <img src={product.image} alt="" className="w-12 h-12 object-cover rounded-xl border bg-slate-50 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-850 dark:text-slate-200 truncate">{product.name}</h4>
                          <span className="font-extrabold text-xs text-indigo-600 block mt-0.5">${product.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow"
                          title="Add directly to cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-2 rounded-xl border text-brand-muted hover:text-rose-600"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 text-center flex flex-col items-center justify-center p-6 space-y-2">
                  <Heart className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-semibold text-brand-text dark:text-slate-200">No items saved in wishlist</p>
                  <p className="text-[10px] text-brand-muted max-w-xs leading-relaxed">Like items in the catalogue grid to place them in your bookmarks here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Security password resets */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdateSecurity} className="space-y-6 animate-fade-in">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" /> Security Credentials
              </span>

              {secUpdated && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-3.5 rounded-xl text-xs text-emerald-600 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Password credentials updated successfully!
                </div>
              )}

              {secError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {secError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 text-xs font-semibold max-w-sm">
                <div className="space-y-1.5">
                  <label className="text-brand-muted">Current Password</label>
                  <input
                    type="password"
                    required
                    value={secPwd.old}
                    onChange={(e) => setSecPwd({ ...secPwd, old: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-brand-muted">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={secPwd.new}
                    onChange={(e) => setSecPwd({ ...secPwd, new: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-brand-muted">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={secPwd.confirm}
                    onChange={(e) => setSecPwd({ ...secPwd, confirm: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
