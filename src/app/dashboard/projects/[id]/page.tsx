import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProjectEditor from '@/components/dashboard/ProjectEditor';

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

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      template: true,
      variants: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const status = statusColors[project.status] || statusColors.DRAFT;
  const type = project.template?.type
    ? (typeColors[project.template.type] || typeColors.LANDING_PAGE)
    : typeColors.LANDING_PAGE;

  const content = JSON.parse(project.content as string);
  const templateSections = project.template
    ? JSON.parse(project.template.sections as string)
    : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/projects" className="text-neutral-500 hover:text-neutral-900">
          Projects
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium">{project.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Client Avatar */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: project.client.primaryColor || '#000' }}
            >
              {project.client.name.charAt(0)}
            </div>

            {/* Project Info */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-neutral-900">{project.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/dashboard/clients/${project.client.id}`} className="text-neutral-500 hover:text-neutral-900">
                  {project.client.name}
                </Link>
                <span className="text-neutral-300">•</span>
                <span className="font-mono text-neutral-400">/p/{project.slug}</span>
                {project.template && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${type.bg} ${type.text}`}>
                      {project.template.type.replace('_', ' ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {project.status === 'PUBLISHED' && (
              <Link
                href={`/p/${project.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <ProjectEditor
        projectId={project.id}
        initialContent={content}
        templateSections={templateSections}
        status={project.status}
        slug={project.slug}
      />
    </div>
  );
}
