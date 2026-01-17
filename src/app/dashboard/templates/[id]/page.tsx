import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import TemplatePreview from '@/components/dashboard/TemplatePreview';

export const dynamic = 'force-dynamic';

const typeColors: Record<string, { bg: string; text: string }> = {
  LANDING_PAGE: { bg: 'bg-[oklch(0.93_0.03_244.9955)]', text: 'text-[oklch(0.5723_0.1606_244.9955)]' },
  LISTICLE: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PDP: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

const sectionIcons: Record<string, string> = {
  // Core
  Hero: '🎯',
  Benefits: '✨',
  SocialProof: '⭐',
  ProductShowcase: '🛍️',
  FinalCTA: '🚀',
  // Listicle
  ListicleIntro: '📋',
  ListicleItems: '📝',
  ListicleConclusion: '✅',
  // PDP
  PDPHero: '🏷️',
  PDPDetails: '📄',
  PDPReviews: '💬',
  PDPUpsells: '🔗',
  // Premium DTC
  AnnouncementBar: '📢',
  VideoHero: '🎬',
  PressLogos: '📰',
  BeforeAfter: '↔️',
  ComparisonTable: '📊',
  FounderStory: '👤',
  UGCGallery: '📸',
  ProductCarousel: '🎠',
  TrustBadges: '🛡️',
};

interface TemplateSection {
  id: string;
  component: string;
  order: number;
  defaultContent: Record<string, unknown>;
}

// Map template names to their real website screenshot thumbnails
const templateThumbnails: Record<string, string> = {
  'Ridge Style - Minimalist Product': '/templates/thumbs/ridge-style.jpg',
  'Gymshark Style - Athletic Brand': '/templates/thumbs/gymshark-style.jpg',
  'Jones Road Style - Beauty Brand': '/templates/thumbs/jonesroad-style.jpg',
  'Hexclad Style - Premium Cookware': '/templates/thumbs/hexclad-style.jpg',
  'OLIPOP Style - Healthy Beverage': '/templates/thumbs/olipop-style.jpg',
  'Allbirds Style - Sustainable Fashion': '/templates/thumbs/allbirds-style.jpg',
};

export default async function TemplateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const template = await db.template.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { projects: true } },
    },
  });

  if (!template) {
    notFound();
  }

  const sections: TemplateSection[] = JSON.parse(template.sections as string);
  const colors = typeColors[template.type] || typeColors.LANDING_PAGE;
  const thumbnailUrl = templateThumbnails[template.name];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/templates" className="text-neutral-500 hover:text-neutral-900">
          Templates
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium">{template.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Template Preview Thumbnail */}
            <div className="w-64 aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-xl overflow-hidden flex-shrink-0 relative">
              {thumbnailUrl ? (
                <>
                  <img
                    src={thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    Inspired by {template.name.split(' Style')[0]}
                  </div>
                </>
              ) : (
                <div className="p-2 h-full">
                  <TemplatePreview sections={sections} category={template.category || undefined} />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-neutral-900">{template.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors.bg} ${colors.text}`}>
                  {template.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-neutral-500 max-w-xl mb-4">
                {template.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {sections.length} sections
                </span>
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  {template._count.projects} project{template._count.projects !== 1 ? 's' : ''}
                </span>
                {template.category && (
                  <span className="flex items-center gap-1.5 text-neutral-500 capitalize">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {template.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/projects/new?templateId=${template.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[oklch(0.6723_0.1606_244.9955)] text-white font-medium rounded-xl hover:bg-[oklch(0.5723_0.1606_244.9955)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Use This Template
            </Link>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Template Sections</h2>
          <p className="text-sm text-neutral-500">These are the building blocks of this template</p>
        </div>

        <div className="divide-y divide-neutral-100">
          {sections.sort((a, b) => a.order - b.order).map((section, index) => (
            <div key={section.id} className="px-6 py-5 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-neutral-100 rounded-xl text-lg">
                {sectionIcons[section.component] || '📦'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Section {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900">{section.component}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {getComponentDescription(section.component)}
                </p>

                {/* Default Content Preview */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.keys(section.defaultContent).slice(0, 4).map((key) => (
                    <span
                      key={key}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md font-mono"
                    >
                      {key}
                    </span>
                  ))}
                  {Object.keys(section.defaultContent).length > 4 && (
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-400 text-xs rounded-md">
                      +{Object.keys(section.defaultContent).length - 4} more
                    </span>
                  )}
                </div>
              </div>
              <div className="text-neutral-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Live Preview</h2>
            <p className="text-sm text-neutral-500">See how this template looks with sample content</p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
            <button className="px-3 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm">
              Desktop
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900">
              Mobile
            </button>
          </div>
        </div>

        <div className="p-6 bg-neutral-50">
          <div className="mx-auto max-w-4xl">
            {thumbnailUrl ? (
              <>
                <div className="rounded-xl overflow-hidden shadow-2xl border border-neutral-200">
                  <img
                    src={thumbnailUrl}
                    alt={template.name}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center text-sm text-neutral-500 mt-4">
                  Screenshot from {template.name.split(' Style')[0]}.com - Your template will replicate this layout with your content.
                </p>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-4 shadow-lg max-w-2xl mx-auto">
                  <TemplatePreview sections={sections} category={template.category || undefined} />
                </div>
                <p className="text-center text-sm text-neutral-500 mt-4">
                  This is a schematic preview. Create a project to see the full template with your content.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getComponentDescription(component: string): string {
  const descriptions: Record<string, string> = {
    // Core
    Hero: 'Full-width hero section with headline, subheadline, and CTA button',
    Benefits: 'Feature benefits grid with icons and descriptions',
    SocialProof: 'Customer testimonials and trust indicators',
    ProductShowcase: 'Product gallery with images and purchase options',
    FinalCTA: 'Final call-to-action section to drive conversions',
    // Listicle
    ListicleIntro: 'Article introduction with headline and meta info',
    ListicleItems: 'Ranked list of products or items with details',
    ListicleConclusion: 'Summary and final recommendations',
    // PDP
    PDPHero: 'Product detail hero with gallery and add-to-cart',
    PDPDetails: 'Product description tabs and specifications',
    PDPReviews: 'Customer reviews and ratings section',
    PDPUpsells: 'Related products and upsell recommendations',
    // Premium DTC
    AnnouncementBar: 'Rotating promotional banner with countdown timer support',
    VideoHero: 'Full-screen video/image hero with playback controls',
    PressLogos: '"As featured in" media logos with optional quotes',
    BeforeAfter: 'Interactive before/after image comparison slider',
    ComparisonTable: 'Product comparison table (us vs. competitors)',
    FounderStory: 'Founder quote and story section with photo',
    UGCGallery: 'User-generated content gallery from social media',
    ProductCarousel: 'Horizontal scrolling product cards with ratings',
    TrustBadges: 'Shipping, warranty, and trust indicator icons',
  };
  return descriptions[component] || 'Custom section component';
}
