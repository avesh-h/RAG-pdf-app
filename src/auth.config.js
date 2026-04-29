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
      
      // Public routes - accessible to all users
      const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/register";
      
      // If on public route, allow access for everyone
      if (isPublicRoute) {
        return true;
      }

      // If logged in and on auth page, redirect to chat
      if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
        return Response.redirect(new URL("/chat", nextUrl));
      }

      // If not logged in and not on public route, deny access (middleware will redirect)
      if (!isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [],
};
