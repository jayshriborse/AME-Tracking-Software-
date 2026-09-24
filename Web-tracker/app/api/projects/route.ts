import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: [] });
  } catch (error: any) {
    console.error('Error in projects API route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
