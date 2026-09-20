import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendOTPEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role, shopName, shopAddress, city } = body;

    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'RETAILER' && (!shopName || !shopAddress || !city)) {
      return NextResponse.json({ error: 'Missing required retailer fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        isEmailVerified: false,
        isApproved: role === 'USER' ? true : false,
        isActive: true,
        ...(role === 'RETAILER' && { shopName, shopAddress, city }),
      },
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    await sendOTPEmail(email, otp, name);

    return NextResponse.json({ message: 'User registered successfully', role: user.role });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
