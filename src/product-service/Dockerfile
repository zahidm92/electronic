FROM golang:1.24-alpine as builder

WORKDIR /src

# Copy go.mod and go.sum files
COPY pb/go.mod pb/go.sum ./pb/
COPY src/product-service/go.mod src/product-service/go.sum ./src/product-service/

WORKDIR /src/src/product-service
RUN go mod download

# Copy source code
COPY pb/ ../../pb/
COPY src/product-service/ .

# Build
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /product-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /product-service /app/product-service
COPY src/product-service/products.json /app/products.json

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3550
CMD ["/app/product-service"]
