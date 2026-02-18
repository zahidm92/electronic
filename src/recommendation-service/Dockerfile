FROM golang:1.24-alpine as builder
WORKDIR /src
COPY pb/go.mod pb/go.sum* ./pb/
COPY src/recommendation-service/go.mod ./src/recommendation-service/
WORKDIR /src/src/recommendation-service
RUN go mod download || true
COPY pb/ ../../pb/
COPY src/recommendation-service/ .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /recommendation-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /recommendation-service /app/recommendation-service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 8080
CMD ["/app/recommendation-service"]
