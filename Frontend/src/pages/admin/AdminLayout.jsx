/**
 * ============================================================================
 * 🛡️ DABBA RESTAURANT - ADMINISTRATIVE CONTROL SUITE LAYOUT
 * ============================================================================
 * @component AdminLayout
 * @description
 * High-security administrative portal layout featuring:
 *  - Regal Deep Violet & Crimson-Reddish ambient aesthetic.
 *  - Floating administrative particles and gradient blur overlays.
 *  - Responsive mobile drawer & desktop sidebar navigation.
 *  - Live operator session information with one-click logout.
 *  - Quick store switch link to preview live customer experience.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminFloatingBackground from '../../components/admin/AdminFloatingBackground';
import { 
  LayoutDashboard, 
  Utensils, 
  PlusCircle, 
  Users, 
  ShoppingBag, 
  LogOut, 
  Store, 
  Menu as MenuIcon, 
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Menu Items', path: '/admin/menu', icon: Utensils },
    { label: 'Add Menu Item', path: '/admin/menu/new', icon: PlusCircle },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Registered Users', path: '/admin/users', icon: Users }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen admin-theme-root text-purple-100 flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* Floating Animated Ambient Background */}
      <AdminFloatingBackground />

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0e0317]/95 border-b border-rose-950/60 px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
            Dabba <span className="text-xs text-rose-300 font-semibold px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60">Admin</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-rose-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 admin-sidebar p-6 flex flex-col justify-between transition-transform md:translate-x-0 md:static shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          
          {/* Admin Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/40 border border-rose-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-white tracking-tight">Dabba</h2>
                <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Crimson-Amethyst Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-rose-600/35 border border-rose-400/30'
                      : 'text-purple-200/70 hover:text-white hover:bg-rose-950/30 hover:border-rose-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-rose-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Footer & User Profile */}
        <div className="pt-6 border-t border-purple-900/40 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-purple-200/80 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-all"
          >
            <Store className="w-4 h-4 text-rose-400" />
            View Customer Storefront
          </Link>

          <div className="flex items-center justify-between px-2 pt-2 bg-[#190624]/60 border border-rose-950/50 rounded-2xl p-2.5">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-rose-400/80 font-mono truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-xl transition-colors shrink-0"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-full relative z-10">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
