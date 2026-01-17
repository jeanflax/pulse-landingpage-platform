'use client';

import React from 'react';
import { BenefitsProps } from '@/types/landing';

const iconMap: Record<string, React.ReactNode> = {
  shield: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  lightning: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  heart: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  star: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  truck: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  refresh: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

const bgColors = [
  'bg-gradient-to-br from-amber-50 to-orange-100',
  'bg-gradient-to-br from-emerald-50 to-teal-100',
  'bg-gradient-to-br from-violet-50 to-purple-100',
  'bg-gradient-to-br from-rose-50 to-pink-100',
  'bg-gradient-to-br from-sky-50 to-blue-100',
  'bg-gradient-to-br from-lime-50 to-green-100',
];

const iconColors = [
  'text-amber-600',
  'text-emerald-600',
  'text-violet-600',
  'text-rose-600',
  'text-sky-600',
  'text-lime-600',
];

export default function Benefits({
  sectionTitle,
  sectionSubtitle,
  benefits,
}: BenefitsProps) {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-20">
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

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative p-8 lg:p-10 rounded-3xl ${bgColors[index % bgColors.length]} transition-all duration-500 hover:scale-[1.02] hover:shadow-xl`}
            >
              {/* Number badge */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-sm font-bold text-neutral-400">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm mb-6 ${iconColors[index % iconColors.length]}`}>
                {iconMap[benefit.icon] || iconMap.star}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed text-lg">
                {benefit.description}
              </p>

              {/* Decorative element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
