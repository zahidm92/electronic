'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: 'zahid@example.com',
        streetAddress: '123 AI Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
        creditCardNumber: '4111111111111111',
        cvv: '123',
        expirationMonth: '12',
        expirationYear: '2025'
    });

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            userId: 'user-123',
            email: formData.email,
            address: {
                street_address: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zip_code: parseInt(formData.zipCode)
            },
            creditCard: {
                credit_card_number: formData.creditCardNumber,
                credit_card_cvv: parseInt(formData.cvv),
                credit_card_expiration_month: parseInt(formData.expirationMonth),
                credit_card_expiration_year: parseInt(formData.expirationYear)
            }
        };

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const result = await response.json();
                setOrder(result.order);
            } else {
                alert('Failed to place order.');
            }
        } catch (err) {
            console.error('Error during checkout:', err);
        } finally {
            setLoading(false);
        }
    };

    if (order) {
        return (
            <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8 font-medium">Your items are on their way.</p>

                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order ID</span> <span className="font-black text-indigo-600">{order.order_id}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tracking #</span> <span className="font-bold text-gray-800">{order.shipping_tracking_id}</span></div>
                    </div>

                    <Link href="/" className="block w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all">
                        Return to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <Link href="/cart" className="text-indigo-600 hover:text-indigo-800 font-bold mb-8 inline-block">← Back to Cart</Link>
                <h1 className="text-4xl font-black text-gray-900 mb-8">Secure Checkout</h1>

                <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Contact & Shipping</h2>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" required />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                            <input type="text" value={formData.streetAddress} onChange={e => setFormData({ ...formData, streetAddress: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                                <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" required />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Zip Code</label>
                                <input type="text" value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" required />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Payment Information</h2>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Card Number</label>
                            <input type="text" value={formData.creditCardNumber} onChange={e => setFormData({ ...formData, creditCardNumber: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" required />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Exp Month</label>
                                <input type="text" value={formData.expirationMonth} onChange={e => setFormData({ ...formData, expirationMonth: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3" required />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Exp Year</label>
                                <input type="text" value={formData.expirationYear} onChange={e => setFormData({ ...formData, expirationYear: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3" required />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">CVV</label>
                                <input type="text" value={formData.cvv} onChange={e => setFormData({ ...formData, cvv: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl p-3" required />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
                    >
                        {loading ? 'Processing Order...' : 'Place Order Now'}
                    </button>
                </form>
            </div>
        </main>
    );
}
