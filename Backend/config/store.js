import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/local_db.json');

if (!process.env.MONGO_URI) {
  if (fs.existsSync(path.join(__dirname, '../../.env'))) {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
  } else if (fs.existsSync(path.join(__dirname, '../.env'))) {
    dotenv.config({ path: path.join(__dirname, '../.env') });
  }
}

let isMongoConnected = false;

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Starter', 'Main Course', 'Dessert', 'Beverage'], required: true },
  cuisine: { type: String, default: 'Continental' },
  price: { type: Number, required: true, min: 0 },
  availability: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  isChefsChoice: { type: Boolean, default: false },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    notes: { type: String, default: '' }
  },
  items: [
    {
      menuItem: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      image: { type: String, default: '' },
      category: { type: String, default: '' }
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Card', 'UPI', 'Cash on Delivery'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  status: { type: String, enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  estimatedDelivery: { type: String, default: '30-45 mins' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const reservationSchema = new mongoose.Schema({
  referenceCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  tables: { type: Number, default: 1, min: 1, max: 20 },
  guests: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seatingArea: { type: String, default: 'Main Dining Hall' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['Confirmed', 'Seated', 'Completed', 'Cancelled'], default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.model('User', userSchema);
const MongooseMenuItem = mongoose.model('MenuItem', menuItemSchema);
const MongooseOrder = mongoose.model('Order', orderSchema);
const MongooseReservation = mongoose.model('Reservation', reservationSchema);

// In-memory / JSON persistence fallback
const memoryDb = {
  users: [],
  menuItems: [],
  orders: [],
  reservations: []
};

const loadLocalData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (content) {
        const parsed = JSON.parse(content);
        memoryDb.users = parsed.users || [];
        memoryDb.menuItems = parsed.menuItems || [];
        memoryDb.orders = parsed.orders || [];
        memoryDb.reservations = parsed.reservations || [];
      }
    }
  } catch (err) {
    console.warn('[Dabba Local Store] Could not read local_db.json, initialized empty:', err.message);
  }
};

const saveLocalData = () => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Dabba Local Store] Failed saving local_db.json:', err.message);
  }
};

loadLocalData();

export const connectDB = async () => {
  let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dabba';
  
  // Auto-sanitize: remove invalid slashes or extra path segments in database name (e.g. /restaurantdb/webskitars -> /restaurantdb)
  if (uri.includes('.mongodb.net/')) {
    const parts = uri.split('.mongodb.net/');
    const afterNet = parts[1] || '';
    const [pathPart, ...queryParts] = afterNet.split('?');
    const segments = pathPart.split('/').filter(Boolean);
    if (segments.length > 1) {
      const validDb = segments[0];
      const queryString = queryParts.length > 0 ? '?' + queryParts.join('?') : '?retryWrites=true&w=majority';
      uri = parts[0] + '.mongodb.net/' + validDb + queryString;
    }
  }

  try {
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`[Dabba DB] Connecting to database: ${maskedUri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    isMongoConnected = true;
    console.log('✅ [Dabba DB] Connected successfully to MongoDB!');
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ [Dabba DB] MongoDB connection error: ${error.message}`);
    console.log('⚡ [Dabba DB] Seamlessly active in Persistent Local/In-Memory Mode (data stored in data/local_db.json).');
  }
};

const generateId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

