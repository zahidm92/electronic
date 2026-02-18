import { NextResponse } from 'next/server';
import { cartService } from '../../../lib/grpc';

export async function POST(request: Request): Promise<NextResponse> {
    const { productId, quantity, userId } = await request.json();

    return new Promise<NextResponse>((resolve) => {
        cartService.AddItem({
            user_id: userId || 'user-123',
            item: {
                product_id: productId,
                quantity: quantity || 1
            }
        }, (err: any) => {
            if (err) {
                console.error('Error adding to cart:', err);
                resolve(NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ success: true }));
            }
        });
    });
}
