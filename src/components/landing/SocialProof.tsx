'use client';

import React from 'react';
import Image from 'next/image';
import { SocialProofProps } from '@/types/landing';

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-neutral-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function SocialProof({
  sectionTitle,
  sectionSubtitle,
  testimonials,
  stats,
}: SocialProofProps) {
  return (
    <section className="py-24 lg:py-32 bg-neutral-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-24">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-widest font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-16">
            {sectionTitle && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl ${
                index === 1
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 md:-mt-4 md:mb-4'
                  : 'bg-neutral-900'
              }`}
            >
              {/* Quote mark */}
              <div className={`text-6xl font-serif leading-none mb-4 ${
                index === 1 ? 'text-white/30' : 'text-neutral-700'
              }`}>
                &ldquo;
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Quote */}
              <blockquote className={`text-lg mb-8 leading-relaxed ${
                index === 1 ? 'text-white' : 'text-neutral-300'
              }`}>
                {testimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    index === 1
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {testimonial.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className={`font-semibold ${index === 1 ? 'text-white' : 'text-white'}`}>
                    {testimonial.author}
                  </div>
                  <div className={`text-sm ${index === 1 ? 'text-white/70' : 'text-neutral-500'}`}>
                    {testimonial.title}
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                index === 1
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-16 pt-16 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-neutral-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">All reviews verified by Trustpilot</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-neutral-700"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm">4.9 average from 2,400+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
