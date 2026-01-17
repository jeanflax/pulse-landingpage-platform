'use client';

import React, { useState } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SectionCard({
  title,
  description,
  children,
  defaultOpen = false,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          {description && (
            <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-neutral-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
