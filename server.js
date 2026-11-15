require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// lets Express read JSON sent from Postman
app.use(express.json());

// a simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Inventory API is running' });
});

// all product APIs start with /api/products
app.use('/api/products', productRoutes);

// if no route matched, send a 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// the error handler must be the LAST middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// connect to MongoDB first, then starting the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log('Database connection failed:', error.message);
  });