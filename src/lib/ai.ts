import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export type TrafficSource = 'DEFAULT' | 'META' | 'GOOGLE' | 'EMAIL' | 'TIKTOK';
export type TemplateType = 'LANDING_PAGE' | 'LISTICLE' | 'PDP';

interface GenerateContentInput {
  productName: string;
  productDescription: string;
  productPrice?: string;
  brandName: string;
  brandVoice?: string;
  templateType: TemplateType;
  trafficSource?: TrafficSource;
  targetAudience?: string;
  keyBenefits?: string[];
  competitors?: string[];
}

interface GeneratedSection {
  sectionId: string;
  content: Record<string, unknown>;
}

interface GenerationResult {
  sections: GeneratedSection[];
  suggestions?: string[];
}

// Traffic source specific copy guidelines
const trafficSourceGuidelines: Record<TrafficSource, string> = {
  DEFAULT: 'Use balanced, benefit-focused copy that works for general audiences.',
  META: `Visitor came from a social media ad (Facebook/Instagram). Use:
- Emotional, story-driven headlines that stop the scroll
- Social proof and FOMO elements
- Lifestyle-focused imagery descriptions
- Casual, conversational tone
- Short, punchy sentences`,
  GOOGLE: `Visitor searched for this product/solution. Use:
- Benefit-focused, solution-oriented headlines
- Comparison and "why us" messaging
- Feature specifications and details
- Trust signals and credibility markers
- Direct, informative tone`,
  EMAIL: `Visitor is an existing subscriber/customer. Use:
- Exclusive, VIP-focused language
- Loyalty rewards and special offers
- "Welcome back" or "Just for you" messaging
- Personalized, warm tone
- Early access or insider benefits`,
  TIKTOK: `Visitor came from TikTok. Use:
- Trendy, Gen-Z friendly language
- "As seen on TikTok" or viral references
- Authentic, unfiltered tone
- User-generated content feel
- Quick, snappy copy`,
};

// Template type specific section prompts
const templatePrompts: Record<TemplateType, string> = {
  LANDING_PAGE: `Generate content for a high-converting DTC landing page with these sections:

1. **hero** - Main hero section
   - headline: Powerful, benefit-driven headline (max 10 words)
   - subheadline: Supporting copy that expands on the headline (max 30 words)
   - ctaText: Primary call-to-action button text
   - ctaLink: "#buy" or "/shop"
   - badge: Optional urgency badge (e.g., "Limited Time", "New Launch")
   - productImage: "/placeholder-product.jpg"
   - productImageAlt: Alt text for the product image

2. **benefits** - Key benefits grid
   - title: Section title (e.g., "Why Choose Us")
   - benefits: Array of 3-4 benefits, each with:
     - icon: One of "shield", "lightning", "heart", "star", "truck", "refresh"
     - title: Benefit title (3-5 words)
     - description: Benefit description (15-25 words)

3. **socialProof** - Testimonials and trust
   - title: Section title
   - testimonials: Array of 3 testimonials, each with:
     - quote: Customer quote (20-40 words)
     - author: Customer name
     - role: Customer title or location
     - rating: 5
     - image: "/placeholder-avatar.jpg"

4. **productShowcase** - Product details
   - title: Section title
   - description: Product description (40-60 words)
   - features: Array of 4-5 feature strings
   - price: Product price
   - comparePrice: Original price (for showing discount)
   - images: Array of 3 image objects with src and alt

5. **finalCta** - Final call-to-action
   - headline: Compelling closing headline
   - subheadline: Final push copy (20-30 words)
   - ctaText: Button text
   - ctaLink: "#buy"
   - guarantee: Guarantee text (e.g., "30-Day Money Back Guarantee")`,

  LISTICLE: `Generate content for a listicle-style landing page:

1. **hero** - Article intro
   - headline: Listicle headline (e.g., "Top 5 Ways to...")
   - subheadline: Article teaser
   - badge: Article category

2. **benefits** - Key points preview
   - title: "What You'll Learn"
   - benefits: Array of 3 key takeaways

3. **socialProof** - Expert credibility
   - title: "Trusted by Experts"
   - testimonials: Array of 2-3 expert quotes

4. **finalCta** - Article conclusion CTA
   - headline: Action-oriented headline
   - subheadline: Summary of value
   - ctaText: Main CTA`,

  PDP: `Generate content for a product detail page:

1. **hero** - Product hero
   - headline: Product name with key benefit
   - subheadline: Product tagline
   - badge: Product badge (e.g., "Best Seller", "New")
   - productImage: "/placeholder-product.jpg"
   - productImageAlt: Product image alt text

2. **benefits** - Product benefits
   - title: "Features & Benefits"
   - benefits: Array of 4-5 product features

3. **socialProof** - Customer reviews
   - title: "Customer Reviews"
   - testimonials: Array of 3-5 customer reviews

4. **finalCta** - Add to cart section
   - headline: Urgency headline
   - subheadline: Scarcity or bonus copy
   - ctaText: "Add to Cart"
   - guarantee: Shipping/return policy`,
};

