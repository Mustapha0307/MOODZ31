import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// const authPages = ["/profile/admin", "/profile/user"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const { pathname } = request.nextUrl;

  // إذا ماكانش token و رايح لصفحات محمية
  if (!token && (pathname.startsWith("/profile/admin") || pathname.startsWith("/profile/user"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url); // باش يرجعو للصفحة الأصلية بعد تسجيل الدخول
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const role = token.role as string;
    console.log("User role from token:", role);

    // منع وصول USER لصفحة admin
    if (pathname.startsWith("/profile/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/profile/user", request.url));
    }

    // منع وصول ADMIN لصفحة user
    if (pathname.startsWith("/profile/user") && role !== "USER") {
      return NextResponse.redirect(new URL("/profile/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
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
