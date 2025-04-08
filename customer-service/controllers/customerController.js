const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (would require auth in a real app)
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({});
  res.status(200).json(customers);
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private (would require auth in a real app)
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  
  res.status(200).json(customer);
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private (would require auth in a real app)
const createCustomer = asyncHandler(async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    addresses,
    dateOfBirth,
    notes
  } = req.body;

  // Check if customer with this email already exists
  const customerExists = await Customer.findOne({ email });

  if (customerExists) {
    res.status(400);
    throw new Error('Customer with this email already exists');
  }

  // Validate required fields
  if (!firstName || !lastName || !email || !phone) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create customer
  const customer = await Customer.create({
    firstName,
    lastName,
    email,
    phone,
    addresses: addresses || [],
    dateOfBirth: dateOfBirth || null,
    notes: notes || ''
  });
  
  res.status(201).json(customer);
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private (would require auth in a real app)
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // If email is being updated, check if it's already in use
  if (req.body.email && req.body.email !== customer.email) {
    const emailExists = await Customer.findOne({ email: req.body.email });
    
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedCustomer);
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private (would require auth in a real app)
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // In a real application, you might want to soft delete instead
  // customer.isActive = false;
  // await customer.save();
  
  await Customer.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
});

// @desc    Add address to customer
// @route   POST /api/customers/:id/addresses
// @access  Private (would require auth in a real app)
const addAddress = asyncHandler(async (req, res) => {
  const { 
    street, 
    city, 
    state, 
    zipCode, 
    country,
    isDefault
  } = req.body;

  // Validate required fields
  if (!street || !city || !state || !zipCode || !country) {
    res.status(400);
    throw new Error('Please provide all required address fields');
  }

  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const newAddress = {
    street,
    city,
    state,
    zipCode,
    country,
    isDefault: isDefault || false
  };

  // If this is the default address, update other addresses
  if (newAddress.isDefault) {
    customer.addresses.forEach(address => {
      address.isDefault = false;
    });
  }

  customer.addresses.push(newAddress);
  await customer.save();

  res.status(201).json(customer);
});

// @desc    Update customer address
// @route   PUT /api/customers/:id/addresses/:addressId
// @access  Private (would require auth in a real app)
const updateAddress = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const addressIndex = customer.addresses.findIndex(
    address => address._id.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Update address fields
  Object.keys(req.body).forEach(key => {
    customer.addresses[addressIndex][key] = req.body[key];
  });

  // If this address is being set as default, update other addresses
  if (req.body.isDefault) {
    customer.addresses.forEach((address, index) => {
      if (index !== addressIndex) {
        address.isDefault = false;
      }
    });
  }

  await customer.save();

  res.status(200).json(customer);
});

// @desc    Delete customer address
// @route   DELETE /api/customers/:id/addresses/:addressId
// @access  Private (would require auth in a real app)
const deleteAddress = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const addressIndex = customer.addresses.findIndex(
    address => address._id.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Remove the address
  customer.addresses.splice(addressIndex, 1);
  await customer.save();

  res.status(200).json(customer);
});

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addAddress,
  updateAddress,
  deleteAddress
};
