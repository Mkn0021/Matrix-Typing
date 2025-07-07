import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/leaderboard/rank?userId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  try {
    // Step 1: find user's best wpm
    const userBest = await prisma.leaderboard.findFirst({
      where: { userId },
      orderBy: { wpm: 'desc' },
    });

    if (!userBest) {
      return NextResponse.json({ error: 'User has no leaderboard entries' }, { status: 404 });
    }

    // Step 2: count how many scores have higher wpm
    const higherCount = await prisma.leaderboard.count({
      where: {
        wpm: { gt: userBest.wpm },
      },
    });

    const rank = higherCount + 1;

    return NextResponse.json({
      userId,
      bestWpm: userBest.wpm,
      rank,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
