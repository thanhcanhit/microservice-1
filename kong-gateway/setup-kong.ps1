# Wait for Kong to be ready
Write-Host "Waiting for Kong to be ready..."
$ready = $false
while (-not $ready) {
    try {
        $response = Invoke-WebRequest -Uri "http://kong:8001/status" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        Write-Host "Kong is not ready yet. Waiting..."
        Start-Sleep -Seconds 5
    }
}

Write-Host "Kong is ready. Setting up services and routes..."

# Create Product Service
Invoke-WebRequest -Uri "http://kong:8001/services" -Method POST -Body @{
    name = "product-service"
    url = "http://product-service:5000"
} -UseBasicParsing

# Create Product Service Routes
Invoke-WebRequest -Uri "http://kong:8001/services/product-service/routes" -Method POST -Body @{
    name = "product-service-route"
    paths = "/api/products"
    strip_path = "false"
} -UseBasicParsing

# Create Order Service
Invoke-WebRequest -Uri "http://kong:8001/services" -Method POST -Body @{
    name = "order-service"
    url = "http://order-service:5001"
} -UseBasicParsing

# Create Order Service Routes
Invoke-WebRequest -Uri "http://kong:8001/services/order-service/routes" -Method POST -Body @{
    name = "order-service-route"
    paths = "/api/orders"
    strip_path = "false"
} -UseBasicParsing

# Create Customer Service
Invoke-WebRequest -Uri "http://kong:8001/services" -Method POST -Body @{
    name = "customer-service"
    url = "http://customer-service:5002"
} -UseBasicParsing

# Create Customer Service Routes
Invoke-WebRequest -Uri "http://kong:8001/services/customer-service/routes" -Method POST -Body @{
    name = "customer-service-route"
    paths = "/api/customers"
    strip_path = "false"
} -UseBasicParsing

# Create health check routes
Invoke-WebRequest -Uri "http://kong:8001/services/product-service/routes" -Method POST -Body @{
    name = "product-health-route"
    paths = "/health/products"
    strip_path = "true"
} -UseBasicParsing

Invoke-WebRequest -Uri "http://kong:8001/services/order-service/routes" -Method POST -Body @{
    name = "order-health-route"
    paths = "/health/orders"
    strip_path = "true"
} -UseBasicParsing

Invoke-WebRequest -Uri "http://kong:8001/services/customer-service/routes" -Method POST -Body @{
    name = "customer-health-route"
    paths = "/health/customers"
    strip_path = "true"
} -UseBasicParsing

Write-Host "Kong setup completed!"
