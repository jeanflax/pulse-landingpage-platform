import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/templates - List all templates
export async function GET() {
  try {
    const templates = await db.template.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { projects: true } },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, category, description, thumbnail, sections } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      );
    }

    const template = await db.template.create({
      data: {
        name,
        type: type || 'LANDING_PAGE',
        category,
        description,
        thumbnail,
        sections: JSON.stringify(sections || []),
        isPublic: true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
