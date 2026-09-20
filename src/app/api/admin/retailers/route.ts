import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";

    const where: any = {
      role: "RETAILER",
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { shopName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };

    if (status === "Pending") {
      where.isApproved = false;
    } else if (status === "Approved") {
      where.isApproved = true;
      where.isActive = true;
    } else if (status === "Locked") {
      where.isActive = false;
    }

    const retailers = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: { phoneListings: true },
        },
      },
      orderBy: [
        { isApproved: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(retailers);
  } catch (error) {
    console.error("Admin retailers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch retailers" }, { status: 500 });
  }
}
