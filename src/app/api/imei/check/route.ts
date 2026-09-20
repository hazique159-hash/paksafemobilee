import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { imei } = await request.json();

    if (!imei || imei.length !== 15 || !/^\d+$/.test(imei)) {
      return NextResponse.json(
        { message: "Invalid IMEI format" },
        { status: 400 }
      );
    }

    const stolenRecord = await prisma.stolenIMEI.findUnique({
      where: { imei },
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
        record: stolenRecord,
      });
    }

    return NextResponse.json({
      status: "CLEAN",
    });

  } catch (error) {
    console.error("IMEI Check Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
