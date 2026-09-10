import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    freeDeliveryThreshold = 499,
    deliveryFee, 
    tax, 
    grandTotal 
  } = useCart();
  const { isBeige } = useTheme();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md shadow-2xl flex flex-col border-l transition-colors duration-300 ${
          isBeige 
            ? 'bg-[#fbf5eb] border-amber-200 text-stone-900' 
            : 'bg-[#1c0906] border-orange-950/90 text-white'
        }`}>
          
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${
            isBeige ? 'bg-amber-50/80 border-amber-200 text-stone-900' : 'bg-[#250d09]/80 border-orange-950/80 text-white'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-lg font-extrabold ${isBeige ? 'text-stone-900' : 'text-white'}`}>Your Delicious Order</h2>
                <p className={`text-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>{cartItems.length} unique item{cartItems.length === 1 ? '' : 's'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className={`p-2 rounded-xl transition-colors ${
                isBeige ? 'text-stone-500 hover:text-stone-900 hover:bg-amber-100' : 'text-orange-300/70 hover:text-white hover:bg-orange-950'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery bar */}
          <div className={`px-6 py-3 border-b ${
            isBeige ? 'bg-amber-100/60 border-amber-200' : 'bg-orange-950/40 border-orange-900/40'
          }`}>
            {remainingForFreeDelivery === 0 ? (
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Unlocked Free Express Delivery!
              </p>
            ) : (
              <div>
                <p className={`text-xs ${isBeige ? 'text-stone-700' : 'text-orange-200/80'}`}>
                  Add <span className="font-bold text-orange-500">₹{remainingForFreeDelivery.toFixed(0)}</span> more for <strong>FREE delivery</strong>
                </p>
                <div className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${isBeige ? 'bg-amber-200' : 'bg-orange-950'}`}>
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeDelivery}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-orange-600/15 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className={`text-base font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>Your cart is empty</h3>
                <p className={`text-xs max-w-xs ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
                  Discover our chef's hand-crafted specials and add your favorites to get started!
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item._id || item.id}
                  className={`flex gap-4 p-3 rounded-2xl border transition-colors shadow-sm ${
                    isBeige 
                      ? 'bg-white border-amber-200 hover:border-orange-400' 
                      : 'bg-[#280e08]/90 border-orange-950/80 hover:border-orange-500/40'
                  }`}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-900"
                  />
                  
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-bold truncate ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md inline-block mt-0.5 border ${
                        isBeige 
                          ? 'text-orange-700 bg-orange-100 border-orange-200' 
                          : 'text-orange-400 bg-orange-950/80 border-orange-900/60'
                      }`}>
                        ₹{Number(item.price)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className={`flex items-center border rounded-lg overflow-hidden ${
                        isBeige ? 'border-amber-300 bg-amber-50' : 'border-orange-950 bg-[#160604]'
                      }`}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                          className={`p-1.5 transition-colors ${
                            isBeige ? 'text-stone-600 hover:bg-amber-100' : 'text-orange-300 hover:bg-orange-950 hover:text-white'
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`px-3 text-xs font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                          className={`p-1.5 transition-colors ${
                            isBeige ? 'text-stone-600 hover:bg-amber-100' : 'text-orange-300 hover:bg-orange-950 hover:text-white'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className={`text-sm font-bold ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cartItems.length > 0 && (
            <div className={`p-6 border-t space-y-4 ${
              isBeige ? 'bg-amber-50/90 border-amber-200' : 'bg-[#250d09]/90 border-orange-950/80'
            }`}>
              <div className="space-y-2 text-xs">
                <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                  <span>Subtotal</span>
                  <span className={`font-semibold ${isBeige ? 'text-stone-900' : 'text-white'}`}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                  <span>Estimated GST (5%)</span>
                  <span className={`font-semibold ${isBeige ? 'text-stone-900' : 'text-white'}`}>₹{tax.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
                  <span>Delivery Fee</span>
                  <span className={`font-semibold ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-500 font-bold uppercase text-[10px]">Free</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className={`pt-2 border-t flex justify-between text-base font-extrabold ${
                  isBeige ? 'border-amber-200 text-stone-900' : 'border-orange-950 text-white'
                }`}>
                  <span>Total</span>
                  <span className="text-orange-500">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleViewCart}
                  className={`w-full py-3 px-4 rounded-xl border font-bold text-xs transition-colors ${
                    isBeige 
                      ? 'border-amber-300 text-stone-800 hover:bg-amber-100' 
                      : 'border-orange-900/60 text-orange-200 hover:bg-orange-950 hover:text-white'
                  }`}
                >
                  View Full Cart
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
