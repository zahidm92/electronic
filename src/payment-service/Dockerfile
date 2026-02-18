FROM golang:1.24-alpine as builder
WORKDIR /src
COPY pb/go.mod pb/go.sum* ./pb/
COPY src/payment-service/go.mod ./src/payment-service/
WORKDIR /src/src/payment-service
RUN go mod download || true
COPY pb/ ../../pb/
COPY src/payment-service/ .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /payment-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /payment-service /app/payment-service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 50051
CMD ["/app/payment-service"]
