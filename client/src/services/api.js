import axios from 'axios';

// Vercel will inject the production URL during build. 
// If it's not found (like on your local machine), it falls back to localhost.
const BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://127.0.0.1:5000/api';

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');

  if (token && token !== 'null') {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// --- Product Endpoints ---

// Get all products for the Shop page
export const fetchProducts = () => API.get('/products');

// Get a single product by ID (Used in ProductDetail.js)
export const fetchProductById = (id) => API.get(`/products/${id}`);

// Get related products
export const fetchRelatedProducts = (category, currentProductId) =>
  API.get(`/products`, {
    params: {
      category: category,
      exclude: currentProductId
    }
  });

// --- Order Endpoints ---
export const createOrder = (orderData) => API.post('/orders', orderData);

export default API;