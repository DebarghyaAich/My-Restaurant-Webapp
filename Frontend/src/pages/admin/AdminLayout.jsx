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
  Sparkles,
  Calendar
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
    { label: 'Table Reservations', path: '/admin/reservations', icon: Calendar },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Menu Items', path: '/admin/menu', icon: Utensils },
    { label: 'Add Menu Item', path: '/admin/menu/new', icon: PlusCircle },
    { label: 'Registered Users', path: '/admin/users', icon: Users }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row relative">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            Dabba <span className="text-[10px] font-semibold text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">Admin</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Minimalist Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-transform md:translate-x-0 md:static shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Dabba</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Suite</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Operations & Menu</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Footer & User Profile */}
        <div className="pt-5 border-t border-slate-200 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Store className="w-4 h-4 text-slate-500" />
            View Customer Storefront
          </Link>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="truncate mr-2">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors shrink-0"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-w-full">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
