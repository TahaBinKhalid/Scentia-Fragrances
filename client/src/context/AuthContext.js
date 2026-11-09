import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // 1. Added this import
import { clearCart } from '../redux/cartSlice'; // 2. Added this import

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch(); // 3. Initialized dispatch here

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    // 4. Clean up everything on logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart'); 
    
    dispatch(clearCart()); // 5. Now 'dispatch' is defined and will work!
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};