export async function generateLandingPageContent(
  input: GenerateContentInput
): Promise<GenerationResult> {
  const {
    productName,
    productDescription,
    productPrice,
    brandName,
    brandVoice,
    templateType,
    trafficSource = 'DEFAULT',
    targetAudience,
    keyBenefits,
    competitors,
  } = input;

  const prompt = `You are an expert DTC copywriter who creates high-converting landing page content. Generate compelling copy for the following product.

## PRODUCT INFORMATION
- **Product Name:** ${productName}
- **Description:** ${productDescription}
${productPrice ? `- **Price:** ${productPrice}` : ''}
- **Brand:** ${brandName}

## BRAND VOICE
${brandVoice || 'Professional, friendly, and benefit-focused. Speaks directly to the customer using "you" language.'}

## TARGET AUDIENCE
${targetAudience || 'Health-conscious consumers aged 25-45 who value quality and convenience.'}

${keyBenefits?.length ? `## KEY BENEFITS TO HIGHLIGHT\n${keyBenefits.map(b => `- ${b}`).join('\n')}` : ''}

${competitors?.length ? `## COMPETITIVE POSITIONING\nPosition against: ${competitors.join(', ')}` : ''}

## TRAFFIC SOURCE OPTIMIZATION
${trafficSourceGuidelines[trafficSource]}

## TEMPLATE REQUIREMENTS
${templatePrompts[templateType]}

## OUTPUT FORMAT
Return a valid JSON object with this exact structure:
{
  "sections": [
    {
      "sectionId": "hero",
      "content": { /* section content matching the template requirements */ }
    },
    {
      "sectionId": "benefits",
      "content": { /* section content */ }
    },
    /* ... other sections ... */
  ],
  "suggestions": [
    "Optional suggestion 1 for improving conversion",
    "Optional suggestion 2"
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown code blocks or explanations
- Use the exact sectionId values specified in the template requirements
- Ensure all content is original and compelling
- Match the brand voice consistently across all sections
- Optimize for the specified traffic source`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text content from response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in AI response');
  }

  // Parse JSON response
  try {
    // Clean up potential markdown code blocks
    let jsonStr = textContent.text.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }

    const result = JSON.parse(jsonStr.trim()) as GenerationResult;
    return result;
  } catch {
    console.error('Failed to parse AI response:', textContent.text);
    throw new Error('Failed to parse AI-generated content');
  }
}

// Generate content for a specific section
export async function generateSectionContent(
  sectionType: string,
  context: {
    productName: string;
    productDescription: string;
    brandVoice?: string;
    existingContent?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { productName, productDescription, brandVoice, existingContent } = context;

  const prompt = `You are an expert DTC copywriter. Generate content for a "${sectionType}" section.

## PRODUCT
- Name: ${productName}
- Description: ${productDescription}

## BRAND VOICE
${brandVoice || 'Professional and friendly'}

${existingContent ? `## EXISTING CONTENT TO IMPROVE\n${JSON.stringify(existingContent, null, 2)}` : ''}

Generate compelling content for this section type. Return ONLY a valid JSON object with the appropriate fields for a ${sectionType} section.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in AI response');
  }

  try {
    let jsonStr = textContent.text.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);

    return JSON.parse(jsonStr.trim());
  } catch {
    console.error('Failed to parse section content:', textContent.text);
    throw new Error('Failed to parse AI-generated section content');
  }
}

// Improve existing copy
export async function improveCopy(
  text: string,
  style: 'more_urgent' | 'more_emotional' | 'more_professional' | 'shorter' | 'longer'
): Promise<string> {
  const styleGuides: Record<typeof style, string> = {
    more_urgent: 'Add urgency and scarcity. Use words like "now", "today", "limited", "don\'t miss".',
    more_emotional: 'Make it more emotionally compelling. Focus on feelings, aspirations, and transformations.',
    more_professional: 'Make it more professional and credible. Use data, specifics, and authoritative tone.',
    shorter: 'Make it more concise. Cut unnecessary words while keeping the core message.',
    longer: 'Expand with more details, benefits, and persuasive elements.',
  };

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Improve this copy: "${text}"\n\nStyle: ${styleGuides[style]}\n\nReturn ONLY the improved text, nothing else.`,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in AI response');
  }

  return textContent.text.trim();
}
