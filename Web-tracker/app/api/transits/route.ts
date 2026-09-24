import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: { items: [], total: 0 }
    });
  } catch (error) {
    console.error('Error in GET /api/transits:', error);
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleNumber } = body;

    if (!vehicleNumber) {
      return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Vehicle number is required' } }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: `TR-${Date.now()}`,
        transitNumber: vehicleNumber.trim(),
        status: 'ACTIVE',
        startedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in POST /api/transits:', error);
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}
