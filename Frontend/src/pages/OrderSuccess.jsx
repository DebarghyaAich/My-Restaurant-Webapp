import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  MapPin, 
  Clock, 
  CreditCard, 
  Receipt,
  UtensilsCrossed
} from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Failed to load order receipt:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          We could not locate this order invoice.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl">
          Return to Menu
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Confirmation Banner */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Order Confirmed & Sent to Kitchen
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Our master chefs have received your ticket and are preparing your meal to perfection.
        </p>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden p-6 sm:p-10 space-y-8 print:border-none print:shadow-none">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Dabba Kitchen</h2>
              <p className="text-xs text-slate-400">Order Invoice & Delivery Receipt</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Reference</p>
            <p className="text-lg font-black text-orange-600 font-mono">{order.orderNumber}</p>
            <p className="text-[11px] text-slate-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status & Delivery Estimation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Clock className="w-4 h-4 text-orange-500" />
              Estimated Delivery
            </div>
            <p className="text-sm font-black text-slate-900">{order.estimatedDelivery || '30-45 mins'}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Receipt className="w-4 h-4 text-emerald-500" />
              Kitchen Status
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {order.status || 'Pending'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Payment Method
            </div>
            <p className="text-xs font-bold text-slate-900">
              {order.paymentMethod} • <span className="text-emerald-600">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Customer & Delivery Address */}
        <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-800 mb-1">
            <MapPin className="w-4 h-4 text-orange-600" />
            Delivery Destination
          </div>
          <p className="text-xs font-extrabold text-slate-900">{order.customerDetails?.fullName}</p>
          <p className="text-xs text-slate-600">{order.customerDetails?.address}, {order.customerDetails?.city} {order.customerDetails?.postalCode}</p>
          <p className="text-xs text-slate-500">Contact: {order.customerDetails?.phone} | {order.customerDetails?.email}</p>
          {order.customerDetails?.notes && (
            <p className="text-xs text-orange-900 italic pt-1">Notes: "{order.customerDetails.notes}"</p>
          )}
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Dish / Item</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Unit Price</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="py-3">
                  <td className="py-3 font-semibold text-slate-900 flex items-center gap-2.5">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                    )}
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-700">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-500">₹{Number(item.price)}</td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Breakdown Totals */}
        <div className="pt-4 border-t border-slate-200 space-y-2 text-xs max-w-xs ml-auto">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">₹{order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Restaurant GST (5%)</span>
            <span className="font-bold text-slate-900">₹{order.tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Delivery Fee</span>
            <span className="font-bold text-slate-900">
              {order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee?.toFixed(2)}`}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
            <span>Total Paid</span>
            <span className="text-orange-600 text-lg">₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons (Hidden when printing) */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt / Invoice
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/my-orders"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Track in My Orders
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              Order More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;
