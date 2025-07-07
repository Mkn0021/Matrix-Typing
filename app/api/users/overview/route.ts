import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/users/overview?userId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    // Fetch user with stats and achievements using only include
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stats: true,
        achievements: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only return the fields you want for the user
    const { id, username, level, country, stats, achievements } = user
    return NextResponse.json({ user: { id, username, level, country, stats, achievements } })
  } catch (error) {
    console.error('User overview API error:', error)
    return NextResponse.json({ error: 'Failed to fetch user overview', details: error }, { status: 500 })
  }
}
