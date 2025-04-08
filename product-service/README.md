# Product Service

A microservice for managing product information including name, price, description, inventory, etc.

## Features

- CRUD operations for products
- MongoDB database integration
- Docker and Docker Compose setup
- RESTful API endpoints

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose

### Running with Docker

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. The API will be available at http://localhost:5000

### Running Locally (without Docker)

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file based on the provided example
   - Update the MongoDB connection string if needed

3. Start the server:
   ```
   npm run dev
   ```

## Product Model

```javascript
{
  name: String,         // Product name
  description: String,  // Product description
  price: Number,        // Product price
  inventory: Number,    // Available inventory
  category: String,     // Product category
  imageUrl: String,     // URL to product image
  isActive: Boolean     // Whether the product is active
}
```
