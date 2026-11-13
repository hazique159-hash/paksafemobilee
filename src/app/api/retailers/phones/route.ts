export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public search for available phones across verified retailers.
// Served under /api/retailers/* so it is covered by the public auth allowlist.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";

    const retailerFilter: any = {
      role: "RETAILER",
      isApproved: true,
      isActive: true,
      isEmailVerified: true,
    };
    if (city) {
      retailerFilter.city = city;
    }

    const whereClause: any = {
      status: "AVAILABLE",
      retailer: retailerFilter,
    };

    if (search) {
      whereClause.OR = [
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    const phones = await prisma.phoneListing.findMany({
      where: whereClause,
      select: {
        id: true,
        brand: true,
        model: true,
        price: true,
        color: true,
        condition: true,
        ramStorage: true,
        image: true,
        retailer: {
          select: {
            id: true,
            shopName: true,
            name: true,
            city: true,
            shopAddress: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ phones });
  } catch (error) {
    console.error("Search Phones Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
