import React, { useState } from 'react';
import { 
  IndianRupee, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle,
  AlertCircle,
  X,
  Wallet
} from 'lucide-react';
import { useSellerStore } from '../../store/sellerStore';

export const SellerPayments: React.FC = () => {
  const { kpis, transactions, payouts, requestPayout, isLoading } = useSellerStore();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(false);

    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) {
      setWithdrawError('Please enter a valid positive withdrawal amount.');
      return;
    }

    if (val > kpis.revenue) {
      setWithdrawError('Insufficient balance to complete request.');
      return;
    }

    const success = await requestPayout(val);
    if (success) {
      setWithdrawSuccess(true);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
    } else {
      setWithdrawError('Payout request blocked by security gates.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'bg-emerald-50 text-emerald-600';
      case 'pending':
      case 'processing':
        return 'bg-amber-55/10 text-amber-600';
      case 'failed':
        return 'bg-rose-50 text-rose-650';
      default:
        return 'bg-slate-100 text-slate-650';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Financial Portal</h2>
          <p className="text-xs text-brand-muted mt-1">Audit active payouts, request withdrawals, and track transaction logs.</p>
        </div>
        <button
          onClick={() => {
            setWithdrawError(null);
            setWithdrawSuccess(false);
            setIsWithdrawModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow shadow-indigo-600/20 animate-pulse-subtle"
        >
          <ArrowUpRight className="w-4 h-4" /> Request Payout
        </button>
      </div>

      {withdrawSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-4 rounded-2xl text-xs text-emerald-600 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Withdrawal request initiated successfully. Payout transfer processing with your bank partner.</span>
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex justify-between">
            <span className="text-brand-muted">Available Balance</span>
            <Wallet className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">₹{kpis.revenue.toLocaleString()}</h3>
          <p className="text-[10px] text-brand-muted leading-normal">Ready for instant automated bank payout withdrawals.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex justify-between">
            <span className="text-brand-muted">Processing Payouts</span>
            <CreditCard className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">
            ₹{payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </h3>
          <p className="text-[10px] text-brand-muted leading-normal">Funds cleared by Stripe processor in transit.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex justify-between">
            <span className="text-brand-muted">Completed Payouts</span>
            <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">
            ₹{payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </h3>
          <p className="text-[10px] text-brand-muted leading-normal">Total payouts transferred in the last 6 months.</p>
        </div>
      </div>

      {/* TABS GRID: TRANSACTIONS & PAYOUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Ledger logs (Transactions list) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4">
          <span className="font-extrabold text-sm tracking-tight block">Transaction Log Ledger</span>
          
          <div className="overflow-x-auto text-[11px] font-semibold leading-relaxed">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-brand-muted font-bold text-[9px] uppercase tracking-wider">
                  <th className="py-2">Reference</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Details</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">{tx.id}</td>
                    <td className="py-2.5 text-brand-muted">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-2.5 text-slate-850 dark:text-slate-200">{tx.details}</td>
                    <td className="py-2.5 uppercase font-bold text-[9px] text-brand-muted">{tx.type}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-2.5 text-right font-extrabold ${
                      tx.type === 'payout' || tx.type === 'withdrawal' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {tx.type === 'payout' || tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout history lists */}
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4">
          <span className="font-extrabold text-sm tracking-tight block">Bank Payout History</span>

          <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
            {payouts.map((pay) => (
              <div key={pay.id} className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">₹{pay.amount.toFixed(2)}</h4>
                  <span className="text-[10px] text-brand-muted block mt-0.5">{pay.bankAccount}</span>
                  <span className="text-[9px] text-brand-muted block mt-0.5">Transferred on {pay.date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getStatusColor(pay.status)}`}>
                  {pay.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WITHDRAWAL DIALOG MODAL */}
      {isWithdrawModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsWithdrawModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 border rounded-3xl p-6 flex flex-col animate-slide-up">
            
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <ArrowUpRight className="w-4.5 h-4.5 text-indigo-600" /> Request bank withdrawal
              </span>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-4.5 h-4.5 text-brand-muted" />
              </button>
            </div>

            {withdrawError && (
              <div className="mt-3 bg-red-50 border border-red-100 text-red-650 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-semibold py-4">
              <div className="space-y-1.5">
                <label className="text-brand-muted block">Available: <span className="font-extrabold text-indigo-600">₹{kpis.revenue.toLocaleString()}</span></label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
                  <input
                    type="number"
                    step="100"
                    required
                    placeholder="Enter amount (e.g. 1000)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-855 rounded-xl pl-8 pr-4 py-2.5 text-xs outline-none border focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                >
                  {isLoading ? 'Clearing context...' : 'Authorize Withdrawal'}
                </button>
              </div>
            </form>

          </div>
        </>
      )}

    </div>
  );
};
