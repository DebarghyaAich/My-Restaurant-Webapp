import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UtensilsCrossed, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const RANDOM_CUSTOMER_PLACEHOLDERS = [
  'e.g. alex.morgan@example.com',
  'e.g. priya.patel@example.com',
  'e.g. jordan.lee@example.com',
  'e.g. arjun.verma@example.com',
  'e.g. samantha.wong@example.com',
  'e.g. foodie.explorer@example.com'
];

const UserLogin = () => {
  const { login } = useAuth();
  const { isBeige } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = typeof location.state?.from === 'string' 
    ? location.state.from 
    : (location.state?.from?.pathname || '/');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pick a random placeholder on component mount
  const [randomPlaceholder] = useState(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_CUSTOMER_PLACEHOLDERS.length);
    return RANDOM_CUSTOMER_PLACEHOLDERS[randomIndex];
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl border transition-all ${
        isBeige
          ? 'bg-[#fdfaf5]/95 border-amber-200/80 shadow-xl shadow-amber-950/5'
          : 'bg-[#180705]/95 border-orange-900/50 shadow-2xl shadow-black/50'
      }`}>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isBeige ? 'text-stone-900' : 'text-white'
          }`}>
            Customer Login
          </h2>
          <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
            Sign in to track your orders, view receipts, and speed up checkout
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className={`block text-xs font-bold mb-1 ${
              isBeige ? 'text-stone-700' : 'text-orange-200'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isBeige ? 'text-stone-400' : 'text-orange-300/50'
              }`} />
              <input
                type="email"
                name="email"
                required
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder={randomPlaceholder}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                  isBeige
                    ? 'bg-stone-50 border border-amber-200 text-stone-900 placeholder-stone-400 focus:bg-white'
                    : 'bg-[#120504] border border-orange-950 text-white placeholder-orange-300/40 focus:bg-[#150604]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1 ${
              isBeige ? 'text-stone-700' : 'text-orange-200'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isBeige ? 'text-stone-400' : 'text-orange-300/50'
              }`} />
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all ${
                  isBeige
                    ? 'bg-stone-50 border border-amber-200 text-stone-900 placeholder-stone-400 focus:bg-white'
                    : 'bg-[#120504] border border-orange-950 text-white placeholder-orange-300/40 focus:bg-[#150604]'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className={`pt-4 border-t text-center text-xs ${
          isBeige ? 'border-amber-100 text-stone-500' : 'border-orange-950 text-orange-200/60'
        }`}>
          New to Dabba?{' '}
          <Link to="/register" state={location.state} className="font-bold text-orange-600 hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UserLogin;
