const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  customId: Number,
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  notes: { type: [String], required: true }, // top, middle, base notes
  sizes: [{ size: String, inStock: Boolean }],
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Eau de Parfum', 'Eau de Toilette'
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'products');