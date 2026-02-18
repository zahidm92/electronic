'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cartRes, productsRes] = await Promise.all([
                fetch('/api/cart/get'),
                fetch('/api/products')
            ]);

            if (cartRes.ok && productsRes.ok) {
                setCart(await cartRes.json());
                setProducts(await productsRes.json());
            }
        } catch (err) {
            console.error('Error fetching cart data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getProduct = (id: string) => products.find(p => p.id === id);

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((acc: number, item: any) => {
            const p = getProduct(item.product_id);
            if (!p) return acc;
            const price = (p.price_usd.units) + (p.price_usd.nanos / 1e9);
            return acc + (price * item.quantity);
        }, 0);
    };

    if (loading) return <div className="p-8 text-center">Loading cart...</div>;

    const total = calculateTotal();

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2">
                        ← Back to Shop
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900">Your Shopping Cart</h1>
                </div>

                {!cart?.items || cart.items.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xl text-gray-500 font-medium mb-6">Your cart is currently empty.</p>
                        <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {cart.items.map((item: any, idx: number) => {
                                const p = getProduct(item.product_id);
                                if (!p) return null;
                                return (
                                    <div key={item.product_id} className={`p-6 flex items-center gap-6 ${idx !== 0 ? 'border-t border-gray-50' : ''}`}>
                                        <img src={p.picture} alt={p.name} className="w-24 h-24 object-cover rounded-2xl shadow-sm" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                                            <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-indigo-600">
                                                ${((p.price_usd.units + p.price_usd.nanos / 1e9) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">Total Amount</p>
                                <p className="text-4xl font-black text-gray-900">${total.toFixed(2)}</p>
                            </div>
                            <Link
                                href="/checkout"
                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
