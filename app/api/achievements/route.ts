// POST /api/achievements
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, title, description } = await req.json();
    const achievement = await prisma.achievement.create({
      data: { userId, title, description },
    });
    return NextResponse.json({ achievement });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create achievement', details: error }, { status: 500 });
  }
}
