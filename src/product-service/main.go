package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"strings"

	pb "github.com/zahidm92/electronic-shop/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"
)

var (
	port = flag.Int("port", 3550, "The server port")
)

type server struct {
	pb.UnimplementedProductCatalogServiceServer
	products []*pb.Product
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
	catalog := &server{}
	if err := catalog.loadProducts(); err != nil {
		return fmt.Errorf("failed to load products: %v", err)
	}

	pb.RegisterProductCatalogServiceServer(s, catalog)
	reflection.Register(s)

	log.Printf("server listening at %v", lis.Addr())
	return s.Serve(lis)
}

func (s *server) loadProducts() error {
	data, err := ioutil.ReadFile("products.json")
	if err != nil {
		return err
	}
	var products []*pb.Product
	if err := json.Unmarshal(data, &products); err != nil {
		return err
	}
	s.products = products
	log.Printf("Loaded %d products", len(s.products))
	return nil
}

func (s *server) ListProducts(ctx context.Context, _ *pb.Empty) (*pb.ListProductsResponse, error) {
	return &pb.ListProductsResponse{Products: s.products}, nil
}

func (s *server) GetProduct(ctx context.Context, req *pb.GetProductRequest) (*pb.Product, error) {
	for _, p := range s.products {
		if p.Id == req.Id {
			return p, nil
		}
	}
	return nil, status.Errorf(codes.NotFound, "product not found")
}

func (s *server) SearchProducts(ctx context.Context, req *pb.SearchProductsRequest) (*pb.SearchProductsResponse, error) {
	var results []*pb.Product
	query := strings.ToLower(req.Query)
	for _, p := range s.products {
		if strings.Contains(strings.ToLower(p.Name), query) || strings.Contains(strings.ToLower(p.Description), query) {
			results = append(results, p)
		}
	}
	return &pb.SearchProductsResponse{Results: results}, nil
}
