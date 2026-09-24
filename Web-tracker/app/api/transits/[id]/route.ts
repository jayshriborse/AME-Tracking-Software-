import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const globalAny = global as any;
    const photoCache = globalAny.photoCache || new Map<string, string>();
    const truckPhotoUrl = photoCache.get(id) || null;

    return NextResponse.json({
      success: true,
      data: {
        id,
        transitNumber: "84210",
        status: 'ACTIVE',
        truckPhotoUrl,
        startedAt: new Date().toISOString(),
        completedAt: null,
        transitProducts: [],
        grouped: [],
        summary: {
          products: 0,
          clients: 0,
          projects: 0
        }
      }
    });
  } catch (error) {
    console.error('Error in GET /api/transits/:id:', error);
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}
