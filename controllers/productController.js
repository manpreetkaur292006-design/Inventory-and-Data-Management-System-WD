const Product = require('../models/Product');

// creating a product
// POST /api/products
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// getting one product on the basis of its id
// GET /api/products/:id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};


// updating a product
// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated product
    runValidators: true, // check the schema rules when we do update
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

// deleting a product
// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({ message: 'Product deleted', id: product._id });
};

// getting all the products (filter,sorting,pagination)
// GET /api/products?category=&minPrice=&maxPrice=&search=&sort=&page=&limit=
exports.getAllProducts = async (req, res) => {
  // 1. FILTERING: add a condition only if the user sent it
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category; // exact match : ?category=Furniture
  }

  if (req.query.search) {
    // partial match on the name, ignoring capital or small letters
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // 2. SORTING: "price" = low to high, "-price" = high to low
  const sortBy = req.query.sort || '-createdAt'; // default: newest first

  // 3. PAGINATION
  const page = Math.max(Number(req.query.page) || 1, 1); // default page 1
  const limit = Math.max(Number(req.query.limit) || 10, 1); // default 10 per page
  const skip = (page - 1) * limit; // how many products to jump over

  const products = await Product.find(filter).sort(sortBy).skip(skip).limit(limit);
  const total = await Product.countDocuments(filter); // all matches, not just this page

  res.status(200).json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    count: products.length,
    products,
  });
};


// adjusting the stock (restock or sale)
// PATCH /api/products/:id/stock
// body: { "change": 10 } adds 10, { "change": -3 } removes 3
exports.updateStock = async (req, res) => {
  const change = req.body.change;

  // find the product by its ID
  const filter = { _id: req.params.id };

  // for a sale (negative change), only match if there is enough stock
  // so quantity can never go below zero
  if (change < 0) {
    filter.quantity = { $gte: -change };
  }

  // $inc adds the number directly inside the database
  const product = await Product.findOneAndUpdate(
    filter,
    { $inc: { quantity: change } },
    { new: true }
  );

  // nothing matched: the product does not exist, or there is not enough stock
  if (!product) {
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res
      .status(400)
      .json({ message: `Not enough stock. Available: ${existing.quantity}` });
  }

  res.status(200).json({ message: 'Stock updated', product });
};

// low-stock items (quantity is at or below reorderLevel)
// GET /api/products/low-stock
exports.getLowStockItems = async (req, res) => {
  const lowStockItems = await Product.aggregate([
    // Stage 1: keep products where quantity <= reorderLevel
    { $match: { $expr: { $lte: ['$quantity', '$reorderLevel'] } } },

    // aggregate() returns plain objects, so virtual fields are missing.
    // We add stockValue and id ourselves.
    {
      $addFields: {
        stockValue: { $multiply: ['$price', '$quantity'] },
        id: { $toString: '$_id' },
      },
    },

    // lowest stock first
    { $sort: { quantity: 1 } },
  ]);

  res.status(200).json({ count: lowStockItems.length, lowStockItems });
};

// category-wise inventory summary
// GET /api/products/summary
exports.getCategorySummary = async (req, res) => {
  const summary = await Product.aggregate([
    // one group for each category. _id holds the category name.
    {
      $group: {
        _id: '$category',
        totalItems: { $sum: 1 }, // adds 1 for every product = a count
        totalQuantity: { $sum: '$quantity' },
        totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        avgPrice: { $avg: '$price' },
      },
    },

    // highest stock value first
    { $sort: { totalStockValue: -1 } },
  ]);

  res.status(200).json({ categories: summary.length, summary });
};