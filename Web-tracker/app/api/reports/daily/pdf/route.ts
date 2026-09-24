import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const customerId = searchParams.get('customerId') || '';
    const projectId = searchParams.get('projectId') || '';
    const jobId = searchParams.get('jobId') || '';
    const statusId = searchParams.get('statusId') || '';
    const customerName = searchParams.get('customerName') || '';
    const projectName = searchParams.get('projectName') || '';
    const jobName = searchParams.get('jobName') || '';

    if (!date) {
      return new Response('Date is required', { status: 400 });
    }

    const url = `http://localhost:3001/api/reports/daily/pdf?date=${date}&customerId=${customerId}&projectId=${projectId}&jobId=${jobId}&statusId=${statusId}&customerName=${encodeURIComponent(customerName)}&projectName=${encodeURIComponent(projectName)}&jobName=${encodeURIComponent(jobName)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      return new Response(errText, { status: res.status });
    }

    // Forward binary buffer
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="daily_report_${date}.pdf"`
      }
    });
  } catch (error: any) {
    console.error('Error in Next.js download daily PDF route:', error);
    return new Response(error.message, { status: 500 });
  }
}

