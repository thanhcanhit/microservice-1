const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.status(200).json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private (would require auth in a real app)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, inventory, category, imageUrl } = req.body;

  if (!name || !description || !price || inventory === undefined || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const product = await Product.create({
    name,
    description,
    price,
    inventory,
    category,
    imageUrl: imageUrl || '',
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (would require auth in a real app)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (would require auth in a real app)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
