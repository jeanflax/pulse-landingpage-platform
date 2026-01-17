interface FounderStoryProps {
  quote: string;
  founderName: string;
  founderTitle: string;
  founderImage?: string;
  signature?: string;
  backgroundColor?: string;
  layout?: 'centered' | 'split';
  story?: string;
}

export default function FounderStory({
  quote,
  founderName,
  founderTitle,
  founderImage,
  signature,
  backgroundColor = '#fff',
  layout = 'centered',
  story,
}: FounderStoryProps) {
  if (layout === 'split') {
    return (
      <section className="py-20" style={{ backgroundColor }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              {founderImage ? (
                <img
                  src={founderImage}
                  alt={founderName}
                  className="w-full aspect-[4/5] object-cover rounded-3xl"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-3xl flex items-center justify-center">
                  <span className="text-8xl font-serif text-neutral-400">
                    {founderName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <blockquote className="text-2xl md:text-3xl font-medium text-neutral-900 leading-relaxed mb-8">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {story && (
                <p className="text-neutral-600 leading-relaxed mb-8">
                  {story}
                </p>
              )}

              <div className="flex items-center gap-4">
                {signature ? (
                  <img
                    src={signature}
                    alt={`${founderName}'s signature`}
                    className="h-12 w-auto"
                  />
                ) : (
                  <div className="font-script text-3xl text-neutral-900">
                    {founderName}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="font-bold text-neutral-900">{founderName}</p>
                <p className="text-neutral-500">{founderTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Centered layout
  return (
    <section className="py-24" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Quote Icon */}
        <div className="w-16 h-16 mx-auto mb-8 bg-neutral-900 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote */}
        <blockquote className="text-2xl md:text-4xl font-medium text-neutral-900 leading-relaxed mb-10">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Founder Info */}
        <div className="flex flex-col items-center">
          {founderImage ? (
            <img
              src={founderImage}
              alt={founderName}
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-neutral-500">
                {founderName.charAt(0)}
              </span>
            </div>
          )}

          {signature ? (
            <img
              src={signature}
              alt={`${founderName}'s signature`}
              className="h-10 w-auto mb-2"
            />
          ) : null}

          <p className="font-bold text-neutral-900">{founderName}</p>
          <p className="text-neutral-500">{founderTitle}</p>
        </div>
      </div>
    </section>
  );
}
