// GET /api/leaderboard/daily
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeaderboardEntry } from '@/lib/types';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scoresRaw = await prisma.leaderboard.findMany({
      where: { createdAt: { gte: today } },
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
    type Entry = typeof scoresRaw[number];
    const scores: LeaderboardEntry[] = scoresRaw.map((entry: Entry, i: number) => ({
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
    return NextResponse.json({ error: 'Failed to fetch daily leaderboard', details: error }, { status: 500 });
  }
}
