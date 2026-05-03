import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-storage")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  // Note: checkout is handled client-side (cart flow); avoid protecting it here
  const protectedPaths = ["/dashboard", "/profile"];
  const authPaths = ["/login", "/register", "/forgot-password"];

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // Check if path is auth page
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthPath && token) {
    try {
      const authData = JSON.parse(token);
      const user = authData?.state?.user;

      if (user) {
        const dashboardUrl = user.role === "admin" ? "/admin" : "/user";
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    } catch (error) {
      // Invalid token, continue to auth page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
