import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

export const SellerAnalytics: React.FC = () => {
  // Chart Mock Data
  const monthlyPerformance = [
    { month: 'Jan', revenue: 4200, sales: 85, visits: 2400 },
    { month: 'Feb', revenue: 5800, sales: 110, visits: 3100 },
    { month: 'Mar', revenue: 8500, sales: 165, visits: 4500 },
    { month: 'Apr', revenue: 7800, sales: 140, visits: 4100 },
    { month: 'May', revenue: 9900, sales: 195, visits: 5200 },
    { month: 'Jun', revenue: 12840, sales: 242, visits: 6800 }
  ];

  const productPerformance = [
    { name: 'Laptop', sales: 42, revenue: 41999 },
    { name: 'Mouse', sales: 112, revenue: 6718 },
    { name: 'Keyboard', sales: 58, revenue: 5219 },
    { name: 'Shirt', sales: 22, revenue: 1099 },
    { name: 'Tea', sales: 8, revenue: 159 }
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 3 },
    { name: 'Fashion', value: 1 },
    { name: 'Wellness', value: 1 }
  ];

  const PIE_COLORS = ['#4F46E5', '#06B6D4', '#10B981'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Deep-Dive Analytics</h2>
        <p className="text-xs text-brand-muted mt-1">Audit sales volumes, traffic click-through rates, and catalog performative margins.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Monthly sales AreaChart */}
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-sm tracking-tight">Financial Growth Performance</span>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-brand-muted">Monthly (USD)</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#growthGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Product performance BarChart */}
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-sm tracking-tight">Product Revenue Comparison</span>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-brand-muted">Item margins (USD)</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Traffic LineChart */}
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-sm tracking-tight">Store Traffic & Clicks</span>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-brand-muted">Monthly unique visitors</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Categories PieChart */}
        <div className="bg-white dark:bg-slate-900 border p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-sm tracking-tight">Stock Category share</span>
          </div>

          <div className="h-48 w-full text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
