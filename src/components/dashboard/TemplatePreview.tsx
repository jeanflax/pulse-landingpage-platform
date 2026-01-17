'use client';

interface Section {
  id: string;
  component: string;
  order: number;
}

interface TemplatePreviewProps {
  sections: Section[];
  category?: string;
}

// Color schemes per category
const categoryColors: Record<string, { primary: string; secondary: string; accent: string }> = {
  accessories: { primary: '#1a1a1a', secondary: '#374151', accent: '#f59e0b' },
  fitness: { primary: '#000000', secondary: '#18181b', accent: '#22c55e' },
  beauty: { primary: '#f5f0eb', secondary: '#d4c4b5', accent: '#be8c63' },
  home: { primary: '#1f2937', secondary: '#374151', accent: '#ef4444' },
  food: { primary: '#6B4FA2', secondary: '#8b5cf6', accent: '#fbbf24' },
  fashion: { primary: '#f5f5f5', secondary: '#e5e5e5', accent: '#16a34a' },
};

// Section visual representations
const sectionVisuals: Record<string, (colors: typeof categoryColors.accessories) => JSX.Element> = {
  AnnouncementBar: (colors) => (
    <div className="h-2 w-full" style={{ backgroundColor: colors.primary }} />
  ),
  Hero: (colors) => (
    <div className="h-12 w-full relative" style={{ backgroundColor: colors.secondary }}>
      <div className="absolute inset-2 flex flex-col justify-center items-center">
        <div className="h-1.5 w-16 bg-white/80 rounded mb-1" />
        <div className="h-1 w-10 bg-white/50 rounded" />
      </div>
    </div>
  ),
  VideoHero: (colors) => (
    <div className="h-14 w-full relative" style={{ backgroundColor: colors.primary }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-white/60 flex items-center justify-center">
          <div className="w-0 h-0 border-l-4 border-l-white/60 border-y-2 border-y-transparent ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="h-1 w-12 bg-white/80 rounded mb-0.5" />
        <div className="h-0.5 w-8 bg-white/50 rounded" />
      </div>
    </div>
  ),
  TrustBadges: (colors) => (
    <div className="h-4 w-full bg-neutral-100 flex items-center justify-center gap-2 px-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
          <div className="h-0.5 w-3 bg-neutral-300 rounded" />
        </div>
      ))}
    </div>
  ),
  ComparisonTable: (colors) => (
    <div className="h-8 w-full bg-neutral-50 p-1">
      <div className="h-full flex flex-col gap-0.5">
        <div className="flex gap-1 flex-1">
          <div className="flex-1 bg-neutral-200 rounded-sm" />
          <div className="w-4 rounded-sm" style={{ backgroundColor: colors.accent }} />
          <div className="w-4 bg-neutral-300 rounded-sm" />
        </div>
        <div className="flex gap-1 flex-1">
          <div className="flex-1 bg-neutral-200 rounded-sm" />
          <div className="w-4 rounded-sm" style={{ backgroundColor: colors.accent }} />
          <div className="w-4 bg-neutral-300 rounded-sm" />
        </div>
      </div>
    </div>
  ),
  ProductCarousel: (colors) => (
    <div className="h-10 w-full bg-white p-1">
      <div className="h-1 w-8 bg-neutral-300 rounded mb-1 mx-auto" />
      <div className="flex gap-1 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-6 h-6 bg-neutral-100 rounded flex-shrink-0 flex flex-col">
            <div className="flex-1 rounded-t" style={{ backgroundColor: `${colors.secondary}20` }} />
            <div className="h-1 m-0.5 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  ),
  SocialProof: (colors) => (
    <div className="h-8 w-full" style={{ backgroundColor: colors.primary }}>
      <div className="h-full flex items-center justify-center gap-3 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-1.5 w-4 bg-white/80 rounded mx-auto mb-0.5" />
            <div className="h-0.5 w-3 bg-white/40 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  ),
  Benefits: (colors) => (
    <div className="h-8 w-full bg-white p-1">
      <div className="flex gap-1 h-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-neutral-50 rounded p-0.5 flex flex-col items-center">
            <div className="w-2 h-2 rounded-full mb-0.5" style={{ backgroundColor: `${colors.accent}40` }} />
            <div className="h-0.5 w-full bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  ),
  PressLogos: () => (
    <div className="h-4 w-full bg-neutral-50 flex items-center justify-center gap-2 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-1.5 w-6 bg-neutral-300 rounded" />
      ))}
    </div>
  ),
  FounderStory: (colors) => (
    <div className="h-8 w-full bg-white p-1 flex gap-2">
      <div className="w-6 h-full rounded" style={{ backgroundColor: `${colors.secondary}30` }} />
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-0.5 w-full bg-neutral-200 rounded mb-0.5" />
        <div className="h-0.5 w-3/4 bg-neutral-200 rounded mb-1" />
        <div className="h-0.5 w-8 bg-neutral-300 rounded" />
      </div>
    </div>
  ),
  BeforeAfter: (colors) => (
    <div className="h-8 w-full bg-neutral-100 p-1 flex">
      <div className="w-1/2 h-full rounded-l" style={{ backgroundColor: `${colors.secondary}40` }} />
      <div className="w-0.5 bg-white" />
      <div className="w-1/2 h-full rounded-r" style={{ backgroundColor: `${colors.accent}40` }} />
    </div>
  ),
  UGCGallery: (colors) => (
    <div className="h-6 w-full bg-white p-0.5">
      <div className="grid grid-cols-4 gap-0.5 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-sm" style={{ backgroundColor: `${colors.secondary}${20 + i * 10}` }} />
        ))}
      </div>
    </div>
  ),
  FinalCTA: (colors) => (
    <div className="h-6 w-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
      <div className="px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.accent }}>
        <div className="h-1 w-6 bg-white/80 rounded" />
      </div>
    </div>
  ),
};

// Default section visual
const defaultSection = () => (
  <div className="h-4 w-full bg-neutral-100 flex items-center justify-center">
    <div className="h-1 w-8 bg-neutral-300 rounded" />
  </div>
);

export default function TemplatePreview({ sections, category = 'accessories' }: TemplatePreviewProps) {
  const colors = categoryColors[category] || categoryColors.accessories;
  const sortedSections = [...sections].sort((a, b) => a.order - b.order).slice(0, 8);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
      {sortedSections.map((section) => {
        const Visual = sectionVisuals[section.component] || defaultSection;
        return (
          <div key={section.id} className="flex-shrink-0">
            {Visual(colors)}
          </div>
        );
      })}
    </div>
  );
}
