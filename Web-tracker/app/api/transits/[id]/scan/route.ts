import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: transitId } = params;
    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'QR Code is required' } }, { status: 400 });
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
      data: {
        transitId,
        transitNumber: "84210",
        idempotentReplay: false,
        scannedAt: now,
        product: {
          id: parsed,
          pieceNumber: parsed,
          fitting: 'Standard',
          status: 'LOADED',
          client: 'Hartwell Constructions',
          project: '47041',
          job: '47041'
        }
      }
    });
  } catch (error) {
    console.error('Error in POST /api/transits/:id/scan:', error);
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}
