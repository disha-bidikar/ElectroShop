import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparedProducts, setComparedProducts] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/api/cart/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      addToast('Please login to add products to your cart', 'error');
      return false;
    }
    try {
      await api.post('/api/cart/add', {
        userId: user.id,
        productId: productId,
        quantity: quantity
      });
      addToast('Added product to your cart! 🛒', 'success');
      fetchCart();
      return true;
    } catch (err) {
      addToast('Failed to add product to cart', 'error');
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/api/cart/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      addToast('Item removed from cart', 'info');
    } catch (err) {
      addToast('Failed to remove item', 'error');
    }
  };

  const toggleCompare = (product) => {
    setComparedProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        addToast(`Removed ${product.name} from comparison`, 'info');
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        addToast('You can compare a maximum of 4 products at once', 'error');
        return prev;
      }
      addToast(`Added ${product.name} to comparison`, 'success');
      return [...prev, product];
    });
  };

  const clearCompare = () => setComparedProducts([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      fetchCart,
      comparedProducts,
      toggleCompare,
      clearCompare
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
