package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"sync"

	pb "github.com/zahidm92/electronic-shop/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var (
	port = flag.Int("port", 7070, "The server port")
)

type server struct {
	pb.UnimplementedCartServiceServer
	mu    sync.Mutex
	items map[string][]*pb.CartItem // user_id -> items
}

func main() {
	flag.Parse()
	if err := run(*port); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}

func run(port int) error {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return fmt.Errorf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	cartServer := &server{
		items: make(map[string][]*pb.CartItem),
	}
	pb.RegisterCartServiceServer(s, cartServer)
	reflection.Register(s)

	log.Printf("server listening at %v", lis.Addr())
	return s.Serve(lis)
}

func (s *server) AddItem(ctx context.Context, req *pb.AddItemRequest) (*pb.Empty, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	userID := req.UserId
	newItem := req.Item

	if s.items[userID] == nil {
		s.items[userID] = []*pb.CartItem{}
	}

	// Check if item exists, if so update quantity
	found := false
	for _, item := range s.items[userID] {
		if item.ProductId == newItem.ProductId {
			item.Quantity += newItem.Quantity
			found = true
			break
		}
	}

	if !found {
		s.items[userID] = append(s.items[userID], newItem)
	}
	log.Printf("Added item %s to cart for user %s", newItem.ProductId, userID)

	return &pb.Empty{}, nil
}

func (s *server) GetCart(ctx context.Context, req *pb.GetCartRequest) (*pb.Cart, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	items := s.items[req.UserId]
	if items == nil {
		items = []*pb.CartItem{}
	}
	log.Printf("GetCart for user %s: %d items", req.UserId, len(items))

	return &pb.Cart{
		UserId: req.UserId,
		Items:  items,
	}, nil
}

func (s *server) EmptyCart(ctx context.Context, req *pb.EmptyCartRequest) (*pb.Empty, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	delete(s.items, req.UserId)
	log.Printf("Emptied cart for user %s", req.UserId)
	
	return &pb.Empty{}, nil
}
