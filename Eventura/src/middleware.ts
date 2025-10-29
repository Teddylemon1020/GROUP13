export { default } from "next-auth/middleware";

// Protect these routes - requires authentication
export const config = {
  matcher: [
    "/home/:path*",
    "/projects/:path*",
    "/api/projects/:path*",
  ],
};
