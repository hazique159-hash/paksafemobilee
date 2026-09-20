import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const validOtp = await prisma.otpVerification.findFirst({
      where: {
        email,
        otp,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!validOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    return NextResponse.json({ message: 'Email verified successfully', role: user.role });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
