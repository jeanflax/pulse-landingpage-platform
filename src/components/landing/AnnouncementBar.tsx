'use client';

import { useState, useEffect } from 'react';

interface Announcement {
  text: string;
  link?: string;
  linkText?: string;
}

interface AnnouncementBarProps {
  announcements: Announcement[];
  backgroundColor?: string;
  textColor?: string;
  rotateInterval?: number;
  showCountdown?: boolean;
  countdownEnd?: string;
}

export default function AnnouncementBar({
  announcements,
  backgroundColor = '#000',
  textColor = '#fff',
  rotateInterval = 4000,
  showCountdown = false,
  countdownEnd,
}: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [announcements.length, rotateInterval]);

  useEffect(() => {
    if (!showCountdown || !countdownEnd) return;

    const calculateTimeLeft = () => {
      const difference = new Date(countdownEnd).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [showCountdown, countdownEnd]);

  const current = announcements[currentIndex];

  return (
    <div
      className="relative overflow-hidden py-2.5 px-4"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 animate-fade-in" key={currentIndex}>
          <span>{current.text}</span>
          {current.link && (
            <a
              href={current.link}
              className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
            >
              {current.linkText || 'Shop Now'}
            </a>
          )}
        </div>

        {showCountdown && countdownEnd && (
          <div className="flex items-center gap-1 font-mono text-xs bg-white/10 px-3 py-1 rounded-full">
            <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>:
            <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>:
            <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {announcements.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1 h-1 rounded-full transition-all ${
                i === currentIndex ? 'bg-white w-3' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
