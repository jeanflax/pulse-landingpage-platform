'use client';

interface Feature {
  name: string;
  ours: boolean | string;
  theirs: boolean | string;
  highlight?: boolean;
}

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  ourBrand: string;
  theirBrand: string;
  features: Feature[];
  ctaText?: string;
  ctaLink?: string;
  style?: 'minimal' | 'detailed';
}

export default function ComparisonTable({
  title = 'Why Choose Us',
  subtitle,
  ourBrand = 'Us',
  theirBrand = 'Them',
  features,
  ctaText = 'Shop Now',
  ctaLink = '#',
}: ComparisonTableProps) {
  const renderValue = (value: boolean | string, isOurs: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isOurs ? 'bg-emerald-100' : 'bg-neutral-100'
        }`}>
          <svg className={`w-5 h-5 ${isOurs ? 'text-emerald-600' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return (
      <span className={`text-sm font-medium ${isOurs ? 'text-neutral-900' : 'text-neutral-500'}`}>
        {value}
      </span>
    );
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="bg-neutral-50 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-neutral-100">
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Feature
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-bold">
                {ourBrand}
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-500 rounded-full text-sm font-medium border border-neutral-200">
                {theirBrand}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="divide-y divide-neutral-200">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 gap-4 p-6 items-center ${
                  feature.highlight ? 'bg-emerald-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {feature.highlight && (
                    <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                  <span className={`font-medium ${feature.highlight ? 'text-emerald-900' : 'text-neutral-900'}`}>
                    {feature.name}
                  </span>
                </div>
                <div className="flex justify-center">
                  {renderValue(feature.ours, true)}
                </div>
                <div className="flex justify-center">
                  {renderValue(feature.theirs, false)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {ctaText && (
          <div className="text-center mt-10">
            <a
              href={ctaLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-bold text-lg rounded-full hover:bg-neutral-800 transition-all hover:scale-105"
            >
              {ctaText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
