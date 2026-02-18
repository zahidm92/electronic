# Electronic Shop Microservices

A cloud-native microservices application for an electronics e-commerce store. Built with Go, Python, Node.js (Next.js), gRPC, and Docker.

## Architecture

This project follows a microservices architecture similar to Google's Online Boutique.
- **Frontend**: Next.js (Node.js)
- **Product Service**: Go (gRPC)
- **Cart Service**: Go (gRPC) + Redis
- **Currency Service**: Python (gRPC)
- **Communication**: gRPC for inter-service communication.

## Prerequisites

- Docker & Docker Compose
- (Optional) Kubernetes cluster (Minikube/Kind)

## Quick Start (Local Development)

1.  **Clone and Build**:
    ```bash
    git clone https://github.com/zahidm92/electronic-shop-microservices.git
    cd electronic-shop-microservices
    docker-compose up --build
    ```

2.  **Access the Application**:
    - Frontend: http://localhost:3000

## Development

### Generating Protobufs
If you change the API definitions in `pb/microservices.proto`, regenerate the code:

```bash
make all-proto
```
(Requires Docker)

### Directory Structure
- `src/`: Backend microservices
- `frontend/`: Next.js frontend application
- `pb/`: Shared Protocol Buffers definitions
- `deployments/`: Kubernetes manifests

## Services

| Service | Language | Description | Port |
| :--- | :--- | :--- | :--- |
| **frontend** | TypeScript (Next.js) | Web frontend and API Gateway | 3000 |
| **product-service** | Go | Product catalog | 3550 |
| **cart-service** | Go | Shopping cart (Redis) | 7070 |
| **currency-service** | Python | Currency conversion | 7000 |
