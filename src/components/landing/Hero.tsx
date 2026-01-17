'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import { HeroProps } from '@/types/landing';

export default function Hero({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  productImage,
  productImageAlt,
  badge,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAF9]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-amber-100/40 via-orange-50/30 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-stone-200/50 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column - Copy */}
          <div className="text-center lg:text-left order-2 lg:order-1 max-w-2xl mx-auto lg:mx-0">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold tracking-wide uppercase rounded-full mb-8">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                {badge}
              </div>
            )}

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-neutral-900 mb-6 tracking-tight leading-[1.05]">
              {headline}
            </h1>

            <p className="text-xl lg:text-2xl text-neutral-600 mb-10 leading-relaxed font-light">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button href={ctaLink} size="lg" className="text-lg px-10 py-5 shadow-lg shadow-neutral-900/20">
                {ctaText}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              {secondaryCtaText && secondaryCtaLink && (
                <Button href={secondaryCtaLink} variant="outline" size="lg" className="text-lg">
                  {secondaryCtaText}
                </Button>
              )}
            </div>

            {/* Trust Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-600">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="font-medium text-neutral-700">2,400+ happy customers</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 font-semibold text-neutral-900">4.9</span>
              </div>
            </div>
          </div>

          {/* Right Column - Product Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square max-w-xl mx-auto">
              {/* Decorative ring */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-neutral-200 animate-[spin_60s_linear_infinite]"></div>

              {/* Main image container */}
              <div className="absolute inset-8 bg-white rounded-3xl shadow-2xl shadow-neutral-900/10 overflow-hidden">
                <Image
                  src={productImage}
                  alt={productImageAlt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-white rounded-2xl shadow-xl p-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Free Shipping</p>
                    <p className="text-sm font-semibold text-neutral-900">Orders $50+</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-xl p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Limited Time</p>
                    <p className="text-sm font-semibold text-neutral-900">20% Off Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-neutral-400">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-neutral-300 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
