'use client';

interface PressLogo {
  name: string;
  logoUrl?: string;
  quote?: string;
}

interface PressLogosProps {
  title?: string;
  logos: PressLogo[];
  showQuotes?: boolean;
  backgroundColor?: string;
  style?: 'minimal' | 'cards' | 'marquee';
}

const defaultLogos: PressLogo[] = [
  { name: 'Vogue', quote: '"A game-changer for modern beauty"' },
  { name: 'Forbes', quote: '"The future of DTC"' },
  { name: 'GQ', quote: '"Best in class"' },
  { name: 'Allure', quote: '"Editor\'s choice"' },
  { name: 'WSJ', quote: '"Disrupting the industry"' },
];

export default function PressLogos({
  title = 'As Featured In',
  logos = defaultLogos,
  showQuotes = false,
  backgroundColor = '#fafafa',
  style = 'minimal',
}: PressLogosProps) {
  if (style === 'marquee') {
    return (
      <section className="py-8 overflow-hidden" style={{ backgroundColor }}>
        <div className="relative">
          <div className="flex animate-marquee">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-12 flex items-center gap-3"
              >
                {logo.logoUrl ? (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="h-8 w-auto grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all"
                  />
                ) : (
                  <span className="text-2xl font-serif font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (style === 'cards') {
    return (
      <section className="py-16 px-6" style={{ backgroundColor }}>
        <div className="max-w-6xl mx-auto">
          {title && (
            <p className="text-center text-sm font-medium text-neutral-500 uppercase tracking-widest mb-10">
              {title}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {logos.map((logo, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                {logo.logoUrl ? (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="h-8 w-auto mx-auto mb-4 grayscale"
                  />
                ) : (
                  <span className="block text-xl font-serif font-bold text-neutral-900 mb-4">
                    {logo.name}
                  </span>
                )}
                {showQuotes && logo.quote && (
                  <p className="text-sm text-neutral-500 italic">
                    {logo.quote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: minimal style
  return (
    <section className="py-12 px-6" style={{ backgroundColor }}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <p className="text-center text-xs font-medium text-neutral-400 uppercase tracking-widest mb-8">
            {title}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <div key={i} className="flex flex-col items-center">
              {logo.logoUrl ? (
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-6 w-auto grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="text-xl font-serif font-bold text-neutral-300 hover:text-neutral-900 transition-colors cursor-default">
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
