import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  DRAFT: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  PUBLISHED: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  ARCHIVED: { bg: 'bg-neutral-100', text: 'text-neutral-600', dot: 'bg-neutral-400' },
};

const typeColors: Record<string, { bg: string; text: string }> = {
  LANDING_PAGE: { bg: 'bg-[oklch(0.93_0.03_244.9955)]', text: 'text-[oklch(0.5723_0.1606_244.9955)]' },
  LISTICLE: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PDP: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: { id: true, name: true, primaryColor: true },
      },
      template: {
        select: { id: true, name: true, type: true, category: true },
      },
      _count: { select: { variants: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">All Projects</h2>
          <p className="text-neutral-500">Manage landing pages across all clients</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[oklch(0.6723_0.1606_244.9955)] text-white font-medium rounded-xl hover:bg-[oklch(0.5723_0.1606_244.9955)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
        <button className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg">
          All
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          Published
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          Drafts
        </button>
        <button className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          Archived
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects yet</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Create your first landing page project to get started.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[oklch(0.6723_0.1606_244.9955)] text-white font-medium rounded-xl hover:bg-[oklch(0.5723_0.1606_244.9955)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {projects.map((project) => {
                const status = statusColors[project.status] || statusColors.DRAFT;
                const type = project.template?.type
                  ? (typeColors[project.template.type] || typeColors.LANDING_PAGE)
                  : typeColors.LANDING_PAGE;

                return (
                  <tr key={project.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/projects/${project.id}`} className="group">
                        <p className="font-semibold text-neutral-900 group-hover:text-[oklch(0.6723_0.1606_244.9955)] transition-colors">
                          {project.name}
                        </p>
                        <p className="text-sm text-neutral-500 font-mono">
                          /p/{project.slug}
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/clients/${project.client.id}`} className="flex items-center gap-2 hover:opacity-80">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: project.client.primaryColor || '#000' }}
                        >
                          {project.client.name.charAt(0)}
                        </div>
                        <span className="text-sm text-neutral-700">{project.client.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {project.template ? (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${type.bg} ${type.text}`}>
                            {project.template.type.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-neutral-600 truncate max-w-[120px]">
                            {project.template.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">No template</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">
                        {project._count.variants} variant{project._count.variants !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        {project.status === 'PUBLISHED' && (
                          <Link
                            href={`/p/${project.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-500 hover:text-[oklch(0.6723_0.1606_244.9955)] hover:bg-[oklch(0.95_0.02_244.9955)] rounded-lg transition-colors"
                            title="View Live"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
