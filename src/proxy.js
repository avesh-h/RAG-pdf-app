import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
});

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Public routes - allow all users immediately
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    return; // No redirect, allow access
  }

  // Protected routes - redirect to login if not logged in
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Logged in users shouldn't access login/register
  if (pathname === "/login" || pathname === "/register") {
    return Response.redirect(new URL("/chat", nextUrl));
  }
});

export const config = {
  matcher: [
    "/",
    "/upload/:path*",
    "/chat/:path*",
    "/files/:path*",
    "/login",
    "/register",
  ],
};
