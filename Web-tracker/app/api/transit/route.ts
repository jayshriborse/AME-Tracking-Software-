import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching transits:', error);
    return NextResponse.json(
      { message: 'Failed to load transit data' },
      { status: 500 }
    );
  }
}
