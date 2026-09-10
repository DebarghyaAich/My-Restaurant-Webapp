import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminFloatingBackground from '../components/admin/AdminFloatingBackground';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const RANDOM_ADMIN_PLACEHOLDERS = [
  'e.g. staff.access@dabba.com',
  'e.g. ops.manager@dabba.com',
  'e.g. administrator@dabba.com',
  'e.g. supervisor@dabba.com'
];

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pick a random placeholder on component mount
  const [adminPlaceholder] = useState(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_ADMIN_PLACEHOLDERS.length);
    return RANDOM_ADMIN_PLACEHOLDERS[randomIndex];
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await login(formData.email, formData.password);
      if (res.user?.role !== 'Admin') {
        setError('Access denied: This account does not possess Administrator privileges.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 admin-theme-root relative overflow-hidden">
      
      {/* Floating Ambient Glow */}
      <AdminFloatingBackground />

      <div className="max-w-md w-full space-y-8 admin-glass-card text-white p-8 sm:p-10 rounded-3xl border border-purple-900/40 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-600/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 bg-rose-950/80 border border-rose-800/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-400" />
            Authorized Personnel Only
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dabba Admin Portal
          </h2>
          <p className="text-xs text-purple-300/60">
            Manage menu items, restaurant users, and track real-time kitchen orders
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold text-purple-300/80 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder={adminPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-300/80 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter administrator password"
                className="w-full pl-10 pr-4 py-2.5 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60 border border-rose-400/20"
          >
            {loading ? 'Verifying Credentials...' : 'Access Admin Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-purple-900/40 text-center text-xs text-purple-300/60">
          Not an administrator?{' '}
          <Link to="/login" className="font-bold text-rose-400 hover:text-rose-300 hover:underline">
            Go to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
