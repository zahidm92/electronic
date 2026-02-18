package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	pb "github.com/zahidm92/electronic-shop/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var (
	port = flag.Int("port", 50051, "The server port")
)

type server struct {
	pb.UnimplementedShippingServiceServer
}

func (s *server) GetQuote(ctx context.Context, in *pb.GetQuoteRequest) (*pb.GetQuoteResponse, error) {
	log.Printf("GetQuote called with %d items", len(in.Items))
	// Stubbed: $15 shipping fee per order
	return &pb.GetQuoteResponse{
		CostUsd: &pb.Money{
			CurrencyCode: "USD",
			Units:        15,
			Nanos:        0,
		},
	}, nil
}

func (s *server) ShipOrder(ctx context.Context, in *pb.ShipOrderRequest) (*pb.ShipOrderResponse, error) {
	log.Printf("ShipOrder called with %d items", len(in.Items))
	// Stubbed tracking ID
	return &pb.ShipOrderResponse{
		TrackingId: "SHIP-123456789",
	}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterShippingServiceServer(s, &server{})
	reflection.Register(s)
	log.Printf("Shipping Service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
