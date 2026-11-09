// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'scentia_cart';

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      return {
        items: parsed.items || [],
        totalPrice: parsed.totalPrice || 0,
        totalQuantity: parsed.totalQuantity || 0
      };
    }
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
  return { items: [], totalPrice: 0, totalQuantity: 0 };
};

const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      items: cartState.items,
      totalPrice: cartState.totalPrice,
      totalQuantity: cartState.totalQuantity
    }));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state);
    },

    updateQuantity: (state, action) => {
      const { id, amount } = action.payload;
      const existingItem = state.items.find(item => item._id === id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + amount;
        if (newQuantity >= 1) {
          existingItem.quantity = newQuantity;
        }
      }

      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      saveCartToStorage(state);
    },
    
    // Set cart from database (on login)
    setCartFromDB: (state, action) => {
      state.items = action.payload || [];
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state);
    },
    
    // Refresh cart from localStorage
    refreshCart: (state) => {
      const savedCart = loadCartFromStorage();
      state.items = savedCart.items;
      state.totalPrice = savedCart.totalPrice;
      state.totalQuantity = savedCart.totalQuantity;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  setCartFromDB,
  refreshCart
} = cartSlice.actions;

export default cartSlice.reducer;