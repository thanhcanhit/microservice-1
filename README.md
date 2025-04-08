# Microservices with Kong Gateway

This project consists of three microservices (Product, Order, and Customer) with Kong Gateway for routing.

## Architecture

- **Product Service**: Manages product information (name, price, description, inventory)
- **Order Service**: Manages orders (create, view, cancel orders)
- **Customer Service**: Manages customer information (name, address, contact info)
- **Kong Gateway**: API Gateway for routing requests to the appropriate microservice

## Services and Ports

- Kong Gateway: http://localhost:8000 (API Gateway)
- Kong Admin API: http://localhost:8001
- Kong Admin GUI: http://localhost:8002
- Product Service: http://localhost:5000
- Order Service: http://localhost:5001
- Customer Service: http://localhost:5002

## API Endpoints through Kong Gateway

- Product Service: http://localhost:8000/api/products
- Order Service: http://localhost:8000/api/orders
- Customer Service: http://localhost:8000/api/customers
- Health Checks:
  - Product Service: http://localhost:8000/health/products
  - Order Service: http://localhost:8000/health/orders
  - Customer Service: http://localhost:8000/health/customers

## Getting Started

1. Start all services:
   ```
   docker-compose up -d
   ```

2. Check if Kong is running:
   ```
   curl http://localhost:8001/status
   ```

3. Test the API endpoints:
   ```
   curl http://localhost:8000/api/products
   curl http://localhost:8000/api/orders
   curl http://localhost:8000/api/customers
   ```

## Stopping the Services

```
docker-compose down
```

## Individual Service Documentation

- [Product Service](./product-service/README.md)
- [Order Service](./order-service/README.md)
- [Customer Service](./customer-service/README.md)
