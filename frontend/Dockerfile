FROM node:22-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy pb files
COPY pb/ ../pb/

COPY frontend/ .

# Rebuild if needed or usage of next build
RUN npm run build

EXPOSE 3000

ENV PROTO_PATH=../pb/microservices.proto
ENV PORT=3000

CMD ["npm", "start"]
