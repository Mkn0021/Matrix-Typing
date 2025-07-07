// GET /api/auth/me
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PublicUser } from '@/types/user';

export async function GET(): Promise<NextResponse<{ user: PublicUser | null }>> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user: PublicUser | null = session.user

  return NextResponse.json({ user });
}
