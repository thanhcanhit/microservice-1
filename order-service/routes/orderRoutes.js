const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} = require('../controllers/orderController');

// Get all orders and create a new order
router.route('/')
  .get(getOrders)
  .post(createOrder);

// Get order by ID
router.route('/:id')
  .get(getOrderById);

// Update order status
router.route('/:id/status')
  .put(updateOrderStatus);

// Update payment status
router.route('/:id/payment')
  .put(updatePaymentStatus);

// Cancel an order
router.route('/:id')
  .delete(cancelOrder);

module.exports = router;
