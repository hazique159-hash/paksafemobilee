import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user as any;

  // Public routes - no auth required
  const publicRoutes = ["/", "/login", "/register", "/verify-otp", "/check-imei", "/retailers"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/retailers/")
  );
  const isApiPublicRoute =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/imei/check") ||
    pathname.startsWith("/api/retailers");

  if (isPublicRoute || isApiPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Shared routes (USER, RETAILER, ADMIN)
  if (pathname.startsWith("/api/imei/report") || pathname.startsWith("/api/imei/my-reports")) {
    if (user.role !== "USER" && user.role !== "RETAILER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } 
  // User/Admin routes
  else if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/user")) {
    if (user.role !== "USER" && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  // Retailer routes
  else if (pathname.startsWith("/retailer") || pathname.startsWith("/api/retailer")) {
    if (user.role !== "RETAILER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  // Admin routes
  else if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
