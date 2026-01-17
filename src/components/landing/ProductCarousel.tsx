'use client';

import { useState, useRef } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  comparePrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  link?: string;
}

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  showRating?: boolean;
  showColors?: boolean;
  cardStyle?: 'minimal' | 'detailed';
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  showRating = true,
  showColors = true,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-end justify-between mb-8">
            <div>
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-neutral-500 mt-2">{subtitle}</p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                    : 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                    : 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Products */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth -mx-6 px-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <a
              key={product.id}
              href={product.link || '#'}
              className="flex-shrink-0 w-72 group"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.comparePrice && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    Save {Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                )}
                {/* Quick Add */}
                <button className="absolute bottom-4 left-4 right-4 py-3 bg-white text-neutral-900 font-medium rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-neutral-100">
                  Quick Add
                </button>
              </div>

              {/* Info */}
              <div>
                {showRating && product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= product.rating! ? 'text-amber-400' : 'text-neutral-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {product.reviewCount && (
                      <span className="text-xs text-neutral-500">
                        ({product.reviewCount})
                      </span>
                    )}
                  </div>
                )}

                <h3 className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {product.title}
                </h3>

                {showColors && product.colors && product.colors.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {product.colors.slice(0, 5).map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-neutral-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {product.colors.length > 5 && (
                      <span className="text-xs text-neutral-400 ml-1">
                        +{product.colors.length - 5}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-neutral-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-neutral-400 line-through text-sm">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
