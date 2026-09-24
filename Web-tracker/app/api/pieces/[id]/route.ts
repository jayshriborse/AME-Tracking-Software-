import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const piece = {
      id: params.id,
      jobId: "47041",
      downloadNo: "47041",
      pieceNo: "7",
      qrCode: "QR-XXXXX",
      sourceFlag: "True",
      currentStatus: "SCANNED",
      scanDateTime: new Date().toISOString(),
      scanLocation: "Main Scanning Area",
      job: {
        id: "JOB-1",
        jobId: "47041",
        customer: {
          id: "CUST-001",
          customerName: "Hartwell Constructions"
        }
      },
      scanEvents: [],
      transitPieces: []
    };

    return NextResponse.json(piece);
  } catch (error) {
    console.error('Error in /api/pieces/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
