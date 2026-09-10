import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token: authToken } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dabba_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dabba_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (item, qty = 1) => {
    const activeToken = authToken || localStorage.getItem('dabba_token') || localStorage.getItem('token');
    if (!isAuthenticated && !activeToken) {
      showNotification('Please log in to add items to your cart!', 'info');
      return;
    }
    const itemId = item._id || item.id;
    setCartItems((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === itemId);
      if (existing) {
        return prev.map((i) =>
          (i._id || i.id) === itemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          _id: itemId,
          id: itemId,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          quantity: qty
        }
      ];
    });
    showNotification(`Added "${item.name}" to your order!`);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
    showNotification('Item removed from cart', 'info');
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        (i._id || i.id) === itemId ? { ...i, quantity: newQty } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('dabba_cart');
    } catch {}
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculations (INR)
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2)); // 5% GST
  const freeDeliveryThreshold = 499;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 49;
  const grandTotal = Number((subtotal + tax + deliveryFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        toast,
        totalCount,
        subtotal: Number(subtotal.toFixed(2)),
        tax,
        freeDeliveryThreshold,
        deliveryFee,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        showNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
