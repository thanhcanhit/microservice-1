# Microservices Frontend

A React frontend application that interacts exclusively with the Kong Gateway to access the Product, Order, and Customer microservices.

## Features

- Product management (create, view, update, delete products)
- Order management (view, update status, cancel orders)
- Customer management (create, view, update, delete customers and their addresses)
- Communicates exclusively with Kong Gateway

## Architecture

This frontend application is designed to work with the following backend services through Kong Gateway:

- **Product Service**: Manages product information
- **Order Service**: Manages order information
- **Customer Service**: Manages customer information
- **Kong Gateway**: Routes API requests to the appropriate microservice

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend microservices and Kong Gateway running

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The application will be available at http://localhost:3000

## API Communication

All API requests are sent to the Kong Gateway (http://localhost:8000), which then routes them to the appropriate microservice:

- Product Service: `/api/products/*`
- Order Service: `/api/orders/*`
- Customer Service: `/api/customers/*`

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm eject`: Ejects from Create React App

## Technologies Used

- React
- React Router
- React Bootstrap
- Axios
- React Toastify
