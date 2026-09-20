export const dynamic = 'force-dynamic';
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

    const imeis = await prisma.stolenIMEI.findMany({
      where: {
        OR: [
          { imei: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { model: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(imeis);
  } catch (error) {
    console.error("Admin stolen IMEIs GET error:", error);
    return NextResponse.json({ error: "Failed to fetch stolen IMEIs" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.stolenIMEI.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Admin stolen IMEI DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
