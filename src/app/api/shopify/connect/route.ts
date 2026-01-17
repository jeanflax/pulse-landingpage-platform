import { NextRequest, NextResponse } from 'next/server';
import { getShopifyAuthUrl } from '@/lib/shopify';
import { db } from '@/lib/db';

// GET /api/shopify/connect?clientId=xxx&shop=mystore
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const shop = searchParams.get('shop');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop domain is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await db.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get Shopify credentials from environment
    const shopifyClientId = process.env.SHOPIFY_CLIENT_ID;
    const redirectUri = process.env.SHOPIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;

    if (!shopifyClientId) {
      return NextResponse.json(
        { error: 'Shopify app not configured. Set SHOPIFY_CLIENT_ID in environment.' },
        { status: 503 }
      );
    }

    // Normalize shop domain
    let shopDomain = shop.toLowerCase().trim();
    if (!shopDomain.includes('.myshopify.com')) {
      shopDomain = `${shopDomain}.myshopify.com`;
    }

    // Create state parameter with client ID (for callback)
    const state = Buffer.from(JSON.stringify({ clientId, timestamp: Date.now() })).toString('base64');

    // Generate authorization URL
    const authUrl = getShopifyAuthUrl(shopDomain, shopifyClientId, redirectUri, state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Shopify connect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Shopify connection' },
      { status: 500 }
    );
  }
}
