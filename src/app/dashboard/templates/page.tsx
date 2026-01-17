import Link from 'next/link';
import { db } from '@/lib/db';
import SeedTemplatesButton from '@/components/dashboard/SeedTemplatesButton';
import TemplatePreview from '@/components/dashboard/TemplatePreview';

export const dynamic = 'force-dynamic';

const typeColors: Record<string, { bg: string; text: string }> = {
  LANDING_PAGE: { bg: 'bg-[oklch(0.93_0.03_244.9955)]', text: 'text-[oklch(0.5723_0.1606_244.9955)]' },
  LISTICLE: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PDP: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

const categoryIcons: Record<string, string> = {
  ecommerce: '🛍️',
  beauty: '✨',
  fitness: '💪',
  tech: '⚡',
  content: '📝',
  accessories: '👜',
  home: '🏠',
  food: '🥤',
  fashion: '👟',
};

// Map template names to their real website screenshot thumbnails
const templateThumbnails: Record<string, string> = {
  'Ridge Style - Minimalist Product': '/templates/thumbs/ridge-style.jpg',
  'Gymshark Style - Athletic Brand': '/templates/thumbs/gymshark-style.jpg',
  'Jones Road Style - Beauty Brand': '/templates/thumbs/jonesroad-style.jpg',
  'Hexclad Style - Premium Cookware': '/templates/thumbs/hexclad-style.jpg',
  'OLIPOP Style - Healthy Beverage': '/templates/thumbs/olipop-style.jpg',
  'Allbirds Style - Sustainable Fashion': '/templates/thumbs/allbirds-style.jpg',
};

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { projects: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Template Gallery</h2>
          <p className="text-neutral-500">Choose a template to start building landing pages</p>
        </div>
        <div className="flex items-center gap-3">
          <SeedTemplatesButton variant="secondary" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
        <button className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg">
          All
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          Landing Pages
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          Listicles
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          PDPs
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No templates yet</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Seed the starter templates to get started with PULSE.
          </p>
          <SeedTemplatesButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const colors = typeColors[template.type] || typeColors.LANDING_PAGE;
            const icon = categoryIcons[template.category || 'ecommerce'] || '📄';
            const sections = JSON.parse(template.sections as string);
            const thumbnailUrl = templateThumbnails[template.name];

            return (
              <Link
                key={template.id}
                href={`/dashboard/templates/${template.id}`}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all group"
              >
                {/* Template Preview */}
                <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-50 relative overflow-hidden">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="p-3 h-full">
                      <TemplatePreview sections={sections} category={template.category || undefined} />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Preview Template
                    </span>
                  </div>
                  {/* Brand badge */}
                  {thumbnailUrl && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                      Inspired by {template.name.split(' Style')[0]}
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 truncate group-hover:text-[oklch(0.6723_0.1606_244.9955)] transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                        {template.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                        {template.type.replace('_', ' ')}
                      </span>
                      {template.category && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 capitalize">
                          {template.category}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400">
                      {sections.length} sections
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
