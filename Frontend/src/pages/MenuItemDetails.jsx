import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Clock, 
  Sparkles, 
  ShieldAlert,
  Share2,
  Lock
} from 'lucide-react';

const MenuItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, showNotification } = useCart();
  const { isAuthenticated } = useAuth();
  const { isBeige } = useTheme();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/menu-items/${id}`);
        if (res.data.success) {
          setItem(res.data.item);
        }
      } catch (err) {
        console.error('Failed to load menu item details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showNotification('Please log in to add items to your cart!', 'info');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!item) return;
    addToCart(item, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      showNotification('Please log in to place an order!', 'info');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!item) return;
    addToCart(item, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500" />
        <h2 className={`text-2xl font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>Dish Not Found</h2>
        <p className={`text-sm max-w-sm ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>
          The requested menu item does not exist or may have been retired by our culinary team.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs font-bold transition-colors ${
            isBeige ? 'text-stone-500 hover:text-amber-800' : 'text-orange-200/70 hover:text-orange-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Menu Items
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border shadow-sm transition-all ${
            isBeige
              ? 'bg-white/80 border-amber-200 text-stone-700 hover:text-stone-900'
              : 'bg-[#180705] border-orange-950 text-orange-200 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          {copied ? 'Link Copied!' : 'Share Dish'}
        </button>
      </div>

      {/* Main Product Card */}
      <div className={`rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 backdrop-blur-md ${
        isBeige
          ? 'bg-white/95 border-amber-200 shadow-amber-900/10'
          : 'bg-[#180705]/95 border-orange-950/80 shadow-black/60'
      }`}>
        
        {/* Item Image */}
        <div className="lg:col-span-6 relative aspect-square lg:aspect-auto overflow-hidden">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md border ${
              isBeige
                ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                : 'bg-black/80 text-orange-400 border-orange-900/60'
            }`}>
              {item.category}
            </span>
            {item.cuisine && (
              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-orange-600 text-white shadow-md">
                {item.cuisine}
              </span>
            )}
            {item.isBestseller && (
              <span className="px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex items-center gap-1 border border-amber-300/50">
                <Sparkles className="w-3.5 h-3.5" />
                Bestseller
              </span>
            )}
            {item.isChefsChoice && (
              <span className="px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-lg flex items-center gap-1 border border-rose-300/50">
                Chef's Choice
              </span>
            )}
          </div>
        </div>

        {/* Details & Controls */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between space-y-8">
          
          <div className="space-y-4">
            
            {/* Status & Category */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  item.availability !== false
                    ? isBeige
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                      : 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-400'
                    : isBeige
                      ? 'bg-rose-100 border border-rose-300 text-rose-800'
                      : 'bg-rose-950/70 border border-rose-800/60 text-rose-400'
                }`}
              >
                {item.availability !== false ? '● In Stock & Ready' : '● Currently Out of Stock'}
              </span>

              <span className={`text-xs font-medium flex items-center gap-1 ${
                isBeige ? 'text-stone-500' : 'text-orange-200/60'
              }`}>
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Freshly prepared in 20-30 mins
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
              isBeige ? 'text-stone-900' : 'text-white'
            }`}>
              {item.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-orange-500">
                ₹{Number(item.price)}
              </span>
              <span className={`text-xs font-semibold ${isBeige ? 'text-stone-500' : 'text-orange-200/60'}`}>
                Taxes calculated at checkout
              </span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                isBeige ? 'text-stone-500' : 'text-orange-200/60'
              }`}>
                Description
              </h3>
              <p className={`text-sm leading-relaxed ${isBeige ? 'text-stone-700' : 'text-orange-100/80'}`}>
                {item.description}
              </p>
            </div>

            {/* Chef's Highlight Box */}
            <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
              isBeige
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-orange-950/40 border-orange-900/60 text-orange-200/90'
            }`}>
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">
                Made to order with authentic culinary recipes. Dietary substitutions available upon request in order notes.
              </p>
            </div>

          </div>

          {/* Action Section */}
          <div className={`space-y-4 pt-6 border-t ${
            isBeige ? 'border-amber-200' : 'border-orange-950/80'
          }`}>
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isBeige ? 'text-stone-500' : 'text-orange-200/60'
              }`}>
                Select Quantity
              </span>
              <div className={`flex items-center rounded-2xl overflow-hidden border shadow-inner ${
                isBeige ? 'border-amber-200 bg-amber-50/60' : 'border-orange-950 bg-[#120504]'
              }`}>
                <button
                  type="button"
                  disabled={quantity <= 1 || item.availability === false}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={`p-3 transition-colors disabled:opacity-40 ${
                    isBeige ? 'text-stone-600 hover:bg-amber-100' : 'text-orange-200/70 hover:bg-orange-900/40 hover:text-white'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`px-5 font-black text-sm ${isBeige ? 'text-stone-900' : 'text-white'}`}>
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={item.availability === false}
                  onClick={() => setQuantity((q) => q + 1)}
                  className={`p-3 transition-colors disabled:opacity-40 ${
                    isBeige ? 'text-stone-600 hover:bg-amber-100' : 'text-orange-200/70 hover:bg-orange-900/40 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Login prompt banner if unauthenticated */}
            {!isAuthenticated && (
              <div className={`rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs border ${
                isBeige
                  ? 'bg-amber-100/80 border-amber-300 text-amber-950'
                  : 'bg-orange-950/60 border-orange-900/60 text-orange-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    Sign in to add dishes to your cart and place orders.
                  </span>
                </div>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="font-bold text-orange-500 hover:underline shrink-0"
                >
                  Log In Now
                </Link>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={item.availability === false}
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                  item.availability === false
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-500/25 hover:scale-[1.02]'
                }`}
              >
                {!isAuthenticated ? <Lock className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                Add {quantity} to Cart
              </button>

              <button
                type="button"
                disabled={item.availability === false}
                onClick={handleBuyNow}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider border transition-all ${
                  item.availability === false
                    ? 'border-stone-300 text-stone-400 cursor-not-allowed'
                    : isBeige
                    ? 'border-stone-900 bg-stone-900 hover:bg-stone-800 text-white'
                    : 'border-orange-600 bg-orange-950/60 hover:bg-orange-900/60 text-white'
                }`}
              >
                Buy Now
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MenuItemDetails;
