'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  primaryColor: string | null;
}

interface Template {
  id: string;
  name: string;
  type: string;
  category: string | null;
  description: string | null;
  sections: string;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  LANDING_PAGE: { bg: 'bg-[oklch(0.93_0.03_244.9955)]', text: 'text-[oklch(0.5723_0.1606_244.9955)]' },
  LISTICLE: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PDP: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

// Map template names to thumbnails
const templateThumbnails: Record<string, string> = {
  'Ridge Style - Minimalist Product': '/templates/thumbs/ridge-style.jpg',
  'Gymshark Style - Athletic Brand': '/templates/thumbs/gymshark-style.jpg',
  'Jones Road Style - Beauty Brand': '/templates/thumbs/jonesroad-style.jpg',
  'Hexclad Style - Premium Cookware': '/templates/thumbs/hexclad-style.jpg',
  'OLIPOP Style - Healthy Beverage': '/templates/thumbs/olipop-style.jpg',
  'Allbirds Style - Sustainable Fashion': '/templates/thumbs/allbirds-style.jpg',
};

function NewProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplateId = searchParams.get('templateId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    name: '',
    clientId: '',
    templateId: preselectedTemplateId || '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsRes, templatesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/templates'),
        ]);

        if (!clientsRes.ok || !templatesRes.ok) {
          throw new Error('Failed to load data');
        }

        const [clientsData, templatesData] = await Promise.all([
          clientsRes.json(),
          templatesRes.json(),
        ]);

        setClients(clientsData);
        setTemplates(templatesData);

        // If template is preselected, auto-generate project name
        if (preselectedTemplateId) {
          const template = templatesData.find((t: Template) => t.id === preselectedTemplateId);
          if (template) {
            setForm(prev => ({
              ...prev,
              templateId: preselectedTemplateId,
              name: `${template.name.split(' - ')[0]} Landing Page`,
            }));
          }
        }
      } catch {
        setError('Failed to load clients and templates');
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [preselectedTemplateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const project = await response.json();
      router.push(`/dashboard/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === form.templateId);

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[oklch(0.6723_0.1606_244.9955)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/dashboard/projects" className="text-neutral-500 hover:text-neutral-900">
          Projects
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900">New Project</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Create New Project</h2>
            <p className="text-neutral-500">
              Set up a new landing page project for a client.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {clients.length === 0 ? (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-amber-800 mb-4">You need to create a client first before creating a project.</p>
              <Link
                href="/dashboard/clients/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Client First
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Summer Sale Landing Page"
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
                />
              </div>

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Client *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => setForm({ ...form, clientId: client.id })}
                      className={`flex items-center gap-3 p-4 border rounded-xl transition-all text-left ${
                        form.clientId === client.id
                          ? 'border-[oklch(0.6723_0.1606_244.9955)] bg-[oklch(0.95_0.02_244.9955)] ring-2 ring-[oklch(0.6723_0.1606_244.9955)]'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: client.primaryColor || '#000' }}
                      >
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-medium text-neutral-900 truncate">{client.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Template
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {templates.map((template) => {
                    const colors = typeColors[template.type] || typeColors.LANDING_PAGE;
                    const thumbnailUrl = templateThumbnails[template.name];
                    const sections = JSON.parse(template.sections as string);

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setForm({ ...form, templateId: template.id })}
                        className={`border rounded-xl overflow-hidden transition-all text-left ${
                          form.templateId === template.id
                            ? 'border-[oklch(0.6723_0.1606_244.9955)] ring-2 ring-[oklch(0.6723_0.1606_244.9955)]'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={template.name}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                              </svg>
                            </div>
                          )}
                          {form.templateId === template.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[oklch(0.95_0.02_244.9955)]0 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-neutral-900 text-sm truncate">{template.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                              {template.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-neutral-500">{sections.length} sections</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Select a template or{' '}
                  <Link href="/dashboard/templates" className="text-[oklch(0.6723_0.1606_244.9955)] hover:underline">
                    browse all templates
                  </Link>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.clientId}
                  className="flex-1 py-3 px-6 bg-[oklch(0.6723_0.1606_244.9955)] text-white font-medium rounded-xl hover:bg-[oklch(0.5723_0.1606_244.9955)] disabled:from-neutral-300 disabled:to-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <Link
                  href="/dashboard/projects"
                  className="py-3 px-6 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Preview</h3>

            {selectedTemplate ? (
              <div>
                <div className="aspect-[16/10] bg-neutral-100 rounded-xl overflow-hidden mb-4">
                  {templateThumbnails[selectedTemplate.name] ? (
                    <img
                      src={templateThumbnails[selectedTemplate.name]}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="font-medium text-neutral-900">{selectedTemplate.name}</p>
                <p className="text-sm text-neutral-500 mt-1">{selectedTemplate.description || 'No description'}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[selectedTemplate.type]?.bg || 'bg-[oklch(0.93_0.03_244.9955)]'} ${typeColors[selectedTemplate.type]?.text || 'text-[oklch(0.5723_0.1606_244.9955)]'}`}>
                    {selectedTemplate.type.replace('_', ' ')}
                  </span>
                  {selectedTemplate.category && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 capitalize">
                      {selectedTemplate.category}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function NewProjectPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewProjectContent />
    </Suspense>
  );
}
