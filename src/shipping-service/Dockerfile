FROM golang:1.24-alpine as builder
WORKDIR /src
COPY pb/go.mod pb/go.sum* ./pb/
COPY src/shipping-service/go.mod ./src/shipping-service/
WORKDIR /src/src/shipping-service
RUN go mod download || true
COPY pb/ ../../pb/
COPY src/shipping-service/ .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /shipping-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /shipping-service /app/shipping-service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 50051
CMD ["/app/shipping-service"]
