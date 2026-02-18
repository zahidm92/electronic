import { NextResponse } from 'next/server';
import { productCatalogService } from '../../../lib/grpc';

export async function GET(): Promise<NextResponse> {
    return new Promise<NextResponse>((resolve) => {
        productCatalogService.ListProducts({}, (err: any, response: any) => {
            if (err) {
                console.error('Error fetching products:', err);
                resolve(NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 }));
            } else {
                resolve(NextResponse.json(response.products));
            }
        });
    });
}
