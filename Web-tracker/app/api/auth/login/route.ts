import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    return NextResponse.json({
      success: true,
      data: {
        accessToken: 'dummy-access-token',
        refreshToken: 'dummy-refresh-token',
        user: {
          id: '1',
          email: email || 'admin@ame.com',
          fullName: 'Demo Admin',
          role: 'ADMIN'
        }
      }
    })
  } catch (error) {
    console.error('Error in /api/auth/login:', error)
    return NextResponse.json({ success: false, error: { code: 'ERROR', message: 'Internal Server Error' } }, { status: 500 })
  }
}
