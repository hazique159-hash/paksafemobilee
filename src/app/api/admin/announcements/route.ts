export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const target = searchParams.get("target") || "ALL";
    const priority = searchParams.get("priority") || "ALL";
    const status = searchParams.get("status") || "ALL";

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { content: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (target !== "ALL") {
      where.target = target;
    }

    if (priority !== "ALL") {
      where.priority = priority;
    }

    if (status === "ACTIVE") {
      where.isActive = true;
    } else if (status === "INACTIVE") {
      where.isActive = false;
    }

    const [announcements, totalCount, activeCount, pinnedCount, retailersCount, usersCount] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: [
          { isPinned: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.announcement.count(),
      prisma.announcement.count({ where: { isActive: true } }),
      prisma.announcement.count({ where: { isPinned: true } }),
      prisma.announcement.count({ where: { target: "RETAILERS" } }),
      prisma.announcement.count({ where: { target: "USERS" } }),
    ]);

    return NextResponse.json({
      announcements,
      stats: {
        totalCount,
        activeCount,
        pinnedCount,
        retailersCount,
        usersCount,
      },
    });
  } catch (error) {
    console.error("Admin announcements GET error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, target = "ALL", priority = "NORMAL", isPinned = false, isActive = true } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const validTargets = ["ALL", "RETAILERS", "USERS"];
    const validPriorities = ["NORMAL", "IMPORTANT", "URGENT"];

    if (!validTargets.includes(target)) {
      return NextResponse.json({ error: "Invalid target audience" }, { status: 400 });
    }

    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority level" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        target,
        priority,
        isPinned: Boolean(isPinned),
        isActive: Boolean(isActive),
        authorId: session.user?.id || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Admin announcement POST error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Admin announcement DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
