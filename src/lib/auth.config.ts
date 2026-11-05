import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public routes
      const publicRoutes = ["/", "/login", "/register", "/verify-otp", "/check-imei", "/retailers", "/announcements"];
      const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith("/retailers/") || pathname.startsWith("/announcements/")
      );
      const isApiPublicRoute =
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/imei/check") ||
        pathname.startsWith("/api/retailers") ||
        pathname.startsWith("/api/announcements");

      if (isPublicRoute || isApiPublicRoute) {
        return true;
      }

      if (!isLoggedIn) {
        return false;
      }

      const user = auth?.user as any;

      // Shared routes
      if (pathname.startsWith("/api/imei/report") || pathname.startsWith("/api/imei/my-reports")) {
        return user?.role === "USER" || user?.role === "RETAILER" || user?.role === "ADMIN";
      }

      // Admin routes
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        return user?.role === "ADMIN";
      }

      // Retailer routes
      if (pathname.startsWith("/retailer") || pathname.startsWith("/api/retailer")) {
        return user?.role === "RETAILER";
      }

      // User dashboard routes
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/user")) {
        return user?.role === "USER" || user?.role === "ADMIN";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
        token.isApproved = (user as any).isApproved;
        token.isActive = (user as any).isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone;
        (session.user as any).role = token.role;
        (session.user as any).isApproved = token.isApproved;
        (session.user as any).isActive = token.isActive;
      }
      return session;
    },
  },
  providers: [],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "pakistan_safe_mobiles_secret_key_2024",
};
