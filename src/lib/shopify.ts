// Shopify API helper functions

const SHOPIFY_API_VERSION = '2024-01';

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string | null;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  sku: string | null;
  inventory_quantity: number;
}

interface ShopifyImage {
  id: number;
  product_id: number;
  src: string;
  alt: string | null;
}

// Generate OAuth authorization URL
export function getShopifyAuthUrl(shop: string, clientId: string, redirectUri: string, state: string): string {
  const scopes = 'read_products,read_content,read_themes';
  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  return authUrl.toString();
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(
  shop: string,
  code: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch products from Shopify store
export async function fetchProducts(
  shop: string,
  accessToken: string,
  limit: number = 50
): Promise<ShopifyProduct[]> {
  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=${limit}&status=active`;

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch products: ${error}`);
  }

  const data = await response.json();
  return data.products;
}

// Fetch a single product
export async function fetchProduct(
  shop: string,
  accessToken: string,
  productId: string
): Promise<ShopifyProduct> {
  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products/${productId}.json`;

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch product: ${error}`);
  }

  const data = await response.json();
  return data.product;
}

// Fetch shop info
export async function fetchShopInfo(shop: string, accessToken: string) {
  const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`;

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch shop info: ${error}`);
  }

  const data = await response.json();
  return data.shop;
}

// Transform Shopify product to our Product model format
export function transformProduct(shopifyProduct: ShopifyProduct) {
  const primaryVariant = shopifyProduct.variants[0];

  return {
    shopifyId: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    description: shopifyProduct.body_html ? stripHtml(shopifyProduct.body_html) : null,
    price: parseFloat(primaryVariant?.price || '0'),
    comparePrice: primaryVariant?.compare_at_price ? parseFloat(primaryVariant.compare_at_price) : null,
    images: JSON.stringify(shopifyProduct.images.map(img => ({
      src: img.src,
      alt: img.alt || shopifyProduct.title,
    }))),
    variants: JSON.stringify(shopifyProduct.variants.map(v => ({
      id: v.id.toString(),
      title: v.title,
      price: v.price,
      comparePrice: v.compare_at_price,
      sku: v.sku,
      inventory: v.inventory_quantity,
    }))),
  };
}

// Generate Shopify checkout URL
export function getCheckoutUrl(shop: string, variantId: string, quantity: number = 1): string {
  // Remove .myshopify.com if present for the storefront URL
  const storeDomain = shop.replace('.myshopify.com', '');
  return `https://${storeDomain}.myshopify.com/cart/${variantId}:${quantity}`;
}

// Generate direct product URL
export function getProductUrl(shop: string, handle: string): string {
  const storeDomain = shop.replace('.myshopify.com', '');
  return `https://${storeDomain}.myshopify.com/products/${handle}`;
}

// Simple HTML strip function
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// Encrypt token for storage (simple base64 for now - use proper encryption in production)
export function encryptToken(token: string): string {
  return Buffer.from(token).toString('base64');
}

// Decrypt token
export function decryptToken(encrypted: string): string {
  return Buffer.from(encrypted, 'base64').toString('utf-8');
}
