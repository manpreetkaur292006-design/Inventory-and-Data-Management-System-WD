// WARNING : this file is made only for testing purpose on postman
//           this will delete ALL the products in the database, and 
//           then add the 12 sample products. so only use this file for TESTING.

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'Wireless Mouse', sku: 'ELEC-MS-101', category: 'Electronics', price: 799, quantity: 30, reorderLevel: 10, supplier: 'Logitech India' },
  { name: 'Bluetooth Speaker', sku: 'ELEC-SP-102', category: 'Electronics', price: 2499, quantity: 8, reorderLevel: 10, supplier: 'JBL India' },
  { name: 'Laptop', sku: 'ELEC-LP-103', category: 'Electronics', price: 55000, quantity: 5, reorderLevel: 3, supplier: 'HP India' },
  { name: 'USB Keyboard', sku: 'ELEC-KB-104', category: 'Electronics', price: 1299, quantity: 40, reorderLevel: 10, supplier: 'Logitech India' },
  { name: 'Cotton T-Shirt', sku: 'APRL-TS-201', category: 'Apparel', price: 499, quantity: 60, reorderLevel: 20, supplier: 'Fab Textiles' },
  { name: 'Denim Jeans', sku: 'APRL-JN-202', category: 'Apparel', price: 1799, quantity: 18, reorderLevel: 20, supplier: 'Fab Textiles' },
  { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
  { name: 'Office Chair', sku: 'FURN-CH-813', category: 'Furniture', price: 6499, quantity: 12, reorderLevel: 5, supplier: 'IKEA India' },
  { name: 'Gel Pen Pack of 15', sku: 'STNY-PN-713', category: 'Stationery', price: 140, quantity: 60, reorderLevel: 20, supplier: 'Cello Pens' },
  { name: 'A4 Notebook', sku: 'STNY-NB-714', category: 'Stationery', price: 60, quantity: 15, reorderLevel: 20, supplier: 'Classmate' },
  { name: 'Basmati Rice 5kg', sku: 'GROC-RC-301', category: 'Groceries', price: 650, quantity: 50, reorderLevel: 15, supplier: 'India Gate' },
  { name: 'Olive Oil 1L', sku: 'GROC-OL-302', category: 'Groceries', price: 899, quantity: 25, reorderLevel: 10, supplier: 'Figaro' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({}); // removes all old products first
  await Product.insertMany(products); // adds the 12 products
  console.log('12 products added');
  await mongoose.disconnect();
};

seed();