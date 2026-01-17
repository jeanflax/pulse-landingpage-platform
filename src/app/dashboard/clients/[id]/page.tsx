import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ClientActions from './ClientActions';
import ShopifyConnect from '@/components/dashboard/ShopifyConnect';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await db.client.findUnique({
    where: { id: params.id },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
      },
      products: {
        orderBy: { title: 'asc' },
      },
      _count: { select: { projects: true, products: true } },
    },
  });

  // Parse product images for the component
  const productsWithParsedImages = client?.products.map((product) => ({
    ...product,
    images: JSON.parse(product.images || '[]') as Array<{ src: string; alt: string }>,
  })) || [];

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/clients" className="text-neutral-500 hover:text-neutral-900">
          Clients
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900">{client.name}</span>
      </div>

      {/* Client Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: client.primaryColor || '#000' }}
            >
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">{client.name}</h1>
              <p className="text-neutral-500">
                {client.shopifyDomain
                  ? `${client.shopifyDomain}.myshopify.com`
                  : 'No Shopify store connected'}
              </p>
              {client.brandVoice && (
                <p className="text-sm text-neutral-400 mt-2 max-w-md">
                  {client.brandVoice}
                </p>
              )}
            </div>
          </div>
          <ClientActions clientId={client.id} clientName={client.name} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-neutral-100">
          <div>
            <p className="text-3xl font-bold text-neutral-900">{client._count.projects}</p>
            <p className="text-sm text-neutral-500">Projects</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-900">{client._count.products}</p>
            <p className="text-sm text-neutral-500">Products Synced</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-900">
              {client.shopifyDomain ? (
                <span className="text-emerald-600">Connected</span>
              ) : (
                <span className="text-neutral-400">—</span>
              )}
            </p>
            <p className="text-sm text-neutral-500">Shopify Status</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/dashboard/projects/new?client=${client.id}`}
          className="bg-neutral-900 text-white rounded-2xl p-6 hover:bg-neutral-800 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">New Project</p>
              <p className="text-sm text-neutral-400">Create a landing page</p>
            </div>
          </div>
        </Link>

        <Link
          href={`/dashboard/ai?client=${client.id}`}
          className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-lg transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[oklch(0.93_0.03_244.9955)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[oklch(0.6723_0.1606_244.9955)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">AI Generate</p>
              <p className="text-sm text-neutral-500">Create content with AI</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Shopify Integration */}
      <ShopifyConnect
        clientId={client.id}
        shopifyDomain={client.shopifyDomain}
        products={productsWithParsedImages}
      />

      {/* Projects */}
      <div className="bg-white rounded-2xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Projects</h2>
          <Link
            href={`/dashboard/projects/new?client=${client.id}`}
            className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>

        {client.projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <p className="text-neutral-600 mb-4">No projects yet</p>
            <Link
              href={`/dashboard/projects/new?client=${client.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {client.projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{project.name}</p>
                  <p className="text-sm text-neutral-500">/{project.slug}</p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                      project.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : project.status === 'ARCHIVED'
                        ? 'bg-neutral-100 text-neutral-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {project.status === 'PUBLISHED' && (
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    )}
                    {project.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
