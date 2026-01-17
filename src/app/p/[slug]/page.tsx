import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getCheckoutUrl } from '@/lib/shopify';
import * as LandingComponents from '@/components/landing';

export const dynamic = 'force-dynamic';

interface TemplateSection {
  id: string;
  component: string;
  order: number;
  defaultContent: Record<string, unknown>;
}

interface ProductContext {
  id: string;
  title: string;
  price: number;
  comparePrice: number | null;
  images: Array<{ src: string; alt: string }>;
  checkoutUrl: string | null;
}

// Map component names to actual components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  Hero: LandingComponents.Hero,
  Benefits: LandingComponents.Benefits,
  SocialProof: LandingComponents.SocialProof,
  ProductShowcase: LandingComponents.ProductShowcase,
  FinalCTA: LandingComponents.FinalCTA,
  AnnouncementBar: LandingComponents.AnnouncementBar,
  VideoHero: LandingComponents.VideoHero,
  PressLogos: LandingComponents.PressLogos,
  BeforeAfter: LandingComponents.BeforeAfter,
  ComparisonTable: LandingComponents.ComparisonTable,
  FounderStory: LandingComponents.FounderStory,
  UGCGallery: LandingComponents.UGCGallery,
  ProductCarousel: LandingComponents.ProductCarousel,
  TrustBadges: LandingComponents.TrustBadges,
  StickyAddToCart: LandingComponents.StickyAddToCart,
};

export default async function PublicLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await db.project.findUnique({
    where: { slug: params.slug },
    include: {
      client: {
        include: {
          products: {
            take: 1,
            orderBy: { syncedAt: 'desc' },
          },
        },
      },
      template: true,
      variants: {
        where: { isActive: true },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Only show published projects
  if (project.status !== 'PUBLISHED') {
    notFound();
  }

  // Parse content
  const content = JSON.parse(project.content as string);
  const templateSections: TemplateSection[] = project.template
    ? JSON.parse(project.template.sections as string)
    : [];

  // Sort sections by order
  const sortedSections = [...templateSections].sort((a, b) => a.order - b.order);

  // Build product context if available
  let productContext: ProductContext | null = null;
  const product = project.client.products[0];

  if (product && project.client.shopifyDomain) {
    const variants = product.variants ? JSON.parse(product.variants) : [];
    const variantId = variants[0]?.id;
    const checkoutUrl = variantId
      ? getCheckoutUrl(project.client.shopifyDomain, variantId)
      : null;

    productContext = {
      id: product.id,
      title: product.title,
      price: product.price,
      comparePrice: product.comparePrice,
      images: JSON.parse(product.images || '[]'),
      checkoutUrl,
    };
  }

  return (
    <main className="min-h-screen">
      {sortedSections.map((section) => {
        const Component = componentMap[section.component];
        if (!Component) {
          console.warn(`Component not found: ${section.component}`);
          return null;
        }

        // Merge default content with project content for this section
        const sectionContent = {
          ...section.defaultContent,
          ...(content[section.id] || {}),
          // Pass product context to all sections
          product: productContext,
        };

        return (
          <Component key={section.id} {...sectionContent} />
        );
      })}
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await db.project.findUnique({
    where: { slug: params.slug },
    include: { client: true },
  });

  if (!project || project.status !== 'PUBLISHED') {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: project.name,
    description: `Landing page for ${project.client.name}`,
  };
}
