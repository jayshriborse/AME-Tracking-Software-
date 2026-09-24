import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const customerId = searchParams.get('customerId') || '';
    const projectId = searchParams.get('projectId') || '';
    const jobId = searchParams.get('jobId') || '';
    const statusId = searchParams.get('statusId') || '';

    if (!date) {
      return NextResponse.json({ success: false, error: 'Date is required' }, { status: 400 });
    }

    const url = `http://localhost:3001/api/reports/daily?date=${date}&customerId=${customerId}&projectId=${projectId}&jobId=${jobId}&statusId=${statusId}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, error: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in Next.js daily report route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

