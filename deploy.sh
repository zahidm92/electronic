#!/bin/bash
echo "Deploying Electronic Shop Microservices to Kubernetes..."

kubectl apply -f kubernetes/redis.yaml
kubectl apply -f kubernetes/email-service.yaml
kubectl apply -f kubernetes/product-service.yaml
kubectl apply -f kubernetes/cart-service.yaml
kubectl apply -f kubernetes/currency-service.yaml
kubectl apply -f kubernetes/shipping-service.yaml
kubectl apply -f kubernetes/payment-service.yaml
kubectl apply -f kubernetes/checkout-service.yaml
kubectl apply -f kubernetes/ad-service.yaml
kubectl apply -f kubernetes/recommendation-service.yaml
kubectl apply -f kubernetes/frontend.yaml

echo "Deployment complete. Check status with: kubectl get pods"
