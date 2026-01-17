import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { LandingPageData } from '@/types/landing';

const dataFilePath = path.join(process.cwd(), 'data', 'landing-page.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data: LandingPageData = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading landing page data:', error);
    return NextResponse.json(
      { error: 'Failed to load landing page data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data: LandingPageData = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving landing page data:', error);
    return NextResponse.json(
      { error: 'Failed to save landing page data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const updates = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const currentData: LandingPageData = JSON.parse(fileContents);

    const updatedData = { ...currentData, ...updates };
    await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating landing page data:', error);
    return NextResponse.json(
      { error: 'Failed to update landing page data' },
      { status: 500 }
    );
  }
}
