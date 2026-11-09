// api/config.js
import axios from 'axios';

// ========== PRODUCTION-READY API CONFIGURATION ==========

const getApiUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.REACT_APP_API_URL || 'https://scentia-api.onrender.com';
    }
    // Development: Use localhost
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

// Base API URL
const API_URL = getApiUrl();

console.log(`🌐 API running in ${process.env.NODE_ENV || 'development'} mode: ${API_URL}`);

// ========== AXIOS INSTANCE CREATION ==========
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout for slow connections
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for CORS and cookies
});

// ========== REQUEST INTERCEPTOR (Add Token) ==========
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            // Try both header formats for maximum compatibility
            config.headers['x-auth-token'] = token; // For your auth middleware
            config.headers['Authorization'] = `Bearer ${token}`; // Alternative format
        }
        
        // Log request in development (optional, remove in production for performance)
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// ========== RESPONSE INTERCEPTOR (Handle Errors Globally) ==========
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📥 Response from ${response.config.url}:`, response.status);
        }
        return response;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            console.error(`❌ API Error ${status}:`, data?.message || data?.msg || error.message);
            
            // Handle authentication errors
            if (status === 401) {
                console.warn('⚠️ Authentication failed. Token may be expired.');
                
                // Clear invalid token if it's an auth error (optional)
                // Only clear if it's NOT the login endpoint to avoid logout loop
                if (!error.config.url?.includes('/auth/login') && 
                    !error.config.url?.includes('/auth/signup')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    
                    // Optional: Redirect to login page
                    // window.location.href = '/login';
                }
            }
            
            // Handle server errors
            if (status >= 500) {
                console.error('🔥 Server error. Please try again later.');
            }
            
        } else if (error.request) {
            // Request was made but no response received
            console.error('🌐 Network error - No response from server. Check your connection.');
            
            // Add user-friendly message for network errors
            error.userMessage = 'Unable to connect to server. Please check your internet connection.';
            
        } else {
            // Something else happened
            console.error('💥 Request error:', error.message);
            error.userMessage = 'An unexpected error occurred. Please try again.';
        }
        
        // Add a user-friendly message to the error object
        if (!error.userMessage) {
            error.userMessage = error.response?.data?.message || 
                               error.response?.data?.msg || 
                               'Something went wrong. Please try again.';
        }
        
        return Promise.reject(error);
    }
);

// ========== HELPER FUNCTIONS ==========

// Function to check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Optional: Check token expiration
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return true; // If can't decode, assume valid
    }
};

// Function to get auth headers separately (if needed)
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'x-auth-token': token,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
};

// Function to clear authentication data
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('savedCheckoutInfo');
};

// Function to set authentication data after login/signup
export const setAuth = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
};

// ========== SPECIFIC API CALLS (Optional) ==========

// Auth API calls
export const authAPI = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    signup: (userData) => api.post('/api/auth/signup', userData),
    getCurrentUser: () => api.get('/api/auth/me'),
    syncCart: (cartItems) => api.post('/api/auth/sync-cart', { cartItems }),
    getCart: () => api.get('/api/auth/get-cart'),
    logout: () => {
        clearAuth();
        return Promise.resolve();
    }
};

// Order API calls
export const orderAPI = {
    createOrder: (orderData) => api.post('/api/orders', orderData),
    getMyOrders: () => api.get('/api/orders/my-orders'),
    getOrderById: (orderId) => api.get(`/api/orders/${orderId}`)
};

// Payment API calls
export const paymentAPI = {
    initiatePayment: (paymentData) => api.post('/api/payment/initiate-payfast', paymentData),
    uploadPaymentProof: (formData) => api.post('/api/payment/upload-payment-proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    checkPaymentStatus: (orderId) => api.get(`/api/payment/check-payment-status/${orderId}`)
};

// Product API calls
export const productAPI = {
    getProducts: () => api.get('/api/products'),
    getProductById: (id) => api.get(`/api/products/${id}`)
};

// ========== DEFAULT EXPORT ==========
export default api;
