#!/bin/bash
set -e

echo "Building product-service..."
docker build -t electronic-shop-microservices-product-service:test -f src/product-service/Dockerfile .

echo "Building frontend..."
docker build -t electronic-shop-microservices-frontend:test -f frontend/Dockerfile .

echo "Creating network..."
docker network create eshop-test-net || true

echo "Starting product-service..."
docker run -d --rm --name product-service --network eshop-test-net -p 3550:3550 electronic-shop-microservices-product-service:test

echo "Starting frontend..."
docker run -d --rm --name frontend --network eshop-test-net \
  -e PORT=3000 \
  -e PRODUCT_SERVICE_ADDR=product-service:3550 \
  -e CURRENCY_SERVICE_ADDR=currency-service:7000 \
  -e CART_SERVICE_ADDR=cart-service:7070 \
  -e RECOMMENDATION_SERVICE_ADDR=recommendation-service:8080 \
  -e CHECKOUT_SERVICE_ADDR=checkout-service:5050 \
  -e AD_SERVICE_ADDR=ad-service:9555 \
  -p 3000:3000 \
  electronic-shop-microservices-frontend:test

echo "Waiting for services to start..."
sleep 10

echo "Testing image availability..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/img/products/typewriter.jpg)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "SUCCESS: Image found (200 OK)"
else
    echo "FAILURE: Image not found (HTTP $HTTP_CODE)"
fi

echo "Cleaning up..."
docker stop frontend product-service
docker network rm eshop-test-net
