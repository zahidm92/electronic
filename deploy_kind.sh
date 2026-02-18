#!/bin/bash
set -e

# Define services and their paths
# Format: "service_name:build_context:dockerfile_path"
SERVICES=(
    "electronic-shop-microservices-product-service:.:src/product-service/Dockerfile"
    "electronic-shop-microservices-frontend:.:frontend/Dockerfile"
    "electronic-shop-microservices-cart-service:.:src/cart-service/Dockerfile"
    "electronic-shop-microservices-currency-service:.:src/currency-service/Dockerfile"
    "electronic-shop-microservices-recommendation-service:.:src/recommendation-service/Dockerfile"
    "electronic-shop-microservices-ad-service:.:src/ad-service/Dockerfile"
    "electronic-shop-microservices-shipping-service:.:src/shipping-service/Dockerfile"
    "electronic-shop-microservices-email-service:.:src/email-service/Dockerfile"
    "electronic-shop-microservices-checkout-service:.:src/checkout-service/Dockerfile"
    "electronic-shop-microservices-payment-service:.:src/payment-service/Dockerfile"
)

echo "Building and Loading images into Kind..."

for entry in "${SERVICES[@]}"; do
    IFS=':' read -r IMAGE_Name BUILD_CONTEXT DOCKERFILE <<< "$entry"
    IMAGE_TAG="${IMAGE_Name}:latest"
    
    echo "Processing $IMAGE_Name..."
    
    # Build image
    docker build -t "$IMAGE_TAG" -f "$DOCKERFILE" "$BUILD_CONTEXT"
    
    # Load into Kind
    kind load docker-image "$IMAGE_TAG"
done

echo "Pulling Redis image..."
docker pull redis:alpine
kind load docker-image redis:alpine

echo "Applying Kubernetes Manifests..."
kubectl apply -f kubernetes/

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod --all --timeout=300s

echo "Deployment complete!"
echo "To access the frontend, run:"
echo "kubectl port-forward svc/frontend 8080:80"
echo "Then open http://localhost:8080"
