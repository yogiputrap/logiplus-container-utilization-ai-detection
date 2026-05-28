import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isHomePage = request.nextUrl.pathname.startsWith('/home');

    // Redirect to login if accessing protected routes without session
    if (isHomePage && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to home if accessing login page with active session
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/home/:path*', '/login'],
};
