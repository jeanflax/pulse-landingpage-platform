'use client';

import React, { useState, useEffect } from 'react';
import {
  HeroEditor,
  BenefitsEditor,
  SocialProofEditor,
  ProductShowcaseEditor,
  CTAEditor,
} from '@/components/admin';
import { LandingPageData } from '@/types/landing';

export default function AdminPage() {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/landing');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-600">Error loading data. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Landing Page Editor</h1>
            <p className="text-sm text-neutral-500">Edit your landing page content</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                saving
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : saveStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : saveStatus === 'success' ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </span>
              ) : saveStatus === 'error' ? (
                'Error - Try Again'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <HeroEditor
            data={data.hero}
            onChange={(hero) => setData({ ...data, hero })}
          />
          <BenefitsEditor
            data={data.benefits}
            onChange={(benefits) => setData({ ...data, benefits })}
          />
          <SocialProofEditor
            data={data.socialProof}
            onChange={(socialProof) => setData({ ...data, socialProof })}
          />
          <ProductShowcaseEditor
            data={data.productShowcase}
            onChange={(productShowcase) => setData({ ...data, productShowcase })}
          />
          <CTAEditor
            data={data.cta}
            onChange={(cta) => setData({ ...data, cta })}
          />
        </div>

        {/* Bottom Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Changes are saved to the server and will appear on the live page.
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Spacer for bottom bar */}
        <div className="h-20"></div>
      </main>
    </div>
  );
}
