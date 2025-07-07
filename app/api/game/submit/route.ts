import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserSession } from '@/lib/session'

// POST /api/game/submit
export async function POST(req: NextRequest) {
  try {
    const user = await getUserSession()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id
    const body = await req.json()
    const { wpm, accuracy, timeElapsed, wordsCompleted, mode } = body

    // 1. Create TypingStats record
    const typingStats = await prisma.typingStats.create({
      data: {
        userId,
        wpm: Math.round(Number(wpm)),
        accuracy: Number(accuracy),
        timeElapsed: Math.round(Number(timeElapsed)),
        wordsCompleted: Math.round(Number(wordsCompleted)),
        mode: String(mode),
      },
    })

    // 2. Update UserStats (bestWpm, bestAccuracy, totalTests, streak)
    const prevStats = await prisma.userStats.findUnique({ where: { userId } })
    const userStats = await prisma.userStats.upsert({
      where: { userId },
      update: {
        bestWpm: Math.max(Number(wpm), prevStats?.bestWpm ?? 0),
        bestAccuracy: Math.max(Number(accuracy), prevStats?.bestAccuracy ?? 0),
        totalTests: { increment: 1 },
      },
      create: {
        userId,
        bestWpm: Math.round(Number(wpm)),
        bestAccuracy: Number(accuracy),
        totalTests: 1,
        streak: 1,
      },
    })

    // 3. Upsert Leaderboard (update if better wpm)
    const prevLeaderboard = await prisma.leaderboard.findUnique({ where: { userId } })
    if (!prevLeaderboard || Number(wpm) > prevLeaderboard.wpm) {
      await prisma.leaderboard.upsert({
        where: { userId },
        update: { wpm: Math.round(Number(wpm)), accuracy: Number(accuracy), mode: String(mode) },
        create: { userId, wpm: Math.round(Number(wpm)), accuracy: Number(accuracy), mode: String(mode) },
      })
    }

    // 3.5. Update user's rank based on leaderboard
    const leaderboard = await prisma.leaderboard.findMany({ orderBy: { wpm: 'desc' } })
    const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1
    await prisma.user.update({
      where: { id: userId },
      data: {
        rank: userRank > 0 ? userRank : -1,
      },
    })

    // 4. Optionally: Add to recent activity (if you have such a model)
    // ...

    return NextResponse.json({ success: true, typingStats, userStats })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to submit game result' }, { status: 500 })
  }
}
