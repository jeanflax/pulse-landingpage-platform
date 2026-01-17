'use client';

import React from 'react';
import FormField from './FormField';
import SectionCard from './SectionCard';
import { SocialProofProps, Testimonial } from '@/types/landing';

interface SocialProofEditorProps {
  data: SocialProofProps;
  onChange: (data: SocialProofProps) => void;
}

export default function SocialProofEditor({ data, onChange }: SocialProofEditorProps) {
  const handleSectionChange = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  const handleStatChange = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...(data.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange({ ...data, stats: newStats });
  };

  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string | number) => {
    const newTestimonials = [...data.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onChange({ ...data, testimonials: newTestimonials });
  };

  const addStat = () => {
    onChange({
      ...data,
      stats: [...(data.stats || []), { value: '', label: '' }],
    });
  };

  const removeStat = (index: number) => {
    const newStats = (data.stats || []).filter((_, i) => i !== index);
    onChange({ ...data, stats: newStats });
  };

  const addTestimonial = () => {
    onChange({
      ...data,
      testimonials: [...data.testimonials, { quote: '', author: '', title: '', rating: 5 }],
    });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = data.testimonials.filter((_, i) => i !== index);
    onChange({ ...data, testimonials: newTestimonials });
  };

  return (
    <SectionCard
      title="Social Proof Section"
      description="Stats and customer testimonials"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <FormField
            label="Section Title"
            name="sectionTitle"
            value={data.sectionTitle || ''}
            onChange={handleSectionChange}
            placeholder="e.g., Loved by Thousands"
          />
          <FormField
            label="Section Subtitle"
            name="sectionSubtitle"
            value={data.sectionSubtitle || ''}
            onChange={handleSectionChange}
            type="textarea"
            rows={2}
          />
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-900">Stats ({(data.stats || []).length})</h4>
            <button
              onClick={addStat}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Stat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(data.stats || []).map((stat, index) => (
              <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-500">Stat {index + 1}</span>
                  <button
                    onClick={() => removeStat(index)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                    placeholder="50K+"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                    placeholder="Happy Customers"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-900">Testimonials ({data.testimonials.length})</h4>
            <button
              onClick={addTestimonial}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Testimonial
            </button>
          </div>

          {data.testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 bg-neutral-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">Testimonial {index + 1}</span>
                {data.testimonials.length > 1 && (
                  <button
                    onClick={() => removeTestimonial(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Quote</label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  placeholder="Customer quote..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Author Name</label>
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Title/Role</label>
                  <input
                    type="text"
                    value={testimonial.title}
                    onChange={(e) => handleTestimonialChange(index, 'title', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg"
                    placeholder="Marketing Director"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Rating (1-5)</label>
                <select
                  value={testimonial.rating || 5}
                  onChange={(e) => handleTestimonialChange(index, 'rating', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
