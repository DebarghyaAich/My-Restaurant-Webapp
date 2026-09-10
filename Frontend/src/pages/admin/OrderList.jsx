import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  Receipt, 
  CheckCircle2, 
  Search, 
  Filter 
} from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setUpdateMsg(`Order updated to "${newStatus}"`);
        setTimeout(() => setUpdateMsg(''), 2500);
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customerDetails?.fullName?.toLowerCase().includes(q);
      const matchPhone = o.customerDetails?.phone?.toLowerCase().includes(q);
      if (!matchNumber && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Customer Orders
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Track customer order fulfillment, update delivery status, and view invoices
        </p>
      </div>

      {updateMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {updateMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['All', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No orders found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-5 font-medium">Order ID & Date</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Items</th>
                  <th className="py-3 px-4 font-medium">Total</th>
                  <th className="py-3 px-4 font-medium">Status Dispatch</th>
                  <th className="py-3 px-5 font-medium text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const oid = order._id || order.id;
                  return (
                    <tr key={oid} className="hover:bg-slate-50/70 transition-colors">
                      
                      <td className="py-3.5 px-5">
                        <p className="font-mono font-semibold text-xs text-slate-900">{order.orderNumber}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-xs text-slate-900">{order.customerDetails?.fullName}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {order.customerDetails?.phone}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                          {order.customerDetails?.address}, {order.customerDetails?.city}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="text-slate-600 text-[11px]">
                              <span className="text-slate-900 font-semibold">{item.quantity}×</span> {item.name}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-xs text-slate-900">₹{order.totalAmount?.toFixed(2)}</p>
                        <span className="text-[10px] text-slate-400">{order.paymentMethod}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(oid, e.target.value)}
                          className={`text-xs font-medium rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'Preparing'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'Out for Delivery'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-white text-slate-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to={`/order-success/${oid}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500" />
                          View
                        </Link>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrderList;
