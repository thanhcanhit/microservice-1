const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price cannot be negative']
    },
    inventory: {
      type: Number,
      required: [true, 'Please add inventory count'],
      default: 0,
      min: [0, 'Inventory cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
