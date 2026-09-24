import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      totalPieces: 0,
      scanned: 0,
      pending: 0,
      readyForDispatch: 0,
      loaded: 0,
      dispatched: 0,
      scanningProgress: 0,
      totalProjects: 0,
      totalJobs: 0,
      latestScan: null,
      recentScans: [],
      activeTransit: null
    });
  } catch (error) {
    console.error('Error in /api/dashboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
