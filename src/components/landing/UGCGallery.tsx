'use client';

import { useState } from 'react';

interface UGCItem {
  imageUrl: string;
  username: string;
  caption?: string;
  likes?: number;
  productLink?: string;
}

interface UGCGalleryProps {
  title?: string;
  subtitle?: string;
  items: UGCItem[];
  columns?: 3 | 4 | 5 | 6;
  showOverlay?: boolean;
  instagramHandle?: string;
}

export default function UGCGallery({
  title = 'Real People, Real Results',
  subtitle,
  items,
  columns = 4,
  showOverlay = true,
  instagramHandle,
}: UGCGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<UGCItem | null>(null);

  const columnClasses = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6',
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            {instagramHandle && (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @{instagramHandle}
              </a>
            )}
          </div>
        )}

        <div className={`grid ${columnClasses[columns]} gap-2`}>
          {items.map((item, i) => (
            <div
              key={i}
              className="relative aspect-square group cursor-pointer overflow-hidden"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.imageUrl}
                alt={`Post by ${item.username}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {showOverlay && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <p className="font-medium">@{item.username}</p>
                    {item.likes && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-sm">{item.likes.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {instagramHandle && (
          <div className="text-center mt-8">
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-neutral-900 text-neutral-900 font-medium rounded-full hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Follow Us on Instagram
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="grid md:grid-cols-2">
              <img
                src={selectedItem.imageUrl}
                alt={`Post by ${selectedItem.username}`}
                className="w-full aspect-square object-cover"
              />
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-lg">@{selectedItem.username}</p>
                  {selectedItem.caption && (
                    <p className="mt-4 text-neutral-600">{selectedItem.caption}</p>
                  )}
                </div>
                {selectedItem.productLink && (
                  <a
                    href={selectedItem.productLink}
                    className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    Shop This Look
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
