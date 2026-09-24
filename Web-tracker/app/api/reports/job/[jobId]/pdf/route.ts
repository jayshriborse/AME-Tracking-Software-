import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    if (!jobId) {
      return new Response('Job ID is required', { status: 400 });
    }

    const url = `http://localhost:3001/api/reports/job/${jobId}/pdf`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      return new Response(errText, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="job_report_${jobId}.pdf"`
      }
    });
  } catch (error: any) {
    console.error('Error in Next.js download job PDF route:', error);
    return new Response(error.message, { status: 500 });
  }
}
