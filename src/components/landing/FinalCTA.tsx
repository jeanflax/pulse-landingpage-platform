'use client';

import React from 'react';
import Button from '../ui/Button';
import { CTAProps } from '@/types/landing';

interface ProductContext {
  id: string;
  title: string;
  price: number;
  comparePrice: number | null;
  images: Array<{ src: string; alt: string }>;
  checkoutUrl: string | null;
}

interface FinalCTAProps extends CTAProps {
  product?: ProductContext;
}

export default function FinalCTA({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  secondaryText,
  product,
}: FinalCTAProps) {
  // Use product checkout URL if available
  const displayCtaLink = product?.checkoutUrl || ctaLink;
  const displayCtaText = product?.checkoutUrl ? (ctaText || 'Shop Now') : (ctaText || 'Get Started');
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800"></div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/10 to-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur border border-white/10 text-white text-sm font-medium rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          Limited Time Offer
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
          {headline}
        </h2>

        {/* Subheadline */}
        {subheadline && (
          <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {subheadline}
          </p>
        )}

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            href={displayCtaLink}
            size="lg"
            className="bg-white text-neutral-900 hover:bg-neutral-100 text-lg px-12 py-6 shadow-2xl shadow-white/10"
          >
            {displayCtaText}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>

        {/* Secondary Text / Promo */}
        {secondaryText && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-amber-300 text-sm font-medium">{secondaryText}</span>
          </div>
        )}

        {/* Trust row */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">30-Day Guarantee</p>
                <p className="text-sm">Full refund, no questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Fast Shipping</p>
                <p className="text-sm">2-3 day delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">24/7 Support</p>
                <p className="text-sm">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
