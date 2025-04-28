import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      try {
        // Clear existing cart data to ensure we're using the new format with cartItemId
        localStorage.removeItem('cart');

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Generate a unique cart item ID
  const generateCartItemId = (item) => {
    // Create a unique identifier using product ID and other relevant attributes
    // This ensures that products with the same ID but different attributes are treated as different items
    // Adding a timestamp to ensure each addition is unique
    return `${item._id}-${item.seller?.id || 'unknown'}-${item.condition || 'standard'}-${Date.now()}`;
  };

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Always create a new cart item with a unique cartItemId
      const cartItem = {
        ...item,
        cartItemId: generateCartItemId(item),
        quantity: 1
      };

      // Always add as a new item
      toast.success(`${item.title} added to your cart`);
      return [...prevItems, cartItem];
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.cartItemId !== cartItemId);
      toast.info('Item removed from cart');
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
      return updatedItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
