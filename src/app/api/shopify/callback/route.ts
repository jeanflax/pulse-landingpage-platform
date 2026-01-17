import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, fetchShopInfo, encryptToken } from '@/lib/shopify';
import { db } from '@/lib/db';

// GET /api/shopify/callback?code=xxx&state=xxx&shop=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const shop = searchParams.get('shop');

    if (!code || !state || !shop) {
      return NextResponse.redirect(
        new URL('/dashboard/clients?error=missing_params', request.url)
      );
    }

    // Decode state to get client ID
    let clientId: string;
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      clientId = stateData.clientId;

      // Verify timestamp is within 10 minutes
      const timestamp = stateData.timestamp;
      if (Date.now() - timestamp > 10 * 60 * 1000) {
        return NextResponse.redirect(
          new URL('/dashboard/clients?error=state_expired', request.url)
        );
      }
    } catch {
      return NextResponse.redirect(
        new URL('/dashboard/clients?error=invalid_state', request.url)
      );
    }

    // Verify client exists
    const client = await db.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.redirect(
        new URL('/dashboard/clients?error=client_not_found', request.url)
      );
    }

    // Get Shopify credentials
    const shopifyClientId = process.env.SHOPIFY_CLIENT_ID;
    const shopifyClientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!shopifyClientId || !shopifyClientSecret) {
      return NextResponse.redirect(
        new URL(`/dashboard/clients/${clientId}?error=shopify_not_configured`, request.url)
      );
    }

    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(
      shop,
      code,
      shopifyClientId,
      shopifyClientSecret
    );

    // Fetch shop info to verify connection
    const shopInfo = await fetchShopInfo(shop, accessToken);

    // Save encrypted token and shop domain to client
    await db.client.update({
      where: { id: clientId },
      data: {
        shopifyDomain: shop,
        shopifyToken: encryptToken(accessToken),
      },
    });

    console.log(`Shopify connected for client ${clientId}: ${shopInfo.name} (${shop})`);

    // Redirect to client page with success message
    return NextResponse.redirect(
      new URL(`/dashboard/clients/${clientId}?shopify=connected`, request.url)
    );
  } catch (error) {
    console.error('Shopify callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/clients?error=shopify_connection_failed', request.url)
    );
  }
}
