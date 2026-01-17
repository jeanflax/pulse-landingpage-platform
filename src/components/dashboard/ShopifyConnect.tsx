'use client';

import { useState } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  comparePrice: number | null;
  images: Array<{ src: string; alt: string }>;
  syncedAt: Date | string;
}

interface ShopifyConnectProps {
  clientId: string;
  shopifyDomain: string | null;
  products: Product[];
}

export default function ShopifyConnect({
  clientId,
  shopifyDomain,
  products: initialProducts,
}: ShopifyConnectProps) {
  const [shop, setShop] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [error, setError] = useState('');

  const handleConnect = () => {
    if (!shop.trim()) {
      setError('Please enter your Shopify store name');
      return;
    }

    setIsConnecting(true);
    setError('');

    // Redirect to OAuth flow
    const storeName = shop.trim().replace('.myshopify.com', '');
    window.location.href = `/api/shopify/connect?clientId=${clientId}&shop=${storeName}`;
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError('');

    try {
      const response = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync products');
      }

      // Refresh products
      const productsResponse = await fetch(`/api/shopify/products?clientId=${clientId}`);
      const productsData = await productsResponse.json();

      if (productsResponse.ok) {
        setProducts(productsData.products);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSyncing(false);
    }
  };

  // Not connected state
  if (!shopifyDomain) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.337 4.034c-.055-.027-.121-.03-.176-.005l-4.044 1.944a.326.326 0 00-.162.218l-.462 2.775-.734-.146.055-.33a.46.46 0 00-.222-.498.459.459 0 00-.546.058l-.968.867-.72-.143a.458.458 0 00-.512.267.46.46 0 00.138.543l.66.535v.001l-.054.325a.46.46 0 00.455.533.464.464 0 00.088-.009l.738-.146.726.589a.459.459 0 00.734-.228l.302-1.01 4.49.89a.182.182 0 00.174-.044.183.183 0 00.056-.166l-.016-.094a.324.324 0 00.15-.085l2.036-2.036a.325.325 0 00.084-.303l-.426-1.706a.324.324 0 00-.227-.234l-.573-.143-.001-.002z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Connect Shopify Store</h3>
            <p className="text-sm text-neutral-500">Import products and enable checkout</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Shopify Store Name
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={shop}
                  onChange={(e) => setShop(e.target.value)}
                  placeholder="mystore"
                  className="w-full px-4 py-3 pr-32 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                  .myshopify.com
                </span>
              </div>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <p className="text-xs text-neutral-400">
            You&apos;ll be redirected to Shopify to authorize access to your store. We only request read access to products.
          </p>
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Shopify Connected</h3>
              <p className="text-sm text-neutral-500">{shopifyDomain}</p>
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            <svg
              className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isSyncing ? 'Syncing...' : 'Sync Products'}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-neutral-600 mb-4">No products synced yet</p>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Now
          </button>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                {product.images[0] ? (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-neutral-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-sm text-neutral-400 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-neutral-400">
                Synced {new Date(product.syncedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-neutral-50 border-t border-neutral-100">
        <p className="text-xs text-neutral-500 text-center">
          {products.length} product{products.length !== 1 ? 's' : ''} synced from Shopify
        </p>
      </div>
    </div>
  );
}
