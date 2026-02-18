import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = process.env.PROTO_PATH || path.join(process.cwd(), '../pb/microservices.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// @ts-ignore
const hipstershop = protoDescriptor.hipstershop;

const PRODUCT_SERVICE_ADDR = process.env.PRODUCT_SERVICE_ADDR || 'localhost:3550';
const CART_SERVICE_ADDR = process.env.CART_SERVICE_ADDR || 'localhost:7070';
const CURRENCY_SERVICE_ADDR = process.env.CURRENCY_SERVICE_ADDR || 'localhost:7000';
const CHECKOUT_SERVICE_ADDR = process.env.CHECKOUT_SERVICE_ADDR || 'localhost:5050';
const AD_SERVICE_ADDR = process.env.AD_SERVICE_ADDR || 'localhost:9555';
const RECOMMENDATION_SERVICE_ADDR = process.env.RECOMMENDATION_SERVICE_ADDR || 'localhost:8080';

// @ts-ignore
export const productCatalogService = new hipstershop.ProductCatalogService(
    PRODUCT_SERVICE_ADDR,
    grpc.credentials.createInsecure()
);

// @ts-ignore
export const cartService = new hipstershop.CartService(
    CART_SERVICE_ADDR,
    grpc.credentials.createInsecure()
);

// @ts-ignore
export const currencyService = new hipstershop.CurrencyService(
    CURRENCY_SERVICE_ADDR,
    grpc.credentials.createInsecure()
);

// @ts-ignore
export const checkoutService = new hipstershop.CheckoutService(
    CHECKOUT_SERVICE_ADDR,
    grpc.credentials.createInsecure()
);

// @ts-ignore
export const adService = new hipstershop.AdService(
    AD_SERVICE_ADDR,
    grpc.credentials.createInsecure()
);

// @ts-ignore
export const recommendationService = new hipstershop.RecommendationService(
    RECOMMENDATION_SERVICE_ADDR,
    grpc.credentials.createInsecure()
);
