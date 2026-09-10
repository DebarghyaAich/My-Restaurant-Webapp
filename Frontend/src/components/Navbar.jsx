import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import AnimatedBrandName from './AnimatedBrandName';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Menu as MenuIcon, 
  X, 
  ClipboardList,
  ShieldCheck,
  Palette
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount, openCart, showNotification } = useCart();
  const { theme, toggleTheme, isBeige } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    showNotification('You have logged out successfully', 'info');
  };

  const isAdmin = user && (user.role === 'Admin' || user.role === 'admin');

  const handleCartClick = (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      showNotification('Please sign in to view and manage your cart!', 'info');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    openCart();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 theme-nav border-b transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-all duration-300">
              <UtensilsCrossed className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <AnimatedBrandName text="Dabba" className="text-2xl font-black" />
              <span className="block text-[10px] font-semibold tracking-widest uppercase text-slate-400 -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping inline-block" />
                Artisanal Kitchen & Dining
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-700 hover:text-orange-600' : 'text-stone-300 hover:text-orange-400'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/menu" 
              className={`text-sm font-semibold transition-colors ${
                isActive('/menu') && !location.search ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-700 hover:text-orange-600' : 'text-stone-300 hover:text-orange-400'
              }`}
            >
              Our Menu
            </Link>

            <Link 
              to="/about" 
              className={`text-sm font-semibold transition-colors ${
                isActive('/about') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-700 hover:text-orange-600' : 'text-stone-300 hover:text-orange-400'
              }`}
            >
              About Us
            </Link>

            <Link 
              to="/contact" 
              className={`text-sm font-semibold transition-colors ${
                isActive('/contact') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-700 hover:text-orange-600' : 'text-stone-300 hover:text-orange-400'
              }`}
            >
              Book Table
            </Link>

            {isAuthenticated && (
              <Link 
                to="/my-orders" 
                className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive('/my-orders') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-700 hover:text-orange-600' : 'text-stone-300 hover:text-orange-400'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                My Orders
              </Link>
            )}

            {isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-950/80 text-orange-400 border border-orange-800/80 rounded-full hover:bg-orange-900 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
                isBeige
                  ? 'bg-amber-100 text-stone-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-orange-950/70 text-orange-200 border-orange-800/70 hover:bg-orange-900/80 hover:border-orange-500'
              }`}
              title="Switch between Spiced Reddish-Orange and Warm Beige theme"
            >
              {isBeige ? (
                <>
                  <span className="text-sm">🌾</span>
                  <span>Warm Beige</span>
                </>
              ) : (
                <>
                  <span className="text-sm">🍛</span>
                  <span>Reddish-Orange</span>
                </>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={handleCartClick}
              className={`relative p-2.5 rounded-xl border transition-colors group flex items-center gap-2 ${
                isBeige
                  ? 'bg-white border-amber-200 text-stone-800 hover:border-orange-500'
                  : 'bg-orange-950/50 border-orange-900/60 text-orange-300 hover:bg-orange-900/40 hover:border-orange-500/50'
              }`}
              aria-label="View Shopping Cart"
              title={!isAuthenticated ? 'Sign in to view your cart' : 'View cart'}
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-orange-500" />
              <span className="font-semibold text-sm">Cart</span>
              {isAuthenticated && totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[11px] font-bold h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className={`flex items-center gap-3 pl-2 border-l ${isBeige ? 'border-amber-200' : 'border-orange-900/60'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-500 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <p className={`text-xs font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>{user?.name}</p>
                    <p className={`text-[10px] font-medium capitalize ${isBeige ? 'text-stone-500' : 'text-orange-300/80'}`}>{user?.role}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    isBeige ? 'text-stone-700 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button & quick toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-lg border text-sm ${
                isBeige ? 'bg-amber-100 border-amber-300 text-stone-900' : 'bg-orange-950/80 border-orange-800 text-orange-200'
              }`}
              title="Toggle theme"
            >
              {isBeige ? '🌾' : '🍛'}
            </button>

            <button
              type="button"
              onClick={handleCartClick}
              className={`relative p-2 rounded-lg border ${
                isBeige ? 'bg-white border-amber-200 text-stone-900' : 'bg-orange-950/80 border-orange-800 text-orange-400'
              }`}
              title={!isAuthenticated ? 'Sign in to view your cart' : 'View cart'}
            >
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              {isAuthenticated && totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${isBeige ? 'text-stone-800 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 pt-3 pb-6 space-y-3 ${
          isBeige ? 'bg-[#fbf5eb] border-amber-200 text-stone-900' : 'bg-[#1c0906] border-orange-900/60 text-white'
        }`}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-800 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'
            }`}
          >
            Home
          </Link>

          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/menu') && !location.search ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-800 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'
            }`}
          >
            Our Menu
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/about') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-800 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'
            }`}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/contact') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-800 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'
            }`}
          >
            Book Table
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive('/my-orders') ? 'text-orange-500 font-bold' : isBeige ? 'text-stone-800 hover:text-orange-600' : 'text-stone-200 hover:text-orange-400'
              }`}
            >
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-orange-400 bg-orange-950/70 border border-orange-800/60"
            >
              Admin Dashboard
            </Link>
          )}

          <div className={`pt-4 border-t flex flex-col gap-2 ${isBeige ? 'border-amber-200' : 'border-orange-900/60'}`}>
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-3">
                <div>
                  <p className={`text-sm font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>{user?.name}</p>
                  <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-300/70'}`}>{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 rounded-xl border font-semibold ${
                    isBeige 
                      ? 'border-amber-300 text-stone-800 hover:bg-amber-100' 
                      : 'border-orange-900/70 text-orange-200 hover:bg-orange-950'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-orange-600 font-semibold text-white shadow-md hover:bg-orange-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
