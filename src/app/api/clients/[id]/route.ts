import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/clients/[id] - Get single client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await db.client.findUnique({
      where: { id: params.id },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        products: {
          orderBy: { title: 'asc' },
        },
        _count: { select: { projects: true, products: true } },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, shopifyDomain, brandVoice, logoUrl, primaryColor } = body;

    const client = await db.client.update({
      where: { id: params.id },
      data: {
        name,
        shopifyDomain,
        brandVoice,
        logoUrl,
        primaryColor,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
