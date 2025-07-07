// GET /api/achievements/[userId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Achievement } from '@/lib/types';

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
): Promise<NextResponse<{ achievements: Achievement[] } | { error: string; details: unknown }>> {
  const { userId } = await context.params;

  try {
    const achievements: Achievement[] = await prisma.achievement.findMany({
      where: { userId },
    });
    return NextResponse.json({ achievements });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch achievements', details: error },
      { status: 500 }
    );
  }
}
