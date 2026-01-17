'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SeedTemplatesButtonProps {
  variant?: 'primary' | 'secondary';
}

export default function SeedTemplatesButton({ variant = 'primary' }: SeedTemplatesButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/templates/seed', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        router.refresh();
      } else {
        console.error('Failed to seed:', data.error);
      }
    } catch (error) {
      console.error('Error seeding templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'secondary') {
    return (
      <button
        onClick={handleSeed}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors text-sm disabled:opacity-50"
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
        {loading ? 'Seeding...' : 'Seed Templates'}
      </button>
    );
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[oklch(0.6723_0.1606_244.9955)] text-white font-medium rounded-xl hover:bg-[oklch(0.5723_0.1606_244.9955)] transition-colors disabled:opacity-50"
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )}
      {loading ? 'Loading...' : 'Load Starter Templates'}
    </button>
  );
}
