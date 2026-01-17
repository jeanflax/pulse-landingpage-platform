'use client';

import React from 'react';
import FormField from './FormField';
import SectionCard from './SectionCard';
import { CTAProps } from '@/types/landing';

interface CTAEditorProps {
  data: CTAProps;
  onChange: (data: CTAProps) => void;
}

export default function CTAEditor({ data, onChange }: CTAEditorProps) {
  const handleChange = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <SectionCard
      title="Final CTA Section"
      description="Closing call-to-action to drive conversions"
    >
      <div className="space-y-4">
        <FormField
          label="Headline"
          name="headline"
          value={data.headline}
          onChange={handleChange}
          placeholder="e.g., Ready to Get Started?"
        />
        <FormField
          label="Subheadline"
          name="subheadline"
          value={data.subheadline || ''}
          onChange={handleChange}
          type="textarea"
          rows={2}
          placeholder="Supporting text with value proposition"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="CTA Button Text"
            name="ctaText"
            value={data.ctaText}
            onChange={handleChange}
            placeholder="e.g., Get Yours Today"
          />
          <FormField
            label="CTA Button Link"
            name="ctaLink"
            value={data.ctaLink}
            onChange={handleChange}
            placeholder="e.g., #shop or /checkout"
          />
        </div>
        <FormField
          label="Secondary Text (optional)"
          name="secondaryText"
          value={data.secondaryText || ''}
          onChange={handleChange}
          placeholder="e.g., Use code WELCOME15 for 15% off"
        />
      </div>
    </SectionCard>
  );
}
