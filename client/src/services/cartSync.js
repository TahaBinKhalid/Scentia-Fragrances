import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Sync cart to database
export const syncCartToDatabase = async (cartItems) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found, skipping cart sync");
      return false;
    }

    if (!cartItems || cartItems.length === 0) {
      console.log("Cart is empty, skipping sync");
      return false;
    }

    console.log("Syncing cart to database:", cartItems);

    const response = await axios.post(
      `${API_URL}/sync-cart`,
      { cartItems },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log("Cart synced successfully:", response.data);
    return response.data.success;
  } catch (error) {
    console.error("Failed to sync cart:", error.response?.data || error.message);
    return false;
  }
};

// Get cart from database
export const getCartFromDatabase = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await axios.get(
      `${API_URL}/get-cart`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data.cart;
  } catch (error) {
    console.error("Failed to get cart:", error);
    return null;
  }
};