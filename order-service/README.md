# Order Service

A microservice for managing orders including creation, viewing, and cancellation of orders.

## Features

- CRUD operations for orders
- Order status management
- Payment status tracking
- Integration with Product Service for inventory management
- MongoDB database integration
- Docker and Docker Compose setup
- RESTful API endpoints

## API Endpoints

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status
- `DELETE /api/orders/:id` - Cancel an order

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Product Service running (for integration)

### Running with Docker

1. Create a Docker network for microservices if it doesn't exist:
   ```
   docker network create microservice-network
   ```

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. The API will be available at http://localhost:5001

### Running Locally (without Docker)

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file based on the provided example
   - Update the MongoDB connection string if needed
   - Set the Product Service URL

3. Start the server:
   ```
   npm run dev
   ```

## Order Model

```javascript
{
  customerId: String,       // ID of the customer
  items: [                  // Array of order items
    {
      productId: String,    // ID of the product
      name: String,         // Name of the product
      quantity: Number,     // Quantity ordered
      price: Number         // Price per unit
    }
  ],
  totalAmount: Number,      // Total order amount
  shippingAddress: {        // Shipping address
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: String,           // Order status (pending, processing, shipped, delivered, cancelled)
  paymentMethod: String,    // Payment method
  paymentStatus: String,    // Payment status (pending, completed, failed, refunded)
  notes: String             // Additional notes
}
```
