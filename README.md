# 🍱 Dabba (डब्बा) — Artisanal Multi-Cuisine MERN Restaurant & Dining Suite

<div align="center">

![Dabba Banner](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80)

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2F%20Resilient%20Store-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%26%20BCrypt-F7DF1E?logo=jsonwebtokens&logoColor=black&style=for-the-badge)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An immersive, full-stack culinary web application engineered with modern React, Express, and resilient persistence. Featuring letter-by-letter animated typography, an autonomous live kitchen ticker, login-gated VIP table bookings with custom calendars and spring dropdowns, dual warm-aesthetic themes, cart & order tracking, and a dedicated executive admin management suite.</strong>
</p>

[Explore Menu](#-culinary-showcase) • [Key Features](#-key-features) • [Architecture](#-system-architecture) • [API Reference](#-api-endpoints) • [Quickstart](#-quickstart-guide) • [Demo Accounts](#-test-credentials)

</div>

---

## 📖 Overview

**Dabba** (*noun: the iconic lunchbox and culinary vessel of India*) is a state-of-the-art MERN web application crafted for high-end dining and express doorstep delivery. It combines authentic royal Indian recipes, fiery wok-charred Chinese delicacies, artisanal wood-fired Continental fare, and handcrafted Japanese sushi and ramen.

Designed with rich aesthetic principles, the application features an ambient floating particle background, a dual-theme switch between **Warm Spiced Terracotta** and **Artisanal Chai Beige**, fluid spring micro-interactions, and real-time operational flows for both customers and restaurant operators.

---

## ✨ Key Features

### 🔠 1. Letter-by-Letter Animated Brand Typography
- The brand name **Dabba** animates dynamically from left to right, character by character (`D` ➔ `a` ➔ `b` ➔ `b` ➔ `a`).
- Each letter emerges with a subtle blur-to-focus resolution, elastic overshoot landing, and a radiant amber/orange ember glow.
- Rests cleanly visible for an uninterrupted reading experience before gracefully dissolving in a cascading wave and repeating automatically.
- Accompanied by the continuous flowing rainbow shimmer on the hero title *"Masterpiece Story"*.

### 📻 2. Autonomous Live Kitchen Activity Ticker
- Uninterrupted real-time feed showcasing live orders and culinary dispatches (e.g., *Connaught Place Dum Biryani*, *Bandra Dim Sum*, *CyberCity Tandoor*, *Indiranagar Wood-Fired Hearth*).
- Cycles autonomously every **3.2 seconds** with smooth vertical slide-and-scale animations and a glowing emerald radar beacon.
- Operates hands-free without requiring manual arrow navigation.

### 🍷 3. Login-Gated VIP Table Reservations
- **Authentication Gatekeeper**: Unregistered guests see an interactive VIP Member lock gateway prompting login with redirected return paths.
- **Custom Interactive Calendar**: Replaces generic browser date pickers with a luxury popover calendar featuring month/year navigation, automatic disabling of past dates, and quick smart presets (`Today`, `Tomorrow`, `This Friday`, `This Saturday`).
- **Spring-Animated Dropdowns**: Custom select menus with cubic-bezier drop transitions, chevron flips, and checkmark micro-animations for Party Size, Dining Time, and Seating Ambience (*Main Dining Hall*, *Private Royal Alcove*, *Garden Terrace*, *Chef's Counter*).
- **Instant VIP Hold Confirmation**: Generates a tamper-proof digital reservation ticket with unique reference codes (`DABBA-RES-XXXX`) saved to the database and viewable inside the member's account.

### 🎨 4. Theme-Adaptive Dual Visual Engine
- **Spiced Terracotta (Default)**: Deep reddish-orange midnight canvas (`#1c0906`) with warm ember glow, glassmorphic cards, and fiery accents.
- **Artisanal Chai Beige**: Warm sunlit sand canvas (`#fbf5eb`) with rich espresso typography, linen borders, and soft organic contrast.
- One-click floating theme switcher with persistent user preference storage in `localStorage`.

### 🛍️ 5. Shopping Cart & Checkout Suite
- Slide-out Cart Drawer accessible globally from any page.
- Instant quantity adjustments, subtotal calculations, taxes, and express delivery thresholds.
- Interactive discount coupon voucher (`DABBA50`) with one-click clipboard copy functionality.
- Real-time order status tracking (`Pending` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`).

### 🛡️ 6. Executive Administrative Command Center
- Regal deep-violet and crimson styled admin portal.
- Real-time operational KPI metric cards (Total Revenue, Gross Orders, Active Dishes, Member Headcount).
- Full Menu Item CRUD management with category filters, bestsellers, chef's specials, and image uploads.
- Live Order Dispatch control with status updates and customer information review.

---

## 🍱 Culinary Showcase

Dabba ships pre-loaded with **56 artisanal culinary creations** spanning five signature categories:

| Category | Highlights & Specialties |
| :--- | :--- |
| **🍛 Royal Indian** | Slow-cooked Dum Biryani, Paneer Butter Masala, Afghani Malai Chaap, Garlic Butter Naan, Rogan Josh |
| **🍱 Japanese Atelier** | Spicy Salmon Maki, Tokyo Tonkotsu Ramen, Crispy Vegetable Gyoza, Uji Matcha Mochi |
| **🥢 Asian Wok & Dim Sum** | Imperial Truffle Dim Sum, Schezwan Wok Noodles, Kung Pao Tofu, Chili Garlic Crispy Lotus Stem |
| **🍕 Artisanal Continental** | Truffle Funghi Sourdough Pizza, Smoked Pomodoro Rigatoni, Herbed Burrata Salad |
| **🍨 Dessert & Beverage** | Saffron Malpua with Rabri, Belgian Dark Chocolate Fondant, Kesari Mango Lassi |

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |            CLIENT BROWSER             |
                                  |     React 18 + Vite + Tailwind CSS    |
                                  +-------------------+-------------------+
                                                      |
                                                      | Axios / REST JSON
                                                      v
                                  +---------------------------------------+
                                  |          EXPRESS.JS BACKEND           |
                                  |        Server Port: 5000 (HTTP)       |
                                  +---------+-------------------+---------+
                                            |                   |
                                            | Middleware:       | Middleware:
                                            | cors, json parser | verifyToken (JWT)
                                            v                   v
                       +--------------------------------------------------------+
                       |                     API ROUTERS                        |
                       |  /api/auth   /api/menu-items   /api/orders   /api/res  |
                       +---------------------------+----------------------------+
                                                   |
                                                   v
                       +--------------------------------------------------------+
                       |              DUAL-MODE PERSISTENCE LAYER               |
                       |                                                        |
                       |  [Primary] Mongoose ➔ MongoDB Instance                |
                       |  [Fallback] Resilient In-Memory & data/local_db.json   |
                       +--------------------------------------------------------+
```

---

## 📂 Codebase Directory Structure

```plaintext
restaurant-project/
├── data/
│   └── local_db.json             # Resilient persistent JSON database store
├── public/                       # Public static assets & favicon
├── server/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection manager
│   │   └── store.js              # Dual-mode persistence & auto-seeding engine
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization (verifyToken, isAdmin)
│   ├── models/
│   │   ├── Dish.js               # Culinary menu item model
│   │   ├── Order.js              # Order & payment schema
│   │   ├── Reservation.js        # Table reservation schema
│   │   └── User.js               # User & admin profile schema
│   ├── routes/
│   │   ├── authRoutes.js         # Register, login, profile endpoints
│   │   ├── menuRoutes.js         # Menu listing, search, category filter, CRUD
│   │   ├── orderRoutes.js        # Checkout, dispatch status lifecycle
│   │   ├── reservationRoutes.js  # Protected table reservation endpoints
│   │   ├── statRoutes.js         # Admin dashboard operational analytics
│   │   └── userRoutes.js         # User registry management
│   ├── utils/
│   │   └── seed.js               # 56-dish menu & account seeder
│   └── server.js                 # Express API server entry point
├── src/
│   ├── assets/                   # Vector graphics & visual assets
│   ├── components/
│   │   ├── admin/                # Admin floating backgrounds & metric cards
│   │   ├── AnimatedBrandName.jsx # Letter-by-letter left-to-right cascading Dabba
│   │   ├── AnimatedDropdown.jsx  # Spring-expanded select component with checkmarks
│   │   ├── CartDrawer.jsx        # Slide-out interactive shopping basket
│   │   ├── FloatingBackground.jsx# Ambient floating culinary particles
│   │   ├── Footer.jsx            # Multi-column footer with brand links
│   │   ├── MenuItemCard.jsx      # Dish display card with dietary flags & order actions
│   │   ├── Navbar.jsx            # Sticky navigation with animated brand logo
│   │   ├── ProtectedRoute.jsx    # Route guard components for Users & Admins
│   │   ├── ReservationCalendar.jsx # Theme-adaptive luxury date picker
│   │   └── Toast.jsx             # Notification snackbar dispatcher
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state machine & JWT handler
│   │   ├── CartContext.jsx       # Cart state, item quantities, coupons
│   │   └── ThemeContext.jsx      # Terracotta vs Beige theme switcher
│   ├── pages/
│   │   ├── admin/                # Dashboard, Menu CRUD, Order manager, User lists
│   │   ├── AboutUs.jsx           # Heritage, chef profiles, culinary philosophy
│   │   ├── BillingPage.jsx       # Multi-step checkout & payment selection
│   │   ├── ContactUs.jsx         # Login-gated table reservations & concierge
│   │   ├── Home.jsx              # Landing page, live kitchen ticker, showcase
│   │   ├── MenuItemDetails.jsx   # Single item deep dive with reviews & ingredients
│   │   ├── MenuPage.jsx          # Searchable, filterable 56-dish catalog
│   │   ├── MyOrders.jsx          # Customer order tracking & reservation vouchers
│   │   ├── OrderSuccess.jsx      # Order confirmation with ETA countdown
│   │   ├── UserLogin.jsx         # Customer login page
│   │   └── UserRegister.jsx      # Customer registration page
│   ├── services/
│   │   └── api.js                # Axios client with JWT auto-injection
│   ├── App.jsx                   # Root layout, router mapping, and global providers
│   ├── index.css                 # Theme variables, custom keyframes, Tailwind setup
│   └── main.jsx                  # React application entry point
├── uploads/                      # Uploaded dish images storage
├── .env.example                  # Environment configuration blueprint
├── .gitignore                    # Version control ignore definitions
├── index.html                    # Single Page Application HTML host
├── package.json                  # Scripts & project dependencies
└── vite.config.js                # Vite build and development configuration
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new customer account | Public |
| `POST` | `/api/auth/login` | Login as user or admin (returns JWT) | Public |
| `GET` | `/api/auth/profile` | Fetch authenticated user profile | Private |

### 🍛 Culinary Menu (`/api/menu-items`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu-items` | Fetch all menu items (search, category, cuisine) | Public |
| `GET` | `/api/menu-items/:id` | Fetch specific dish details | Public |
| `POST` | `/api/menu-items` | Create new menu item (with image upload) | Admin |
| `PUT` | `/api/menu-items/:id` | Update existing menu item | Admin |
| `DELETE` | `/api/menu-items/:id` | Remove menu item | Admin |

### 🍷 VIP Reservations (`/api/reservations`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reservations` | Reserve table (date, time, party size, zone) | Private (Member) |
| `GET` | `/api/reservations` | View user's reservations (or all for Admin) | Private |
| `GET` | `/api/reservations/:id` | View specific reservation voucher | Private |

### 🛒 Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place a new delivery or takeaway order | Public / User |
| `GET` | `/api/orders/my-orders` | Fetch orders placed by authenticated user | Private |
| `GET` | `/api/orders` | Fetch all orders | Admin |
| `PUT` | `/api/orders/:id/status` | Update dispatch status (Preparing, Delivered) | Admin |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: Local MongoDB instance running on port 27017 (not required; the backend automatically falls back to `data/local_db.json` if offline).

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/dabba-restaurant-app.git

# Navigate into the project folder
cd dabba-restaurant-app/restaurant-project

# Install client and server dependencies
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in `restaurant-project/` (or duplicate `.env.example`):
```bash
cp .env.example .env
```

Default settings:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dabba_restaurant
JWT_SECRET=dabba_super_secret_jwt_signature_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Run Development Servers
Start both backend API and Vite frontend simultaneously:
```bash
# Terminal 1: Start Backend API (Port 5000)
node server/server.js

# Terminal 2: Start Vite Client (Port 5173)
npm run dev:client
```

Open your browser and navigate to:
```
http://localhost:5173
```

### 5. Build for Production
To generate an optimized client production bundle:
```bash
npm run build
npm start
```

---

## 🔑 Test Credentials

The database is pre-seeded with ready-to-test administrative and customer accounts:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **👑 Store Administrator** | `admin@dabba.com` | `admin123` | Full Admin Dashboard, Menu CRUD, Order Dispatches |
| **👤 VIP Customer** | `user@dabba.com` | `password123` | Table Reservations, Orders, Order History, Cart |

**Discount Promo Code**: Use **`DABBA50`** at checkout to receive an instant ₹50 discount.

---

## 🛠️ Technology Stack

- **Client Runtime**: React 18, React DOM, Vite 8
- **Routing**: React Router DOM v6
- **Styling & FX**: Tailwind CSS v4, Custom CSS3 Keyframe Physics, Canvas Glassmorphism
- **Iconography**: Lucide React
- **HTTP Client**: Axios (with authorization interceptors)
- **Backend Framework**: Express.js (ESM modules)
- **Security**: JSON Web Tokens (jsonwebtoken), BCrypt.js password hashing
- **Data Persistence**: Mongoose 8 + Resilient File-Backed Local JSON Store (`local_db.json`)
- **File Uploads**: Multer multi-part form parser

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute for educational and commercial applications.

---

<div align="center">
  Crafted with ❤️ by the <strong>Dabba Culinary Engineering Team</strong> • Where Every Bite Tells a Masterpiece Story.
</div>