// Resilient Models with unified API
export const UserModel = {
  async findOne(query) {
    if (isMongoConnected) return await MongooseUser.findOne(query);
    return memoryDb.users.find(u => {
      for (const key in query) {
        if (key === 'email' && u.email?.toLowerCase() !== query.email?.toLowerCase()) return false;
        if (key !== 'email' && u[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  async findById(id) {
    if (isMongoConnected) return await MongooseUser.findById(id);
    return memoryDb.users.find(u => u._id === id || u.id === id) || null;
  },

  async find(query = {}) {
    if (isMongoConnected) return await MongooseUser.find(query).select('-password').sort({ createdAt: -1 });
    return memoryDb.users.map(u => {
      const { password, ...rest } = u;
      return rest;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(data) {
    if (isMongoConnected) return await MongooseUser.create(data);
    const newUser = {
      _id: generateId(),
      id: generateId(),
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role || 'User',
      createdAt: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    saveLocalData();
    return newUser;
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) return await MongooseUser.findByIdAndDelete(id);
    const idx = memoryDb.users.findIndex(u => u._id === id || u.id === id);
    if (idx !== -1) {
      const removed = memoryDb.users.splice(idx, 1)[0];
      saveLocalData();
      return removed;
    }
    return null;
  },

  async countDocuments() {
    if (isMongoConnected) return await MongooseUser.countDocuments();
    return memoryDb.users.length;
  }
};

export const MenuItemModel = {
  async find(query = {}) {
    if (isMongoConnected) {
      const q = {};
      if (query.category && query.category !== 'All') q.category = query.category;
      if (query.cuisine && query.cuisine !== 'All') q.cuisine = query.cuisine;
      if (query.search) {
        q.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { cuisine: { $regex: query.search, $options: 'i' } }
        ];
      }
      return await MongooseMenuItem.find(q).sort({ createdAt: -1 });
    }
    return memoryDb.menuItems.filter(item => {
      if (query.category && query.category !== 'All' && item.category !== query.category) return false;
      if (query.cuisine && query.cuisine !== 'All' && item.cuisine?.toLowerCase() !== query.cuisine.toLowerCase()) return false;
      if (query.search) {
        const s = query.search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(s);
        const matchDesc = item.description?.toLowerCase().includes(s);
        const matchCuisine = item.cuisine?.toLowerCase().includes(s);
        if (!matchName && !matchDesc && !matchCuisine) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    if (isMongoConnected) return await MongooseMenuItem.findById(id);
    return memoryDb.menuItems.find(item => item._id === id || item.id === id) || null;
  },

  async create(data) {
    if (isMongoConnected) return await MongooseMenuItem.create(data);
    const newItem = {
      _id: generateId(),
      id: generateId(),
      name: data.name,
      description: data.description,
      category: data.category,
      cuisine: data.cuisine || 'Continental',
      price: Number(data.price),
      availability: data.availability !== undefined ? Boolean(data.availability) : true,
      isBestseller: data.isBestseller !== undefined ? Boolean(data.isBestseller) : false,
      isChefsChoice: data.isChefsChoice !== undefined ? Boolean(data.isChefsChoice) : false,
      image: data.image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDb.menuItems.push(newItem);
    saveLocalData();
    return newItem;
  },

  async findByIdAndUpdate(id, data) {
    if (isMongoConnected) return await MongooseMenuItem.findByIdAndUpdate(id, data, { new: true });
    const item = memoryDb.menuItems.find(i => i._id === id || i.id === id);
    if (!item) return null;
    if (data.name !== undefined) item.name = data.name;
    if (data.description !== undefined) item.description = data.description;
    if (data.category !== undefined) item.category = data.category;
    if (data.cuisine !== undefined) item.cuisine = data.cuisine;
    if (data.price !== undefined) item.price = Number(data.price);
    if (data.availability !== undefined) item.availability = Boolean(data.availability);
    if (data.isBestseller !== undefined) item.isBestseller = Boolean(data.isBestseller);
    if (data.isChefsChoice !== undefined) item.isChefsChoice = Boolean(data.isChefsChoice);
    if (data.image !== undefined) item.image = data.image;
    item.updatedAt = new Date().toISOString();
    saveLocalData();
    return item;
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) return await MongooseMenuItem.findByIdAndDelete(id);
    const idx = memoryDb.menuItems.findIndex(i => i._id === id || i.id === id);
    if (idx !== -1) {
      const removed = memoryDb.menuItems.splice(idx, 1)[0];
      saveLocalData();
      return removed;
    }
    return null;
  },

  async countDocuments() {
    if (isMongoConnected) return await MongooseMenuItem.countDocuments();
    return memoryDb.menuItems.length;
  }
};

export const OrderModel = {
  async find(query = {}) {
    if (isMongoConnected) {
      const q = {};
      if (query.user) q.user = query.user;
      return await MongooseOrder.find(q).sort({ createdAt: -1 });
    }
    return memoryDb.orders.filter(o => {
      if (query.user && o.user !== query.user) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    if (isMongoConnected) return await MongooseOrder.findById(id);
    return memoryDb.orders.find(o => o._id === id || o.id === id || o.orderNumber === id) || null;
  },

  async create(data) {
    if (isMongoConnected) return await MongooseOrder.create(data);
    const orderNumber = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      _id: generateId(),
      id: generateId(),
      orderNumber,
      user: data.user || null,
      customerDetails: data.customerDetails,
      items: data.items,
      subtotal: Number(data.subtotal),
      tax: Number(data.tax),
      deliveryFee: Number(data.deliveryFee || 0),
      totalAmount: Number(data.totalAmount),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || 'Completed',
      status: data.status || 'Pending',
      estimatedDelivery: '30-45 mins',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDb.orders.push(newOrder);
    saveLocalData();
    return newOrder;
  },

  async findByIdAndUpdate(id, data) {
    if (isMongoConnected) return await MongooseOrder.findByIdAndUpdate(id, data, { new: true });
    const order = memoryDb.orders.find(o => o._id === id || o.id === id || o.orderNumber === id);
    if (!order) return null;
    if (data.status) order.status = data.status;
    if (data.paymentStatus) order.paymentStatus = data.paymentStatus;
    order.updatedAt = new Date().toISOString();
    saveLocalData();
    return order;
  },

  async countDocuments() {
    if (isMongoConnected) return await MongooseOrder.countDocuments();
    return memoryDb.orders.length;
  }
};

export const ReservationModel = {
  async find(query = {}) {
    if (isMongoConnected) {
      const q = {};
      if (query.user) q.user = query.user;
      return await MongooseReservation.find(q).sort({ createdAt: -1 });
    }
    return (memoryDb.reservations || []).filter(r => {
      if (query.user && r.user !== query.user) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    if (isMongoConnected) return await MongooseReservation.findById(id);
    return (memoryDb.reservations || []).find(r => r._id === id || r.id === id || r.referenceCode === id) || null;
  },

  async create(data) {
    if (isMongoConnected) return await MongooseReservation.create(data);
    const referenceCode = `DABBA-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      _id: generateId(),
      id: generateId(),
      referenceCode,
      user: data.user,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      tables: Number(data.tables) || 1,
      guests: data.guests,
      date: data.date,
      time: data.time,
      seatingArea: data.seatingArea || 'Main Dining Hall',
      message: data.message || '',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!memoryDb.reservations) memoryDb.reservations = [];
    memoryDb.reservations.push(newReservation);
    saveLocalData();
    return newReservation;
  },

  async findByIdAndUpdate(id, data) {
    if (isMongoConnected) return await MongooseReservation.findByIdAndUpdate(id, data, { new: true });
    const resv = (memoryDb.reservations || []).find(r => r._id === id || r.id === id || r.referenceCode === id);
    if (!resv) return null;
    if (data.status) resv.status = data.status;
    resv.updatedAt = new Date().toISOString();
    saveLocalData();
    return resv;
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) return await MongooseReservation.findByIdAndDelete(id);
    const idx = (memoryDb.reservations || []).findIndex(r => r._id === id || r.id === id || r.referenceCode === id);
    if (idx !== -1) {
      const removed = memoryDb.reservations.splice(idx, 1)[0];
      saveLocalData();
      return removed;
    }
    return null;
  },

  async countDocuments() {
    if (isMongoConnected) return await MongooseReservation.countDocuments();
    return (memoryDb.reservations || []).length;
  }
};

