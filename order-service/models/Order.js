const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, 'Customer ID is required']
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery']
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
