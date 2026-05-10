import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const publicRoutes = [
        "/login",
        "/register",
        "/api/auth",
        "/favicon.ico",
        "_next"
    ]
    if (publicRoutes.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    } else {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            const loginURL = new URL("/login", request.url);
            // console.log(loginURL);
            loginURL.searchParams.set("callbackUrl", request.url);
            return NextResponse.redirect(loginURL);
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
};
