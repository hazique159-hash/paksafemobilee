export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      totalUsers,
      totalRetailers,
      pendingRetailers,
      totalStolenIMEIs,
      totalAnnouncements,
      activeAnnouncements,
      recentUsers,
      recentReports,
      recentAnnouncements,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "RETAILER" } }),
      prisma.user.count({ where: { role: "RETAILER", isApproved: false } }),
      prisma.stolenIMEI.count(),
      prisma.announcement.count(),
      prisma.announcement.count({ where: { isActive: true } }),
      prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.stolenIMEI.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, imei: true, brand: true, model: true, createdAt: true },
      }),
      prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { id: true, title: true, priority: true, target: true, isPinned: true, isActive: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalRetailers,
      pendingRetailers,
      totalStolenIMEIs,
      totalAnnouncements,
      activeAnnouncements,
      recentUsers,
      recentReports,
      recentAnnouncements,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
