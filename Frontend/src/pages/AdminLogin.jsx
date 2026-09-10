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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with your administrator credentials to manage Dabba operations
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder={adminPlaceholder}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter administrator password"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Not an administrator?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Go to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
