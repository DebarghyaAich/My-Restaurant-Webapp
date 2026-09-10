import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Utensils, 
  Users, 
  ShoppingBag, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchStats();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Overview of live orders, revenue, and restaurant operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/menu/new"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Menu Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Menu Items</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats?.totalMenuItems || 0}</span>
            <Link to="/admin/menu" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</span>
            <Link to="/admin/users" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 transition-colors">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats?.totalOrders || 0}</span>
            <Link to="/admin/orders" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-0.5 transition-colors">
              Track <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        </div>

      </div>

      {/* Order Status Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Orders</p>
            <p className="text-lg font-bold text-slate-900">{stats?.pendingOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">In Preparation</p>
            <p className="text-lg font-bold text-slate-900">{stats?.preparingOrders || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Delivered</p>
            <p className="text-lg font-bold text-slate-900">{stats?.deliveredOrders || 0}</p>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Latest orders placed across dining and takeout</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
          <div className="text-center py-8 text-slate-400 text-xs font-medium">
            No customer orders recorded yet. Incoming orders will display here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-mono font-medium text-slate-800">{order.orderNumber}</td>
                    <td className="py-3.5">
                      <p className="font-semibold text-slate-900">{order.customerDetails?.fullName}</p>
                      <p className="text-[11px] text-slate-500">{order.customerDetails?.phone}</p>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {order.items?.length} item{order.items?.length === 1 ? '' : 's'}
                    </td>
                    <td className="py-3.5 font-semibold text-slate-900">₹{order.totalAmount?.toFixed(2)}</td>
                    <td className="py-3.5 text-slate-600">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.status === 'Preparing'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : order.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id || order.id, e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 text-xs rounded-md px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
