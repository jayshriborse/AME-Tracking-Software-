import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error in GET /api/scans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrCode, scanLocation } = body;

    if (!qrCode) {
      return NextResponse.json({ error: 'QR Code is required' }, { status: 400 });
    }

    const parseQrCode = (code: string): string => {
      const trimmed = code.trim();
      try {
        const json = JSON.parse(trimmed);
        return (json.ItemID || json.id || json.qrCode || json.qr || trimmed).trim();
      } catch {
        return trimmed;
      }
    };

    const parsed = parseQrCode(qrCode);
    const now = new Date().toISOString();

    return NextResponse.json({
      success: true,
      alreadyScanned: false,
      piece: {
        id: `SCAN-${Date.now()}`,
        pieceNo: parsed,
        jobId: 'N/A',
        currentStatus: 'SCANNED',
        scanDateTime: now,
        scanLocation: scanLocation || 'Main Scanning Area'
      }
    });
  } catch (error) {
    console.error('Error in /api/scans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
