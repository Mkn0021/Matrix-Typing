// POST /api/stats
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, wpm, accuracy, timeElapsed, wordsCompleted, mode } = await req.json();
    const stat = await prisma.typingStats.create({
      data: { userId, wpm, accuracy, timeElapsed, wordsCompleted, mode },
    });
    return NextResponse.json({ stat });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit stat', details: error }, { status: 500 });
  }
}
