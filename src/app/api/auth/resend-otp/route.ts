export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendOTPEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.otpVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    await sendOTPEmail(email, otp, user.name);

    return NextResponse.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
