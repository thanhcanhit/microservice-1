# Customer Service

A microservice for managing customer information including name, address, contact information, etc.

## Features

- CRUD operations for customers
- Address management (add, update, delete addresses)
- MongoDB database integration
- Docker and Docker Compose setup
- RESTful API endpoints

## API Endpoints

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a specific customer
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer
- `POST /api/customers/:id/addresses` - Add a new address to a customer
- `PUT /api/customers/:id/addresses/:addressId` - Update a customer's address
- `DELETE /api/customers/:id/addresses/:addressId` - Delete a customer's address

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose

### Running with Docker

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. The API will be available at http://localhost:5002

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

## Customer Model

```javascript
{
  firstName: String,      // Customer's first name
  lastName: String,       // Customer's last name
  email: String,          // Customer's email (unique)
  phone: String,          // Customer's phone number
  addresses: [            // Array of customer addresses
    {
      street: String,     // Street address
      city: String,       // City
      state: String,      // State/Province
      zipCode: String,    // Postal/ZIP code
      country: String,    // Country
      isDefault: Boolean  // Whether this is the default address
    }
  ],
  dateOfBirth: Date,      // Customer's date of birth
  notes: String,          // Additional notes about the customer
  isActive: Boolean       // Whether the customer is active
}
```
