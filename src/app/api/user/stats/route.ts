import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reportsCount = await prisma.stolenIMEI.count({
      where: {
        reportedById: session.user.id,
      },
    });

    return NextResponse.json(
      { reportsCount, totalChecked: 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
