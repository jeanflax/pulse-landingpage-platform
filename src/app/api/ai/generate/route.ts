import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateLandingPageContent, generateSectionContent, improveCopy, TemplateType, TrafficSource } from '@/lib/ai';

// POST /api/ai/generate - Generate landing page content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action = 'full', // 'full' | 'section' | 'improve'
      projectId,
      clientId,
      templateType = 'LANDING_PAGE',
      trafficSource = 'DEFAULT',
      // For full generation
      productName,
      productDescription,
      productPrice,
      targetAudience,
      keyBenefits,
      competitors,
      // For section generation
      sectionType,
      existingContent,
      // For improve
      text,
      style,
    } = body;

    // Get brand info if clientId provided
    let brandName = 'Brand';
    let brandVoice: string | undefined;

    if (clientId) {
      const client = await db.client.findUnique({ where: { id: clientId } });
      if (client) {
        brandName = client.name;
        brandVoice = client.brandVoice || undefined;
      }
    } else if (projectId) {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: { client: true },
      });
      if (project?.client) {
        brandName = project.client.name;
        brandVoice = project.client.brandVoice || undefined;
      }
    }

    // Handle different action types
    if (action === 'full') {
      if (!productName || !productDescription) {
        return NextResponse.json(
          { error: 'Product name and description are required' },
          { status: 400 }
        );
      }

      const result = await generateLandingPageContent({
        productName,
        productDescription,
        productPrice,
        brandName,
        brandVoice,
        templateType: templateType as TemplateType,
        trafficSource: trafficSource as TrafficSource,
        targetAudience,
        keyBenefits,
        competitors,
      });

      return NextResponse.json(result);
    }

    if (action === 'section') {
      if (!sectionType || !productName) {
        return NextResponse.json(
          { error: 'Section type and product name are required' },
          { status: 400 }
        );
      }

      const content = await generateSectionContent(sectionType, {
        productName,
        productDescription: productDescription || '',
        brandVoice,
        existingContent,
      });

      return NextResponse.json({ content });
    }

    if (action === 'improve') {
      if (!text || !style) {
        return NextResponse.json(
          { error: 'Text and style are required for improvement' },
          { status: 400 }
        );
      }

      const improved = await improveCopy(text, style);
      return NextResponse.json({ improved });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "full", "section", or "improve"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI generation error:', error);

    // Check for API key issues
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set ANTHROPIC_API_KEY.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
}
