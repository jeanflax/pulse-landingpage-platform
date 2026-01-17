'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  primaryColor: string | null;
  brandVoice: string | null;
}

interface Template {
  id: string;
  name: string;
  type: string;
  category: string | null;
}

interface GeneratedSection {
  sectionId: string;
  content: Record<string, unknown>;
}

interface GenerationResult {
  sections: GeneratedSection[];
  suggestions?: string[];
}

const trafficSources = [
  { id: 'DEFAULT', name: 'Default', description: 'Balanced copy for all audiences' },
  { id: 'META', name: 'Meta Ads', description: 'Social media optimized' },
  { id: 'GOOGLE', name: 'Google Ads', description: 'Search intent optimized' },
  { id: 'EMAIL', name: 'Email', description: 'Subscriber focused' },
  { id: 'TIKTOK', name: 'TikTok', description: 'Gen-Z friendly' },
];

export default function AIGeneratePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);

  const [form, setForm] = useState({
    clientId: '',
    templateId: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    targetAudience: '',
    keyBenefits: '',
    competitors: '',
    trafficSource: 'DEFAULT',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsRes, templatesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/templates'),
        ]);
        const [clientsData, templatesData] = await Promise.all([
          clientsRes.json(),
          templatesRes.json(),
        ]);
        setClients(clientsData);
        setTemplates(templatesData);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!form.productName || !form.productDescription) {
      setError('Product name and description are required');
      return;
    }

    setGenerating(true);
    setError('');
    setResult(null);

    try {
      const selectedTemplate = templates.find(t => t.id === form.templateId);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full',
          clientId: form.clientId || undefined,
          templateType: selectedTemplate?.type || 'LANDING_PAGE',
          trafficSource: form.trafficSource,
          productName: form.productName,
          productDescription: form.productDescription,
          productPrice: form.productPrice || undefined,
          targetAudience: form.targetAudience || undefined,
          keyBenefits: form.keyBenefits ? form.keyBenefits.split('\n').filter(Boolean) : undefined,
          competitors: form.competitors ? form.competitors.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Generation failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateProject = async () => {
    if (!result || !form.clientId || !form.templateId) {
      setError('Please select a client and template, then generate content');
      return;
    }

    setCreatingProject(true);
    setError('');

    try {
      // Convert sections array to content object
      const content: Record<string, unknown> = {};
      for (const section of result.sections) {
        content[section.sectionId] = section.content;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.productName} Landing Page`,
          clientId: form.clientId,
          templateId: form.templateId,
          content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const project = await response.json();
      router.push(`/dashboard/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[oklch(0.6723_0.1606_244.9955)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">AI Content Generator</h2>
        <p className="text-neutral-500">Generate high-converting landing page content with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-[oklch(0.93_0.03_244.9955)] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[oklch(0.6723_0.1606_244.9955)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            Product Details
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Client</label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
              >
                <option value="">Select a client (optional)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-neutral-500">Client&apos;s brand voice will be used for generation</p>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Template</label>
              <select
                value={form.templateId}
                onChange={(e) => setForm({ ...form, templateId: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.type.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder="e.g., Premium Vitamin C Serum"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Product Description *</label>
              <textarea
                value={form.productDescription}
                onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
                placeholder="Describe your product in detail. Include key features, benefits, and what makes it unique..."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Product Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Price</label>
              <input
                type="text"
                value={form.productPrice}
                onChange={(e) => setForm({ ...form, productPrice: e.target.value })}
                placeholder="e.g., $49.99"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
              />
            </div>

            {/* Traffic Source */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Traffic Source</label>
              <div className="grid grid-cols-5 gap-2">
                {trafficSources.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => setForm({ ...form, trafficSource: source.id })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      form.trafficSource === source.id
                        ? 'border-[oklch(0.6723_0.1606_244.9955)] bg-[oklch(0.95_0.02_244.9955)] ring-2 ring-[oklch(0.6723_0.1606_244.9955)]'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className={`text-sm font-medium ${form.trafficSource === source.id ? 'text-[oklch(0.5723_0.1606_244.9955)]' : 'text-neutral-900'}`}>
                      {source.name}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {trafficSources.find(s => s.id === form.trafficSource)?.description}
              </p>
            </div>

            {/* Advanced Options */}
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-neutral-700 flex items-center gap-2">
                <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Advanced Options
              </summary>
              <div className="mt-4 space-y-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                    placeholder="e.g., Health-conscious women aged 25-40"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Key Benefits (one per line)</label>
                  <textarea
                    value={form.keyBenefits}
                    onChange={(e) => setForm({ ...form, keyBenefits: e.target.value })}
                    placeholder="Reduces wrinkles in 2 weeks&#10;Clinically proven formula&#10;100% organic ingredients"
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Competitors (comma separated)</label>
                  <input
                    type="text"
                    value={form.competitors}
                    onChange={(e) => setForm({ ...form, competitors: e.target.value })}
                    placeholder="e.g., Brand A, Brand B, Brand C"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </details>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !form.productName || !form.productDescription}
              className="w-full py-4 px-6 bg-[oklch(0.6723_0.1606_244.9955)] text-white font-medium rounded-xl hover:bg-[oklch(0.5723_0.1606_244.9955)] disabled:from-neutral-300 disabled:to-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Generated Content
          </h3>

          {!result ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-neutral-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-neutral-500">Fill in the product details and click Generate</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-medium text-amber-800 mb-2">AI Suggestions</p>
                  <ul className="space-y-1">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Generated Sections */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {result.sections.map((section, index) => (
                  <div key={section.sectionId} className="border border-neutral-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                      <span className="font-medium text-neutral-900 capitalize">
                        {section.sectionId.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs text-neutral-500">Section {index + 1}</span>
                    </div>
                    <div className="p-4">
                      <pre className="text-xs text-neutral-600 whitespace-pre-wrap font-mono bg-neutral-50 p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(section.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Project Button */}
              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={handleCreateProject}
                  disabled={creatingProject || !form.clientId || !form.templateId}
                  className="w-full py-4 px-6 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {creatingProject ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Project with This Content
                    </>
                  )}
                </button>
                {(!form.clientId || !form.templateId) && result && (
                  <p className="mt-2 text-xs text-center text-neutral-500">
                    Select a client and template above to create a project
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
