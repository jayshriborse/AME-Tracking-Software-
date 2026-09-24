import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    success: true,
    data: {
      accessToken: 'dummy-access-token',
      refreshToken: 'dummy-refresh-token'
    }
  })
}
