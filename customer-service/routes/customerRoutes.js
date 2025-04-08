const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/customerController');

// Get all customers and create a new customer
router.route('/')
  .get(getCustomers)
  .post(createCustomer);

// Get, update and delete a customer by ID
router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

// Add a new address to a customer
router.route('/:id/addresses')
  .post(addAddress);

// Update and delete a specific address
router.route('/:id/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

module.exports = router;
