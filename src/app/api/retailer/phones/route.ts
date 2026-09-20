import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const phones = await prisma.phoneListing.findMany({
      where: { retailerId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(phones);
  } catch (error) {
    console.error("Error fetching phones:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { brand, model, price, color, condition, ramStorage, image, status } = body;

    if (!brand || !model || !price || !condition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const phone = await prisma.phoneListing.create({
      data: {
        brand,
        model,
        price: Number(price),
        color,
        condition,
        ramStorage,
        image,
        status: status || "AVAILABLE",
        retailerId: session.user.id!,
      },
    });

    return NextResponse.json(phone, { status: 201 });
  } catch (error) {
    console.error("Error creating phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
