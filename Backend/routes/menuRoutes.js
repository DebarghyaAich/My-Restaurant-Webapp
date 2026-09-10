import express from 'express';
import MenuItemModel from '../models/MenuItem.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/menu-items (Public)
router.get('/', async (req, res) => {
  try {
    const { category, cuisine, search } = req.query;
    const items = await MenuItemModel.find({ category, cuisine, search });
    return res.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch menu items.' });
  }
});

// GET /api/menu-items/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }
    return res.json({ success: true, item });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch menu item.' });
  }
});

// POST /api/menu-items (Admin Only)
router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, cuisine, price, availability, imageUrl } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, description, category, and price are required.' });
    }

    let image = imageUrl || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const newItem = await MenuItemModel.create({
      name: name.trim(),
      description: description.trim(),
      category,
      cuisine: cuisine || 'Continental',
      price: Number(price),
      availability: availability === 'false' || availability === false ? false : true,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    });

    return res.status(201).json({
      success: true,
      message: 'Menu item added successfully!',
      item: newItem
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return res.status(500).json({ success: false, message: 'Could not add menu item.' });
  }
});

// PUT /api/menu-items/:id (Admin Only)
router.put('/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, cuisine, price, availability, imageUrl } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category;
    if (cuisine !== undefined) updateData.cuisine = cuisine;
    if (price !== undefined) updateData.price = Number(price);
    if (availability !== undefined) updateData.availability = availability === 'true' || availability === true;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined && imageUrl !== '') {
      updateData.image = imageUrl;
    }

    const updatedItem = await MenuItemModel.findByIdAndUpdate(req.params.id, updateData);
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    return res.json({
      success: true,
      message: 'Menu item updated successfully!',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return res.status(500).json({ success: false, message: 'Could not update menu item.' });
  }
});

// DELETE /api/menu-items/:id (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await MenuItemModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }
    return res.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not delete menu item.' });
  }
});

export default router;
