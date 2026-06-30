import { NextResponse } from "next/server";

import { auth } from "@/auth";

const authRoutes = ["/login", "/register"];

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth);
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.includes(pathname);
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
