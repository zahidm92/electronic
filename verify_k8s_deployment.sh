#!/bin/bash
set -e

echo "Starting port-forward..."
kubectl port-forward svc/frontend 8080:80 > /dev/null 2>&1 &
PF_PID=$!

echo "Waiting for port-forward to be ready..."
sleep 5

echo "Testing frontend access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "SUCCESS: Frontend accessible (200 OK)"
else
    echo "FAILURE: Frontend check failed (HTTP $HTTP_CODE)"
fi

echo "Testing image access..."
IMG_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/static/img/products/typewriter.jpg)
if [ "$IMG_CODE" -eq 200 ]; then
    echo "SUCCESS: Image accessible (200 OK)"
else
    echo "FAILURE: Image check failed (HTTP $IMG_CODE)"
fi

echo "Cleaning up..."
kill $PF_PID
