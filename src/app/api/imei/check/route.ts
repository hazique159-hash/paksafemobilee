export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = (body.query || body.imei || "").trim();

    if (!query) {
      return NextResponse.json(
        { message: "Please enter a valid IMEI or Serial Number" },
        { status: 400 }
      );
    }

    const stolenRecord = await prisma.stolenIMEI.findFirst({
      where: {
        OR: [
          { imei: { equals: query, mode: "insensitive" } },
          { serialNumber: { equals: query, mode: "insensitive" } },
        ],
      },
      include: {
        reportedBy: {
          select: {
            name: true,
            phone: true,
            email: true,
          }
        }
      }
    });

    if (stolenRecord) {
      return NextResponse.json({
        status: "STOLEN",
        searchedQuery: query,
        record: stolenRecord,
      });
    }

    return NextResponse.json({
      status: "CLEAN",
      searchedQuery: query,
    });

  } catch (error) {
    console.error("IMEI Check Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
