'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TemplateSection {
  id: string;
  component: string;
  order: number;
  defaultContent: Record<string, unknown>;
}

interface ProjectEditorProps {
  projectId: string;
  initialContent: Record<string, unknown>;
  templateSections: TemplateSection[];
  status: string;
  slug: string;
}

const sectionIcons: Record<string, string> = {
  Hero: '🎯',
  Benefits: '✨',
  SocialProof: '⭐',
  ProductShowcase: '🛍️',
  FinalCTA: '🚀',
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

const improveStyles = [
  { id: 'more_urgent', label: 'More Urgent', icon: '⚡' },
  { id: 'more_emotional', label: 'More Emotional', icon: '❤️' },
  { id: 'more_professional', label: 'More Professional', icon: '💼' },
  { id: 'shorter', label: 'Shorter', icon: '✂️' },
  { id: 'longer', label: 'Longer', icon: '📝' },
];

export default function ProjectEditor({
  projectId,
  initialContent,
  templateSections,
  status,
  slug,
}: ProjectEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [activeSection, setActiveSection] = useState<string | null>(
    templateSections[0]?.id || null
  );
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [improvingField, setImprovingField] = useState<string | null>(null);
  const [showImproveMenu, setShowImproveMenu] = useState<string | null>(null);

  const sortedSections = [...templateSections].sort((a, b) => a.order - b.order);

  const handleContentChange = (sectionId: string, field: string, value: unknown) => {
    setContent((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] as Record<string, unknown> || {}),
        [field]: value,
      },
    }));
  };

  const handleImprove = async (sectionId: string, field: string, text: string, style: string) => {
    if (!text.trim()) return;

    setImprovingField(`${sectionId}-${field}`);
    setShowImproveMenu(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve',
          text,
          style,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to improve text');
      }

      const { improved } = await response.json();
      handleContentChange(sectionId, field, improved);
      setMessage({ type: 'success', text: 'Text improved with AI!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to improve text' });
    } finally {
      setImprovingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setMessage({ type: 'success', text: 'Changes saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setMessage(null);

    try {
      const newStatus = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setMessage({
        type: 'success',
        text: newStatus === 'PUBLISHED'
          ? 'Project published successfully!'
          : 'Project unpublished',
      });
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status' });
    } finally {
      setPublishing(false);
    }
  };

  const activeSectionData = sortedSections.find((s) => s.id === activeSection);
  const activeSectionContent = activeSection
    ? (content[activeSection] as Record<string, unknown>) || activeSectionData?.defaultContent || {}
    : {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sections List */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Sections</h2>
          <span className="text-sm text-neutral-500">{sortedSections.length} sections</span>
        </div>
        <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
          {sortedSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full px-6 py-4 flex items-center gap-3 text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-[oklch(0.95_0.02_244.9955)] border-l-4 border-[oklch(0.6723_0.1606_244.9955)]'
                  : 'hover:bg-neutral-50 border-l-4 border-transparent'
              }`}
            >
              <span className="text-xl">{sectionIcons[section.component] || '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${activeSection === section.id ? 'text-[oklch(0.5723_0.1606_244.9955)]' : 'text-neutral-900'}`}>
                  {section.component}
                </p>
                <p className="text-xs text-neutral-500">Section {index + 1}</p>
              </div>
              <svg className={`w-4 h-4 ${activeSection === section.id ? 'text-violet-500' : 'text-neutral-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Section Editor */}
        {activeSectionData ? (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sectionIcons[activeSectionData.component] || '📦'}</span>
                <div>
                  <h2 className="font-semibold text-neutral-900">{activeSectionData.component}</h2>
                  <p className="text-sm text-neutral-500">Edit section content</p>
                </div>
              </div>
              <a
                href="/dashboard/ai"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[oklch(0.6723_0.1606_244.9955)] bg-[oklch(0.95_0.02_244.9955)] rounded-lg hover:bg-[oklch(0.93_0.03_244.9955)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Generate
              </a>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(activeSectionData.defaultContent).map(([key, defaultValue]) => {
                const currentValue = activeSectionContent[key] ?? defaultValue;
                const valueType = typeof defaultValue;
                const fieldKey = `${activeSectionData.id}-${key}`;
                const isImproving = improvingField === fieldKey;

                if (valueType === 'string') {
                  const isLongText = (defaultValue as string).length > 100 || key.toLowerCase().includes('description');
                  return (
                    <div key={key} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-neutral-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {/* AI Improve Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowImproveMenu(showImproveMenu === fieldKey ? null : fieldKey)}
                            disabled={isImproving || !(currentValue as string).trim()}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[oklch(0.6723_0.1606_244.9955)] bg-[oklch(0.95_0.02_244.9955)] rounded-md hover:bg-[oklch(0.93_0.03_244.9955)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isImproving ? (
                              <>
                                <div className="w-3 h-3 border-2 border-[oklch(0.6723_0.1606_244.9955)] border-t-transparent rounded-full animate-spin" />
                                Improving...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                AI Improve
                              </>
                            )}
                          </button>
                          {/* Improve Menu Dropdown */}
                          {showImproveMenu === fieldKey && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 py-2">
                              {improveStyles.map((style) => (
                                <button
                                  key={style.id}
                                  onClick={() => handleImprove(activeSectionData.id, key, currentValue as string, style.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                                >
                                  <span>{style.icon}</span>
                                  <span>{style.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {isLongText ? (
                        <textarea
                          value={currentValue as string}
                          onChange={(e) => handleContentChange(activeSectionData.id, key, e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none resize-none"
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue as string}
                          onChange={(e) => handleContentChange(activeSectionData.id, key, e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        />
                      )}
                    </div>
                  );
                }

                if (valueType === 'boolean') {
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <label className="text-sm font-medium text-neutral-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleContentChange(activeSectionData.id, key, !currentValue)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          currentValue ? 'bg-[oklch(0.6723_0.1606_244.9955)]' : 'bg-neutral-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            currentValue ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>
                  );
                }

                if (Array.isArray(defaultValue)) {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-neutral-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-2">
                          {(currentValue as unknown[]).length} items
                        </p>
                        <textarea
                          value={JSON.stringify(currentValue, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              handleContentChange(activeSectionData.id, key, parsed);
                            } catch {
                              // Invalid JSON, ignore
                            }
                          }}
                          rows={6}
                          className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  );
                }

                if (valueType === 'object' && defaultValue !== null) {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-neutral-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <textarea
                          value={JSON.stringify(currentValue, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              handleContentChange(activeSectionData.id, key, parsed);
                            } catch {
                              // Invalid JSON, ignore
                            }
                          }}
                          rows={6}
                          className="w-full px-3 py-2 border border-neutral-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[oklch(0.6723_0.1606_244.9955)] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
              </svg>
            </div>
            <p className="text-neutral-500">Select a section to edit its content</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors ${
              status === 'PUBLISHED'
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
            }`}
          >
            {publishing ? (
              <>
                <div className={`w-4 h-4 border-2 ${status === 'PUBLISHED' ? 'border-amber-700' : 'border-white'} border-t-transparent rounded-full animate-spin`} />
                {status === 'PUBLISHED' ? 'Unpublishing...' : 'Publishing...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {status === 'PUBLISHED' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              </>
            )}
          </button>
        </div>

        {/* Preview Link */}
        {status === 'PUBLISHED' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-emerald-800">Published</p>
                  <p className="text-sm text-emerald-600">Your landing page is live</p>
                </div>
              </div>
              <a
                href={`/p/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Page
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
