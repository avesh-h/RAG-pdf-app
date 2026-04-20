import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/upload/:path*",
    "/chat/:path*",
    "/files/:path*",
    "/login",
    "/register",
  ],
};
