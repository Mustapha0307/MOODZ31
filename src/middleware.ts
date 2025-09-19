import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/profile/admin", "/profile/user"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  // لو ماكانش عندك token وتحب تدخل لصفحة محمية → redirect ل /login
  if (!token && protectedRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const role = token.role;

    // 👤 USER يقدر يدخل غير /profile/user
    if (role === "USER" && pathname.startsWith("/profile/admin")) {
      return NextResponse.redirect(new URL("/profile/user", request.url));
    }

    // 👑 ADMIN يقدر يدخل غير /profile/admin
    if (role === "ADMIN" && pathname.startsWith("/profile/user")) {
      return NextResponse.redirect(new URL("/profile/admin/Home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
  ],
};
