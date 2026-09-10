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
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Imperial Operations Suite
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Dabba Restaurant Dashboard
          </h1>
          <p className="text-xs text-purple-200/70">
            Live operations, culinary metrics, and real-time kitchen order dispatch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/menu/new"
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 border border-rose-400/20"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Menu Items */}
        <div className="admin-glass-card p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200/70">Total Menu Items</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-950/80 text-purple-400 flex items-center justify-center border border-purple-800/60 shadow-inner">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats?.totalMenuItems || 0}</span>
            <Link to="/admin/menu" className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="admin-glass-card p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200/70">Total Users</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/60 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats?.totalUsers || 0}</span>
            <Link to="/admin/users" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 transition-colors">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-glass-card p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200/70">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-950/80 text-fuchsia-400 flex items-center justify-center border border-fuchsia-800/60 shadow-inner">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-white">{stats?.totalOrders || 0}</span>
            <Link to="/admin/orders" className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-0.5 transition-colors">
              Track <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Total Revenue with Standout Ruby Reddish Accent */}
        <div className="admin-glass-card p-6 rounded-3xl space-y-4 shadow-xl border-rose-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300/80">Gross Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-950/80 text-rose-300 flex items-center justify-center border border-rose-800/70 shadow-inner">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-white">
              ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
            </span>
            <span className="text-xs font-bold text-rose-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Live
            </span>
          </div>
        </div>

      </div>

      {/* Order Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="admin-glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-800/60 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-200/70">Pending Confirmation</p>
            <p className="text-2xl font-black text-white">{stats?.pendingOrders || 0} Orders</p>
          </div>
        </div>

        <div className="admin-glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/70 border border-rose-800/60 text-rose-400 flex items-center justify-center shrink-0">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-200/70">In Kitchen / Preparing</p>
            <p className="text-2xl font-black text-white">{stats?.preparingOrders || 0} Orders</p>
          </div>
        </div>

        <div className="admin-glass-card p-5 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-200/70">Successfully Delivered</p>
            <p className="text-2xl font-black text-white">{stats?.deliveredOrders || 0} Orders</p>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="admin-glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
          <div>
            <h2 className="text-lg font-black text-white">Recent Kitchen & Online Orders</h2>
            <p className="text-xs text-purple-200/60">Latest active orders placed by dining customers</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            View All Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
          <div className="text-center py-10 text-purple-300/50 text-xs">
            No customer orders recorded yet. As orders are placed from the cart and billing page, they will appear here in real time!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-900/40 text-purple-200/60 font-bold uppercase tracking-wider text-[10px] bg-purple-950/40">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Dishes</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-rose-950/20 transition-colors">
                    <td className="py-4 font-mono font-bold text-rose-400">{order.orderNumber}</td>
                    <td className="py-4">
                      <p className="font-bold text-white">{order.customerDetails?.fullName}</p>
                      <p className="text-[10px] text-purple-300/50">{order.customerDetails?.phone}</p>
                    </td>
                    <td className="py-4 text-purple-200/80">
                      {order.items?.length} item{order.items?.length === 1 ? '' : 's'}
                    </td>
                    <td className="py-4 font-bold text-white">₹{order.totalAmount?.toFixed(2)}</td>
                    <td className="py-4">
                      <span className="text-[11px] text-purple-300/70">{order.paymentMethod}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : order.status === 'Preparing'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id || order.id, e.target.value)}
                        className="bg-[#120622] border border-purple-900/60 text-[11px] text-purple-200 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
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
