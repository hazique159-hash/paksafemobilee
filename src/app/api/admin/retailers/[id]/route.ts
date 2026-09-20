export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isApproved, isActive } = body;

    const existingRetailer = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingRetailer) {
      return NextResponse.json({ error: "Retailer not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Send emails based on state changes
    if (existingRetailer.email) {
      if (isApproved === true && !existingRetailer.isApproved) {
        await transporter.sendMail({
          from: `"PakSafeMobiles" <${process.env.MAIL_FROM}>`,
          to: existingRetailer.email,
          subject: "Your Account has been Approved - PakSafeMobiles",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #059669; text-align: center;">Congratulations!</h2>
              <p style="color: #334155; font-size: 16px;">Your retailer account on PakSafeMobiles has been approved by the administration.</p>
              <p style="color: #334155; font-size: 16px;">You can now log in to your account and access the retailer dashboard.</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In Now</a>
              </div>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 30px; text-align: center;">If you have any questions, please contact our support team.</p>
            </div>
          `,
        }).catch((err) => console.error("Failed to send approval email:", err));
      }

      if (isActive === false && existingRetailer.isActive !== false) {
        await transporter.sendMail({
          from: `"PakSafeMobiles" <${process.env.MAIL_FROM}>`,
          to: existingRetailer.email,
          subject: "Account Suspended - PakSafeMobiles",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #dc2626; text-align: center;">Account Suspended</h2>
              <p style="color: #334155; font-size: 16px;">Your retailer account on PakSafeMobiles has been suspended by the administration.</p>
              <p style="color: #334155; font-size: 16px;">During this time, you will not be able to log in or use your account.</p>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 30px; text-align: center;">Please contact our support team for more information.</p>
            </div>
          `,
        }).catch((err) => console.error("Failed to send suspension email:", err));
      }

      if (isActive === true && existingRetailer.isActive === false) {
        await transporter.sendMail({
          from: `"PakSafeMobiles" <${process.env.MAIL_FROM}>`,
          to: existingRetailer.email,
          subject: "Account Reactivated - PakSafeMobiles",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #059669; text-align: center;">Account Reactivated</h2>
              <p style="color: #334155; font-size: 16px;">Your retailer account on PakSafeMobiles has been successfully reactivated.</p>
              <p style="color: #334155; font-size: 16px;">You can now log in and continue using your account.</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In Now</a>
              </div>
            </div>
          `,
        }).catch((err) => console.error("Failed to send reactivation email:", err));
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin retailer update error:", error);
    return NextResponse.json({ error: "Failed to update retailer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Retailer deleted successfully" });
  } catch (error) {
    console.error("Admin retailer delete error:", error);
    return NextResponse.json({ error: "Failed to delete retailer" }, { status: 500 });
  }
}
