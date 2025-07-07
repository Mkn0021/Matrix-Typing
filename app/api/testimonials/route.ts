// GET, POST /api/testimonials
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ testimonials });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials', details: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, userName, role, image, rating, text } = await req.json();
    const testimonial = await prisma.testimonial.create({
      data: { userId, userName, role, image, rating, text },
    });
    return NextResponse.json({ testimonial });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial', details: error }, { status: 500 });
  }
}
