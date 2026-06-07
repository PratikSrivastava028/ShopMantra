import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  DollarSign, ShoppingBag, TrendingUp, Package, AlertTriangle,
  Sparkles, ArrowRight, CheckCircle2, Info, AlertCircle, XCircle,
  LayoutDashboard, BarChart2, RefreshCw
} from 'lucide-react';
import { useSellerStore } from '../../store/sellerStore';
import { useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const INSIGHT_STYLES = {
  positive: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> },
  warning:  { bg: 'bg-amber-50 dark:bg-amber-950/20',   border: 'border-amber-200 dark:border-amber-800',   text: 'text-amber-700 dark:text-amber-300',   icon: <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" /> },
  danger:   { bg: 'bg-rose-50 dark:bg-rose-950/20',     border: 'border-rose-200 dark:border-rose-800',     text: 'text-rose-700 dark:text-rose-300',     icon: <XCircle className="w-4 h-4 shrink-0 text-rose-500" /> },
  info:     { bg: 'bg-blue-50 dark:bg-blue-950/20',     border: 'border-blue-200 dark:border-blue-800',     text: 'text-blue-700 dark:text-blue-300',     icon: <Info className="w-4 h-4 shrink-0 text-blue-500" /> },
};

export const SellerDashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { analytics, transactions, fetchDashboardData, isLoading } = useSellerStore();
  const [chartRange, setChartRange] = useState<'monthly' | 'trend'>('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const a = analytics;

  // KPI cards config
  const kpiCards = a ? [
    { label: 'Total Products',     val: a.totalProducts,      icon: <Package className="w-4 h-4 text-indigo-600" />,  color: 'text-indigo-600' },
    { label: 'Active Products',    val: a.activeProducts,     icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, color: 'text-emerald-600' },
    { label: 'Out of Stock',       val: a.outOfStockProducts, icon: <AlertCircle className="w-4 h-4 text-rose-600" />,  color: 'text-rose-600' },
    { label: 'Total Orders',       val: a.totalOrders,        icon: <ShoppingBag className="w-4 h-4 text-cyan-600" />,  color: 'text-cyan-600' },
    { label: 'Pending Orders',     val: a.pendingOrders,      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />, color: 'text-amber-600' },
    { label: 'Total Revenue',      val: `₹${a.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-violet-600" />, color: 'text-violet-600' },
    { label: 'Monthly Revenue',    val: `₹${a.monthlyRevenue.toLocaleString()}`, icon: <TrendingUp className="w-4 h-4 text-teal-600" />, color: 'text-teal-600' },
    { label: 'Conversion Rate',    val: `${a.conversionRate}%`, icon: <BarChart2 className="w-4 h-4 text-fuchsia-600" />, color: 'text-fuchsia-600' },
  ] : [];

  const chartData = chartRange === 'monthly' ? (a?.revenueByMonth || []) : (a?.trendData || []);
  const chartKey = chartRange === 'monthly' ? 'month' : 'date';

  const stockStatusStyle = (status: string) => {
    if (status === 'in_stock')   return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
    if (status === 'low_stock')  return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400';
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" /> Merchant Dashboard
          </h2>
          <p className="text-xs text-brand-muted mt-1">Real-time analytics from your store data.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboardData()}
            disabled={isLoading}
            className="px-3 py-2 border rounded-xl text-xs font-semibold text-brand-muted hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {isLoading && !a && (
        <div className="flex items-center justify-center h-40 text-brand-muted text-sm">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading analytics...
        </div>
      )}

      {/* 8 KPI Widgets */}
      {a && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{kpi.label}</span>
                <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border">
                  {kpi.icon}
                </div>
              </div>
              <h3 className={`text-xl font-extrabold ${kpi.color}`}>{kpi.val}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Chart + Demand Wheel */}
      {a && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue / Trend Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight">Revenue Analytics</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setChartRange('monthly')} className={`px-3 py-1 rounded-lg font-semibold border transition ${chartRange === 'monthly' ? 'bg-indigo-600 text-white border-indigo-600' : 'text-brand-muted border-brand-border hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  Monthly
                </button>
                <button onClick={() => setChartRange('trend')} className={`px-3 py-1 rounded-lg font-semibold border transition ${chartRange === 'trend' ? 'bg-indigo-600 text-white border-indigo-600' : 'text-brand-muted border-brand-border hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  Last 30 Days
                </button>
              </div>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey={chartKey} stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Demand Wheel */}
          <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <span className="font-extrabold text-sm tracking-tight block">Product Demand Wheel</span>
            {a.demandWheel.length > 0 ? (
              <div className="h-56 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={a.demandWheel} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {a.demandWheel.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any, _: any, props: any) => [`${v} units`, props.payload.name]} />
                    <Legend layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-brand-muted text-xs text-center">
                No order data yet.<br />Sales will appear here once orders are placed.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Performance + Top Products */}
      {a && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Category Performance Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <span className="font-extrabold text-sm tracking-tight block">Revenue by Category</span>
            {a.categoryStats.length > 0 ? (
              <div className="h-52 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={a.categoryStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                    <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-brand-muted text-xs">No category data yet.</div>
            )}
          </div>

          {/* Top Products List */}
          <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <span className="font-extrabold text-sm tracking-tight block">Top Selling Products</span>
            {a.topProducts.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-52">
                {a.topProducts.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-extrabold text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{p.title}</p>
                      <p className="text-[10px] text-brand-muted">{p.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-600">{p.sold} sold</p>
                      <p className="text-[10px] text-brand-muted">₹{p.revenue.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-brand-muted text-xs">No sales data yet.</div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {a && a.aiInsights.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b pb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-extrabold text-sm tracking-tight">AI Product Insights</span>
            <span className="text-[10px] text-brand-muted ml-auto">Generated from your store data</span>
          </div>
          <div className="space-y-2">
            {a.aiInsights.map((insight, i) => {
              const s = INSIGHT_STYLES[insight.type];
              return (
                <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border ${s.bg} ${s.border}`}>
                  {s.icon}
                  <p className={`text-xs font-medium leading-relaxed ${s.text}`}>{insight.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      {a && a.inventory.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="font-extrabold text-sm tracking-tight">Inventory Overview</span>
            <button onClick={() => navigate('/seller/products')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5">Sold</th>
                  <th className="py-2.5">Revenue</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {a.inventory.slice(0, 8).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 max-w-[180px] truncate">{item.title}</td>
                    <td className="py-3 text-brand-muted">{item.category}</td>
                    <td className="py-3 font-bold">{item.stock}</td>
                    <td className="py-3 text-brand-muted">{item.sold}</td>
                    <td className="py-3 font-bold text-emerald-600">₹{item.revenue.toFixed(0)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${stockStatusStyle(item.status)}`}>
                        {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="font-extrabold text-sm tracking-tight">Recent Transactions</span>
            <button onClick={() => navigate('/seller/payments')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                  <th className="py-2.5">Transaction ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-slate-800 dark:text-slate-200">{tx.id.slice(-8)}</td>
                    <td className="py-3 text-brand-muted">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200">{tx.details}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${tx.status === 'success' ? 'bg-emerald-50 text-emerald-600' : tx.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-extrabold ${tx.type === 'payout' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {tx.type === 'payout' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
