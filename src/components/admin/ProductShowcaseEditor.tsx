'use client';

import React from 'react';
import FormField from './FormField';
import SectionCard from './SectionCard';
import { ProductShowcaseProps, ProductImage } from '@/types/landing';

interface ProductShowcaseEditorProps {
  data: ProductShowcaseProps;
  onChange: (data: ProductShowcaseProps) => void;
}

export default function ProductShowcaseEditor({ data, onChange }: ProductShowcaseEditorProps) {
  const handleChange = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  const handleImageChange = (index: number, field: keyof ProductImage, value: string) => {
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange({ ...data, images: newImages });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(data.features || [])];
    newFeatures[index] = value;
    onChange({ ...data, features: newFeatures });
  };

  const addImage = () => {
    onChange({
      ...data,
      images: [...data.images, { src: '', alt: '' }],
    });
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onChange({ ...data, images: newImages });
  };

  const addFeature = () => {
    onChange({
      ...data,
      features: [...(data.features || []), ''],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = (data.features || []).filter((_, i) => i !== index);
    onChange({ ...data, features: newFeatures });
  };

  return (
    <SectionCard
      title="Product Showcase Section"
      description="Product gallery, pricing, and features"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <FormField
            label="Section Title"
            name="sectionTitle"
            value={data.sectionTitle || ''}
            onChange={handleChange}
            placeholder="e.g., See It In Detail"
          />
          <FormField
            label="Section Subtitle"
            name="sectionSubtitle"
            value={data.sectionSubtitle || ''}
            onChange={handleChange}
          />
          <FormField
            label="Product Description"
            name="description"
            value={data.description || ''}
            onChange={handleChange}
            type="textarea"
            rows={3}
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Price"
            name="price"
            value={data.price || ''}
            onChange={handleChange}
            placeholder="$199"
          />
          <FormField
            label="Compare at Price (optional)"
            name="comparePrice"
            value={data.comparePrice || ''}
            onChange={handleChange}
            placeholder="$249"
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-900">Product Images ({data.images.length})</h4>
            <button
              onClick={addImage}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Image
            </button>
          </div>

          {data.images.map((image, index) => (
            <div key={index} className="p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500">Image {index + 1}</span>
                {data.images.length > 1 && (
                  <button
                    onClick={() => removeImage(index)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="url"
                  value={image.src}
                  onChange={(e) => handleImageChange(index, 'src', e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  placeholder="Alt text"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-900">Features ({(data.features || []).length})</h4>
            <button
              onClick={addFeature}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Feature
            </button>
          </div>

          {(data.features || []).map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg"
                placeholder="Feature description"
              />
              <button
                onClick={() => removeFeature(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
