package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"os"

	pb "github.com/zahidm92/electronic-shop/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var (
	port = flag.Int("port", 5050, "The server port")
)

type server struct {
	pb.UnimplementedCheckoutServiceServer
	productServiceAddr  string
	cartServiceAddr     string
	shippingServiceAddr string
	paymentServiceAddr  string
	currencyServiceAddr string
}

func (s *server) PlaceOrder(ctx context.Context, req *pb.PlaceOrderRequest) (*pb.PlaceOrderResponse, error) {
	log.Printf("PlaceOrder called for user %s", req.UserId)

	// 1. Get Cart
	cartConn, err := grpc.Dial(s.cartServiceAddr, grpc.WithInsecure())
	if err != nil {
		return nil, fmt.Errorf("failed to dial cart service: %v", err)
	}
	defer cartConn.Close()
	cartClient := pb.NewCartServiceClient(cartConn)
	cart, err := cartClient.GetCart(ctx, &pb.GetCartRequest{UserId: req.UserId})
	if err != nil {
		return nil, fmt.Errorf("failed to get cart: %v", err)
	}

	if len(cart.Items) == 0 {
		return nil, fmt.Errorf("cart is empty")
	}

	// 2. Prepare Order Items and Calculate Total
	var orderItems []*pb.OrderItem
	var totalUsd pb.Money
	totalUsd.CurrencyCode = "USD"

	productConn, err := grpc.Dial(s.productServiceAddr, grpc.WithInsecure())
	if err != nil {
		return nil, fmt.Errorf("failed to dial product service: %v", err)
	}
	defer productConn.Close()
	productClient := pb.NewProductCatalogServiceClient(productConn)

	for _, item := range cart.Items {

		product, err := productClient.GetProduct(ctx, &pb.GetProductRequest{Id: item.ProductId})
		if err != nil {
			return nil, fmt.Errorf("failed to get product %s: %v", item.ProductId, err)
		}
		log.Printf("Got product: %s, PriceUsd: %v", product.Name, product.PriceUsd)

		price := product.PriceUsd
		orderItems = append(orderItems, &pb.OrderItem{
			Item: item,
			Cost: price,
		})
		totalUsd.Units += price.Units * int64(item.Quantity)
		totalUsd.Nanos += price.Nanos * item.Quantity
		totalUsd.Units += int64(totalUsd.Nanos / 1e9)
		totalUsd.Nanos = totalUsd.Nanos % 1e9
	}

	// 3. Get Shipping Quote
	shippingConn, err := grpc.Dial(s.shippingServiceAddr, grpc.WithInsecure())
	if err != nil {
		return nil, fmt.Errorf("failed to dial shipping service: %v", err)
	}
	defer shippingConn.Close()
	shippingClient := pb.NewShippingServiceClient(shippingConn)
	quote, err := shippingClient.GetQuote(ctx, &pb.GetQuoteRequest{
		Address: req.Address,
		Items:   cart.Items,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get shipping quote: %v", err)
	}
	shippingCost := quote.CostUsd

	totalUsd.Units += shippingCost.Units
	totalUsd.Nanos += shippingCost.Nanos
	totalUsd.Units += int64(totalUsd.Nanos / 1e9)
	totalUsd.Nanos = totalUsd.Nanos % 1e9

	// 4. Charge Payment
	paymentConn, err := grpc.Dial(s.paymentServiceAddr, grpc.WithInsecure())
	if err != nil {
		return nil, fmt.Errorf("failed to dial payment service: %v", err)
	}
	defer paymentConn.Close()
	paymentClient := pb.NewPaymentServiceClient(paymentConn)
	_, err = paymentClient.Charge(ctx, &pb.ChargeRequest{
		Amount:     &totalUsd,
		CreditCard: req.CreditCard,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to charge payment: %v", err)
	}

	// 5. Ship Order
	shipResp, err := shippingClient.ShipOrder(ctx, &pb.ShipOrderRequest{
		Address: req.Address,
		Items:   cart.Items,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to ship order: %v", err)
	}

	// 6. Empty Cart
	_, _ = cartClient.EmptyCart(ctx, &pb.EmptyCartRequest{UserId: req.UserId})

	orderResult := &pb.OrderResult{
		OrderId:            "ORD-" + req.UserId[:4] + "-555",
		ShippingTrackingId: shipResp.TrackingId,
		ShippingCost:       shippingCost,
		ShippingAddress:    req.Address,
		Items:              orderItems,
	}

	return &pb.PlaceOrderResponse{Order: orderResult}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	checkoutSrv := &server{
		productServiceAddr:  os.Getenv("PRODUCT_SERVICE_ADDR"),
		cartServiceAddr:     os.Getenv("CART_SERVICE_ADDR"),
		shippingServiceAddr: os.Getenv("SHIPPING_SERVICE_ADDR"),
		paymentServiceAddr:  os.Getenv("PAYMENT_SERVICE_ADDR"),
		currencyServiceAddr: os.Getenv("CURRENCY_SERVICE_ADDR"),
	}

	pb.RegisterCheckoutServiceServer(s, checkoutSrv)
	reflection.Register(s)
	log.Printf("Checkout Service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
