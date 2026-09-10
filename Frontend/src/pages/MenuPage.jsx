import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  SlidersHorizontal, 
  Utensils, 
  Sparkles, 
  Flame, 
  Check, 
  Globe2 
} from 'lucide-react';

const CATEGORIES = ['All', 'Starter', 'Main Course', 'Dessert', 'Beverage'];
const CUISINES = ['All', 'Indian', 'Chinese', 'Continental', 'Japanese'];

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCuisine = searchParams.get('cuisine') || 'All';
  const initialCategory = searchParams.get('category') || 'All';
  const initialFilter = searchParams.get('filter') || 'All';
  const { isBeige } = useTheme();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeCuisine, setActiveCuisine] = useState(initialCuisine);
  const [specialFilter, setSpecialFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Keep state in sync with URL search params
  useEffect(() => {
    const cuisineParam = searchParams.get('cuisine');
    if (cuisineParam && CUISINES.includes(cuisineParam)) {
      setActiveCuisine(cuisineParam);
    } else if (!cuisineParam) {
      setActiveCuisine('All');
    }

    const catParam = searchParams.get('category');
    if (catParam && CATEGORIES.includes(catParam)) {
      setActiveCategory(catParam);
    } else if (!catParam) {
      setActiveCategory('All');
    }

    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setSpecialFilter(filterParam);
    } else {
      setSpecialFilter('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await api.get('/menu-items');
        const dataItems = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setItems(dataItems);
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesCuisine = activeCuisine === 'All' || item.cuisine === activeCuisine;
    const matchesSpecial = 
      specialFilter === 'All' ||
      (specialFilter === 'chefsChoice' && item.isChefsChoice) ||
      (specialFilter === 'bestseller' && item.isBestseller);
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.cuisine && item.cuisine.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesCuisine && matchesSpecial && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleCuisineChange = (cuisine) => {
    setActiveCuisine(cuisine);
    if (cuisine === 'All') {
      searchParams.delete('cuisine');
    } else {
      searchParams.set('cuisine', cuisine);
    }
    setSearchParams(searchParams);
  };

  const handleSpecialFilterChange = (filterKey) => {
    setSpecialFilter(filterKey);
    if (filterKey === 'All') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', filterKey);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 ${
      isBeige ? 'text-stone-900' : 'text-stone-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${
            isBeige 
              ? 'bg-orange-100 border-orange-300 text-orange-800' 
              : 'bg-orange-950/70 border-orange-800/60 text-orange-400'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Complete Culinary Catalog
          </div>
          <h1 className={`text-4xl sm:text-5xl font-black tracking-tight ${
            isBeige ? 'text-stone-900' : 'text-white'
          }`}>
            Explore Our Gourmet Menu
          </h1>
          <p className={`text-sm max-w-xl mx-auto ${
            isBeige ? 'text-stone-600' : 'text-orange-200/70'
          }`}>
            From rich Mughal curries and wok-tossed Asian stir-fries to wood-fired Neapolitan pizzas and decadent sweets.
          </p>
        </div>

        {/* Filter & Controls Card */}
        <div className={`p-6 rounded-3xl border shadow-xl mb-10 space-y-6 backdrop-blur-md transition-all ${
          isBeige 
            ? 'bg-white/95 border-amber-200 text-stone-900 shadow-amber-900/5' 
            : 'bg-[#280e08]/85 border-orange-950/80 text-white'
        }`}>
          
          {/* Top Row: Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isBeige ? 'text-stone-400' : 'text-orange-300/60'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish, ingredient, or cuisine..."
                className={`w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border ${
                  isBeige
                    ? 'bg-amber-50/60 border-amber-200 text-stone-900 placeholder-stone-400'
                    : 'bg-[#1a0805] border-orange-900/60 text-white placeholder-orange-300/40'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${
                    isBeige ? 'text-stone-400 hover:text-stone-900' : 'text-orange-300 hover:text-white'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <SlidersHorizontal className={`w-4 h-4 ${isBeige ? 'text-stone-400' : 'text-orange-400'}`} />
              <span className={`text-xs font-semibold ${isBeige ? 'text-stone-500' : 'text-orange-200/70'}`}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 border ${
                  isBeige
                    ? 'bg-white border-amber-200 text-stone-900'
                    : 'bg-[#1a0805] border-orange-900/70 text-orange-100'
                }`}
              >
                <option value="default">Chef's Recommendation</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Highlights Row: Chef's Choice & Bestsellers */}
          <div className={`space-y-2 pt-2 border-t ${isBeige ? 'border-amber-200/80' : 'border-orange-950/80'}`}>
            <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isBeige ? 'text-stone-500' : 'text-orange-300/70'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Featured Highlights
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSpecialFilterChange('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  specialFilter === 'All'
                    ? 'bg-orange-600 text-white shadow-md'
                    : isBeige
                    ? 'bg-amber-50 text-stone-700 hover:bg-amber-100 border border-amber-200'
                    : 'bg-orange-950/50 text-orange-200/70 hover:text-white hover:bg-orange-900/60 border border-orange-900/50'
                }`}
              >
                All Menu Items
              </button>

              <button
                type="button"
                onClick={() => handleSpecialFilterChange('chefsChoice')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  specialFilter === 'chefsChoice'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg ring-2 ring-rose-400/40'
                    : isBeige
                    ? 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                    : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-900/50'
                }`}
              >
                <span>👨‍🍳</span>
                <span>Chef's Choice ({items.filter(i => i.isChefsChoice).length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpecialFilterChange('bestseller')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  specialFilter === 'bestseller'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg ring-2 ring-amber-400/40'
                    : isBeige
                    ? 'bg-amber-100/70 text-amber-950 hover:bg-amber-200/70 border border-amber-300'
                    : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-900/50'
                }`}
              >
                <span>⭐</span>
                <span>Bestsellers ({items.filter(i => i.isBestseller).length})</span>
              </button>
            </div>
          </div>

          {/* Middle Row: Cuisine Selector */}
          <div className={`space-y-2 pt-2 border-t ${isBeige ? 'border-amber-200/80' : 'border-orange-950/80'}`}>
            <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isBeige ? 'text-stone-500' : 'text-orange-300/70'
            }`}>
              <Globe2 className="w-3.5 h-3.5 text-orange-500" />
              Filter by Regional Cuisine
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CUISINES.map((c) => {
                const count = c === 'All' ? items.length : items.filter(i => i.cuisine === c).length;
                const emoji = c === 'Indian' ? '🍛' : c === 'Chinese' ? '🥢' : c === 'Continental' ? '🍕' : c === 'Japanese' ? '🍱' : '🌟';
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCuisineChange(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activeCuisine === c
                        ? 'bg-orange-600 text-white shadow-md'
                        : isBeige
                        ? 'bg-amber-50 text-stone-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-orange-950/50 text-orange-200/70 hover:text-white hover:bg-orange-900/60 border border-orange-900/50'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{c === 'All' ? 'All Cuisines' : `${c}`}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCuisine === c
                        ? 'bg-white/20 text-white'
                        : isBeige ? 'bg-amber-200/80 text-stone-800' : 'bg-orange-950 text-orange-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Meal Category Pills */}
          <div className={`space-y-2 pt-2 border-t ${isBeige ? 'border-amber-200/80' : 'border-orange-950/80'}`}>
            <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isBeige ? 'text-stone-500' : 'text-orange-300/70'
            }`}>
              <Utensils className="w-3.5 h-3.5 text-orange-500" />
              Course Category
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 scale-105'
                      : isBeige
                      ? 'bg-amber-50 text-stone-700 hover:bg-amber-100 border border-amber-200'
                      : 'bg-orange-950/50 text-orange-200/70 hover:text-white hover:bg-orange-900/60 border border-orange-900/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Showing {sortedItems.length} delicious dish{sortedItems.length === 1 ? '' : 'es'}</span>
          {(activeCategory !== 'All' || activeCuisine !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                handleCuisineChange('All');
                setSearchQuery('');
              }}
              className="text-orange-400 hover:underline font-bold"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-slate-800 rounded-2xl w-full" />
                <div className="h-5 bg-slate-800 rounded-md w-3/4" />
                <div className="h-3 bg-slate-800/80 rounded-md w-full" />
                <div className="h-10 bg-slate-800 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-orange-950/70 border border-orange-800/60 text-orange-400 flex items-center justify-center mx-auto">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No dishes match your selection</h3>
            <p className="text-xs text-slate-400">
              Try resetting your cuisine or category filters to explore the rest of our menu.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                handleCuisineChange('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <MenuItemCard key={item._id || item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MenuPage;
