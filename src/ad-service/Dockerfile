FROM golang:1.24-alpine as builder
WORKDIR /src
COPY pb/go.mod pb/go.sum* ./pb/
COPY src/ad-service/go.mod ./src/ad-service/
WORKDIR /src/src/ad-service
RUN go mod download || true
COPY pb/ ../../pb/
COPY src/ad-service/ .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /ad-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /ad-service /app/ad-service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 9555
CMD ["/app/ad-service"]
