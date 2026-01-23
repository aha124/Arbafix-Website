import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // If user is authenticated, allow access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without auth
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // Allow Stripe webhook to bypass auth (Stripe needs to POST to this endpoint)
        if (req.nextUrl.pathname === "/api/stripe/webhook") {
          return true;
        }
        // Require authentication for all other admin routes
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
