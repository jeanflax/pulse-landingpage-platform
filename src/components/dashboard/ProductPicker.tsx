'use client';

import { useState, useEffect } from 'react';

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: string;
  comparePrice: string | null;
  sku: string | null;
  inventory: number;
}

interface Product {
  id: string;
  shopifyId: string;
  title: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductPickerProps {
  clientId: string;
  selectedProductId?: string;
  onSelect: (product: Product | null) => void;
}

export default function ProductPicker({
  clientId,
  selectedProductId,
  onSelect,
}: ProductPickerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/shopify/products?clientId=${clientId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch products');
        }

        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [clientId]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
            <div className="h-3 bg-neutral-200 rounded w-24 animate-pulse mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-xl p-4 bg-red-50 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 text-center">
        <p className="text-neutral-500 text-sm">No products synced from Shopify</p>
        <p className="text-neutral-400 text-xs mt-1">
          Connect Shopify and sync products in client settings
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Selected Product / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors text-left"
      >
        {selectedProduct ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
              {selectedProduct.images[0] ? (
                <img
                  src={selectedProduct.images[0].src}
                  alt={selectedProduct.images[0].alt || selectedProduct.title}
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
              <p className="font-medium text-neutral-900 truncate">{selectedProduct.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-neutral-900">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ${selectedProduct.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Select a Product</p>
              <p className="text-sm text-neutral-500">Choose from {products.length} synced products</p>
            </div>
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-neutral-200 shadow-xl z-20 max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-neutral-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Product List */}
            <div className="max-h-72 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-neutral-500 text-sm">No products match &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      onSelect(product);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center gap-4 p-3 hover:bg-neutral-50 transition-colors text-left ${
                      selectedProductId === product.id ? 'bg-neutral-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{product.title}</p>
                      <p className="text-sm text-neutral-500">${product.price.toFixed(2)}</p>
                    </div>
                    {selectedProductId === product.id && (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
