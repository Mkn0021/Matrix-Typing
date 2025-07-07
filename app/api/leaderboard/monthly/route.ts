// GET /api/leaderboard/monthly
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeaderboardEntry } from '@/lib/types';

export async function GET() {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const scoresRaw = await prisma.leaderboard.findMany({
      where: { createdAt: { gte: firstDay } },
      orderBy: { wpm: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            username: true,
            image: true,
            country: true,
            level: true,
            userStats: { select: { streak: true, totalTests: true } },
          },
        },
      },
    });
    const scores = scoresRaw.map((entry, i) => ({
      ...entry,
      rank: i + 1,
      user: {
        ...entry.user,
        streak: entry.user.userStats?.streak ?? 0,
        totalTests: entry.user.userStats?.totalTests ?? 0,
      },
    })) as LeaderboardEntry[];
    return NextResponse.json({ scores });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch monthly leaderboard', details: error }, { status: 500 });
  }
}
