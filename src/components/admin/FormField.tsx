'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: 'text' | 'textarea' | 'url' | 'number';
  placeholder?: string;
  rows?: number;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  rows = 3,
}: FormFieldProps) {
  const inputClasses = "w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all text-neutral-900";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}
