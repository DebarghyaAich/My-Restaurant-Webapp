import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Upload, AlertCircle, CheckCircle2, Image as ImageIcon, Plus } from 'lucide-react';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Japanese'];

const AddMenuItem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Starter',
    price: '',
    availability: true,
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'imageUrl' && !imageFile) {
      setPreviewUrl(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description || !formData.price) {
      setError('Please provide item name, description, and price.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('availability', formData.availability);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl);
      }

      const res = await api.post('/menu-items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate('/admin/menu');
      }
    } catch (err) {
      console.error('Failed to add item:', err);
      setError(err.response?.data?.message || 'Error saving menu item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <Link
          to="/admin/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu Inventory
        </Link>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Create New Menu Item
        </h1>
        <p className="text-xs text-purple-300/60">
          Specify dish title, culinary category, pricing, and upload an appetizing photo
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-950/40">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="admin-glass-card rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Item Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-purple-300/80 mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wood-Fired Truffle Funghi Pizza"
                className="w-full px-4 py-3 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-purple-300/80 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#150628] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-purple-300/80 mb-1.5">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 399"
                className="w-full px-4 py-3 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-purple-300/80 mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed ingredient composition, preparation notes, and flavor profile..."
                className="w-full px-4 py-3 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>

            {/* Availability Checkbox */}
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-[#120622] border-purple-900/60"
              />
              <label htmlFor="availability" className="text-xs font-bold text-purple-300/90 cursor-pointer">
                In Stock & Available to Order immediately
              </label>
            </div>

            {/* Image Upload / URL */}
            <div className="sm:col-span-2 pt-4 border-t border-purple-900/40 space-y-4">
              <label className="block text-xs font-bold text-purple-300/80">
                Dish Photography / Image
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* File Upload with Multer */}
                <div className="border-2 border-dashed border-purple-800/60 rounded-2xl p-6 text-center hover:border-rose-500/70 transition-colors bg-[#130726]/40">
                  <Upload className="w-8 h-8 text-rose-400/60 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">Upload Image File</p>
                  <p className="text-[10px] text-purple-300/50 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-3 block w-full text-[11px] text-purple-300/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gradient-to-r file:from-rose-600 file:via-purple-600 file:to-indigo-600 file:text-white hover:file:from-rose-500 hover:file:via-purple-500 hover:file:to-indigo-500 cursor-pointer transition-all"
                  />
                </div>

                {/* Or Image URL */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-purple-300/70 uppercase tracking-wider">Or Image Web URL</span>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-[#120622] border border-purple-900/60 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                  <p className="text-[10px] text-purple-300/50">Provide a direct high-res image link</p>
                </div>
              </div>

              {/* Live Preview */}
              {previewUrl && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-purple-300/70 block mb-2">Live Image Preview:</span>
                  <div className="w-40 h-28 rounded-2xl overflow-hidden border border-rose-800/60 bg-[#120622]">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-purple-900/40 flex justify-end gap-3">
            <Link
              to="/admin/menu"
              className="px-6 py-3 rounded-xl border border-purple-900/60 text-xs font-bold text-purple-300/70 hover:text-white hover:bg-purple-950/60 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2 disabled:opacity-60 border border-rose-400/20"
            >
              {loading ? 'Publishing Dish...' : 'Publish to Menu'}
              <Plus className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddMenuItem;
