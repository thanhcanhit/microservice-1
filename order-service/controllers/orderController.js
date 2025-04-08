const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const productService = require('../services/productService');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (would require auth in a real app)
const getOrders = asyncHandler(async (req, res) => {
  // In a real app, you would filter orders by the authenticated user
  // For now, we'll just return all orders
  const orders = await Order.find({});
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (would require auth in a real app)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  res.status(200).json(order);
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (would require auth in a real app)
const createOrder = asyncHandler(async (req, res) => {
  const { 
    customerId, 
    items, 
    shippingAddress, 
    paymentMethod,
    notes 
  } = req.body;

  // Validate required fields
  if (!customerId || !items || items.length === 0 || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Check if products are in stock
    await productService.checkProductsStock(items);
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await productService.getProductById(item.productId);
      
      orderItems.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
      
      totalAmount += product.price * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      customerId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes: notes || ''
    });
    
    // Update product inventory
    await productService.updateProductInventory(items);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (would require auth in a real app)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    res.status(400);
    throw new Error('Please provide a status');
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Prevent cancellation of already shipped or delivered orders
  if (status === 'cancelled' && ['shipped', 'delivered'].includes(order.status)) {
    res.status(400);
    throw new Error(`Cannot cancel an order that is already ${order.status}`);
  }
  
  order.status = status;
  
  const updatedOrder = await order.save();
  
  res.status(200).json(updatedOrder);
});

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private (would require auth in a real app)
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  
  if (!paymentStatus) {
    res.status(400);
    throw new Error('Please provide a payment status');
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.paymentStatus = paymentStatus;
  
  const updatedOrder = await order.save();
  
  res.status(200).json(updatedOrder);
});

// @desc    Cancel an order
// @route   DELETE /api/orders/:id
// @access  Private (would require auth in a real app)
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Prevent cancellation of already shipped or delivered orders
  if (['shipped', 'delivered'].includes(order.status)) {
    res.status(400);
    throw new Error(`Cannot cancel an order that is already ${order.status}`);
  }
  
  order.status = 'cancelled';
  
  await order.save();
  
  res.status(200).json({ id: req.params.id, status: 'cancelled' });
});

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
};
