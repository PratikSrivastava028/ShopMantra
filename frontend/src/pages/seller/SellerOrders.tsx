import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Eye, ShieldCheck, Filter } from 'lucide-react';
import { useSellerStore } from '../../store/sellerStore';
import { OrderStatus } from '../../types';

const mapBackendStatusToFrontend = (status: string): OrderStatus => {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'CONFIRMED': return 'Processing';
    case 'SHIPPED': return 'Shipped';
    case 'DELIVERED': return 'Delivered';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Pending';
  }
};

const mapFrontendStatusToBackend = (status: OrderStatus): string => {
  switch (status) {
    case 'Pending': return 'PENDING';
    case 'Processing': return 'CONFIRMED';
    case 'Shipped': return 'SHIPPED';
    case 'Delivered': return 'DELIVERED';
    case 'Cancelled': return 'CANCELLED';
    default: return 'PENDING';
  }
};

export const SellerOrders: React.FC = () => {
  const { orders, fetchDashboardData, updateOrderStatus, isLoading } = useSellerStore();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    const backendStatus = mapFrontendStatusToBackend(nextStatus);
    await updateOrderStatus(orderId, backendStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Processing':
        return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-100 text-slate-600 border-transparent';
    }
  };

  const mappedOrders = orders.map((o: any) => {
    const itemsText = o.items
      ?.map((item: any) => `${item.productTitle || 'Product'} (x${item.quantity})`)
      .join(', ') || 'No items';

    return {
      id: o._id || o.id || '',
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A',
      customer: o.customerName || 'Unknown Customer',
      amount: o.totalPrice?.amount || 0,
      status: mapBackendStatusToFrontend(o.status),
      items: itemsText,
    };
  });

  const filteredOrders = mappedOrders.filter(o => statusFilter === 'All' || o.status === statusFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-100">Merchant Orders</h2>
        <p className="text-xs text-brand-muted mt-1">Audit active client orders, update dispatch timelines, and review total earnings margins.</p>
      </div>

      {/* Filter header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
          <Filter className="w-4 h-4" />
          <span>Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        
        <span className="text-[10px] text-brand-muted font-bold">Total Processed: {mappedOrders.length} orders</span>
      </div>

      {/* Orders Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-xs font-semibold leading-relaxed">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-brand-muted text-[10px] uppercase font-bold tracking-wider bg-slate-50/50">
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3">Date</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Itemized Receipt</th>
                <th className="py-3">Earnings</th>
                <th className="py-3">Timelines Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {isLoading && filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-muted">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-muted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-5 font-mono font-bold text-indigo-600 dark:text-cyan-400">{o.id}</td>
                    <td className="py-3.5 text-brand-muted">{o.date}</td>
                    <td className="py-3.5 text-slate-850 dark:text-slate-200 font-bold">{o.customer}</td>
                    <td className="py-3.5 text-brand-muted max-w-xs truncate font-medium" title={o.items}>{o.items}</td>
                    <td className="py-3.5 font-extrabold text-slate-850 dark:text-slate-100">₹{o.amount.toLocaleString()}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shrink-0 ${getStatusColor(o.status)}`}>
                          {o.status}
                        </span>
                        
                        {/* Interactive drop down status changer */}
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className="bg-slate-50 border rounded text-[10px] p-0.5 outline-none cursor-pointer text-brand-muted font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
