export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const priority = searchParams.get("priority") || "ALL";
    const targetParam = searchParams.get("target");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Build role-based target filter
    let allowedTargets: ("ALL" | "RETAILERS" | "USERS")[] = ["ALL"];
    if (userRole === "RETAILER") {
      allowedTargets = ["ALL", "RETAILERS"];
    } else if (userRole === "USER") {
      allowedTargets = ["ALL", "USERS"];
    } else if (userRole === "ADMIN") {
      allowedTargets = ["ALL", "RETAILERS", "USERS"];
    }

    const where: any = {
      isActive: true,
      target: targetParam && allowedTargets.includes(targetParam as any)
        ? targetParam
        : { in: allowedTargets },
    };

    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { content: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Announcements GET error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
