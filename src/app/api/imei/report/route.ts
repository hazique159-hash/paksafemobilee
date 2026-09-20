import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'USER' && (session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'RETAILER') {
       return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    const { imei, brand, model, description } = await req.json();

    if (!imei || !brand || !model) {
      return NextResponse.json(
        { error: 'IMEI, brand, and model are required' },
        { status: 400 }
      );
    }

    if (!/^\d{15}$/.test(imei)) {
      return NextResponse.json(
        { error: 'IMEI must be exactly 15 digits' },
        { status: 400 }
      );
    }

    // Check if IMEI is already reported
    const existing = await prisma.stolenIMEI.findUnique({
      where: { imei },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This IMEI has already been reported as stolen' },
        { status: 400 }
      );
    }

    // Fetch full user data from DB to get phone
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id! },
      select: { phone: true, email: true },
    });

    // Create report
    const report = await prisma.stolenIMEI.create({
      data: {
        imei,
        brand,
        model,
        description,
        reporterPhone: dbUser?.phone || '',
        reporterEmail: dbUser?.email || session.user.email || '',
        reportedById: session.user.id!,
      },
    });

    return NextResponse.json(
      { message: 'Report submitted successfully', report },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
