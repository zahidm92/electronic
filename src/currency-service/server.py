import os
import sys
import json
import logging
from concurrent import futures
import grpc

# Add pb directory to path to import generated code
sys.path.append('../../pb')
import microservices_pb2
import microservices_pb2_grpc

logger = logging.getLogger('currency_service')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
logger.addHandler(handler)

PORT = os.environ.get('PORT', '7000')

class CurrencyService(microservices_pb2_grpc.CurrencyServiceServicer):
    def __init__(self):
        self._rates = self._load_rates()

    def _load_rates(self):
        try:
            with open('data/currency_conversion.json', 'r') as f:
                data = json.load(f)
                return data
        except Exception as e:
            logger.error(f"Failed to load rates: {e}")
            return {}

    def GetSupportedCurrencies(self, request, context):
        logger.info("GetSupportedCurrencies called")
        return microservices_pb2.GetSupportedCurrenciesResponse(
            currency_codes=list(self._rates.keys())
        )

    def Convert(self, request, context):
        logger.info(f"Convert called: {request}")
        from_code = request.from_.currency_code
        to_code = request.to_code
        
        if from_code not in self._rates or to_code not in self._rates:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details(f"Currency not supported: {from_code} -> {to_code}")
            return microservices_pb2.Money()

        rate_from = self._rates[from_code]
        rate_to = self._rates[to_code]
        
        # Convert to USD then to target
        # units + nanos/1e9
        total_from = request.from_.units + (request.from_.nanos / 1e9)
        total_usd = total_from / rate_from
        total_target = total_usd * rate_to

        units = int(total_target)
        nanos = int((total_target - units) * 1e9)

        return microservices_pb2.Money(
            currency_code=to_code,
            units=units,
            nanos=nanos
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    microservices_pb2_grpc.add_CurrencyServiceServicer_to_server(CurrencyService(), server)
    server.add_insecure_port(f'[::]:{PORT}')
    logger.info(f"CurrencyService listening on port {PORT}")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
