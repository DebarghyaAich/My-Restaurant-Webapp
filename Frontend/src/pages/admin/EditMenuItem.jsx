import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Upload, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Japanese'];

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Main Course',
    price: '',
    availability: true,
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/menu-items/${id}`);
        if (res.data.success && res.data.item) {
          const item = res.data.item;
          setFormData({
            name: item.name,
            description: item.description,
            category: item.category,
            price: item.price,
            availability: item.availability !== false,
            imageUrl: item.image || ''
          });
          setPreviewUrl(item.image || '');
        }
      } catch (err) {
        console.error('Failed to load item:', err);
        setError('Menu item not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

    try {
      setSaving(true);
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

      const res = await api.put(`/menu-items/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        navigate('/admin/menu');
      }
    } catch (err) {
      console.error('Failed to update item:', err);
      setError(err.response?.data?.message || 'Error updating menu item.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <Link
          to="/admin/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Menu Items
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Edit Menu Item
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Modify dish details, pricing, category, and inventory status
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Item Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              />
            </div>

            {/* Availability Checkbox */}
            <div className="sm:col-span-2 flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
              />
              <label htmlFor="availability" className="text-xs font-medium text-slate-700 cursor-pointer">
                In Stock & Available for Ordering
              </label>
            </div>

            {/* Image update */}
            <div className="sm:col-span-2 pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Update Dish Image
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* File Upload */}
                <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-800">Upload New File</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Leave empty to keep existing image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer transition-colors"
                  />
                </div>

                {/* URL input */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-600">Or Image Web URL</span>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1.5">Image Preview:</span>
                  <div className="w-32 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Submit */}
          <div className="pt-5 border-t border-slate-100 flex justify-end gap-2.5">
            <Link
              to="/admin/menu"
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Update Menu Item'}
              <Save className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default EditMenuItem;
