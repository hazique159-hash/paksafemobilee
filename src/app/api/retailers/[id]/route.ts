import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const retailer = await prisma.user.findFirst({
      where: {
        id,
        role: "RETAILER",
        isApproved: true,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        shopName: true,
        shopAddress: true,
        city: true,
        shopImage: true,
        phone: true,
        email: true,
        phoneListings: {
          where: {
            status: "AVAILABLE"
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!retailer) {
      return NextResponse.json(
        { message: "Retailer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ retailer });
  } catch (error) {
    console.error("Fetch Retailer Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
