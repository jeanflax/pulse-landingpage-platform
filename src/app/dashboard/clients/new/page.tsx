'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colorOptions = [
  '#000000', '#1f2937', '#7c3aed', '#2563eb', '#0891b2',
  '#059669', '#ca8a04', '#ea580c', '#dc2626', '#db2777',
];

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    shopifyDomain: '',
    brandVoice: '',
    primaryColor: '#000000',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create client');
      }

      const client = await response.json();
      router.push(`/dashboard/clients/${client.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/dashboard/clients" className="text-neutral-500 hover:text-neutral-900">
          Clients
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900">New Client</span>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Add New Client</h2>
          <p className="text-neutral-500">
            Create a new client to start building landing pages for their store.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Acme Co"
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
            />
          </div>

          {/* Shopify Domain */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Shopify Store Domain
            </label>
            <div className="flex">
              <input
                type="text"
                value={form.shopifyDomain}
                onChange={(e) => setForm({ ...form, shopifyDomain: e.target.value })}
                placeholder="mystore"
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-l-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
              />
              <span className="px-4 py-3 bg-neutral-100 border border-l-0 border-neutral-200 rounded-r-xl text-neutral-500 text-sm">
                .myshopify.com
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              You can connect the Shopify store later to sync products.
            </p>
          </div>

          {/* Brand Voice */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Brand Voice
            </label>
            <textarea
              value={form.brandVoice}
              onChange={(e) => setForm({ ...form, brandVoice: e.target.value })}
              placeholder="Describe the brand's tone and style. e.g., 'Friendly and approachable, uses casual language, focuses on sustainability and quality craftsmanship.'"
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
            />
            <p className="mt-2 text-sm text-neutral-500">
              This helps AI generate copy that matches the brand&apos;s personality.
            </p>
          </div>

          {/* Brand Color */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Brand Color
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, primaryColor: color })}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    form.primaryColor === color
                      ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border-0"
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="p-4 bg-neutral-50 rounded-xl">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Preview</p>
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: form.primaryColor }}
              >
                {form.name ? form.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">
                  {form.name || 'Client Name'}
                </p>
                <p className="text-sm text-neutral-500">
                  {form.shopifyDomain ? `${form.shopifyDomain}.myshopify.com` : 'No store connected'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !form.name}
              className="flex-1 py-3 px-6 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </button>
            <Link
              href="/dashboard/clients"
              className="py-3 px-6 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
