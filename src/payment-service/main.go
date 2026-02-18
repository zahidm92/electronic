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
	pb.UnimplementedPaymentServiceServer
}

func (s *server) Charge(ctx context.Context, in *pb.ChargeRequest) (*pb.ChargeResponse, error) {
	log.Printf("Charge called for amount %d %s", in.Amount.Units, in.Amount.CurrencyCode)
	// Stubbed: Always success
	return &pb.ChargeResponse{
		TransactionId: "TXN-987654321",
	}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterPaymentServiceServer(s, &server{})
	reflection.Register(s)
	log.Printf("Payment Service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
