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
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Menu Items
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your dishes, pricing, categories, and real-time inventory
          </p>
        </div>

        <Link
          to="/admin/menu/new"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </Link>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </div>

        {/* Category Pill filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['All', 'Starter', 'Main Course', 'Dessert', 'Beverage'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Loading menu records...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">No dishes match your search</p>
            <p className="text-xs text-slate-500">Try changing your filters or add a new menu item.</p>
            <Link to="/admin/menu/new" className="text-xs text-slate-900 font-semibold hover:underline inline-block pt-1">
              Add your first dish
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-5 font-medium">Dish</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Availability</th>
                  <th className="py-3 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <tr key={itemId} className="hover:bg-slate-50/70 transition-colors">
                      
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">{item.name}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs sm:max-w-sm mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-xs text-slate-900">
                          ₹{Number(item.price)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(item)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1.5 border transition-colors ${
                            item.availability !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle availability"
                        >
                          {item.availability !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" /> Out of Stock
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/menu/${itemId}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="View on storefront"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/menu/edit/${itemId}`}
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit menu item"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(itemId, item.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
