import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const pathname = req.nextUrl.pathname;

    // Protected dashboard routes (without /dashboard prefix due to route groups)
    const isOnProtectedRoute = pathname.startsWith("/projects") ||
        pathname.startsWith("/settings");
    const isOnAuthPage = pathname.startsWith("/login") ||
        pathname.startsWith("/register");

    // Redirect logged-in users away from auth pages
    if (isLoggedIn && isOnAuthPage) {
        return NextResponse.redirect(new URL("/projects", req.nextUrl));
    }

    // Redirect unauthenticated users to login
    if (!isLoggedIn && isOnProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Match all paths except static files and API routes (except auth API)
        "/((?!_next/static|_next/image|favicon.ico|api/track|tracker.js|images).*)",
    ],
};
