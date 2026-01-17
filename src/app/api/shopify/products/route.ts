import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/shopify/products?clientId=xxx - Get synced products for a client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await db.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        shopifyDomain: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get products for this client
    const products = await db.product.findMany({
      where: { clientId },
      orderBy: { title: 'asc' },
    });

    // Parse JSON fields
    const parsedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: product.variants ? JSON.parse(product.variants) : [],
    }));

    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        shopifyDomain: client.shopifyDomain,
      },
      products: parsedProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
