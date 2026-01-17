'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductShowcaseProps } from '@/types/landing';

export default function ProductShowcase({
  sectionTitle,
  sectionSubtitle,
  description,
  features,
  images,
  price,
  comparePrice,
}: ProductShowcaseProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const discount = comparePrice && price
    ? Math.round(((parseFloat(comparePrice.replace(/[^0-9.]/g, '')) - parseFloat(price.replace(/[^0-9.]/g, ''))) / parseFloat(comparePrice.replace(/[^0-9.]/g, ''))) * 100)
    : 0;

  return (
    <section className="py-24 lg:py-32 bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-16 lg:mb-20">
            {sectionTitle && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-light">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-lg">
              {images.length > 0 && (
                <Image
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  fill
                  className="object-cover"
                />
              )}

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-rose-500 text-white text-sm font-bold rounded-full">
                  {discount}% OFF
                </div>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-neutral-900 ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {/* Price Block */}
            {price && (
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-5xl font-black text-neutral-900">{price}</span>
                  {comparePrice && (
                    <span className="text-2xl text-neutral-400 line-through">{comparePrice}</span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-emerald-600 font-medium">
                    You save {comparePrice?.charAt(0)}{(parseFloat(comparePrice?.replace(/[^0-9.]/g, '') || '0') - parseFloat(price.replace(/[^0-9.]/g, ''))).toFixed(0)} ({discount}% off)
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                {description}
              </p>
            )}

            {/* Features List */}
            {features && features.length > 0 && (
              <div className="mb-8 p-6 bg-white rounded-2xl">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 mb-8">
              <button className="w-full py-5 px-8 bg-neutral-900 text-white text-lg font-semibold rounded-full hover:bg-neutral-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-neutral-900/20 flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              <button className="w-full py-5 px-8 bg-amber-400 text-neutral-900 text-lg font-semibold rounded-full hover:bg-amber-300 transition-all flex items-center justify-center gap-2">
                Buy Now — Pay Later
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Trust Elements */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-2xl">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-neutral-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-neutral-600">30-Day Returns</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-neutral-600">2-Year Warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
