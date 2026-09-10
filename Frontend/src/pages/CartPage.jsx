import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

const CartPage = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    tax, 
    deliveryFee, 
    grandTotal 
  } = useCart();
  const { isBeige } = useTheme();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'TASTY10') {
      const discountAmount = Number((subtotal * 0.1).toFixed(2));
      setDiscount(discountAmount);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid promo code. Try "TASTY10" for 10% off!');
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const finalTotal = Number(Math.max(0, grandTotal - discount).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Looks like you haven't added any appetizing dishes to your order yet. Check out our chef-curated menu!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Full Menu
        </Link>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300 ${
      isBeige ? 'text-stone-900' : 'text-stone-100'
    }`}>
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isBeige ? 'text-stone-900' : 'text-white'}`}>
            Review Your Order
          </h1>
          <p className={`text-xs mt-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
            {cartItems.length} dish{cartItems.length === 1 ? '' : 'es'} in your cart
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border shadow-sm transition-colors ${
              isBeige 
                ? 'bg-white border-amber-200 text-stone-700 hover:text-orange-600' 
                : 'bg-[#280e08] border-orange-900/70 text-orange-200 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Add More Dishes
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`rounded-3xl border shadow-xl overflow-hidden backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/90 border-orange-950/80 text-white'
          }`}>
            
            <div className={`divide-y ${isBeige ? 'divide-amber-100' : 'divide-orange-950/70'}`}>
              {cartItems.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <div key={itemId} className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
                    
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      className="w-24 h-24 rounded-2xl object-cover bg-stone-950 shrink-0"
                    />

                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <Link to={`/menu/${itemId}`} className={`font-bold text-base transition-colors ${
                          isBeige ? 'text-stone-900 hover:text-orange-600' : 'text-white hover:text-orange-400'
                        }`}>
                          {item.name}
                        </Link>
                        <span className={`text-base font-black ${isBeige ? 'text-stone-900' : 'text-orange-400'}`}>
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>

                      <p className={`text-xs font-semibold mt-0.5 ${isBeige ? 'text-orange-600' : 'text-orange-400'}`}>
                        ₹{Number(item.price)} each
                      </p>

                      <div className="flex items-center justify-between sm:justify-start gap-6 mt-4">
                        {/* Quantity Adjuster */}
                        <div className={`flex items-center border rounded-xl overflow-hidden ${
                          isBeige ? 'border-amber-300 bg-amber-50' : 'border-orange-950 bg-[#160604]'
                        }`}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className={`p-2 transition-colors ${
                              isBeige ? 'text-stone-600 hover:bg-amber-100' : 'text-orange-300 hover:bg-orange-950 hover:text-white'
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={`px-4 text-xs font-extrabold ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className={`p-2 transition-colors ${
                              isBeige ? 'text-stone-600 hover:bg-amber-100' : 'text-orange-300 hover:bg-orange-950 hover:text-white'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
                          className="text-xs font-semibold text-stone-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Delivery Note */}
          <div className={`rounded-2xl p-4 flex items-center gap-3 border ${
            isBeige ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
          }`}>
            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-xs font-medium">
              Free Express Delivery applies automatically on orders over ₹499!
            </p>
          </div>

        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className={`rounded-3xl border shadow-xl p-6 space-y-6 backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/90 border-orange-950/80 text-white'
          }`}>
            <h2 className={`text-lg font-black pb-3 border-b ${isBeige ? 'border-amber-100 text-stone-900' : 'border-orange-950 text-white'}`}>
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs">
              <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                <span>Subtotal</span>
                <span className={`font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                <span>Estimated GST (5%)</span>
                <span className={`font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>₹{tax.toFixed(2)}</span>
              </div>

              <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                <span>Delivery Charge</span>
                <span className={`font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-500 font-extrabold uppercase text-[10px]">Free</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Special Promo (10% Off)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className={`pt-3 border-t flex justify-between text-base font-black ${
                isBeige ? 'border-amber-200 text-stone-900' : 'border-orange-950 text-white'
              }`}>
                <span>Grand Total</span>
                <span className="text-orange-500 text-xl">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isBeige ? 'text-stone-500' : 'text-orange-300/70'
              }`}>
                Apply Promo Voucher
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isBeige ? 'text-stone-400' : 'text-orange-400'}`} />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Try code: TASTY10"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 border ${
                      isBeige 
                        ? 'bg-amber-50 border-amber-200 text-stone-900' 
                        : 'bg-[#180705] border-orange-950 text-white placeholder-orange-300/40'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                >
                  Apply
                </button>
              </div>

              {couponApplied && (
                <p className="text-[11px] text-emerald-500 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  10% Discount Applied!
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-500 font-bold mt-1.5">
                  {couponError}
                </p>
              )}
            </form>

            {/* Proceed to Checkout Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout', { state: { discount } })}
              className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              Proceed to Billing & Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Safety Guarantee */}
            <div className={`pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold ${
              isBeige ? 'text-stone-500' : 'text-orange-200/60'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Encrypted 256-Bit Checkout</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;
