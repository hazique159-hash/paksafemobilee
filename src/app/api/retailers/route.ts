import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";

    const whereClause: any = {
      role: "RETAILER",
      isApproved: true,
      isActive: true,
      isEmailVerified: true,
    };

    if (search) {
      whereClause.shopName = { contains: search, mode: "insensitive" };
    }
    
    if (city) {
      whereClause.city = city;
    }

    const retailers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        shopName: true,
        shopAddress: true,
        city: true,
        shopImage: true,
        phone: true,
        email: true,
        _count: {
          select: {
            phoneListings: {
              where: { status: "AVAILABLE" }
            }
          }
        }
      },
      orderBy: {
        shopName: 'asc'
      }
    });

    return NextResponse.json({ retailers });
  } catch (error) {
    console.error("Fetch Retailers Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
