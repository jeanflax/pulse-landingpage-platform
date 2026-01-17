import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const where = clientId ? { clientId } : {};

    const projects = await db.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { id: true, name: true, primaryColor: true },
        },
        template: {
          select: { id: true, name: true, type: true, category: true },
        },
        _count: { select: { variants: true } },
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, clientId, templateId, content } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await db.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // If templateId provided, verify template exists and get default content
    let templateContent = content || {};
    if (templateId) {
      const template = await db.template.findUnique({ where: { id: templateId } });
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      // Parse template sections and build default content
      const sections = JSON.parse(template.sections as string);
      const defaultContent: Record<string, unknown> = {};
      for (const section of sections) {
        defaultContent[section.id] = section.defaultContent || {};
      }
      templateContent = { ...defaultContent, ...content };
    }

    const slug = generateSlug(name);

    const project = await db.project.create({
      data: {
        name,
        slug,
        clientId,
        templateId: templateId || null,
        content: JSON.stringify(templateContent),
        status: 'DRAFT',
      },
      include: {
        client: {
          select: { id: true, name: true, primaryColor: true },
        },
        template: {
          select: { id: true, name: true, type: true, category: true },
        },
      },
    });

    // Create default variant
    await db.variant.create({
      data: {
        projectId: project.id,
        trafficSource: 'DEFAULT',
        content: '{}',
        isActive: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
