'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Will create this simple proxy
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1, userId: 'user-123' }),
      });
      if (response.ok) {
        alert('Added to cart!');
      } else {
        alert('Failed to add to cart.');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading products...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Electronics Store</h1>
          <Link href="/cart" className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-lg font-semibold">
            View Cart (user-123)
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl text-gray-500 font-medium">No products found.</p>
            <p className="text-sm text-gray-400 mt-2">The product service might be starting up...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                <div className="h-64 bg-gray-100 relative overflow-hidden">
                  <Link href={`/product/${product.id}`}>
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.error("Image failed to load:", product.picture);
                        // Optional: set a fallback image here if needed
                      }}
                    />
                  </Link>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm uppercase tracking-wider">
                    {product.categories?.[0] || 'Electronics'}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">{product.name}</h2>
                  <p className="text-gray-500 mb-6 line-clamp-2 text-sm leading-relaxed">{product.description}</p>
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-2xl font-black text-gray-900">
                      ${product.price_usd?.units}.{(product.price_usd?.nanos || 0) / 10000000}
                    </span>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={addingToCart === product.id}
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                      {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
