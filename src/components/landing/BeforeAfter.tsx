'use client';

import { useState, useRef, useEffect } from 'react';

interface BeforeAfterProps {
  title?: string;
  subtitle?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  aspectRatio?: string;
}

export default function BeforeAfter({
  title,
  subtitle,
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initialPosition = 50,
  aspectRatio = '16/9',
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-20 px-6 bg-neutral-50">
      <div className="max-w-4xl mx-auto">
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
          </div>
        )}

        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
          style={{ aspectRatio }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* After Image (Background) */}
          <img
            src={afterImage}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                width: containerRef.current?.offsetWidth || '100%',
                maxWidth: 'none'
              }}
              draggable={false}
            />
          </div>

          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 text-white text-sm font-medium rounded-full backdrop-blur-sm">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 text-black text-sm font-medium rounded-full backdrop-blur-sm">
            {afterLabel}
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-4">
          Drag the slider to compare
        </p>
      </div>
    </section>
  );
}
