import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Eye, Plus, Check, Lock, Sparkles, ChefHat } from 'lucide-react';

const MenuItemCard = ({ item }) => {
  const { addToCart, cartItems, showNotification } = useCart();
  const { isAuthenticated } = useAuth();
  const { isBeige } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const itemId = item._id || item.id;
  const isInCart = cartItems.some((i) => (i._id || i.id) === itemId);

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showNotification('Please log in to add items to your cart!', 'info');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    addToCart(item, 1);
  };

  return (
    <div className={`group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col food-card-hover backdrop-blur-md border ${
      isBeige 
        ? 'bg-white/95 border-amber-200/80 hover:border-orange-500/60 text-stone-900 shadow-amber-900/5' 
        : 'bg-[#280e08]/90 border-orange-950/80 hover:border-orange-500/60 text-white shadow-black/40'
    }`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category & Cuisine Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-stone-950/85 text-orange-400 border border-orange-900/40 shadow-md backdrop-blur-sm">
            {item.category}
          </span>
          {item.cuisine && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-600/90 text-white shadow-sm backdrop-blur-sm">
              {item.cuisine}
            </span>
          )}
        </div>

        {/* Availability Badge & Special Badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span
            className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full shadow-md ${
              item.availability !== false
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {item.availability !== false ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Bottom Bar Badges over Image */}
        {(item.isBestseller || item.isChefsChoice) && (
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 flex-wrap pointer-events-none">
            {item.isBestseller && (
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex items-center gap-1 border border-amber-300/40 animate-pulse">
                <Sparkles className="w-3 h-3 text-yellow-100" />
                Bestseller
              </span>
            )}
            {item.isChefsChoice && (
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-lg flex items-center gap-1 border border-rose-300/40">
                <ChefHat className="w-3 h-3 text-pink-100" />
                Chef's Choice
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={`font-bold text-lg line-clamp-1 transition-colors ${
              isBeige ? 'text-stone-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-400'
            }`}>
              {item.name}
            </h3>
            <span className={`text-lg font-black shrink-0 ${isBeige ? 'text-orange-600' : 'text-orange-400'}`}>
              ₹{Number(item.price)}
            </span>
          </div>

          <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
            {item.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`pt-3 border-t flex items-center gap-2 ${isBeige ? 'border-amber-200/80' : 'border-orange-950/80'}`}>
          <Link
            to={`/menu/${itemId}`}
            className={`flex-1 py-2.5 px-3 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
              isBeige 
                ? 'border-amber-200 text-stone-700 hover:bg-amber-50 hover:text-orange-600' 
                : 'border-orange-900/60 text-orange-200/80 hover:bg-orange-950/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 opacity-70" />
            View
          </Link>

          <button
            type="button"
            disabled={item.availability === false}
            onClick={handleCartClick}
            title={!isAuthenticated ? 'Sign in to add to cart' : 'Add to cart'}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
              item.availability === false
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : isInCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : !isAuthenticated
                ? 'bg-slate-900 hover:bg-orange-600 text-white shadow-slate-900/20'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/25'
            }`}
          >
            {item.availability === false ? (
              'Sold Out'
            ) : isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : !isAuthenticated ? (
              <>
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                Add to Cart
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
