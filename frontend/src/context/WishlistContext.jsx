import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Wishlist fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please login to add to wishlist' };
    const exists = wishlist.some(w => w.productId === productId);
    try {
      if (exists) {
        await API.delete(`/wishlist/${productId}`);
        setWishlist(prev => prev.filter(w => w.productId !== productId));
        return { success: true, added: false, message: 'Removed from wishlist' };
      } else {
        const res = await API.post('/wishlist', { productId });
        if (res.data.success) {
          fetchWishlist();
          return { success: true, added: true, message: 'Added to wishlist' };
        }
      }
    } catch (err) {
      return { success: false, message: 'Wishlist action failed' };
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(w => w.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isWishlisted, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
