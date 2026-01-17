'use client';

import React from 'react';
import FormField from './FormField';
import SectionCard from './SectionCard';
import { HeroProps } from '@/types/landing';

interface HeroEditorProps {
  data: HeroProps;
  onChange: (data: HeroProps) => void;
}

export default function HeroEditor({ data, onChange }: HeroEditorProps) {
  const handleChange = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <SectionCard
      title="Hero Section"
      description="Main headline, product image, and call-to-action"
      defaultOpen={true}
    >
      <div className="space-y-4">
        <FormField
          label="Badge Text"
          name="badge"
          value={data.badge || ''}
          onChange={handleChange}
          placeholder="e.g., New Collection, Limited Edition"
        />
        <FormField
          label="Headline"
          name="headline"
          value={data.headline}
          onChange={handleChange}
          placeholder="Main headline that grabs attention"
        />
        <FormField
          label="Subheadline"
          name="subheadline"
          value={data.subheadline}
          onChange={handleChange}
          type="textarea"
          placeholder="Supporting text that explains the value proposition"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Primary CTA Text"
            name="ctaText"
            value={data.ctaText}
            onChange={handleChange}
            placeholder="e.g., Shop Now"
          />
          <FormField
            label="Primary CTA Link"
            name="ctaLink"
            value={data.ctaLink}
            onChange={handleChange}
            placeholder="e.g., #shop or /products"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Secondary CTA Text (optional)"
            name="secondaryCtaText"
            value={data.secondaryCtaText || ''}
            onChange={handleChange}
            placeholder="e.g., Learn More"
          />
          <FormField
            label="Secondary CTA Link"
            name="secondaryCtaLink"
            value={data.secondaryCtaLink || ''}
            onChange={handleChange}
            placeholder="e.g., #features"
          />
        </div>
        <FormField
          label="Product Image URL"
          name="productImage"
          value={data.productImage}
          onChange={handleChange}
          type="url"
          placeholder="https://..."
        />
        <FormField
          label="Product Image Alt Text"
          name="productImageAlt"
          value={data.productImageAlt}
          onChange={handleChange}
          placeholder="Describe the image for accessibility"
        />
      </div>
    </SectionCard>
  );
}
