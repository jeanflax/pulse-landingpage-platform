import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, decryptToken, transformProduct } from '@/lib/shopify';
import { db } from '@/lib/db';

// POST /api/shopify/sync - Sync products for a client
export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Get client with Shopify credentials
    const client = await db.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    if (!client.shopifyDomain || !client.shopifyToken) {
      return NextResponse.json(
        { error: 'Client is not connected to Shopify' },
        { status: 400 }
      );
    }

    // Decrypt the access token
    const accessToken = decryptToken(client.shopifyToken);

    // Fetch products from Shopify
    const shopifyProducts = await fetchProducts(client.shopifyDomain, accessToken);

    // Sync products to database
    const syncedProducts = [];
    for (const shopifyProduct of shopifyProducts) {
      const productData = transformProduct(shopifyProduct);

      const product = await db.product.upsert({
        where: {
          clientId_shopifyId: {
            clientId,
            shopifyId: productData.shopifyId,
          },
        },
        create: {
          clientId,
          shopifyId: productData.shopifyId,
          title: productData.title,
          description: productData.description,
          price: productData.price,
          comparePrice: productData.comparePrice,
          images: productData.images,
          variants: productData.variants,
          syncedAt: new Date(),
        },
        update: {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          comparePrice: productData.comparePrice,
          images: productData.images,
          variants: productData.variants,
          syncedAt: new Date(),
        },
      });

      syncedProducts.push(product);
    }

    return NextResponse.json({
      success: true,
      synced: syncedProducts.length,
      products: syncedProducts,
    });
  } catch (error) {
    console.error('Shopify sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync products' },
      { status: 500 }
    );
  }
}
