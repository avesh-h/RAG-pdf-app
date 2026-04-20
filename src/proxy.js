import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  console.log("=== PROXY DEBUG ===");
  console.log("URL:", req.nextUrl.pathname);
  console.log("AUTH_SECRET exists:", !!process.env.AUTH_SECRET);
  console.log("AUTH_SECRET value:", process.env.AUTH_SECRET);
  console.log("Token:", token);
  console.log(
    "Cookies:",
    req.cookies.getAll().map((c) => c.name),
  );
  console.log("===================");

  const isLoggedIn = !!token;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/upload", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/chat/:path*",
    "/files/:path*",
    "/login",
    "/register",
  ],
};
