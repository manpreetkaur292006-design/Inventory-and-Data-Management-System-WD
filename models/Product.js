const mongoose = require('mongoose');

// The schema is the blueprint of one product
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes extra spaces at the start and end
      minlength: [2, 'Name must be at least 2 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true, // no two products can share a SKU
      uppercase: true, // "fur-tb-1" is saved as "FUR-TB-1"
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      default: 0, // used when quantity is not sent
      min: [0, 'Quantity cannot be negative'],
    },
    reorderLevel: {
      type: Number,
      default: 10, // at or below this number = low stock
      min: [0, 'Reorder level cannot be negative'],
    },
    supplier: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: { virtuals: true }, // shows virtual fields in the response
  }
);

// Virtual field: price x quantity, calculated whenever the product is read
// (we use a normal function so that "this" means the product)
productSchema.virtual('stockValue').get(function () {
  return this.price * this.quantity;
});

module.exports = mongoose.model('Product', productSchema);