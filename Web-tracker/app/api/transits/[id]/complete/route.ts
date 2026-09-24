import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const now = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: {
        id,
        status: 'COMPLETED',
        completedAt: now
      }
    });
  } catch (error) {
    console.error('Error in POST /api/transits/:id/complete:', error);
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}
