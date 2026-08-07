import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/cart');
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, message: 'Please login to add items to cart' };
    try {
      const res = await API.post('/cart', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        return { success: true, message: 'Added to cart' };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error adding to cart' };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await API.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await API.delete(`/cart/${itemId}`);
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear');
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>

  );
};

export const useCart = () => useContext(CartContext);
