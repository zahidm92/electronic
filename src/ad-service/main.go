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
	port = flag.Int("port", 9555, "The server port")
)

type server struct {
	pb.UnimplementedAdServiceServer
}

func (s *server) GetAds(ctx context.Context, in *pb.AdRequest) (*pb.AdResponse, error) {
	log.Printf("GetAds called with context keys: %v", in.ContextKeys)
	return &pb.AdResponse{
		Ads: []*pb.Ad{
			{RedirectUrl: "/product/66v9f8p2zc", Text: "Ad: Check out our newest smartphone!"},
			{RedirectUrl: "/product/0PUK6V6EV0", Text: "Ad: Limited time offer on vintage cameras!"},
		},
	}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterAdServiceServer(s, &server{})
	reflection.Register(s)
	log.Printf("Ad Service listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
