const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Ensure path is correct

dotenv.config();

const products = [
  {
    name: "Oud Imperial",
    price: 250,
    category: "Woody",
    description: "A deep, majestic blend of Cambodian Oud.",
    notes: ["Oud", "Saffron", "Leather"],
    image: "/images/oud-imperial.png",
    stock: 15,
    isFeatured: true
  },
  {
    name: "Midnight Rose",
    price: 180,
    category: "Floral",
    description: "Enchanting evening fragrance with Damask rose.",
    notes: ["Rose", "Vanilla", "Amber"],
    image: "public/images/logo192.png",
    stock: 25
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany(); // Clears current products to avoid duplicates
    await Product.insertMany(products);
    console.log("✅ Scentia Products Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();