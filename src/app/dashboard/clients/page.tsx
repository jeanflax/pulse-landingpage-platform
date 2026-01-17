import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await db.client.findMany({
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
          <h2 className="text-2xl font-bold text-neutral-900">All Clients</h2>
          <p className="text-neutral-500">Manage your Shopify clients and their landing pages</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </Link>
      </div>

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No clients yet</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Add your first client to start creating landing pages for their Shopify store.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: client.primaryColor || '#000' }}
                >
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 truncate group-hover:text-neutral-700">
                    {client.name}
                  </h3>
                  <p className="text-sm text-neutral-500 truncate">
                    {client.shopifyDomain || 'No store connected'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-neutral-500">
                    {client._count.projects} project{client._count.projects !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {client.shopifyDomain ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                      Not connected
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* Add New Card */}
          <Link
            href="/dashboard/clients/new"
            className="bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 p-6 hover:border-neutral-400 hover:bg-neutral-100 transition-all flex items-center justify-center min-h-[180px]"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-neutral-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-medium text-neutral-600">Add New Client</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
