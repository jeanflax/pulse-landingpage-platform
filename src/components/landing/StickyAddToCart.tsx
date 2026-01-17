'use client';

import { useState, useEffect } from 'react';

interface ProductContext {
  id: string;
  title: string;
  price: number;
  comparePrice: number | null;
  images: Array<{ src: string; alt: string }>;
  checkoutUrl: string | null;
}

interface StickyAddToCartProps {
  productName?: string;
  price?: number;
  comparePrice?: number;
  image?: string;
  ctaText?: string;
  onAddToCart?: () => void;
  showAfterScroll?: number;
  variants?: { label: string; value: string }[];
  checkoutUrl?: string;
  product?: ProductContext;
}

export default function StickyAddToCart({
  productName,
  price,
  comparePrice,
  image,
  ctaText = 'Add to Cart',
  onAddToCart,
  showAfterScroll = 600,
  variants,
  checkoutUrl,
  product,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variants?.[0]?.value || '');

  // Use product context if available, otherwise use props
  const displayName = product?.title || productName || 'Product';
  const displayPrice = product?.price || price || 0;
  const displayComparePrice = product?.comparePrice || comparePrice;
  const displayImage = product?.images?.[0]?.src || image;
  const displayCheckoutUrl = product?.checkoutUrl || checkoutUrl;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(p);
  };

  const handleClick = () => {
    if (displayCheckoutUrl) {
      window.location.href = displayCheckoutUrl;
    } else if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-neutral-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-4 min-w-0">
              {displayImage && (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-medium text-neutral-900 truncate">
                  {displayName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">
                    {formatPrice(displayPrice)}
                  </span>
                  {displayComparePrice && displayComparePrice > displayPrice && (
                    <span className="text-neutral-400 line-through text-sm">
                      {formatPrice(displayComparePrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Variants & CTA */}
            <div className="flex items-center gap-3">
              {variants && variants.length > 0 && (
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {variants.map((variant) => (
                    <option key={variant.value} value={variant.value}>
                      {variant.label}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={handleClick}
                className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-full hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                {displayCheckoutUrl ? 'Buy Now' : ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
