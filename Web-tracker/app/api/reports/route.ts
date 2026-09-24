import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error generating report data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
