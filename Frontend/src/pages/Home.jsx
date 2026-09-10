/**
 * ============================================================================
 * 🏠 DABBA RESTAURANT STOREFRONT - FLAGSHIP LANDING EXPERIENCE
 * ============================================================================
 * @component Home
 * @description
 * High-impact hero landing page showcasing the culinary identity of Dabba:
 *  - Autonomous Live Kitchen Ticker (cycles real-time culinary dispatch activities).
 *  - Animated Brand Typography: Left-to-right cascading letter entrance for 'Dabba'.
 *  - Masterpiece Story flowing gradient text shimmer.
 *  - Interactive Coupon voucher with one-click clipboard copy.
 *  - Multi-Cuisine Showcase filter (Indian, Japanese, Chinese, Continental, Desserts).
 *  - Curated Chef's Specials, Bestseller spotlights, and customer reviews.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';
import AnimatedBrandName from '../components/AnimatedBrandName';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Award, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Star, 
  ChefHat, 
  UtensilsCrossed,
  Quote,
  Copy,
  Check,
  Tag,
  ShoppingBag
} from 'lucide-react';

const liveKitchenActivities = [
  { id: 1, text: "Just dispatched to Connaught Place: Royal Dum Biryani & Garlic Naan", tag: "Express Delivery", icon: "🍛" },
  { id: 2, text: "Fresh out of tandoor: Afghani Malai Chaap ordered in CyberCity", tag: "Tandoor Live", icon: "🔥" },
  { id: 3, text: "Sushi Master just rolled: Spicy Salmon Maki & Gyoza for Greater Kailash", tag: "Japanese Kitchen", icon: "🍱" },
  { id: 4, text: "Simmering 16-hr rich broth: Tokyo Tonkotsu Ramen bowl plated", tag: "Ramen Station", icon: "🍜" },
  { id: 5, text: "Wok sizzling: Imperial Dim Sum Basket & Hakka Noodles for Bandra", tag: "Wok Special", icon: "🥢" },
  { id: 6, text: "Wood-fired hearth at 450°C: Truffle Funghi Pizza in Indiranagar", tag: "Hearth Fresh", icon: "🍕" },
  { id: 7, text: "Sweet finale: Artisanal Uji Matcha Mochi & Rabri in Park Street", tag: "Dessert Atelier", icon: "🍨" }
];

const Home = () => {
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [activityIndex, setActivityIndex] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const { isBeige } = useTheme();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/menu-items');
        const dishes = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setAllDishes(dishes);
      } catch (err) {
        console.error('Failed to load menu dishes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // Autonomous Live Kitchen Ticker Autoupdater (Cycles smoothly every 3.2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveKitchenActivities.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('DABBA50');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  // Filter spotlight dishes based on interactive selected cuisine
  const filteredSpotlight = selectedCuisine === 'All'
    ? allDishes.slice(0, 4)
    : allDishes.filter((d) => d.cuisine === selectedCuisine).slice(0, 4);

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      isBeige ? 'text-[#2b160f]' : 'text-[#fff7ed]'
    }`}>
      
      {/* 1. HERO BANNER */}
      <section className={`relative overflow-hidden py-20 lg:py-28 transition-colors duration-300 ${
        isBeige 
          ? 'bg-gradient-to-b from-[#fffbf5] via-[#fbf5eb] to-[#f4eae0] text-stone-900 border-b border-amber-200/70' 
          : 'bg-gradient-to-b from-[#240a06]/95 via-[#1a0805]/95 to-[#130503] text-white border-b border-orange-950/80'
      }`}>
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-tr from-orange-600/25 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Autonomous Auto-Updating Live Kitchen Ticker Bar */}
          <div className="mb-8 flex items-center justify-center lg:justify-start">
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md text-xs shadow-xl max-w-xl transition-all border ${
              isBeige 
                ? 'bg-white/95 border-amber-200 text-stone-700 shadow-amber-900/5' 
                : 'bg-[#1a0805]/95 border-orange-850/80 text-orange-200 shadow-black/50'
            }`}>
              <div className="flex items-center gap-2 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 animate-live-ring"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  ● Live Kitchen
                </span>
              </div>

              {/* Self-updating animated activity line with key transition */}
              <div 
                key={activityIndex} 
                className="animate-live-ticker flex items-center gap-2 truncate overflow-hidden"
              >
                <span className="text-sm shrink-0">{liveKitchenActivities[activityIndex].icon}</span>
                <span className={`font-medium truncate text-xs ${isBeige ? 'text-stone-800' : 'text-stone-200'}`}>
                  {liveKitchenActivities[activityIndex].text}
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/25 shrink-0">
                  {liveKitchenActivities[activityIndex].tag}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide shadow-md ${
                isBeige 
                  ? 'bg-orange-100 border-orange-300 text-orange-800' 
                  : 'bg-orange-950/80 border-orange-700/60 text-orange-400'
              }`}>
                <Sparkles className="w-4 h-4 text-orange-500" />
                <AnimatedBrandName text="Dabba" />&nbsp;Kitchen • Authentic Taste, Handcrafted with Heart
              </div>

              <h1 className={`text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] ${
                isBeige ? 'text-stone-900' : 'text-white'
              }`}>
                Where Every Bite Tells a{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent gradient-shine">
                  Masterpiece Story
                </span>
              </h1>

              <p className={`text-base sm:text-lg max-w-xl font-normal leading-relaxed ${
                isBeige ? 'text-stone-600' : 'text-orange-200/80'
              }`}>
                Step into <AnimatedBrandName text="Dabba" className="text-xl mx-1" />. Immerse yourself in authentic Indian royal curries, fiery wok-charred Chinese specialties, and handcrafted wood-fired Continental treasures.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-orange-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  View Full Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className={`px-7 py-4 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all ${
                    isBeige 
                      ? 'bg-amber-100/80 hover:bg-amber-200 text-stone-800 border-amber-300' 
                      : 'bg-orange-950/80 hover:bg-orange-900 text-orange-200 border-orange-800/80'
                  }`}
                >
                  Reserve a Table
                </Link>

                {/* Interactive Coupon Pill */}
                <button
                  onClick={handleCopyCoupon}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${
                    isBeige 
                      ? 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-800' 
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}
                  title="Click to copy promo code"
                >
                  <Tag className="w-4 h-4 text-orange-500" />
                  <span>Code: <strong className={`tracking-widest ${isBeige ? 'text-stone-900' : 'text-white'}`}>DABBA50</strong></span>
                  {copiedCoupon ? (
                    <span className="inline-flex items-center gap-1 text-emerald-500 text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  ) : (
                    <span className={`text-[11px] flex items-center gap-1 ${isBeige ? 'text-stone-500' : 'text-orange-300/80'}`}>
                      <Copy className="w-3.5 h-3.5" /> ₹50 off
                    </span>
                  )}
                </button>
              </div>

              {/* Mini Highlights */}
              <div className={`pt-6 grid grid-cols-3 gap-6 border-t max-w-lg ${
                isBeige ? 'border-amber-200' : 'border-orange-900/60'
              }`}>
                <div className="group cursor-default">
                  <div className="text-2xl sm:text-3xl font-black text-orange-500 group-hover:scale-105 transition-transform">100%</div>
                  <div className={`text-xs font-medium ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>Organic Sourced</div>
                </div>
                <div className="group cursor-default">
                  <div className="text-2xl sm:text-3xl font-black text-orange-500 group-hover:scale-105 transition-transform">30 Min</div>
                  <div className={`text-xs font-medium ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>Hot Doorstep Drop</div>
                </div>
                <div className="group cursor-default">
                  <div className="text-2xl sm:text-3xl font-black text-orange-500 group-hover:scale-105 transition-transform">4.9 ★</div>
                  <div className={`text-xs font-medium ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>10,000+ Reviews</div>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Floating Top Rating Card */}
                <div className={`absolute -top-5 -right-4 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-float-reverse z-20 ${
                  isBeige 
                    ? 'bg-white/95 text-stone-900 border-amber-200 shadow-amber-900/10' 
                    : 'bg-[#280e08]/95 text-white border-orange-900/70 shadow-black/60'
                }`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>4.9 / 5.0</span>
                      <span className="text-[10px] text-amber-400">★★★★★</span>
                    </div>
                    <p className={`text-[10px] font-medium ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>10,000+ Foodie Reviews</p>
                  </div>
                </div>

                <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 aspect-[4/5] relative group ${
                  isBeige ? 'border-amber-200' : 'border-orange-950/80'
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                    alt="Dabba Dining Experience"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 inline-block">
                      Chef's Special
                    </span>
                    <h3 className="text-xl font-black">Wood-Fired Culinary Mastery</h3>
                    <p className="text-xs text-orange-200/90">Live open kitchens with authentic tandoor & hearths</p>
                  </div>
                </div>

                {/* Floating Bottom Delivery Badge */}
                <div className={`absolute -bottom-6 -left-6 p-4 rounded-3xl shadow-2xl border flex items-center gap-3 animate-float-slow z-20 ${
                  isBeige 
                    ? 'bg-white text-stone-900 border-amber-200' 
                    : 'bg-[#280e08] text-white border-orange-900/70'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-sm">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">Free Express Delivery</span>
                    <p className={`text-sm font-black ${isBeige ? 'text-stone-900' : 'text-white'}`}>On Orders Over ₹499</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 2. REGIONAL CUISINE SHOWCASE BANNERS (Chinese, Indian, Continental) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className={`text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${
            isBeige 
              ? 'bg-orange-100 border-orange-300 text-orange-800' 
              : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
          }`}>
            Global Gastronomy
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isBeige ? 'text-stone-900' : 'text-white'}`}>
            Journey Through World Cuisines
          </h2>
          <p className={`text-sm ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
            Click on any cuisine banner to instantly filter authentic dishes in our restaurant catalog.
          </p>
        </div>

        {/* CUISINE BANNER 1: CHINESE CUISINE BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 text-white shadow-2xl border border-red-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-900/80 border border-red-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider">
                🥢 Authentic Far-East Delicacies
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Imperial Chinese <br />
                <span className="text-amber-400">Wok & Dim Sum Specials</span>
              </h3>
              <p className="text-sm text-rose-100/80 max-w-lg leading-relaxed">
                Handmade translucent crystal dim sums, spicy fiery Szechuan Kung Pao chicken, crunchy honey chilli lotus stems, and high-heat wok-tossed Hakka noodles cooked with aged dark soy and Sichuan peppercorns.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/menu?cuisine=Chinese"
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Explore Chinese Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-amber-200/90 font-semibold">
                  {allDishes.filter((d) => d.cuisine === 'Chinese').length || 11} Specialties Available
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full min-h-[300px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80"
                alt="Chinese Cuisine Wok"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-red-950/40 to-red-950" />
            </div>

          </div>
        </div>


        {/* CUISINE BANNER 2: INDIAN CUISINE BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-orange-900 to-yellow-950 text-white shadow-2xl border border-amber-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-5 order-2 lg:order-1 h-64 sm:h-80 lg:h-full min-h-[300px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                alt="Royal Indian Biryani & Tandoori"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-amber-950/40 to-amber-950" />
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 p-8 sm:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-900/80 border border-amber-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider">
                🍛 Royal Mughal & Tandoor Kitchen
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Authentic Indian <br />
                <span className="text-yellow-400">Dum Biryani & Rich Curries</span>
              </h3>
              <p className="text-sm text-amber-100/80 max-w-lg leading-relaxed">
                Slow-dum cooked Hyderabadi basmati biryani infused with saffron, iconic Delhi-style butter chicken simmered in rich cashew tomato gravy, hot garlic butter naans, and warm gulab jamuns with pistachio rabri.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/menu?cuisine=Indian"
                  className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Explore Indian Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-yellow-200/90 font-semibold">
                  {allDishes.filter((d) => d.cuisine === 'Indian').length || 14} Specialties Available
                </span>
              </div>
            </div>

          </div>
        </div>


        {/* CUISINE BANNER 3: CONTINENTAL & ITALIAN BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white shadow-2xl border border-stone-700/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                🍕 Wood-Fired Hearth & Pasta
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Continental & <br />
                <span className="text-emerald-400">Artisanal Italian Classics</span>
              </h3>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
                900°F wood-fired Margherita Napoletana, freshly rolled Fettuccine Alfredo, prime dry-aged Wagyu burgers, pan-seared Atlantic salmon, and decadent molten Belgian lava cake.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/menu?cuisine=Continental"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Explore Continental Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-emerald-200/90 font-semibold">
                  {allDishes.filter((d) => d.cuisine === 'Continental').length || 21} Dishes Available
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full min-h-[300px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"
                alt="Wood-Fired Continental Pizza"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-stone-900/40 to-stone-900" />
            </div>

          </div>
        </div>

        {/* CUISINE BANNER 4: JAPANESE KAISEKI & RAMEN BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-rose-950 text-white shadow-2xl border border-indigo-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-5 order-2 lg:order-1 h-64 sm:h-80 lg:h-full min-h-[300px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
                alt="Japanese Ramen and Sushi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-indigo-950/40 to-indigo-950" />
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 p-8 sm:p-12 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-rose-300 text-xs font-bold uppercase tracking-wider">
                🍱 Japanese Kaiseki, Ramen & Sushi
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Imperial Japanese <br />
                <span className="text-rose-400">Ramen, Maki & Teppan Art</span>
              </h3>
              <p className="text-sm text-indigo-100/80 max-w-lg leading-relaxed">
                16-hour slow-simmered Tokyo Tonkotsu Ramen with molten egg, handcrafted gyoza, crispy tiger prawn tempura moriawase, spicy salmon maki, chicken katsu curry don, and artisanal Kyoto matcha mochi gelato.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/menu?cuisine=Japanese"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Explore Japanese Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-rose-200/90 font-semibold">
                  {allDishes.filter((d) => d.cuisine === 'Japanese').length || 10} Specialties Available
                </span>
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* 3. CHEF'S SPOTLIGHT DISHES WITH INTERACTIVE CUISINE SWITCHER */}
      <section className={`py-16 backdrop-blur-md border-y transition-colors duration-300 ${
        isBeige ? 'bg-amber-50/50 border-amber-200/80' : 'bg-[#250d09]/40 border-orange-950/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
            <div>
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                isBeige 
                  ? 'bg-orange-100 border-orange-300 text-orange-800' 
                  : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
              }`}>
                Must-Try Dishes
              </span>
              <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mt-2 ${
                isBeige ? 'text-stone-900' : 'text-white'
              }`}>
                Chef's Signature Recommendations
              </h2>
              <p className={`text-xs mt-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>
                Handcrafted culinary masterpieces most celebrated by our local diners
              </p>
            </div>

            {/* Interactive Cuisine Filter Tabs */}
            <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md ${
              isBeige 
                ? 'bg-white/95 border-amber-200 shadow-sm' 
                : 'bg-[#1b0805]/90 border-orange-950/80'
            }`}>
              {['All', 'Indian', 'Chinese', 'Continental', 'Japanese'].map((cuisine) => {
                const count = cuisine === 'All' 
                  ? allDishes.length 
                  : allDishes.filter((d) => d.cuisine === cuisine).length;
                const isActive = selectedCuisine === cuisine;
                const emoji = cuisine === 'All' ? '🌟' : cuisine === 'Indian' ? '🍛' : cuisine === 'Chinese' ? '🥢' : cuisine === 'Continental' ? '🍕' : '🍱';
                return (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-105'
                        : isBeige
                        ? 'text-stone-600 hover:text-stone-900 hover:bg-amber-100'
                        : 'text-orange-200/70 hover:text-white hover:bg-orange-900/60'
                    }`}
                  >
                    <span>{emoji} {cuisine === 'All' ? 'All' : cuisine}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive 
                          ? 'bg-orange-700/60 text-white' 
                          : isBeige 
                          ? 'bg-amber-100 text-stone-700' 
                          : 'bg-orange-950 text-orange-300'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={`rounded-3xl p-4 animate-pulse space-y-4 border ${
                  isBeige ? 'bg-amber-100/40 border-amber-200' : 'bg-[#280e08]/60 border-orange-950/80'
                }`}>
                  <div className={`aspect-[4/3] rounded-2xl w-full ${isBeige ? 'bg-amber-200/60' : 'bg-orange-950'}`} />
                  <div className={`h-5 rounded-md w-3/4 ${isBeige ? 'bg-amber-200/60' : 'bg-orange-950'}`} />
                  <div className={`h-3 rounded-md w-1/2 ${isBeige ? 'bg-amber-200/60' : 'bg-orange-950'}`} />
                </div>
              ))}
            </div>
          ) : filteredSpotlight.length === 0 ? (
            <div className={`text-center py-12 rounded-3xl border border-dashed ${
              isBeige ? 'bg-white/60 border-amber-300' : 'bg-[#280e08]/40 border-orange-950/80'
            }`}>
              <p className={`text-sm font-medium ${isBeige ? 'text-stone-500' : 'text-orange-300/70'}`}>No dishes found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSpotlight.map((dish) => (
                <div key={dish._id || dish.id} className="transition-transform duration-300 hover:-translate-y-1">
                  <MenuItemCard item={dish} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/menu"
              className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-6 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg border ${
                isBeige
                  ? 'text-orange-700 hover:text-white bg-white hover:bg-orange-600 border-amber-200 hover:border-orange-500'
                  : 'text-orange-400 hover:text-white bg-[#280e08]/90 hover:bg-orange-600 border-orange-900/80 hover:border-orange-500'
              }`}
            >
              <span>Explore Complete Menu ({allDishes.length} Items)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>


      {/* 4. DEDICATED CHEF'S CHOICE SHOWCASE SECTION */}
      <section className={`py-20 border-b transition-colors duration-300 relative overflow-hidden ${
        isBeige 
          ? 'bg-gradient-to-b from-amber-100/40 via-orange-50/60 to-amber-100/40 text-stone-900 border-amber-200' 
          : 'bg-gradient-to-b from-[#160503] via-[#200705] to-[#120402] text-white border-orange-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-md ${
                isBeige
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-rose-950/80 border-rose-800/80 text-rose-300'
              }`}>
                <ChefHat className="w-4 h-4 text-rose-500" />
                Executive Kitchen Selection
              </div>
              <h2 className={`text-3xl sm:text-5xl font-black tracking-tight mt-3 ${
                isBeige ? 'text-stone-900' : 'text-white'
              }`}>
                The Master Chef's Choice
              </h2>
              <p className={`text-sm mt-2 max-w-xl ${isBeige ? 'text-stone-600' : 'text-orange-200/80'}`}>
                Personally curated culinary landmarks across Indian, Chinese, Continental, and Japanese gastronomy — celebrating whole roasted spices, wood-fire, and 16-hour simmered stocks.
              </p>
            </div>

            <Link
              to="/menu?filter=chefsChoice"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-rose-600/30 transition-all hover:scale-105 flex items-center gap-2 shrink-0"
            >
              <span>View All Chef's Choice ({allDishes.filter(d => d.isChefsChoice).length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of Chef's Choice Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allDishes
              .filter((d) => d.isChefsChoice)
              .slice(0, 8)
              .map((dish) => (
                <div key={dish._id || dish.id} className="transition-transform duration-300 hover:-translate-y-1">
                  <MenuItemCard item={dish} />
                </div>
              ))}
          </div>

        </div>
      </section>


      {/* 4. WHY CHOOSE DABBA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className={`text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${
            isBeige 
              ? 'bg-orange-100 border-orange-300 text-orange-800' 
              : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
          }`}>
            Our Culinary Promise
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isBeige ? 'text-stone-900' : 'text-white'}`}>
            Why Dine with <AnimatedBrandName text="Dabba" />
          </h2>
          <p className={`text-sm ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
            From the soil of verified organic farms to the flames of our hearths, excellence defines us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className={`group p-8 rounded-3xl border shadow-xl hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 space-y-4 cursor-default backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/85 border-orange-950/80 text-white shadow-black/40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center justify-center font-bold group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base transition-colors ${isBeige ? 'text-stone-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-400'}`}>Award-Winning Chefs</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              Every dish is conceptualized and executed under the watchful eyes of certified master culinary artisans.
            </p>
          </div>

          <div className={`group p-8 rounded-3xl border shadow-xl hover:shadow-2xl hover:border-emerald-500/40 hover:-translate-y-2 transition-all duration-300 space-y-4 cursor-default backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/85 border-orange-950/80 text-white shadow-black/40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center font-bold group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base transition-colors ${isBeige ? 'text-stone-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-400'}`}>100% Organic Produce</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              We partner directly with sustainable local green farms to ensure crisp vegetables, fresh meats, and cold-pressed oils.
            </p>
          </div>

          <div className={`group p-8 rounded-3xl border shadow-xl hover:shadow-2xl hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-300 space-y-4 cursor-default backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/85 border-orange-950/80 text-white shadow-black/40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center font-bold group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base transition-colors ${isBeige ? 'text-stone-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'}`}>30-Min Fast Dispatch</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              Thermal-sealed heat insulation bags retain fresh-out-of-the-pan temperatures during transit to your doorstep.
            </p>
          </div>

          <div className={`group p-8 rounded-3xl border shadow-xl hover:shadow-2xl hover:border-purple-500/40 hover:-translate-y-2 transition-all duration-300 space-y-4 cursor-default backdrop-blur-md ${
            isBeige 
              ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
              : 'bg-[#280e08]/85 border-orange-950/80 text-white shadow-black/40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center justify-center font-bold group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`font-extrabold text-base transition-colors ${isBeige ? 'text-stone-900 group-hover:text-purple-600' : 'text-white group-hover:text-purple-400'}`}>Pristine Hygiene</h3>
            <p className={`text-xs leading-relaxed ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              Sterilized prep stations, temperature-monitored cold storage, and a strict 5-star sanitization protocol.
            </p>
          </div>

        </div>
      </section>


      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className={`py-20 backdrop-blur-md border-y transition-colors duration-300 ${
        isBeige ? 'bg-amber-50/50 border-amber-200/80 text-stone-900' : 'bg-[#250d09]/40 border-orange-950/80 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className={`text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${
              isBeige 
                ? 'bg-orange-100 border-orange-300 text-orange-800' 
                : 'bg-orange-950/80 border-orange-800/80 text-orange-400'
            }`}>
              Patron Reviews
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isBeige ? 'text-stone-900' : 'text-white'}`}>
              Loved by Foodies Worldwide
            </h2>
            <p className={`text-sm ${isBeige ? 'text-stone-600' : 'text-orange-200/70'}`}>
              Read how Dabba turned weeknight dinners and grand celebrations into cherished memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className={`p-8 rounded-3xl border space-y-4 relative ${
              isBeige ? 'bg-white border-amber-200/80 shadow-md' : 'bg-[#280e08] border-orange-950/80'
            }`}>
              <Quote className="w-8 h-8 text-orange-500/20 absolute top-6 right-6" />
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className={`text-xs leading-relaxed italic ${isBeige ? 'text-stone-600' : 'text-orange-200/80'}`}>
                "The Delhi Butter Chicken and Dum Biryani were an explosion of flavor! Truly reminiscent of high-end Mughlai royalty dining. Arrived piping hot!"
              </p>
              <div className="pt-2">
                <p className={`font-bold text-sm ${isBeige ? 'text-stone-900' : 'text-white'}`}>Priya Sharma</p>
                <p className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-orange-300/60'}`}>Verified Food Critic</p>
              </div>
            </div>

            <div className={`p-8 rounded-3xl border space-y-4 relative ${
              isBeige ? 'bg-white border-amber-200/80 shadow-md' : 'bg-[#280e08] border-orange-950/80'
            }`}>
              <Quote className="w-8 h-8 text-orange-500/20 absolute top-6 right-6" />
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className={`text-xs leading-relaxed italic ${isBeige ? 'text-stone-600' : 'text-orange-200/80'}`}>
                "Their wood-fired Margherita pizza has the most authentic crust I've had outside of Naples. Plus the online checkout and tracking was ridiculously fast!"
              </p>
              <div className="pt-2">
                <p className={`font-bold text-sm ${isBeige ? 'text-stone-900' : 'text-white'}`}>Marcus Sterling</p>
                <p className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-orange-300/60'}`}>Regular Diner</p>
              </div>
            </div>

            <div className={`p-8 rounded-3xl border space-y-4 relative ${
              isBeige ? 'bg-white border-amber-200/80 shadow-md' : 'bg-[#280e08] border-orange-950/80'
            }`}>
              <Quote className="w-8 h-8 text-orange-500/20 absolute top-6 right-6" />
              <div className="flex text-amber-400 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className={`text-xs leading-relaxed italic ${isBeige ? 'text-stone-600' : 'text-orange-200/80'}`}>
                "The Imperial Dim Sum basket and Kung Pao Chicken were sensational. Crispy lotus root had the exact crunch and spice glaze balance I crave."
              </p>
              <div className="pt-2">
                <p className={`font-bold text-sm ${isBeige ? 'text-stone-900' : 'text-white'}`}>David Chen</p>
                <p className={`text-[10px] ${isBeige ? 'text-stone-500' : 'text-orange-300/60'}`}>Local Food Enthusiast</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 6. CALL TO ACTION RESERVATION BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-8 sm:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Craving Something Unforgettable Tonight?
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 font-medium">
              Explore our menu of {allDishes.length} handpicked dishes, enjoy express 30-minute delivery, or book a private candlelight table today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/menu"
              className="px-8 py-4 bg-stone-950 hover:bg-stone-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              Order Online Now
            </Link>
            <Link
              to="/contact"
              className="px-6 py-4 bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all"
            >
              Contact & Book Table
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
