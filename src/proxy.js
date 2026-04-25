import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
});

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // If user is NOT logged in → redirect to login
  if (!isLoggedIn && nextUrl.pathname !== "/login") {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // If logged in user tries to visit login/register
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
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
