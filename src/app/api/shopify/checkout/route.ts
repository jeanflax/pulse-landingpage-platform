import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutUrl, decryptToken, fetchProduct } from '@/lib/shopify';
import { db } from '@/lib/db';

// GET /api/shopify/checkout?productId=xxx&variantId=xxx&quantity=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const quantity = parseInt(searchParams.get('quantity') || '1', 10);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product from our database
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { client: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.client.shopifyDomain) {
      return NextResponse.json(
        { error: 'Client is not connected to Shopify' },
        { status: 400 }
      );
    }

    // Parse variants to get the variant ID
    let checkoutVariantId = variantId;

    if (!checkoutVariantId && product.variants) {
      const variants = JSON.parse(product.variants);
      if (variants.length > 0) {
        checkoutVariantId = variants[0].id;
      }
    }

    if (!checkoutVariantId) {
      // Fetch from Shopify if we don't have variant info
      if (product.client.shopifyToken) {
        const accessToken = decryptToken(product.client.shopifyToken);
        const shopifyProduct = await fetchProduct(
          product.client.shopifyDomain,
          accessToken,
          product.shopifyId
        );
        if (shopifyProduct.variants.length > 0) {
          checkoutVariantId = shopifyProduct.variants[0].id.toString();
        }
      }
    }

    if (!checkoutVariantId) {
      return NextResponse.json(
        { error: 'Could not determine product variant' },
        { status: 400 }
      );
    }

    // Generate checkout URL
    const checkoutUrl = getCheckoutUrl(
      product.client.shopifyDomain,
      checkoutVariantId,
      quantity
    );

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}

// POST version for API calls
export async function POST(request: NextRequest) {
  try {
    const { productId, variantId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product from our database
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { client: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.client.shopifyDomain) {
      return NextResponse.json(
        { error: 'Client is not connected to Shopify' },
        { status: 400 }
      );
    }

    // Parse variants to get the variant ID
    let checkoutVariantId = variantId;

    if (!checkoutVariantId && product.variants) {
      const variants = JSON.parse(product.variants);
      if (variants.length > 0) {
        checkoutVariantId = variants[0].id;
      }
    }

    if (!checkoutVariantId) {
      return NextResponse.json(
        { error: 'Could not determine product variant' },
        { status: 400 }
      );
    }

    // Generate checkout URL
    const checkoutUrl = getCheckoutUrl(
      product.client.shopifyDomain,
      checkoutVariantId,
      quantity
    );

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
