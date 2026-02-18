import { NextResponse } from 'next/server';
import { checkoutService } from '../../../lib/grpc';

export async function POST(request: Request): Promise<NextResponse> {
    const { userId, address, email, creditCard } = await request.json();

    return new Promise<NextResponse>((resolve) => {
        checkoutService.PlaceOrder({
            user_id: userId || 'user-123',
            user_currency: 'USD',
            address: address,
            email: email,
            credit_card: creditCard
        }, (err: any, response: any) => {
            if (err) {
                console.error('Error placing order:', err);
                resolve(NextResponse.json({ error: 'Failed to place order' }, { status: 500 }));
            } else {
                resolve(NextResponse.json(response));
            }
        });
    });
}
