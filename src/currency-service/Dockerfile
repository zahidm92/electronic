FROM python:3.11-slim

WORKDIR /app

COPY src/currency-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy pb files
COPY pb/ /pb/
# Regenerate protobuf code to ensure version compatibility
RUN python -m grpc_tools.protoc -I/pb --python_out=/pb --grpc_python_out=/pb /pb/microservices.proto

# Adjust python path to include /pb
ENV PYTHONPATH=/pb

COPY src/currency-service/ .

EXPOSE 7000
CMD ["python", "server.py"]
