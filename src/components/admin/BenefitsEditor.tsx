'use client';

import React from 'react';
import FormField from './FormField';
import SectionCard from './SectionCard';
import { BenefitsProps, Benefit } from '@/types/landing';

interface BenefitsEditorProps {
  data: BenefitsProps;
  onChange: (data: BenefitsProps) => void;
}

const iconOptions = [
  { value: 'shield', label: 'Shield' },
  { value: 'lightning', label: 'Lightning' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'truck', label: 'Truck' },
  { value: 'refresh', label: 'Refresh' },
];

export default function BenefitsEditor({ data, onChange }: BenefitsEditorProps) {
  const handleSectionChange = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  const handleBenefitChange = (index: number, field: keyof Benefit, value: string) => {
    const newBenefits = [...data.benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    onChange({ ...data, benefits: newBenefits });
  };

  const addBenefit = () => {
    onChange({
      ...data,
      benefits: [...data.benefits, { icon: 'star', title: '', description: '' }],
    });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = data.benefits.filter((_, i) => i !== index);
    onChange({ ...data, benefits: newBenefits });
  };

  return (
    <SectionCard
      title="Benefits Section"
      description="Highlight key product benefits"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <FormField
            label="Section Title"
            name="sectionTitle"
            value={data.sectionTitle || ''}
            onChange={handleSectionChange}
            placeholder="e.g., Why Choose Us"
          />
          <FormField
            label="Section Subtitle"
            name="sectionSubtitle"
            value={data.sectionSubtitle || ''}
            onChange={handleSectionChange}
            type="textarea"
            rows={2}
            placeholder="Brief description of your benefits"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-900">Benefits ({data.benefits.length})</h4>
            <button
              onClick={addBenefit}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Benefit
            </button>
          </div>

          {data.benefits.map((benefit, index) => (
            <div key={index} className="p-4 bg-neutral-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">Benefit {index + 1}</span>
                {data.benefits.length > 1 && (
                  <button
                    onClick={() => removeBenefit(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Icon</label>
                <select
                  value={benefit.icon}
                  onChange={(e) => handleBenefitChange(index, 'icon', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  placeholder="Benefit title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={benefit.description}
                  onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  placeholder="Explain this benefit"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
