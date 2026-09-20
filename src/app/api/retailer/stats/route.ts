import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isApproved: true,
        shopName: true,
        city: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const phoneCount = await prisma.phoneListing.count({
      where: { retailerId: userId },
    });

    return NextResponse.json({
      shopStatus: user.isApproved ? "Approved" : "Pending",
      phoneCount,
      shopName: user.shopName || "Not Set",
      city: user.city || "Not Set",
    });
  } catch (error) {
    console.error("Error fetching retailer stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
