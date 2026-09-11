/**
 * ============================================================================
 * 🍱 DABBA RESTAURANT WEB APP - ROOT CLIENT ROUTER & LAYOUT
 * ============================================================================
 * @description
 * Primary client-side application container for Dabba Restaurant.
 * Configures:
 *  - Theme-adaptive root shell with dynamic CSS variable injection.
 *  - Ambient floating background animation with culinary particles.
 *  - Global Cart Drawer and real-time Toast notification providers.
 *  - Customer-facing public storefront and dining reservation workflows.
 *  - Member portal (Order history, table booking ticket vouchers).
 *  - Role-based protected routes for VIP customers and Admin Dashboard suite.
 * ============================================================================
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import { ProtectedAdminRoute, ProtectedUserRoute } from './components/ProtectedRoute';

// Public & Customer Pages
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import MenuItemDetails from './pages/MenuItemDetails';
import CartPage from './pages/CartPage';
import BillingPage from './pages/BillingPage';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';

// Admin Suite Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import MenuList from './pages/admin/MenuList';
import AddMenuItem from './pages/admin/AddMenuItem';
import EditMenuItem from './pages/admin/EditMenuItem';
import UserList from './pages/admin/UserList';
import OrderList from './pages/admin/OrderList';
import ReservationList from './pages/admin/ReservationList';
import FloatingBackground from './components/FloatingBackground';
import { useTheme } from './context/ThemeContext';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const { isBeige } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen theme-app-bg font-sans relative selection:bg-orange-500 selection:text-white transition-colors duration-300 ${
      isBeige ? 'text-[#2b160f]' : 'text-[#fff7ed]'
    }`}>
      {/* Ambient Floating Culinary Particles & Glow */}
      <FloatingBackground />
      
      {/* Global Notifications & Cart Drawer */}
      <Toast />
      <CartDrawer />

      {/* Show Public Navbar & Footer only outside Admin Control Center */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1 relative z-10">
        <Routes>
          {/* Public Pages: Browse menu and contact */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<MenuItemDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* User Protected Routes: Login required for Cart, Billing & Orders */}
          <Route
            path="/cart"
            element={
              <ProtectedUserRoute>
                <CartPage />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedUserRoute>
                <BillingPage />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedUserRoute>
                <OrderSuccess />
              </ProtectedUserRoute>
            }
          />
          
          {/* User Protected Routes */}
          <Route
            path="/my-orders"
            element={
              <ProtectedUserRoute>
                <MyOrders />
              </ProtectedUserRoute>
            }
          />

          {/* Authentication Pages */}
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Suite */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuList />} />
            <Route path="menu/new" element={<AddMenuItem />} />
            <Route path="menu/edit/:id" element={<EditMenuItem />} />
            <Route path="users" element={<UserList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="reservations" element={<ReservationList />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

    </div>
  );
}

export default App;
