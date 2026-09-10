import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Truck, 
  ReceiptText,
  AlertCircle
} from 'lucide-react';

const BillingPage = () => {
  const { cartItems, subtotal, tax, deliveryFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { isBeige } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const discount = location.state?.discount || 0;
  const finalTotal = Number(Math.max(0, grandTotal - discount).toFixed(2));

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardData, setCardData] = useState({
    cardNumber: '4532 8900 1234 5678',
    cardHolder: user?.name || 'Jane Doe',
    expiry: '12/28',
    cvv: '884'
  });
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update user prefill if user logs in or is loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email
      }));
      setCardData((prev) => ({
        ...prev,
        cardHolder: prev.cardHolder || user.name
      }));
    }
  }, [user]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      setErrorMessage('Please fill in all required billing and delivery fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        items: cartItems.map((item) => ({
          menuItem: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        subtotal,
        tax,
        deliveryFee,
        totalAmount: finalTotal,
        paymentMethod
      };

      const res = await api.post('/orders', payload);
      if (res.data.success && res.data.order) {
        clearCart();
        navigate(`/order-success/${res.data.order._id || res.data.order.id}`, {
          state: { order: res.data.order }
        });
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300 ${
      isBeige ? 'text-stone-900' : 'text-stone-100'
    }`}>
      
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/cart"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
            isBeige ? 'text-stone-500 hover:text-orange-600' : 'text-orange-300/70 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shopping Cart
        </Link>
        <h1 className={`text-3xl font-black tracking-tight mt-2 ${isBeige ? 'text-stone-900' : 'text-white'}`}>
          Billing & Delivery Details
        </h1>
        <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
          Provide your delivery destination and select your preferred payment method.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Billing Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Customer & Delivery Address */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/90 border-orange-950/80 text-white shadow-black/40'
          }`}>
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isBeige ? 'border-amber-100' : 'border-orange-950'}`}>
              <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className={`text-lg font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                Delivery Address & Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Street Address & Apartment/Suite *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat 4B, Emerald Heights, Linking Road"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Postal / PIN Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="400050"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`block text-xs font-bold mb-1.5 ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Chef & Delivery Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Extra napkins, ring doorbell twice, mild spice instructions..."
                  className={`w-full px-4 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none border ${
                    isBeige 
                      ? 'bg-amber-50/70 border-amber-200 text-stone-900 focus:bg-white' 
                      : 'bg-[#180705] border-orange-950 text-white focus:bg-[#200a06]'
                  }`}
                />
              </div>

            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/90 border-orange-950/80 text-white shadow-black/40'
          }`}>
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isBeige ? 'border-amber-100' : 'border-orange-950'}`}>
              <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h2 className={`text-lg font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                  Select Payment Method
                </h2>
                <p className={`text-[11px] ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>All transactions are encrypted and secured</p>
              </div>
            </div>

            {/* Payment Method Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  paymentMethod === 'Card'
                    ? 'border-orange-500 bg-orange-500/10 shadow-md ring-2 ring-orange-500/20'
                    : isBeige
                    ? 'border-amber-200 hover:border-amber-300 bg-amber-50/60'
                    : 'border-orange-950 hover:border-orange-800 bg-[#180705]'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'Card' ? 'text-orange-500' : isBeige ? 'text-stone-500' : 'text-orange-400/60'}`} />
                <div>
                  <p className={`text-xs font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>Credit / Debit Card</p>
                  <p className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>Visa, Mastercard, RuPay</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  paymentMethod === 'UPI'
                    ? 'border-orange-500 bg-orange-500/10 shadow-md ring-2 ring-orange-500/20'
                    : isBeige
                    ? 'border-amber-200 hover:border-amber-300 bg-amber-50/60'
                    : 'border-orange-950 hover:border-orange-800 bg-[#180705]'
                }`}
              >
                <Smartphone className={`w-5 h-5 ${paymentMethod === 'UPI' ? 'text-orange-500' : isBeige ? 'text-stone-500' : 'text-orange-400/60'}`} />
                <div>
                  <p className={`text-xs font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>UPI / QR Pay</p>
                  <p className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>GPay, PhonePe, Paytm</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-orange-500 bg-orange-500/10 shadow-md ring-2 ring-orange-500/20'
                    : isBeige
                    ? 'border-amber-200 hover:border-amber-300 bg-amber-50/60'
                    : 'border-orange-950 hover:border-orange-800 bg-[#180705]'
                }`}
              >
                <Banknote className={`w-5 h-5 ${paymentMethod === 'Cash on Delivery' ? 'text-orange-500' : isBeige ? 'text-stone-500' : 'text-orange-400/60'}`} />
                <div>
                  <p className={`text-xs font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>Cash on Delivery</p>
                  <p className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>Pay upon delivery</p>
                </div>
              </button>

            </div>

            {/* Dynamic Details based on chosen payment method */}
            {paymentMethod === 'Card' && (
              <div className={`space-y-4 pt-2 p-4 rounded-2xl border ${
                isBeige ? 'bg-amber-50/60 border-amber-200' : 'bg-[#180705] border-orange-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isBeige ? 'text-stone-700' : 'text-orange-200'}`}>Card Credentials</span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    256-Bit SSL Encrypted
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    placeholder="4532 •••• •••• ••••"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      isBeige
                        ? 'bg-white border border-amber-200 text-stone-900 focus:border-amber-500'
                        : 'bg-[#120504] border border-orange-900/60 text-white focus:border-orange-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        isBeige
                          ? 'bg-white border border-amber-200 text-stone-900 focus:border-amber-500'
                          : 'bg-[#120504] border border-orange-900/60 text-white focus:border-orange-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>CVV / CVC</label>
                    <input
                      type="password"
                      maxLength="4"
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        isBeige
                          ? 'bg-white border border-amber-200 text-stone-900 focus:border-amber-500'
                          : 'bg-[#120504] border border-orange-900/60 text-white focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className={`space-y-3 pt-2 p-4 rounded-2xl border ${
                isBeige ? 'bg-amber-50/60 border-amber-200' : 'bg-[#180705] border-orange-950'
              }`}>
                <label className={`block text-[11px] font-bold ${isBeige ? 'text-stone-700' : 'text-orange-200'}`}>Virtual Payment Address / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@okaxis"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    isBeige
                      ? 'bg-white border border-amber-200 text-stone-900 focus:border-amber-500'
                      : 'bg-[#120504] border border-orange-900/60 text-white focus:border-orange-500'
                  }`}
                />
                <p className={`text-[11px] ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
                  A payment request will be sent to your UPI app upon placing this order.
                </p>
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className={`pt-2 p-4 rounded-2xl border text-xs font-medium leading-relaxed ${
                isBeige
                  ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                  : 'bg-orange-950/40 border-orange-900/70 text-orange-200'
              }`}>
                💵 Please have exact cash ready (₹<strong>{finalTotal.toFixed(2)}</strong>) for our delivery executive to ensure a swift, contactless drop-off.
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Sticky Order Summary & Submission */}
        <div className="lg:col-span-5">
          <div className={`sticky top-28 rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 ${
            isBeige
              ? 'bg-white/95 border-amber-200/80 shadow-amber-900/5'
              : 'bg-[#180705]/95 border-orange-950/80 shadow-black/40'
          }`}>
            
            <div className={`flex items-center justify-between pb-4 border-b ${
              isBeige ? 'border-amber-200/60' : 'border-orange-950/60'
            }`}>
              <div className="flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-orange-500" />
                <h3 className={`text-base font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>Your Basket Summary</h3>
              </div>
              <span className={`text-xs font-bold ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>{cartItems.length} items</span>
            </div>

            {/* Item list */}
            <div className={`max-h-60 overflow-y-auto divide-y pr-1 space-y-2 ${
              isBeige ? 'divide-amber-100' : 'divide-orange-950/60'
            }`}>
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-orange-500/10 text-orange-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-orange-500/20">
                      {item.quantity}×
                    </span>
                    <span className={`font-semibold truncate ${isBeige ? 'text-stone-800' : 'text-orange-100'}`}>{item.name}</span>
                  </div>
                  <span className={`font-bold shrink-0 ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className={`pt-4 border-t space-y-2.5 text-xs ${
              isBeige ? 'border-amber-200/60' : 'border-orange-950/60'
            }`}>
              <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                <span>Subtotal</span>
                <span className={`font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                <span>Estimated GST (5%)</span>
                <span className={`font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>₹{tax.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                <span>Express Delivery</span>
                <span className={`font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                  {deliveryFee === 0 ? <span className="text-emerald-500 font-bold uppercase text-[10px]">Free</span> : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Applied Promo Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className={`pt-3 border-t flex justify-between text-base font-black ${
                isBeige ? 'border-amber-200 text-stone-900' : 'border-orange-950 text-white'
              }`}>
                <span>Amount to Pay</span>
                <span className="text-orange-500 text-2xl font-black">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Guarantee */}
            <div className={`flex items-center gap-2 text-xs p-3 rounded-xl border ${
              isBeige
                ? 'bg-amber-50/70 text-stone-600 border-amber-200/60'
                : 'bg-orange-950/40 text-orange-200/80 border-orange-900/40'
            }`}>
              <Truck className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Estimated Delivery: <strong>30–45 mins</strong></span>
            </div>

            {/* Complete Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Order...
                </>
              ) : (
                `Place Order • ₹${finalTotal.toFixed(2)}`
              )}
            </button>

            <div className={`text-center text-[10px] font-medium ${
              isBeige ? 'text-stone-400' : 'text-orange-200/40'
            }`}>
              By confirming, you agree to Dabba Terms of Dining & Service.
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};

export default BillingPage;
