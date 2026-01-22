// client/src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart items from localStorage on initial load
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cartItems');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        // CRITICAL FIX: Ensure price and qty are numbers when loaded from localStorage
        return parsedCart.map(item => ({
          ...item,
          price: Number(item.price), // Convert price to number
          qty: Number(item.qty)      // Convert qty to number
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage:", error);
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    // Ensure product.price and qty are numbers when adding to cart
    const numericPrice = Number(product.price);
    const numericQty = Number(qty);

    if (isNaN(numericPrice) || isNaN(numericQty)) {
        console.error("Attempted to add item with non-numeric price or quantity:", product, qty);
        toast.error("Error adding item to cart. Invalid price or quantity.");
        return;
    }

    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: x.qty + numericQty } : x
        )
      );
    } else {
      setCartItems([...cartItems, {
        product: product._id, // Assuming product._id is the unique identifier
        name: product.name,
        image: product.image,
        price: numericPrice, // Store as number
        qty: numericQty,     // Store as number
      }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((x) => x.product !== productId));
  };

  const updateCartQuantity = (productId, newQty) => {
    const numericNewQty = Number(newQty); // Ensure newQty is a number

    if (isNaN(numericNewQty)) {
        console.error("Attempted to update quantity with non-numeric value:", newQty);
        return;
    }

    if (numericNewQty < 1) {
        removeFromCart(productId); // Remove if quantity goes to 0 or less
        return;
    }

    setCartItems(
      cartItems.map((x) =>
        x.product === productId ? { ...x, qty: numericNewQty } : x
      )
    );
  };

  // Define clearCart function
  const clearCart = () => { // <--- ADDED THIS FUNCTION
    setCartItems([]);
    localStorage.removeItem('cartItems'); // Also clear from local storage
    toast.info("Cart cleared!");
  };

  // Calculate totals directly in context for easier access
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart, // <--- EXPOSE clearCart HERE
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);