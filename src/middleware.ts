import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie,
      },
    });
    
    const session = response.ok ? await response.json() : null;
    const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
    const isAuthRoute = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";

    if (isDashboardRoute && !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    console.error("Middleware session check failed:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
