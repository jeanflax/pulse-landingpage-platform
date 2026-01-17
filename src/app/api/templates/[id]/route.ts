import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/templates/[id] - Get single template
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await db.template.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { projects: true } },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id] - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, type, category, description, thumbnail, sections, isPublic } = body;

    const template = await db.template.update({
      where: { id: params.id },
      data: {
        name,
        type,
        category,
        description,
        thumbnail,
        sections: sections ? JSON.stringify(sections) : undefined,
        isPublic,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.template.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
