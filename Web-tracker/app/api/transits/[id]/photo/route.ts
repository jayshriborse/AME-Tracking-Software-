import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const mockUrl = '/uploads/demo-truck.png';
    
    const globalAny = global as any;
    if (!globalAny.photoCache) {
      globalAny.photoCache = new Map<string, string>();
    }
    globalAny.photoCache.set(id, mockUrl);

    return NextResponse.json({
      success: true,
      data: {
        id: id,
        transitNumber: id,
        status: 'ACTIVE',
        startedAt: new Date().toISOString(),
        truckPhotoUrl: mockUrl
      }
    });
  } catch (error) {
    console.error('Error in POST /api/transits/:id/photo:', error);
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}
