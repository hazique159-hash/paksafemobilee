export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendPasswordResetEmail } from '@/lib/mail';

// Step 1 of password reset: user submits their email, we send a reset OTP.
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email.' },
        { status: 404 }
      );
    }

    // Clear any existing codes for this email, then create a fresh one.
    await prisma.otpVerification.deleteMany({ where: { email } });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpVerification.create({
      data: { email, otp, expiresAt },
    });

    try {
      await sendPasswordResetEmail(email, otp, user.name);
    } catch (mailError) {
      // Don't leave an unusable code behind, and surface a clear message.
      console.error('Password reset email failed:', mailError);
      await prisma.otpVerification.deleteMany({ where: { email } });
      return NextResponse.json(
        {
          error:
            'We could not send the reset code right now. Please try again in a few minutes.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: 'Password reset code sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
