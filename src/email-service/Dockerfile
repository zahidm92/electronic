FROM golang:1.24-alpine as builder
WORKDIR /src
COPY pb/go.mod pb/go.sum* ./pb/
COPY src/email-service/go.mod ./src/email-service/
WORKDIR /src/src/email-service
RUN go mod download || true
COPY pb/ ../../pb/
COPY src/email-service/ .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /email-service .

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /email-service /app/email-service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 8080
CMD ["/app/email-service"]
