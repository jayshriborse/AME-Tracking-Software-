import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      id: '1',
      email: 'admin@ame.com',
      fullName: 'Demo Admin',
      role: 'ADMIN'
    }
  })
}
