export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isAuthPage = pathname === "/login" || pathname === "/register";

      const isProtected =
        pathname.startsWith("/chat") ||
        pathname.startsWith("/upload") ||
        pathname.startsWith("/files");

      // logged in user should not see login/register
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/chat", nextUrl));
      }

      // protected route but not logged in
      if (!isLoggedIn && isProtected) {
        return false;
      }

      return true;
    },
  },

  providers: [],
};
