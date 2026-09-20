import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const phone = await prisma.phoneListing.findUnique({
      where: { id },
    });

    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    if (phone.retailerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized access to phone listing" }, { status: 403 });
    }

    return NextResponse.json(phone);
  } catch (error) {
    console.error("Error fetching phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const phone = await prisma.phoneListing.findUnique({
      where: { id },
    });

    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    if (phone.retailerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { brand, model, price, color, condition, ramStorage, image, status } = body;

    const updatedPhone = await prisma.phoneListing.update({
      where: { id },
      data: {
        brand,
        model,
        price: Number(price),
        color,
        condition,
        ramStorage,
        image,
        status,
      },
    });

    return NextResponse.json(updatedPhone);
  } catch (error) {
    console.error("Error updating phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const phone = await prisma.phoneListing.findUnique({
      where: { id },
    });

    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    if (phone.retailerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    const updatedPhone = await prisma.phoneListing.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedPhone);
  } catch (error) {
    console.error("Error patching phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RETAILER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const phone = await prisma.phoneListing.findUnique({
      where: { id },
    });

    if (!phone) {
      return NextResponse.json({ error: "Phone not found" }, { status: 404 });
    }

    if (phone.retailerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.phoneListing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting phone:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
