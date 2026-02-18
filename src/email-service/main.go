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
	port = flag.Int("port", 8080, "The server port")
)

type server struct {
	pb.UnimplementedEmailServiceServer
}

func (s *server) SendOrderConfirmation(ctx context.Context, in *pb.SendOrderConfirmationRequest) (*pb.Empty, error) {
	log.Printf("Email Service: Sending order confirmation to %s for order %s", in.Email, in.Order.OrderId)
	// Stubbed: Log to console
	return &pb.Empty{}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterEmailServiceServer(s, &server{})
	reflection.Register(s)
	log.Printf("Email Service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
