'use client';

import { useState, useRef } from 'react';

interface VideoHeroProps {
  headline: string;
  subheadline?: string;
  videoUrl?: string;
  videoPoster?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
  overlayOpacity?: number;
  alignment?: 'left' | 'center' | 'right';
  minHeight?: string;
}

export default function VideoHero({
  headline,
  subheadline,
  videoUrl,
  videoPoster,
  backgroundImage,
  ctaText = 'Shop Now',
  ctaLink = '#',
  secondaryCtaText,
  secondaryCtaLink,
  badge,
  overlayOpacity = 0.4,
  alignment = 'center',
  minHeight = '90vh',
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight }}
    >
      {/* Video or Image Background */}
      {videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={videoPoster}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className={`relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col ${alignmentClasses[alignment]}`}>
        {badge && (
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-white text-black rounded-full">
            {badge}
          </span>
        )}

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            {subheadline}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-10">
          <a
            href={ctaLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-neutral-100 transition-all hover:scale-105"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          {secondaryCtaText && (
            <a
              href={secondaryCtaLink || '#'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white/30 hover:border-white/60 transition-all"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>

      {/* Video Controls */}
      {videoUrl && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          <button
            onClick={togglePlay}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
