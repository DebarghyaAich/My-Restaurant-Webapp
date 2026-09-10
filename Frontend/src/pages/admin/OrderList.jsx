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
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-rose-400">
          Kitchen & Delivery Dispatch
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Customer Orders Management
        </h1>
        <p className="text-xs text-purple-300/60">
          Monitor kitchen tickets, update delivery stages, and verify billing payments
        </p>
      </div>

      {updateMsg && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-4 h-4" />
          {updateMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-glass-card p-6 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xl">
        
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['All', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-rose-950/50 border border-rose-400/30'
                  : 'bg-[#140826] text-purple-300/70 hover:text-white hover:bg-purple-950/50 border border-purple-900/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="admin-glass-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-purple-300/50 text-xs">
            Loading order records...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-purple-300/60">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-900/40 text-purple-300/60 font-bold uppercase tracking-wider text-[10px] bg-purple-950/40">
                  <th className="py-4 px-6">Order ID & Date</th>
                  <th className="py-4 px-4">Customer & Destination</th>
                  <th className="py-4 px-4">Dishes Ordered</th>
                  <th className="py-4 px-4">Bill Total</th>
                  <th className="py-4 px-4">Status Dispatch</th>
                  <th className="py-4 px-6 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {filteredOrders.map((order) => {
                  const oid = order._id || order.id;
                  return (
                    <tr key={oid} className="hover:bg-purple-950/30 transition-colors">
                      
                      <td className="py-4 px-6">
                        <p className="font-mono font-bold text-sm text-rose-400">{order.orderNumber}</p>
                        <p className="text-[10px] text-purple-300/50 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-white text-xs">{order.customerDetails?.fullName}</p>
                        <p className="text-[11px] text-purple-300/60 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-rose-400" />
                          {order.customerDetails?.phone}
                        </p>
                        <p className="text-[10px] text-purple-300/50 truncate max-w-xs mt-0.5">
                          {order.customerDetails?.address}, {order.customerDetails?.city}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <p key={idx} className="text-purple-200/90 text-[11px]">
                              <strong className="text-rose-400 font-extrabold">{item.quantity}×</strong> {item.name}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-black text-sm text-white">₹{order.totalAmount?.toFixed(2)}</p>
                        <span className="text-[10px] text-purple-300/60 font-semibold">{order.paymentMethod}</span>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(oid, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                              : order.status === 'Preparing'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                              : order.status === 'Out for Delivery'
                              ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#150628] text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/order-success/${oid}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#120622] hover:bg-purple-950/60 text-purple-300 hover:text-white text-xs font-bold border border-purple-900/40 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-rose-400" />
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
