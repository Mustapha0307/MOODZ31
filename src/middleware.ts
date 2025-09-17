import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authPages = ["/profile/admin", "/profile/user"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  if (!token && authPages.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const role = token.role;
    console.log("User role from token:", role);

    // Only ADMIN can access /profile/admin, others are redirected
    if (
      pathname.startsWith("/profile/user") &&
      role === "USER" &&
      pathname !== "/profile/user"){
      return NextResponse.redirect(new URL("/profile/user", request.url));
      }
    if (pathname === "/profile/user" && role === "ADMIN") {
      return NextResponse.redirect(new URL("/profile/admin/Home", request.url));
    }

    if (pathname.startsWith("/profile/user") && role === "ADMIN") {
      return NextResponse.redirect(new URL("/profile/admin/Home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/verify",
    "/profile/:path*",
    "/forgot-password",
    "/reset-password",
  ],
};


// import { NextResponse } from "next/server";
// import authConfig from "./auth.config";
// import NextAuth from "next-auth";

// const { auth: middleware } = NextAuth(authConfig);

// const authRoutes = ["/login", "/register", "/verfiy", "/forgot-password", "/reset-password"];
// const protectedRoutes = ["/profile"]

// export default middleware((req)=>{
//   const { nextUrl } = req;
//   const path = nextUrl.pathname;
//   const isUserLoggedIn: boolean = Boolean(req.auth);
//   const role = req.auth?.role;

//   if(authRoutes.includes(path) && isUserLoggedIn)
//     return NextResponse.redirect(new URL("/profile", nextUrl))
//   if(protectedRoutes.includes(path) && !isUserLoggedIn)
//     return NextResponse.redirect(new URL("/login", nextUrl))

// })

//  export const config = {
//   matcher: [
//     "/login",
//     "/register",
//     "/verify",
//     "/profile/:path*",
//     "/forgot-password",
//     "/reset-password"
//   ],
// };