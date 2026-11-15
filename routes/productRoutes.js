const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockItems,
  getCategorySummary,
} = require('../controllers/productController');
const validateStock = require('../middleware/validateStock');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);

router.get('/low-stock', getLowStockItems);
router.get('/summary', getCategorySummary);

router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', validateStock, updateStock);

module.exports = router;