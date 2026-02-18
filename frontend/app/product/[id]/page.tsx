'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                const p = data.find((item: any) => item.id === id);
                setProduct(p);
            }
        } catch (err) {
            console.error("Failed to fetch product:", err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: string) => {
        setAddingToCart(true);
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
            setAddingToCart(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-xl">Loading product...</div>;
    if (!product) return <div className="p-8 text-center text-xl">Product not found.</div>;

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-bold mb-8 inline-block">
                    ← Back to Catalog
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-96 md:h-auto bg-gray-100">
                        <img
                            src={product.picture}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => console.error(`Image failed to load: ${product.picture}`)}
                        />
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                        <div className="mb-4">
                            {product.categories?.map((cat: string) => (
                                <span key={cat} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase mr-2 last:mr-0 tracking-wider">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">{product.description}</p>

                        <div className="mt-auto pt-8 border-t flex items-center justify-between">
                            <span className="text-4xl font-black text-indigo-600">
                                ${product.price_usd?.units}.{(product.price_usd?.nanos || 0) / 10000000}
                            </span>
                            <button
                                onClick={() => addToCart(product.id)}
                                disabled={addingToCart}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
