import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [clientCount, projectCount, publishedCount] = await Promise.all([
    db.client.count(),
    db.project.count(),
    db.project.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const recentClients = await db.client.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { projects: true } },
    },
  });

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">{clientCount}</p>
              <p className="text-sm text-neutral-500">Total Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">{projectCount}</p>
              <p className="text-sm text-neutral-500">Total Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[oklch(0.93_0.03_244.9955)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[oklch(0.6723_0.1606_244.9955)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">{publishedCount}</p>
              <p className="text-sm text-neutral-500">Published Pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/clients/new"
          className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Add New Client</p>
              <p className="text-sm text-neutral-500">Connect a Shopify store</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/templates"
          className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Browse Templates</p>
              <p className="text-sm text-neutral-500">Start with a pre-built design</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-2xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Recent Clients</h2>
          <Link href="/dashboard/clients" className="text-sm text-neutral-500 hover:text-neutral-900">
            View all
          </Link>
        </div>
        {recentClients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-neutral-600 mb-4">No clients yet</p>
            <Link
              href="/dashboard/clients/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add your first client
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentClients.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: client.primaryColor || '#000' }}
                >
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{client.name}</p>
                  <p className="text-sm text-neutral-500 truncate">
                    {client.shopifyDomain || 'No store connected'}
                  </p>
                </div>
                <div className="text-sm text-neutral-500">
                  {client._count.projects} project{client._count.projects !== 1 ? 's' : ''}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
