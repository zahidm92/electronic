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
	pb.UnimplementedRecommendationServiceServer
}

func (s *server) ListRecommendations(ctx context.Context, in *pb.ListRecommendationsRequest) (*pb.ListRecommendationsResponse, error) {
	log.Printf("ListRecommendations called for user %s", in.UserId)
	// Stubbed: Return a few product IDs
	return &pb.ListRecommendationsResponse{
		ProductIds: []string{"66v9f8p2zc", "0PUK6V6EV0", "OLJCESPC7Z"},
	}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterRecommendationServiceServer(s, &server{})
	reflection.Register(s)
	log.Printf("Recommendation Service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
