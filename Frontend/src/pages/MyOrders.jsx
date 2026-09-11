import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ClipboardList, 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Receipt, 
  ShoppingBag,
  Package,
  Calendar,
  Users,
  Compass,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const MyOrders = () => {
  const { user } = useAuth();
  const { isBeige } = useTheme();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'reservations'
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, resvRes] = await Promise.allSettled([
          api.get('/orders'),
          api.get('/reservations')
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
          setOrders(ordersRes.value.data.orders || []);
        }

        if (resvRes.status === 'fulfilled' && resvRes.value.data.success) {
          setReservations(resvRes.value.data.reservations || []);
        }
      } catch (err) {
        console.error('Failed to load portal data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300 ${
      isBeige ? 'text-stone-900' : 'text-orange-50'
    }`}>
      
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
          isBeige ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-orange-950 text-orange-400 border-orange-850'
        }`}>
          Customer Dining Portal
        </span>
        <h1 className={`text-3xl font-black tracking-tight mt-2 ${
          isBeige ? 'text-stone-900' : 'text-white'
        }`}>
          My Orders & Table Reservations
        </h1>
        <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
          Track live delivery tickets and review upcoming table reservations for {user?.email}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                : isBeige
                ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                : 'bg-[#180705] text-orange-200/70 hover:text-white hover:bg-orange-950/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Culinary Delivery Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                : isBeige
                ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                : 'bg-[#180705] text-orange-200/70 hover:text-white hover:bg-orange-950/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Table Reservations ({reservations.length})
          </button>
        </div>
      </div>

      {/* Tab Content: DELIVERY ORDERS */}
      {activeTab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <div className={`rounded-3xl border p-12 text-center space-y-4 max-w-md mx-auto backdrop-blur-md ${
              isBeige ? 'bg-white border-stone-200' : 'bg-[#180705]/80 border-orange-950'
            }`}>
              <div className="w-16 h-16 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className={`text-xl font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>No Orders Placed Yet</h2>
              <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
                You haven't placed any delivery orders yet. Browse our artisanal menu to treat yourself today!
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Explore Menu Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const currentStep = getStepIndex(order.status);
                return (
                  <div 
                    key={order._id || order.id} 
                    className={`rounded-3xl border shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 transition-all hover:shadow-md backdrop-blur-md ${
                      isBeige ? 'bg-white border-stone-200' : 'bg-[#180705]/90 border-orange-950'
                    }`}
                  >
                    
                    {/* Order Top Bar */}
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b ${
                      isBeige ? 'border-stone-100' : 'border-orange-950'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-orange-500">{order.orderNumber}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 ${isBeige ? 'text-stone-400' : 'text-orange-200/50'}`}>
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`text-base font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                          ₹{order.totalAmount?.toFixed(2)}
                        </span>
                        <Link
                          to={`/order-success/${order._id || order.id}`}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                            isBeige ? 'border-stone-200 text-stone-700 hover:bg-stone-50' : 'border-orange-900/60 text-orange-200 hover:bg-orange-950/60'
                          }`}
                        >
                          <Receipt className="w-3.5 h-3.5 text-orange-500" />
                          Invoice
                        </Link>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {STATUS_STEPS.map((step, idx) => {
                          const isComplete = idx <= currentStep;
                          return (
                            <div key={step} className="flex flex-col items-center text-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                                  isComplete
                                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/30'
                                    : (isBeige ? 'bg-stone-100 text-stone-400' : 'bg-[#120504] text-orange-200/30 border border-orange-950')
                                }`}
                              >
                                {idx === 0 && <Clock className="w-3.5 h-3.5" />}
                                {idx === 1 && <ChefHat className="w-3.5 h-3.5" />}
                                {idx === 2 && <Truck className="w-3.5 h-3.5" />}
                                {idx === 3 && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <span
                                className={`text-[10px] font-bold ${
                                  isComplete 
                                    ? (isBeige ? 'text-stone-900' : 'text-white') 
                                    : (isBeige ? 'text-stone-400' : 'text-orange-200/40')
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items in order */}
                    <div className={`rounded-2xl p-4 divide-y text-xs ${
                      isBeige ? 'bg-stone-50 divide-stone-100' : 'bg-[#120504] divide-orange-950 text-orange-200'
                    }`}>
                      {order.items?.map((item, i) => (
                        <div key={i} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-500">{item.quantity}×</span>
                            <span className={`font-semibold ${isBeige ? 'text-stone-800' : 'text-white'}`}>{item.name}</span>
                          </div>
                          <span className={`font-bold ${isBeige ? 'text-stone-700' : 'text-orange-300'}`}>₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab Content: TABLE RESERVATIONS */}
      {activeTab === 'reservations' && (
        <>
          {reservations.length === 0 ? (
            <div className={`rounded-3xl border p-12 text-center space-y-4 max-w-md mx-auto backdrop-blur-md ${
              isBeige ? 'bg-white border-stone-200' : 'bg-[#180705]/80 border-orange-950'
            }`}>
              <div className="w-16 h-16 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h2 className={`text-xl font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>No Reserved Tables</h2>
              <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
                You don't have any upcoming restaurant table bookings. Reserve your VIP table with customized ambience now!
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Book a Table Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((resv) => (
                <div
                  key={resv._id || resv.id || resv.referenceCode}
                  className={`rounded-3xl border shadow-sm p-6 sm:p-8 space-y-4 transition-all hover:shadow-md backdrop-blur-md ${
                    isBeige ? 'bg-white border-stone-200' : 'bg-[#180705]/90 border-orange-950'
                  }`}
                >
                  <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b ${
                    isBeige ? 'border-stone-100' : 'border-orange-950'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-orange-500">{resv.referenceCode}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {resv.status || 'Confirmed'}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isBeige ? 'text-stone-400' : 'text-orange-200/50'}`}>
                          Booked by {resv.customerName} • Contact: {resv.phone}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/contact"
                      className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
                    >
                      Reserve Another <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border ${isBeige ? 'bg-stone-50 border-stone-100' : 'bg-[#120504] border-orange-950'}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/50'}`}>
                        <Calendar className="w-3 h-3 text-orange-500" /> Date
                      </span>
                      <strong className={isBeige ? 'text-stone-900' : 'text-white'}>
                        {formatDisplayDate(resv.date)}
                      </strong>
                    </div>

                    <div className={`p-3 rounded-xl border ${isBeige ? 'bg-stone-50 border-stone-100' : 'bg-[#120504] border-orange-950'}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/50'}`}>
                        <Clock className="w-3 h-3 text-orange-500" /> Time Slot
                      </span>
                      <strong className={isBeige ? 'text-stone-900' : 'text-white'}>
                        {resv.time}
                      </strong>
                    </div>

                    <div className={`p-3 rounded-xl border ${isBeige ? 'bg-stone-50 border-stone-100' : 'bg-[#120504] border-orange-950'}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/50'}`}>
                        <Users className="w-3 h-3 text-orange-500" /> Table Size
                      </span>
                      <strong className={isBeige ? 'text-stone-900' : 'text-white'}>
                        {resv.guests}
                      </strong>
                    </div>

                    <div className={`p-3 rounded-xl border ${isBeige ? 'bg-stone-50 border-stone-100' : 'bg-[#120504] border-orange-950'}`}>
                      <span className={`block text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/50'}`}>
                        <Compass className="w-3 h-3 text-orange-500" /> Ambience
                      </span>
                      <strong className={isBeige ? 'text-stone-900' : 'text-white'}>
                        {resv.seatingArea || 'Main Dining'}
                      </strong>
                    </div>
                  </div>

                  {resv.message && (
                    <div className={`p-3 rounded-xl text-xs border ${
                      isBeige ? 'bg-stone-50 border-stone-100 text-stone-600' : 'bg-[#120504] border-orange-950 text-orange-200/70'
                    }`}>
                      <span className="font-bold text-orange-500">Dietary & Special Notes: </span>
                      {resv.message}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default MyOrders;
