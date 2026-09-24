import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 200, total: 0, pages: 0 }
    });
  } catch (error) {
    console.error('Error in /api/shipping-list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
