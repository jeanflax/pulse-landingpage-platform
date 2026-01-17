export interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  productImage: string;
  productImageAlt: string;
  badge?: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface BenefitsProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  benefits: Benefit[];
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar?: string;
  rating?: number;
}

export interface SocialProofProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials: Testimonial[];
  stats?: {
    value: string;
    label: string;
  }[];
  logos?: {
    src: string;
    alt: string;
  }[];
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductShowcaseProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  description?: string;
  features?: string[];
  images: ProductImage[];
  price?: string;
  comparePrice?: string;
}

export interface CTAProps {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
}

export interface LandingPageData {
  hero: HeroProps;
  benefits: BenefitsProps;
  socialProof: SocialProofProps;
  productShowcase: ProductShowcaseProps;
  cta: CTAProps;
}
