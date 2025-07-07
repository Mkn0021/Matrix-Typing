// GET /api/stats/user/[userId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TypingStats } from '@/lib/types';

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<{ stats: TypingStats[] } | { error: string; details: unknown }>> {
  const { userId } = await context.params;
  try {
    const stats: TypingStats[] = await prisma.typingStats.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user stats', details: error }, { status: 500 });
  }
}
