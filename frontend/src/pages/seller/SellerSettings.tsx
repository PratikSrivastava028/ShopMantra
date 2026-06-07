import React, { useState } from 'react';
import { Settings, ShieldCheck, Check, Info } from 'lucide-react';

export const SellerSettings: React.FC = () => {
  const [shopName, setShopName] = useState('ZenMantra Wellness & Tech');
  const [shopDesc, setShopDesc] = useState('Providing premium tailored apparel, precision mechanical items, and ceremonial Kyoto green tea sencha.');
  const [payoutBank, setPayoutBank] = useState('Chase Business ending in 9482');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Merchant Settings</h2>
        <p className="text-xs text-brand-muted mt-1">Configure shop identities, corporate bank routing, and security API keys.</p>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-emerald-600 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>Shop settings updated successfully. Changes applied to billing structures.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Config Forms */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm space-y-6">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <Settings className="w-4.5 h-4.5 text-indigo-600" /> Shop Profile
          </span>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold leading-relaxed">
            <div className="space-y-1.5">
              <label className="text-brand-muted">Public Shop Name</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-brand-muted">Shop Description Summary</label>
              <textarea
                rows={3}
                required
                value={shopDesc}
                onChange={(e) => setShopDesc(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-brand-muted">Settlement Bank Account Routing</label>
              <input
                type="text"
                required
                value={payoutBank}
                onChange={(e) => setPayoutBank(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-850 rounded-xl px-3 py-2 border text-xs outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25"
              >
                Save Settings Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Information Security cover */}
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4">
          <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> Security Standards
          </span>
          
          <div className="text-xs text-brand-muted leading-relaxed font-semibold space-y-3">
            <p>Your shop balance is secured using industry standard multi-party computing cover and SOC2 compliance rules.</p>
            <div className="flex items-start gap-2 text-[10px] text-brand-muted font-medium bg-slate-50 p-3 rounded-xl border">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>To activate high volume withdrawals above ₹1,000,000 daily limit, please submit business KYC verification papers.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
