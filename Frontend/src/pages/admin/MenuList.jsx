import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Utensils, 
  AlertCircle 
} from 'lucide-react';

const MenuList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/menu-items', { params });
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [category, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      return;
    }

    try {
      const res = await api.delete(`/menu-items/${id}`);
      if (res.data.success) {
        setMessage(`"${name}" was deleted successfully.`);
        setTimeout(() => setMessage(''), 3000);
        fetchMenu();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete menu item.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStock = async (item) => {
    const itemId = item._id || item.id;
    try {
      const res = await api.put(`/menu-items/${itemId}`, {
        availability: item.availability === false ? true : false
      });
      if (res.data.success) {
        fetchMenu();
      }
    } catch (err) {
      console.error('Failed to toggle stock status:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-rose-400">
            Culinary Catalog & Inventory
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Menu Item Management
          </h1>
          <p className="text-xs text-purple-200/70">
            Add, update, or remove dishes and configure live kitchen availability
          </p>
        </div>

        <Link
          to="/admin/menu/new"
          className="px-5 py-3 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 self-start sm:self-auto border border-rose-400/20"
        >
          <Plus className="w-4 h-4" />
          Add New Menu Item
        </Link>
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-950/40">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-glass-card p-6 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xl">
        
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu item by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Category Pill filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['All', 'Starter', 'Main Course', 'Dessert', 'Beverage'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-rose-600/30 border border-rose-400/30'
                  : 'bg-[#140826] text-purple-300/70 hover:text-white hover:bg-rose-950/40 border border-purple-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Menu Table */}
      <div className="admin-glass-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-purple-300/50 text-xs">
            Loading menu records...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-purple-300/60 space-y-3">
            <Utensils className="w-8 h-8 text-rose-400/50 mx-auto" />
            <p className="text-sm font-bold text-white">No dishes match your search criteria</p>
            <Link to="/admin/menu/new" className="text-xs text-rose-400 font-bold hover:underline inline-block">
              Add your first dish
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-900/40 text-purple-200/60 font-bold uppercase tracking-wider text-[10px] bg-purple-950/40">
                  <th className="py-4 px-6">Dish Preview</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {items.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <tr key={itemId} className="hover:bg-rose-950/20 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                            alt={item.name}
                            className="w-14 h-14 rounded-2xl object-cover bg-[#120622] shrink-0 border border-purple-900/50"
                          />
                          <div>
                            <p className="font-bold text-sm text-white">{item.name}</p>
                            <p className="text-[11px] text-purple-300/60 line-clamp-1 max-w-sm mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-950/60 text-purple-300 border border-purple-800/60">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-extrabold text-sm text-rose-400">
                          ₹{Number(item.price)}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(item)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all ${
                            item.availability !== false
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          }`}
                          title="Click to toggle availability"
                        >
                          {item.availability !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Out of Stock
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/menu/${itemId}`}
                            target="_blank"
                            className="p-2 text-purple-300/70 hover:text-white hover:bg-purple-950/60 rounded-lg transition-colors"
                            title="View on storefront"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/menu/edit/${itemId}`}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg transition-colors"
                            title="Edit menu item"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(itemId, item.name)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg transition-colors"
                            title="Delete menu item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default MenuList;
