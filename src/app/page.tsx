import { Hero, Benefits, SocialProof, ProductShowcase, FinalCTA } from '@/components/landing';
import { LandingPageData } from '@/types/landing';
import { promises as fs } from 'fs';
import path from 'path';

async function getLandingPageData(): Promise<LandingPageData> {
  const filePath = path.join(process.cwd(), 'data', 'landing-page.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getLandingPageData();
  const { hero, benefits, socialProof, productShowcase, cta } = data;

  return (
    <main className="min-h-screen">
      <Hero {...hero} />
      <Benefits {...benefits} />
      <SocialProof {...socialProof} />
      <ProductShowcase {...productShowcase} />
      <FinalCTA {...cta} />
    </main>
  );
}
