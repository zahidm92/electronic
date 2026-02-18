FROM golang:1.24-alpine as builder
WORKDIR /src
COPY pb/go.mod pb/go.sum* ./pb/
COPY src/checkout-service/go.mod ./src/checkout-service/
WORKDIR /src/src/checkout-service
RUN go mod download || true
COPY pb/ ../../pb/
COPY src/checkout-service/ .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /checkout-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /checkout-service /app/checkout-service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 5050
CMD ["/app/checkout-service"]
