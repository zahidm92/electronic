FROM golang:1.24-alpine as builder

WORKDIR /src

# Copy go.mod and go.sum files
COPY pb/go.mod pb/go.sum ./pb/
COPY src/cart-service/go.mod src/cart-service/go.sum ./src/cart-service/

WORKDIR /src/src/cart-service
RUN go mod download

# Copy source code
COPY pb/ ../../pb/
COPY src/cart-service/ .

# Build
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /cart-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /cart-service /app/cart-service

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 7070
CMD ["/app/cart-service"]
