#!/bin/bash

# Wait for Kong to be ready
echo "Waiting for Kong to be ready..."
until curl -s http://kong:8001/status > /dev/null; do
  sleep 5
done

echo "Kong is ready. Setting up services and routes..."

# Create Product Service
curl -s -X POST http://kong:8001/services \
  --data name=product-service \
  --data url=http://product-service:5000

# Create Product Service Routes
curl -s -X POST http://kong:8001/services/product-service/routes \
  --data name=product-service-route \
  --data paths=/api/products \
  --data strip_path=false

# Create Order Service
curl -s -X POST http://kong:8001/services \
  --data name=order-service \
  --data url=http://order-service:5001

# Create Order Service Routes
curl -s -X POST http://kong:8001/services/order-service/routes \
  --data name=order-service-route \
  --data paths=/api/orders \
  --data strip_path=false

# Create Customer Service
curl -s -X POST http://kong:8001/services \
  --data name=customer-service \
  --data url=http://customer-service:5002

# Create Customer Service Routes
curl -s -X POST http://kong:8001/services/customer-service/routes \
  --data name=customer-service-route \
  --data paths=/api/customers \
  --data strip_path=false

# Create health check routes
curl -s -X POST http://kong:8001/services/product-service/routes \
  --data name=product-health-route \
  --data paths=/health/products \
  --data strip_path=true

curl -s -X POST http://kong:8001/services/order-service/routes \
  --data name=order-health-route \
  --data paths=/health/orders \
  --data strip_path=true

curl -s -X POST http://kong:8001/services/customer-service/routes \
  --data name=customer-health-route \
  --data paths=/health/customers \
  --data strip_path=true

echo "Kong setup completed!"
