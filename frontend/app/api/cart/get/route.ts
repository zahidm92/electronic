import { NextResponse } from 'next/server';
import { cartService } from '../../../../lib/grpc';

export async function GET(): Promise<NextResponse> {
    const userId = 'user-123'; // Mock user ID
    return new Promise<NextResponse>((resolve) => {
        cartService.GetCart({ user_id: userId }, (err: any, response: any) => {
            if (err) {
                console.error('Error fetching cart:', err);
                resolve(NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 }));
            } else {
                resolve(NextResponse.json(response));
            }
        });
    });
}
