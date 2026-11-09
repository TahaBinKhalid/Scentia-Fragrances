import axios from 'axios';

// Ensure this matches your backend port (5000 is standard for Flask/Node)
const API = axios.create({ baseURL: 'http://127.0.0.1:5000/api' });


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
// Note: Ensure your backend uses 'category' and 'exclude' to filter the list
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