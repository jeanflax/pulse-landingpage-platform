import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/clients - List all clients
export async function GET() {
  try {
    const clients = await db.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { projects: true } },
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, shopifyDomain, brandVoice, logoUrl, primaryColor } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    const client = await db.client.create({
      data: {
        name,
        shopifyDomain: shopifyDomain || null,
        brandVoice: brandVoice || null,
        logoUrl: logoUrl || null,
        primaryColor: primaryColor || '#000000',
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
